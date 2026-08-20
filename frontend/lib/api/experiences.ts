import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Experience } from "@/types/experience";
import { ExperienceInput } from "@/lib/validations/experience.schema";

export const experiencesApi = {
  getPublicExperiences: () =>
    apiClient<ApiResponse<Experience[]>>("/experiences"),

  getAdminExperiences: (params?: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Experience[]>>(`/admin/experiences?${query.toString()}`);
  },

  getExperienceById: (id: number | string) =>
    apiClient<ApiResponse<Experience>>(`/admin/experiences/${id}`),

  createExperience: (data: ExperienceInput) =>
    apiClient<ApiResponse<Experience>>("/admin/experiences", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExperience: (id: number | string, data: ExperienceInput) =>
    apiClient<ApiResponse<Experience>>(`/admin/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteExperience: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/experiences/${id}`, {
      method: "DELETE",
    }),
};
