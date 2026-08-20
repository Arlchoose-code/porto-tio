import { z } from "zod";

export const certificateSchema = z.object({
  name: z.string().min(3, "Certificate name is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issue_date: z.string().min(4, "Issue date is required"),
  expiration_date: z.string().optional().nullable(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  medium_url: z.string().optional(),
  original_url: z.string().optional(),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
