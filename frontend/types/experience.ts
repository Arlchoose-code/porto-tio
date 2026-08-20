export interface Experience {
  id: number;
  company: string;
  position: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string;
  order: number;
}
