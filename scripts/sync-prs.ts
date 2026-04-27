import { graphql } from "@octokit/graphql";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const username = process.env.GH_USERNAME || "legend4tech";

const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${process.env.GH_TOKEN}` },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

interface ReviewNode {
  author: { login: string; avatarUrl: string } | null;
}

interface PRNode {
  databaseId: number;
  title: string;
  url: string;
  mergedAt: string | null;
  body: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  author: { login: string; avatarUrl: string } | null;
  labels: { nodes: Array<{ name: string; color: string }> };
  reviews: { nodes: ReviewNode[] };
  commits: { totalCount: number };
  repository: { nameWithOwner: string; url: string; owner: { login: string } };
}

interface SearchResult {
  search: {
    issueCount: number;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: PRNode[];
  };
  rateLimit: { cost: number; remaining: number; resetAt: string };
}

interface YearsResult {
  user: { contributionsCollection: { contributionYears: number[] } };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
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

// Properly typed retry wrapper using @octokit/graphql directly
async function gql<T>(
  query: string,
  variables: Record<string, unknown>,
  retries = 8,
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await graphqlWithAuth<T>(query, variables);
      if (!result)
        throw Object.assign(new Error("empty response"), { status: 502 });
      return result;
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      const status = e?.status ?? 0;
      const isRetryable =
        status === 502 ||
        status === 503 ||
        status === 504 ||
        e?.message?.includes("ETIMEDOUT") ||
        e?.message?.includes("ECONNRESET") ||
        e?.message?.includes("socket hang up") ||
        e?.message?.includes("empty response");

      if (isRetryable && attempt < retries) {
        const wait = Math.min(3000 * attempt, 60000);
        console.warn(
          `[sync-prs] HTTP ${status || "network"} — retry ${attempt}/${retries - 1} in ${wait / 1000}s`,
        );
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
  throw new Error("unreachable");
}

// ---------------------------------------------------------------------------
// GraphQL queries
// ---------------------------------------------------------------------------

const YEARS_QUERY = /* graphql */ `
  query Years($login: String!) {
    user(login: $login) {
      contributionsCollection { contributionYears }
    }
  }
`;

const PR_SEARCH_QUERY = /* graphql */ `
  query MergedPRs($searchQuery: String!, $cursor: String) {
    search(query: $searchQuery, type: ISSUE, first: 50, after: $cursor) {
      issueCount
      pageInfo { hasNextPage endCursor }
      nodes {
        ... on PullRequest {
          databaseId
          title
          url
          mergedAt
          body
          additions
          deletions
          changedFiles
          author { login avatarUrl }
          labels(first: 10) { nodes { name color } }
          reviews(first: 20) { nodes { author { login avatarUrl } } }
          commits { totalCount }
          repository {
            nameWithOwner
            url
            owner { login }
          }
        }
      }
    }
    rateLimit { cost remaining resetAt }
  }
`;

// ---------------------------------------------------------------------------
// Fetch all merged PRs for one quarter window
// ---------------------------------------------------------------------------

async function fetchWindow(
  from: string,
  to: string,
  prMap: Map<number, GitHubPRResponse>,
): Promise<void> {
  const searchQuery = `author:${username} is:pr is:merged merged:${from}..${to}`;
  let cursor: string | null = null;
  let page = 0;

  while (true) {
    page++;
    const t = Date.now();

    const gqlResult: SearchResult = await gql<SearchResult>(PR_SEARCH_QUERY, {
      searchQuery,
      cursor,
    });
    const { search, rateLimit } = gqlResult;

    console.log(`[sync-prs] ${from}..${to} page ${page}`, {
      total: search.issueCount,
      fetched: search.nodes.length,
      accumulated: prMap.size,
      hasNextPage: search.pageInfo.hasNextPage,
      rateRemaining: rateLimit.remaining,
      ms: Date.now() - t,
    });

    if (rateLimit.remaining < 15) {
      const wait = Math.max(
        new Date(rateLimit.resetAt).getTime() - Date.now() + 3000,
        0,
      );
      console.warn(
        `[sync-prs] rate limit low — sleeping ${Math.ceil(wait / 1000)}s`,
      );
      await sleep(wait);
    }

    for (const node of search.nodes) {
      if (!node.mergedAt || prMap.has(node.databaseId)) continue;
      const [owner, repo] = node.repository.nameWithOwner.split("/");

      const reviewerMap = new Map<
        string,
        { login: string; avatarUrl: string }
      >();
      for (const r of node.reviews.nodes) {
        if (r.author !== null && r.author.login !== username) {
          reviewerMap.set(r.author.login, {
            login: r.author.login,
            avatarUrl: r.author.avatarUrl,
          });
        }
      }
      const reviewers: Array<{ login: string; avatarUrl: string }> = Array.from(
        reviewerMap.values(),
      );

      prMap.set(node.databaseId, {
        id: node.databaseId,
        title: node.title,
        url: node.url,
        mergedAt: node.mergedAt,
        repository: node.repository.nameWithOwner,
        repositoryUrl: node.repository.url,
        labels: node.labels.nodes,
        closedIssues: extractClosedIssues(node.body ?? "", owner, repo),
        description: node.body || null,
        additions: node.additions,
        deletions: node.deletions,
        changedFiles: node.changedFiles,
        author: node.author ?? { login: username, avatarUrl: "" },
        reviewers,
        commits: node.commits.totalCount,
      });
    }

    if (!search.pageInfo.hasNextPage) break;
    cursor = search.pageInfo.endCursor;
  }
}

function quarters(year: number) {
  return [
    { from: `${year}-01-01`, to: `${year}-03-31` },
    { from: `${year}-04-01`, to: `${year}-06-30` },
    { from: `${year}-07-01`, to: `${year}-09-30` },
    { from: `${year}-10-01`, to: `${year}-12-31` },
  ];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function sync(): Promise<void> {
  console.log("[sync-prs] starting GraphQL sync", {
    username,
    hasGitHubToken: Boolean(process.env.GH_TOKEN),
    hasUpstashUrl: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    hasUpstashToken: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
  });

  const { user } = await gql<YearsResult>(YEARS_QUERY, { login: username });
  const years = user.contributionsCollection.contributionYears;
  console.log(`[sync-prs] contribution years: ${years.join(", ")}`);

  const prMap = new Map<number, GitHubPRResponse>();
  for (const year of years) {
    console.log(`\n[sync-prs] === year ${year} ===`);
    for (const { from, to } of quarters(year)) {
      await fetchWindow(from, to, prMap);
    }
  }

  const allPRs = Array.from(prMap.values()).sort(
    (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime(),
  );

  console.log(`\n[sync-prs] writing to Redis — ${allPRs.length} PRs`);
  await redis.set(`prs:${username}`, allPRs, { ex: 60 * 60 * 25 });
  console.log(`✅ Synced ${allPRs.length} unique merged PRs to Redis`);
}

sync().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
