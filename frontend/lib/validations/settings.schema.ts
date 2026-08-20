import { z } from "zod";

export const siteSettingSchema = z.object({
  title: z.string().min(2, "Site title is required"),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  bio_short: z.string().optional(),
  footer_text: z.string().optional(),
  robots_txt: z.string().optional(),
});

export type SiteSettingInput = z.infer<typeof siteSettingSchema>;

export const socialLinkSchema = z.object({
  platform: z.string().min(2, "Platform is required"),
  url: z.string().min(2, "URL is required"),
  icon: z.string().optional(),
  order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export const seoSettingSchema = z.object({
  path: z.string().min(1, "Path is required"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
  canonical_url: z.string().optional(),
  json_ld: z.string().optional(),
});

export type SeoSettingInput = z.infer<typeof seoSettingSchema>;