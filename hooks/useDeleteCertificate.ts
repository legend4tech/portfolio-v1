import { deleteCertificate } from "@/app/actions/certificates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * React Query mutation hook to delete a certificate
 * Automatically invalidates the certificates query on success
 */
export function useDeleteCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCertificate(id);
      if (!result.success) {
        throw new Error("Failed to delete certificate");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete certificate");
    },
  });
}
