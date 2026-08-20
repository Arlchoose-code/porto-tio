import { z } from "zod";

export const pageSchema = z.object({
  title: z.string().min(2, "Page title is required"),
  slug: z.string().min(2, "Page slug is required"),
  content: z.string().optional(),
  status: z.enum(["published", "draft"]).default("published"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type PageInput = z.infer<typeof pageSchema>;
