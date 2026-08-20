export interface Education {
  id: number;
  institution: string;
  degree?: string;
  major?: string;
  gpa?: string;
  start_year: number;
  end_year: number;
  description?: string;
  order: number;
}
