import { apiClient } from "./client";
import { ApiResponse } from "@/types/common";
import { PublicSiteInfo, SiteSetting, SocialLink } from "@/types/settings";
import { SiteSettingInput, SocialLinkInput } from "@/lib/validations/settings.schema";

export const settingsApi = {
  getPublicSettings: () =>
    apiClient<ApiResponse<PublicSiteInfo>>("/settings"),

  getAdminSiteSettings: () =>
    apiClient<ApiResponse<SiteSetting>>("/admin/settings"),

  updateAdminSiteSettings: (data: SiteSettingInput) =>
    apiClient<ApiResponse<SiteSetting>>("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getSocialLinks: () =>
    apiClient<ApiResponse<SocialLink[]>>("/admin/social-links"),

  createSocialLink: (data: SocialLinkInput) =>
    apiClient<ApiResponse<SocialLink>>("/admin/social-links", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSocialLink: (id: number | string, data: SocialLinkInput) =>
    apiClient<ApiResponse<SocialLink>>(`/admin/social-links/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSocialLink: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/social-links/${id}`, {
      method: "DELETE",
    }),
};
