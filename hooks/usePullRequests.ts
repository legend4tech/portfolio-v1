import type { GitHubPR } from "@/types/portfolioTypes";
import { useQuery } from "@tanstack/react-query";

async function fetchPullRequests(): Promise<GitHubPR[]> {
  console.log("[v0] Fetching pull requests from API...");

  const response = await fetch("/api/github/pull-requests");

  if (!response.ok) {
    console.error(
      "[v0] Failed to fetch pull requests:",
      response.status,
      response.statusText,
    );
    throw new Error("Failed to fetch pull requests");
  }

  const result = await response.json();
  console.log("[v0] API Response:", result);

  const pullRequests = result.data || [];
  console.log("[v0] Parsed pull requests:", pullRequests.length, "PRs");

  return Array.isArray(pullRequests) ? pullRequests : [];
}

export function usePullRequests() {
  return useQuery<GitHubPR[], Error>({
    queryKey: ["pull-requests"],
    queryFn: fetchPullRequests,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}
