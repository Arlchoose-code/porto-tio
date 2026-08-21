export interface HeroStatItem {
  id: string;
  value: string;
  label: string;
  description: string;
  color?: string; // "primary" | "indigo" | "blue" | "emerald" | "purple" | "amber"
  order?: number;
}

export interface SiteSetting {
  id: number;
  title: string;
  description: string;
  logo: string;
  favicon: string;
  address?: string;
  email?: string;
  phone?: string;
  bio_short?: string;
  footer_text: string;
  robots_txt: string;
  hero_badge?: string;
  hero_title?: string;
  hero_description?: string;
  hero_image?: string;
  hero_card_title?: string;
  hero_card_status?: string;
  hero_card_subtitle?: string;
  hero_stats?: string; // JSON string of HeroStatItem[]
  career_badge?: string;
  career_title?: string;
  career_description?: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
  is_active: boolean;
}

export interface PublicSiteInfo {
  site_setting: SiteSetting;
  social_links: SocialLink[];
}