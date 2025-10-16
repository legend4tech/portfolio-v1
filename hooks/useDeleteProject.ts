import { deleteProject } from "@/app/actions/projects"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Custom hook for deleting projects
 * Handles mutation, cache invalidation, and user feedback
 */
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProject(id)
      if (!result.success) {
        throw new Error("Failed to delete project")
      }
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast.success("Project deleted successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete project")
    },
  })
}
