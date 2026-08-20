export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface ApiMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponseWithMeta<T> {
  status: boolean;
  message: string;
  data: T;
  meta: ApiMeta;
}
