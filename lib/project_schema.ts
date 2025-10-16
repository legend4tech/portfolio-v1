import { z } from "zod";

/**
 * Zod schema for project validation
 * Ensures all required fields are present and properly formatted
 */
export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),

  image: z.string().url("Must be a valid URL").min(1, "Image is required"),

  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required")
    .max(15, "Maximum 15 technologies allowed"),

  keyFeatures: z
    .array(z.string())
    .min(1, "At least one key feature is required")
    .max(10, "Maximum 10 key features allowed"),

  demoUrl: z.string().url("Must be a valid URL"),

  githubUrl: z.string().url("Must be a valid URL"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
