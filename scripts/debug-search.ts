import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.MY_GH_TOKEN });

async function test() {
  const username = "legend4tech";

  // Test 1: Simple author search
  const search = await octokit.search.issuesAndPullRequests({
    q: `author:${username}`,
    per_page: 5,
  });
  console.log("Author search results:", search.data.total_count);

  // Test 2: List user's public repos (verify token works)
  const repos = await octokit.repos.listForUser({ username, per_page: 5 });
  console.log("User repos found:", repos.data.length);

  // Test 3: Try fetching a specific PR if you know one exists
  // await octokit.pulls.get({ owner: "repo-owner", repo: "repo-name", pull_number: 123 });
}

test();
