import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

// Types matching the API response
export interface GitHubLabel {
  name: string;
  color: string;
}

export interface GitHubReviewer {
  login: string;
  avatarUrl: string;
}

export interface GitHubAuthor {
  login: string;
  avatarUrl: string;
}

export interface GitHubIssue {
  number: string;
  url: string;
}

export interface GitHubPR {
  id: number;
  title: string;
  url: string;
  mergedAt: string;
  repository: string;
  repositoryUrl: string;
  labels: GitHubLabel[];
  closedIssues: GitHubIssue[];
  description: string | null;
  additions: number;
  deletions: number;
  changedFiles: number;
  author: GitHubAuthor;
  reviewers: GitHubReviewer[];
  commits: number;
}

// For backward compatibility
export type GitHubPRResponse = GitHubPR;

export interface PRStats {
  total: number;
  repositories: number;
  totalIssuesClosed: number;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
}

// API Response types
interface APIResponse {
  success: boolean;
  data: GitHubPR[];
  count: number;
  cached: boolean;
  fetchTime: number;
  stats?: {
    totalPRs: number;
    totalAdditions: number;
    totalDeletions: number;
    totalCommits: number;
    repositories: number;
  };
}

interface UsePullRequestsResult {
  data: GitHubPR[];
  stats: PRStats;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
  isCached: boolean;
  fetchTime?: number;
}

interface UseFilteredPullRequestsOptions {
  repository?: string;
  searchQuery?: string;
  sortBy?: "recent" | "oldest" | "additions" | "commits";
}

// Main fetch function
async function fetchPullRequests(): Promise<{
  data: GitHubPR[];
  cached: boolean;
  fetchTime: number;
}> {
  console.log("[usePullRequests] Fetching pull requests from API...");

  const startTime = performance.now();
  const response = await fetch("/api/github/pull-requests", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(
      "[usePullRequests] Failed to fetch pull requests:",
      response.status,
      response.statusText,
      errorData
    );

    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    throw new Error(
      errorData.error || `Failed to fetch pull requests (${response.status})`
    );
  }

  const result: APIResponse = await response.json();
  const endTime = performance.now();
  const clientFetchTime = endTime - startTime;

  console.log("[usePullRequests] API Response:", {
    success: result.success,
    count: result.count,
    cached: result.cached,
    serverFetchTime: result.fetchTime,
    clientFetchTime: clientFetchTime.toFixed(2),
  });

  if (!result.success) {
    throw new Error("API returned unsuccessful response");
  }

  const pullRequests = result.data || [];
  console.log(
    "[usePullRequests] Parsed pull requests:",
    pullRequests.length,
    "PRs"
  );

  return {
    data: Array.isArray(pullRequests) ? pullRequests : [],
    cached: result.cached,
    fetchTime: result.fetchTime,
  };
}

// Calculate stats from pull requests
function calculateStats(pullRequests: GitHubPR[]): PRStats {
  return {
    total: pullRequests.length,
    repositories: new Set(pullRequests.map((pr) => pr.repository)).size,
    totalIssuesClosed: pullRequests.reduce(
      (acc, pr) => acc + pr.closedIssues.length,
      0
    ),
    totalCommits: pullRequests.reduce((acc, pr) => acc + (pr.commits || 0), 0),
    totalAdditions: pullRequests.reduce(
      (acc, pr) => acc + (pr.additions || 0),
      0
    ),
    totalDeletions: pullRequests.reduce(
      (acc, pr) => acc + (pr.deletions || 0),
      0
    ),
  };
}

// Main hook for fetching pull requests
export function usePullRequests(): UsePullRequestsResult {
  const query = useQuery<
    { data: GitHubPR[]; cached: boolean; fetchTime: number },
    Error
  >({
    queryKey: ["pull-requests"],
    queryFn: fetchPullRequests,
    staleTime: 1000 * 60 * 60, // 1 hour - matches API cache
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const stats = useMemo(() => {
    if (!query.data?.data) {
      return {
        total: 0,
        repositories: 0,
        totalIssuesClosed: 0,
        totalCommits: 0,
        totalAdditions: 0,
        totalDeletions: 0,
      };
    }
    return calculateStats(query.data.data);
  }, [query.data?.data]);

  return {
    data: query.data?.data || [],
    stats,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    isCached: query.data?.cached || false,
    fetchTime: query.data?.fetchTime,
  };
}

// Hook for filtered and sorted pull requests
export function useFilteredPullRequests(
  options: UseFilteredPullRequestsOptions = {}
): UsePullRequestsResult {
  const { repository = "all", searchQuery = "", sortBy = "recent" } = options;
  const { data: allPRs, stats: allStats, ...rest } = usePullRequests();

  const filteredAndSortedPRs = useMemo(() => {
    let filtered = [...allPRs];

    // Filter by repository
    if (repository !== "all") {
      filtered = filtered.filter((pr) => pr.repository === repository);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pr) =>
          pr.title.toLowerCase().includes(query) ||
          pr.repository.toLowerCase().includes(query) ||
          pr.description?.toLowerCase().includes(query) ||
          pr.labels.some((label) => label.name.toLowerCase().includes(query)) ||
          pr.author.login.toLowerCase().includes(query) ||
          pr.reviewers.some((reviewer) =>
            reviewer.login.toLowerCase().includes(query)
          )
      );
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort(
          (a, b) =>
            new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.mergedAt).getTime() - new Date(b.mergedAt).getTime()
        );
        break;
      case "additions":
        filtered.sort((a, b) => (b.additions || 0) - (a.additions || 0));
        break;
      case "commits":
        filtered.sort((a, b) => (b.commits || 0) - (a.commits || 0));
        break;
    }

    return filtered;
  }, [allPRs, repository, searchQuery, sortBy]);

  const filteredStats = useMemo(() => {
    return calculateStats(filteredAndSortedPRs);
  }, [filteredAndSortedPRs]);

  return {
    data: filteredAndSortedPRs,
    stats: filteredStats,
    ...rest,
  };
}

// Hook for analytics data
export function usePRAnalytics() {
  const { data: pullRequests, isLoading } = usePullRequests();

  const analytics = useMemo(() => {
    if (!pullRequests || pullRequests.length === 0) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentPRs = pullRequests.filter(
      (pr) => new Date(pr.mergedAt) >= thirtyDaysAgo
    );

    const weeklyPRs = pullRequests.filter(
      (pr) => new Date(pr.mergedAt) >= sevenDaysAgo
    );

    // Calculate average stats
    const avgAdditions =
      pullRequests.reduce((sum, pr) => sum + (pr.additions || 0), 0) /
      pullRequests.length;
    const avgDeletions =
      pullRequests.reduce((sum, pr) => sum + (pr.deletions || 0), 0) /
      pullRequests.length;
    const avgCommits =
      pullRequests.reduce((sum, pr) => sum + (pr.commits || 0), 0) /
      pullRequests.length;
    const avgChangedFiles =
      pullRequests.reduce((sum, pr) => sum + (pr.changedFiles || 0), 0) /
      pullRequests.length;

    // Get most productive day
    const dayFrequency = pullRequests.reduce(
      (acc, pr) => {
        const day = new Date(pr.mergedAt).toLocaleDateString("en-US", {
          weekday: "long",
        });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostProductiveDay = Object.entries(dayFrequency).sort(
      ([, a], [, b]) => b - a
    )[0];

    // Get repository distribution
    const repoFrequency = pullRequests.reduce(
      (acc, pr) => {
        acc[pr.repository] = (acc[pr.repository] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const topRepositories = Object.entries(repoFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Get most active reviewers
    const reviewerFrequency = pullRequests.reduce(
      (acc, pr) => {
        pr.reviewers.forEach((reviewer) => {
          acc[reviewer.login] = (acc[reviewer.login] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const topReviewers = Object.entries(reviewerFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      recentActivity: recentPRs.length,
      weeklyActivity: weeklyPRs.length,
      avgAdditions: Math.round(avgAdditions),
      avgDeletions: Math.round(avgDeletions),
      avgCommits: Math.round(avgCommits * 10) / 10,
      avgChangedFiles: Math.round(avgChangedFiles * 10) / 10,
      mostProductiveDay: mostProductiveDay
        ? `${mostProductiveDay[0]} (${mostProductiveDay[1]} PRs)`
        : "N/A",
      totalCodeChanges: pullRequests.reduce(
        (sum, pr) => sum + (pr.additions || 0) + (pr.deletions || 0),
        0
      ),
      dayFrequency,
      repoFrequency,
      topRepositories,
      reviewerFrequency,
      topReviewers,
    };
  }, [pullRequests]);

  return {
    analytics,
    isLoading,
  };
}

// Hook to get unique repositories
export function useRepositories() {
  const { data: pullRequests, isLoading } = usePullRequests();

  const repositories = useMemo(() => {
    return ["all", ...new Set(pullRequests.map((pr) => pr.repository))];
  }, [pullRequests]);

  return {
    repositories,
    isLoading,
  };
}

// Hook to invalidate cache (for admin/refresh functionality)
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  const invalidateCache = async (secret: string, username?: string) => {
    try {
      const response = await fetch("/api/github/pull-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret, username }),
      });

      if (!response.ok) {
        throw new Error("Failed to invalidate cache");
      }

      const result = await response.json();

      // Invalidate React Query cache
      await queryClient.invalidateQueries({ queryKey: ["pull-requests"] });

      return result;
    } catch (error) {
      console.error("Error invalidating cache:", error);
      throw error;
    }
  };

  return { invalidateCache };
}
