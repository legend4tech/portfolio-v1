import { getTechStack } from "@/app/actions/techstack"
import type { DBTechStack } from "@/types/portfolioTypes"
import { useQuery } from "@tanstack/react-query"

/**
 * React Query hook to fetch all tech stack items
 * Provides loading states, error handling, and automatic caching
 */
export function useTechStack() {
  return useQuery<DBTechStack[], Error>({
    queryKey: ["techstack"],
    queryFn: async () => {
      try {
        const techStack = await getTechStack()
        return Array.isArray(techStack) ? techStack : []
      } catch (error) {
        console.error("Error fetching tech stack:", error)
        throw error // Throw error instead of returning empty array to trigger error state
      }
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice
  })
}
