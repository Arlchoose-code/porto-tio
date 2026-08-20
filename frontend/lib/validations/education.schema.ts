import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().min(2, "Institution is required"),
  degree: z.string().optional(),
  major: z.string().optional(),
  gpa: z.string().optional(),
  start_year: z.coerce.number().min(1900),
  end_year: z.coerce.number().min(1900),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;
