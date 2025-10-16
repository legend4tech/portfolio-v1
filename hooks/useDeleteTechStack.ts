import { deleteTechStack } from "@/app/actions/techstack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * React Query mutation hook to delete a tech stack item
 * Automatically invalidates the tech stack query on success
 */
export function useDeleteTechStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTechStack(id);
      if (!result.success) {
        throw new Error("Failed to delete tech stack item");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techstack"] });
      toast.success("Tech stack item deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete tech stack item");
    },
  });
}
