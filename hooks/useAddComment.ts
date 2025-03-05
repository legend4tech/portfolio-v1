import { addComment } from "@/app/actions/comments";
import type { CommentFormValues } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CommentFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("message", data.message);
      if (data.file) {
        formData.append("file", data.file);
      }
      return addComment(formData);
    },
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
