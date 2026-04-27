import { Octokit } from "@octokit/rest";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const username = "legend4tech";
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

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

async function sync() {
  const limit = pLimit(3);
  const allPRs: GitHubPRResponse[] = [];

  for (let page = 1; page <= 2; page++) {
    const { data } = await octokit.search.issuesAndPullRequests({
      q: `type:pr author:${username} is:merged sort:updated-desc`,
      per_page: 100,
      page,
    });
    console.log("returned-data", data);

    if (!data.items.length) break;

    const results = await Promise.all(
      data.items.map((item) =>
        limit(async () => {
          const [owner, repo] = item.repository_url.split("/").slice(-2);
          try {
            const [prDetail, reviews, commits] = await Promise.all([
              octokit.pulls.get({ owner, repo, pull_number: item.number }),
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
              `Skipping PR #${item.number}:`,
              (err as Error).message,
            );
            return null;
          }
        }),
      ),
    );

    allPRs.push(...results.filter((pr): pr is GitHubPRResponse => pr !== null));
    if (data.items.length < 100) break;
  }

  allPRs.sort(
    (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime(),
  );

  await redis.set(`prs:${username}`, allPRs, { ex: 60 * 60 * 25 });
  console.log(`✅ Synced ${allPRs.length} PRs to Redis`);
}

sync().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
