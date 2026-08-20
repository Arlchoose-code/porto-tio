export interface ProjectCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  thumbnail_url: string;
  medium_url: string;
  original_url: string;
  caption?: string;
  order: number;
}

export interface Project {
  id: number;
  category_id: number;
  category?: ProjectCategory;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  content?: string;
  thumbnail_url?: string;
  medium_url?: string;
  original_url?: string;
  demo_url?: string;
  repo_url?: string;
  start_date?: string;
  end_date?: string;
  status: "published" | "draft" | "archived";
  featured: boolean;
  order: number;
  views: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}