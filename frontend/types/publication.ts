export interface Publication {
  id: number;
  title: string;
  journal: string;
  index_type?: string;
  publication_date: string;
  doi?: string;
  url?: string;
  abstract?: string;
  authors?: string;
  order: number;
}
