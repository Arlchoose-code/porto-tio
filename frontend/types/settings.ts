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