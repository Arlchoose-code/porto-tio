import { apiClient } from "./client";
import { ApiResponse } from "@/types/common";
import { Skill, SkillCategory } from "@/types/skill";
import { SkillInput, SkillCategoryInput } from "@/lib/validations/skill.schema";

export const skillsApi = {
  getPublicSkills: () =>
    apiClient<ApiResponse<SkillCategory[]>>("/skills"),

  getAdminSkills: () =>
    apiClient<ApiResponse<Skill[]>>("/admin/skills"),

  createSkill: (data: SkillInput) =>
    apiClient<ApiResponse<Skill>>("/admin/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSkill: (id: number | string, data: SkillInput) =>
    apiClient<ApiResponse<Skill>>(`/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkill: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/skills/${id}`, {
      method: "DELETE",
    }),

  // Categories
  getCategories: () =>
    apiClient<ApiResponse<SkillCategory[]>>("/admin/skill-categories"),

  createCategory: (data: SkillCategoryInput) =>
    apiClient<ApiResponse<SkillCategory>>("/admin/skill-categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCategory: (id: number | string, data: SkillCategoryInput) =>
    apiClient<ApiResponse<SkillCategory>>(`/admin/skill-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCategory: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/skill-categories/${id}`, {
      method: "DELETE",
    }),
};
