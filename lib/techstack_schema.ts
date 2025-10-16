import { z } from "zod"

/**
 * Zod schema for tech stack validation
 * Ensures all required fields are present and valid
 */
export const techStackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  icon: z.string().url("Please provide a valid URL for the icon"),
  category: z.enum(["Frontend", "Backend", "Blockchain", "Tools", "Other"], {
    required_error: "Please select a category",
  }),
  order: z.number().min(0, "Order must be at least 0").max(999, "Order must be less than 1000"),
})

export type TechStackFormData = z.infer<typeof techStackSchema>
