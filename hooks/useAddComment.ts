import { addComment } from "@/app/actions/comments";
import { CommentFormValues } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentFormValues) => addComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment added successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add comment. Please try again.");
      console.error("Error adding comment:", error);
    },
  });
}
