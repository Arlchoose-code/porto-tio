import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Education } from "@/types/education";
import { EducationInput } from "@/lib/validations/education.schema";

export const educationsApi = {
  getPublicEducations: () =>
    apiClient<ApiResponse<Education[]>>("/educations"),

  getAdminEducations: (params?: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Education[]>>(`/admin/educations?${query.toString()}`);
  },

  getEducationById: (id: number | string) =>
    apiClient<ApiResponse<Education>>(`/admin/educations/${id}`),

  createEducation: (data: EducationInput) =>
    apiClient<ApiResponse<Education>>("/admin/educations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateEducation: (id: number | string, data: EducationInput) =>
    apiClient<ApiResponse<Education>>(`/admin/educations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEducation: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/educations/${id}`, {
      method: "DELETE",
    }),
};
