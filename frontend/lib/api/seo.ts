import { apiClient } from "./client";
import { ApiResponse } from "@/types/common";
import { SeoSetting } from "@/types/seo";
import { SeoSettingInput } from "@/lib/validations/settings.schema";

export const seoApi = {
  getSeoForPath: (path: string) =>
    apiClient<ApiResponse<SeoSetting>>(`/seo?path=${encodeURIComponent(path)}`),

  getAllSeoSettings: () =>
    apiClient<ApiResponse<SeoSetting[]>>("/admin/seo"),

  createSeoSetting: (data: SeoSettingInput) =>
    apiClient<ApiResponse<SeoSetting>>("/admin/seo", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSeoSetting: (id: number | string, data: SeoSettingInput) =>
    apiClient<ApiResponse<SeoSetting>>(`/admin/seo/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSeoSetting: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/seo/${id}`, {
      method: "DELETE",
    }),
};
