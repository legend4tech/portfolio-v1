"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ContactFormValues } from "@/lib/schema";
import { sendContactEmail } from "@/app/actions/email";

export function useSendEmail() {
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      return sendContactEmail(formData);
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send message. Please try again.");
      console.error("Error sending email:", error);
    },
  });
}
