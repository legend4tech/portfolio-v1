// GitHub API utilities for fetching pull requests

export interface GitHubPR {
  id: number
  title: string
  html_url: string
  created_at: string
  merged_at: string
  repository_url: string
  repository_name: string
  labels: Array<{
    name: string
    color: string
  }>
  closed_issues: string[]
  body: string | null
  user: {
    login: string
    avatar_url: string
  }
}

export interface ProcessedPR {
  id: number
  title: string
  url: string
  mergedAt: string
  repository: string
  repositoryUrl: string
  labels: Array<{
    name: string
    color: string
  }>
  closedIssues: Array<{
    number: string
    url: string
  }>
  description: string
}

export async function fetchMergedPullRequests(username: string): Promise<ProcessedPR[]> {
  try {
    // GitHub Search API endpoint for merged PRs
    const query = `author:${username}+type:pr+is:merged`
    const url = `https://api.github.com/search/issues?q=${query}&sort=updated&order=desc&per_page=100`

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Add GitHub token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    const pullRequests = data.items || []

    // Process and format the PRs
    const processedPRs: ProcessedPR[] = pullRequests.map((pr: any) => {
      // Extract repository name from repository_url
      const repoUrlParts = pr.repository_url.split("/")
      const repoName = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`

      // Extract closed issues from PR body
      const closedIssues = extractClosedIssues(pr.body, pr.html_url)

      return {
        id: pr.id,
        title: pr.title,
        url: pr.html_url,
        mergedAt: pr.closed_at, // For merged PRs, closed_at is the merge date
        repository: repoName,
        repositoryUrl: `https://github.com/${repoName}`,
        labels: pr.labels.map((label: any) => ({
          name: label.name,
          color: label.color,
        })),
        closedIssues,
        description: pr.body || "",
      }
    })

    return processedPRs
  } catch (error) {
    console.error("Error fetching GitHub PRs:", error)
    return []
  }
}

// Extract closed issues from PR body
function extractClosedIssues(body: string | null, prUrl: string): Array<{ number: string; url: string }> {
  if (!body) return []

  const closedIssues: Array<{ number: string; url: string }> = []

  // Match patterns like "closes #123", "fixes #456", "resolves #789"
  const issuePattern = /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi
  let match

  while ((match = issuePattern.exec(body)) !== null) {
    const issueNumber = match[1]
    // Construct issue URL from PR URL
    const repoUrl = prUrl.split("/pull/")[0]
    closedIssues.push({
      number: issueNumber,
      url: `${repoUrl}/issues/${issueNumber}`,
    })
  }

  return closedIssues
}
