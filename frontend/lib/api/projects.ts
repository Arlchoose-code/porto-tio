import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Project, ProjectCategory, ProjectImage } from "@/types/project";
import { ProjectInput, ProjectCategoryInput } from "@/lib/validations/project.schema";

export const projectsApi = {
  // Public
  getPublicProjects: (params?: { page?: number; per_page?: number; category?: string; featured?: boolean; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.category) query.set("category", params.category);
    if (params?.featured) query.set("featured", "true");
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Project[]>>(`/projects?${query.toString()}`);
  },

  getProjectBySlug: (slug: string) =>
    apiClient<ApiResponse<Project>>(`/projects/${slug}`),

  // Admin
  getAdminProjects: (params?: { page?: number; per_page?: number; search?: string; sort?: string; order?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.order) query.set("order", params.order);
    return apiClient<ApiResponseWithMeta<Project[]>>(`/admin/projects?${query.toString()}`);
  },

  getProjectById: (id: number | string) =>
    apiClient<ApiResponse<Project>>(`/admin/projects/${id}`),

  createProject: (data: ProjectInput) =>
    apiClient<ApiResponse<Project>>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProject: (id: number | string, data: ProjectInput) =>
    apiClient<ApiResponse<Project>>(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteProject: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/projects/${id}`, {
      method: "DELETE",
    }),

  // Categories
  getCategories: () =>
    apiClient<ApiResponse<ProjectCategory[]>>("/admin/project-categories"),

  createCategory: (data: ProjectCategoryInput) =>
    apiClient<ApiResponse<ProjectCategory>>("/admin/project-categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id: number | string, data: ProjectCategoryInput) =>
    apiClient<ApiResponse<ProjectCategory>>(`/admin/project-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/project-categories/${id}`, {
      method: "DELETE",
    }),

  // Project Images
  deleteImage: (imageId: number) =>
    apiClient<ApiResponse<null>>(`/admin/project-images/${imageId}`, {
      method: "DELETE",
    }),

  reorderImages: (projectId: number | string, imageIds: number[]) =>
    apiClient<ApiResponse<null>>(`/admin/projects/${projectId}/images/reorder`, {
      method: "POST",
      body: JSON.stringify({ image_ids: imageIds }),
    }),
};
