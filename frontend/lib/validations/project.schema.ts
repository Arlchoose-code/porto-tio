import { z } from "zod";

export const projectCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type ProjectCategoryInput = z.infer<typeof projectCategorySchema>;

export const projectSchema = z.object({
  category_id: z.coerce.number().min(1, "Category is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(2, "Slug is required"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional(),
  thumbnail_url: z.string().optional(),
  medium_url: z.string().optional(),
  original_url: z.string().optional(),
  demo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repo_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["published", "draft", "archived"]).default("published"),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;