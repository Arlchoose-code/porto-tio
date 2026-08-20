export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiration_date?: string | null;
  credential_id?: string;
  credential_url?: string;
  thumbnail_url?: string;
  medium_url?: string;
  original_url?: string;
  description?: string;
  order: number;
  created_at: string;
}
