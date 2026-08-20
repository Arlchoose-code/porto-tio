import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(2, "Company/Organization name is required"),
  position: z.string().min(2, "Position/Role is required"),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  start_date: z.string().min(4, "Start date is required"),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
