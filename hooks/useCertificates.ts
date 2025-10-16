import { getCertificates } from "@/app/actions/certificates"
import type { DBCertificate } from "@/types/portfolioTypes"
import { useQuery } from "@tanstack/react-query"

/**
 * React Query hook to fetch all certificates
 * Provides loading states, error handling, and automatic caching
 */
export function useCertificates() {
  return useQuery<DBCertificate[], Error>({
    queryKey: ["certificates"],
    queryFn: async () => {
      try {
        const certificates = await getCertificates()
        return Array.isArray(certificates) ? certificates : []
      } catch (error) {
        console.error("Error fetching certificates:", error)
        throw error // Throw error instead of returning empty array to trigger error state
      }
    },
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice
  })
}
