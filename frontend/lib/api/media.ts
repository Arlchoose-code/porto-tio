import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Media } from "@/types/media";

export const mediaApi = {
  getMediaList: (params?: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Media[]>>(`/admin/media?${query.toString()}`);
  },

  uploadMedia: async (file: File): Promise<ApiResponse<Media>> => {
    const formData = new FormData();
    formData.append("file", file);

    const API_BASE = typeof window === "undefined"
      ? (process.env.NEXT_SERVER_API_URL || "http://localhost:8080/api")
      : "/backend-api";

    const response = await fetch(`${API_BASE}/admin/media/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok || data.status === false) {
      throw new Error(data.message || "Failed to upload file");
    }
    return data;
  },

  deleteMedia: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/media/${id}`, {
      method: "DELETE",
    }),
};
