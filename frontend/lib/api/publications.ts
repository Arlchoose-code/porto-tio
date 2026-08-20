import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Publication } from "@/types/publication";
import { PublicationInput } from "@/lib/validations/publication.schema";

export const publicationsApi = {
  getPublicPublications: () =>
    apiClient<ApiResponse<Publication[]>>("/publications"),

  getAdminPublications: (params?: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Publication[]>>(`/admin/publications?${query.toString()}`);
  },

  getPublicationById: (id: number | string) =>
    apiClient<ApiResponse<Publication>>(`/admin/publications/${id}`),

  createPublication: (data: PublicationInput) =>
    apiClient<ApiResponse<Publication>>("/admin/publications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePublication: (id: number | string, data: PublicationInput) =>
    apiClient<ApiResponse<Publication>>(`/admin/publications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deletePublication: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/publications/${id}`, {
      method: "DELETE",
    }),
};
