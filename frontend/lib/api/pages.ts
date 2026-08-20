import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Page } from "@/types/page";
import { PageInput } from "@/lib/validations/page.schema";

export const pagesApi = {
  getPublicPage: (slug: string) =>
    apiClient<ApiResponse<Page>>(`/pages/${slug}`),

  getAdminPages: (params?: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Page[]>>(`/admin/pages?${query.toString()}`);
  },

  getPageById: (id: number | string) =>
    apiClient<ApiResponse<Page>>(`/admin/pages/${id}`),

  createPage: (data: PageInput) =>
    apiClient<ApiResponse<Page>>("/admin/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePage: (id: number | string, data: PageInput) =>
    apiClient<ApiResponse<Page>>(`/admin/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deletePage: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/pages/${id}`, {
      method: "DELETE",
    }),
};
