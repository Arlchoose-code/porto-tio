import { z } from "zod";

export const skillCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type SkillCategoryInput = z.infer<typeof skillCategorySchema>;

export const skillSchema = z.object({
  category_id: z.coerce.number().min(1, "Please select a category"),
  name: z.string().min(2, "Skill name is required"),
  proficiency: z.coerce.number().min(1).max(100).default(80),
  level: z.string().optional(),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;