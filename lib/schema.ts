import * as z from "zod";

// ... (other code remains the same)

export const commentFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(12, "Name must be less than 12 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 2 * 1024 * 1024),
      "Image must be 2MB or less"
    ),
});

// Define the ContactFormValues schema
export const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }), // Name must be a non-empty string
  message: z.string().min(1, { message: "Message is required" }), // Message must be a non-empty string
  email: z.string().email({ message: "Invalid email address" }), // Email must be a valid email format
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
// Infer the TypeScript type from the schema
export type ContactFormValues = z.infer<typeof contactFormSchema>;
