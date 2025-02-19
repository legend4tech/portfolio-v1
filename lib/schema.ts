import * as z from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const commentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type CommentFormValues = z.infer<typeof commentFormSchema>;
