// app/api/github/pull-requests/route.ts
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import NodeCache from "node-cache";

// Initialize cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

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
  author: {
    login: string;
    avatarUrl: string;
  };
  reviewers: Array<{ login: string; avatarUrl: string }>;
  commits: number;
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

async function fetchPRsWithPagination(
  octokit: Octokit,
  username: string
): Promise<GitHubPRResponse[]> {
  const allPRs: GitHubPRResponse[] = [];
  let page = 1;
  const perPage = 100;

  try {
    // Search for merged PRs
    const searchQuery = `type:pr author:${username} is:merged sort:updated-desc`;

    while (true) {
      const { data } = await octokit.search.issuesAndPullRequests({
        q: searchQuery,
        per_page: perPage,
        page,
      });

      if (data.items.length === 0) break;

      // Fetch detailed info for each PR in parallel
      const prDetailsPromises = data.items.map(async (item) => {
        const [owner, repo] = item.repository_url.split("/").slice(-2);

        try {
          const [prDetail, reviews, commits] = await Promise.all([
            octokit.pulls.get({
              owner,
              repo,
              pull_number: item.number,
            }),
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

          // Extract closed issues from PR body
          const closedIssues = extractClosedIssues(
            prDetail.data.body || "",
            owner,
            repo
          );

          // Get unique reviewers
          const uniqueReviewers = Array.from(
            new Map(
              reviews.data.map((review) => [
                review.user?.login,
                {
                  login: review.user?.login || "",
                  avatarUrl: review.user?.avatar_url || "",
                },
              ])
            ).values()
          ).filter((reviewer) => reviewer.login !== username);

          return {
            id: prDetail.data.id,
            title: prDetail.data.title,
            url: prDetail.data.html_url,
            mergedAt: prDetail.data.merged_at || "",
            repository: `${owner}/${repo}`,
            repositoryUrl: `https://github.com/${owner}/${repo}`,
            labels: prDetail.data.labels.map((label) =>
              typeof label === "string"
                ? { name: label, color: "808080" }
                : { name: label.name || "", color: label.color || "808080" }
            ),
            closedIssues,
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
        } catch (error) {
          console.error(`Error fetching PR #${item.number}:`, error);
          return null;
        }
      });

      const prDetails = (await Promise.all(prDetailsPromises)).filter(
        (pr): pr is GitHubPRResponse => pr !== null
      );

      allPRs.push(...prDetails);

      // Check if we have more pages
      if (data.items.length < perPage) break;
      page++;

      // Prevent infinite loops
      if (page > 10) break;
    }

    return allPRs;
  } catch (error) {
    console.error("Error fetching PRs:", error);
    throw error;
  }
}

function extractClosedIssues(
  body: string,
  owner: string,
  repo: string
): Array<{ number: string; url: string }> {
  const closedKeywords = [
    "closes",
    "closed",
    "close",
    "fixes",
    "fixed",
    "fix",
    "resolves",
    "resolved",
    "resolve",
  ];
  const issuePattern = new RegExp(
    `(${closedKeywords.join("|")})\\s+#(\\d+)`,
    "gi"
  );
  const issues: Array<{ number: string; url: string }> = [];
  let match;

  while ((match = issuePattern.exec(body)) !== null) {
    const issueNumber = match[2];
    issues.push({
      number: issueNumber,
      url: `https://github.com/${owner}/${repo}/issues/${issueNumber}`,
    });
  }

  return Array.from(
    new Map(issues.map((issue) => [issue.number, issue])).values()
  );
}

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // Get client identifier for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username) {
      return NextResponse.json(
        { error: "GitHub username not configured" },
        { status: 500 }
      );
    }

    // Check cache
    const cacheKey = `prs:${username}`;
    const cachedData = cache.get<GitHubPRResponse[]>(cacheKey);

    if (cachedData) {
      console.log(`[Cache Hit] Returning ${cachedData.length} PRs from cache`);
      return NextResponse.json(
        {
          success: true,
          data: cachedData,
          count: cachedData.length,
          cached: true,
          fetchTime: Date.now() - startTime,
        },
        {
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=86400",
            "X-Cache": "HIT",
          },
        }
      );
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: token,
      request: {
        timeout: 30000, // 30 seconds
      },
    });

    console.log(`[API] Fetching PRs for ${username}...`);
    const pullRequests = await fetchPRsWithPagination(octokit, username);

    // Sort by merge date (most recent first)
    pullRequests.sort(
      (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime()
    );

    // Cache the results
    cache.set(cacheKey, pullRequests);

    console.log(`[API] Successfully fetched ${pullRequests.length} PRs`);

    return NextResponse.json(
      {
        success: true,
        data: pullRequests,
        count: pullRequests.length,
        cached: false,
        fetchTime: Date.now() - startTime,
        stats: {
          totalPRs: pullRequests.length,
          totalAdditions: pullRequests.reduce(
            (sum, pr) => sum + pr.additions,
            0
          ),
          totalDeletions: pullRequests.reduce(
            (sum, pr) => sum + pr.deletions,
            0
          ),
          totalCommits: pullRequests.reduce((sum, pr) => sum + pr.commits, 0),
          repositories: new Set(pullRequests.map((pr) => pr.repository)).size,
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("[API Error]", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch pull requests";

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Revalidate endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, username } = body;

    // Verify secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const targetUsername = username || process.env.GITHUB_USERNAME;
    const cacheKey = `prs:${targetUsername}`;

    // Clear cache
    cache.del(cacheKey);

    return NextResponse.json({
      success: true,
      message: "Cache invalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to invalidate cache" },
      { status: 500 }
    );
  }
}
