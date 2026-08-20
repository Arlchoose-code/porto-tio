export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
  meta_title?: string;
  meta_description?: string;
  updated_at: string;
}
