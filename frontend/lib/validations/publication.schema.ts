import { z } from "zod";

export const publicationSchema = z.object({
  title: z.string().min(5, "Title is required"),
  journal: z.string().min(2, "Journal name is required"),
  index_type: z.string().optional(),
  publication_date: z.string().min(4, "Publication date is required"),
  doi: z.string().optional(),
  url: z.string().optional(),
  abstract: z.string().optional(),
  authors: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type PublicationInput = z.infer<typeof publicationSchema>;
