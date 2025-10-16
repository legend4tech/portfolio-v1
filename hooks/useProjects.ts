import { getProjects } from "@/app/actions/projects";
import type { DBProject } from "@/types/portfolioTypes";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook for fetching projects
 * Provides loading states, error handling, and cached data
 */
export function useProjects() {
  return useQuery<DBProject[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const projects = await getProjects();
        return Array.isArray(projects) ? projects : [];
      } catch (error) {
        console.error("Error fetching projects:", error);
        throw error; // Throw error instead of returning empty array to trigger error state
      }
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice
  });
}
