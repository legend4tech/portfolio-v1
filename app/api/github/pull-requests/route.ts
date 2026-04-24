// app/api/github/pull-requests/route.ts
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const CACHE_TTL_SECONDS = 3600; // 1 hour

interface GitHubPRResponse {
  id: number;
  title: string;
  url: string;
  mergedAt: string;
  repository: string;
  repositoryUrl: string;
  labels: Array<{ name: string; color: string }>;
  closedIssues: Array<{ number: string; url: string }>;
  description: string | null;
  additions: number;
  deletions: number;
  changedFiles: number;
  author: { login: string; avatarUrl: string };
  reviewers: Array<{ login: string; avatarUrl: string }>;
  commits: number;
}

// ─── Simple concurrency limiter (no extra deps needed) ────────────────────────
function pLimit(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  const next = () => {
    if (active < concurrency && queue.length) {
      active++;
      queue.shift()!();
    }
  };
  return function limit<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            active--;
            next();
          });
      });
      next();
    });
  };
}

function extractClosedIssues(body: string, owner: string, repo: string) {
  const pattern =
    /(closes|closed|close|fixes|fixed|fix|resolves|resolved|resolve)\s+#(\d+)/gi;
  const issues = new Map<string, { number: string; url: string }>();
  let match;
  while ((match = pattern.exec(body)) !== null) {
    issues.set(match[2], {
      number: match[2],
      url: `https://github.com/${owner}/${repo}/issues/${match[2]}`,
    });
  }
  return [...issues.values()];
}

async function fetchPRsWithPagination(
  octokit: Octokit,
  username: string,
): Promise<GitHubPRResponse[]> {
  const allPRs: GitHubPRResponse[] = [];
  const limit = pLimit(5); // max 5 concurrent PR detail fetches
  const MAX_PAGES = 2; // 200 PRs max — increase if you need more

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data } = await octokit.search.issuesAndPullRequests({
      q: `type:pr author:${username} is:merged sort:updated-desc`,
      per_page: 100,
      page,
    });

    if (data.items.length === 0) break;

    const pageResults = await Promise.all(
      data.items.map((item) =>
        limit(async () => {
          const [owner, repo] = item.repository_url.split("/").slice(-2);
          try {
            const prDetail = await octokit.pulls.get({
              owner,
              repo,
              pull_number: item.number,
            });

            const [reviews, commits] = await Promise.all([
              octokit.pulls.listReviews({
                owner,
                repo,
                pull_number: item.number,
              }),
              octokit.pulls.listCommits({
                owner,
                repo,
                pull_number: item.number,
              }),
            ]);

            const uniqueReviewers = Array.from(
              new Map(
                reviews.data.map((r) => [
                  r.user?.login,
                  {
                    login: r.user?.login || "",
                    avatarUrl: r.user?.avatar_url || "",
                  },
                ]),
              ).values(),
            ).filter((r) => r.login !== username);

            return {
              id: prDetail.data.id,
              title: prDetail.data.title,
              url: prDetail.data.html_url,
              mergedAt: prDetail.data.merged_at || "",
              repository: `${owner}/${repo}`,
              repositoryUrl: `https://github.com/${owner}/${repo}`,
              labels: prDetail.data.labels.map((l) =>
                typeof l === "string"
                  ? { name: l, color: "808080" }
                  : { name: l.name || "", color: l.color || "808080" },
              ),
              closedIssues: extractClosedIssues(
                prDetail.data.body || "",
                owner,
                repo,
              ),
              description: prDetail.data.body || null,
              additions: prDetail.data.additions || 0,
              deletions: prDetail.data.deletions || 0,
              changedFiles: prDetail.data.changed_files || 0,
              author: {
                login: prDetail.data.user?.login || username,
                avatarUrl: prDetail.data.user?.avatar_url || "",
              },
              reviewers: uniqueReviewers,
              commits: commits.data.length,
            } as GitHubPRResponse;
          } catch (err) {
            console.error(
              `Error fetching PR #${item.number}:`,
              (err as Error).message,
            );
            return null;
          }
        }),
      ),
    );

    allPRs.push(
      ...pageResults.filter((pr): pr is GitHubPRResponse => pr !== null),
    );

    if (data.items.length < 100) break;
  }

  return allPRs.sort(
    (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime(),
  );
}

export async function GET() {
  const startTime = Date.now();
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return NextResponse.json(
      { error: "GitHub username not configured" },
      { status: 500 },
    );
  }

  const cacheKey = `prs:${username}`;

  // ── Try Redis cache first ──────────────────────────────────────────────────
  try {
    const cached = await redis.get<GitHubPRResponse[]>(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] ${cached.length} PRs from Redis`);
      return NextResponse.json(
        {
          success: true,
          data: cached,
          count: cached.length,
          cached: true,
          fetchTime: Date.now() - startTime,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
            "X-Cache": "HIT",
          },
        },
      );
    }
  } catch (cacheErr) {
    // Redis being down should never crash the app — just skip cache
    console.warn("[Redis] Cache read failed, fetching fresh:", cacheErr);
  }

  // ── Fetch fresh from GitHub ────────────────────────────────────────────────
  const octokit = new Octokit({
    auth: token,
    request: { timeout: 10000 },
  });

  try {
    const pullRequests = await fetchPRsWithPagination(octokit, username);
    const fetchTime = Date.now() - startTime;

    // Write to Redis (fire and forget — don't let a cache write failure break the response)
    redis
      .set(cacheKey, pullRequests, { ex: CACHE_TTL_SECONDS })
      .catch((err) => console.warn("[Redis] Cache write failed:", err));

    console.log(`[API] Fetched ${pullRequests.length} PRs in ${fetchTime}ms`);

    return NextResponse.json(
      {
        success: true,
        data: pullRequests,
        count: pullRequests.length,
        cached: false,
        fetchTime,
        stats: {
          totalPRs: pullRequests.length,
          totalAdditions: pullRequests.reduce((s, p) => s + p.additions, 0),
          totalDeletions: pullRequests.reduce((s, p) => s + p.deletions, 0),
          totalCommits: pullRequests.reduce((s, p) => s + p.commits, 0),
          repositories: new Set(pullRequests.map((p) => p.repository)).size,
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Cache": "MISS",
        },
      },
    );
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to fetch pull requests";
    console.error("[API Error]", error);
    return NextResponse.json({ error: msg, success: false }, { status: 500 });
  }
}

// ─── Cache invalidation ───────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { secret, username } = await request.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const targetUsername = username || process.env.GITHUB_USERNAME;
    await redis.del(`prs:${targetUsername}`);

    return NextResponse.json({
      success: true,
      message: "Cache cleared from Redis",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to invalidate cache" },
      { status: 500 },
    );
  }
}
