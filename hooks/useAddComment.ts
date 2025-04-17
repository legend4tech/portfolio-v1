import { addComment } from "@/app/actions/comments";
import type { CommentFormValues } from "@/lib/schema";
import { uploadFileToS3 } from "@/lib/uploadFileToS3";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CommentFormValues) => {
      try {
        let avatarUrl = null;

        // If there's a file, upload it first
        if (data.file) {
          toast.loading("Uploading file...");
          try {
            // Upload the file directly from the client
            avatarUrl = await uploadFileToS3(data.file);
            toast.dismiss();
          } catch (error) {
            toast.dismiss();
            toast.error("Failed to upload file. Please try again.");
            console.error("Error uploading file:", error);
            throw error;
          }
        }

        // Create a FormData object for the server action
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("message", data.message);

        // Add the avatar URL if we have one
        if (avatarUrl) {
          formData.append("avatar", avatarUrl);
        }

        // Call the server action with the form data
        const result = await addComment(formData);
        return result;
      } catch (error) {
        console.error("Error in mutation:", error);
        throw error;
      }
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
