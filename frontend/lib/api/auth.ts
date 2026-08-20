import { apiClient } from "./client";
import { ApiResponse } from "@/types/common";
import { User, LoginResponse } from "@/types/auth";
import { LoginInput } from "@/lib/validations/auth.schema";

export const authApi = {
  login: async (data: LoginInput) => {
    const res = await apiClient<ApiResponse<LoginResponse>>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (typeof window !== "undefined" && res.data) {
      if (res.data.access_token) {
        localStorage.setItem("auth_token", res.data.access_token);
      }
      if (res.data.user) {
        localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      }
    }
    return res;
  },

  logout: async () => {
    try {
      await apiClient<ApiResponse<null>>("/admin/auth/logout", {
        method: "POST",
      });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
  },

  refreshToken: () =>
    apiClient<ApiResponse<{ access_token: string }>>("/admin/auth/refresh", {
      method: "POST",
    }),

  getMe: () =>
    apiClient<ApiResponse<User>>("/admin/auth/me"),

  updateProfile: async (data: { name: string; email: string }) => {
    const res = await apiClient<ApiResponse<User>>("/admin/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (typeof window !== "undefined" && res.data) {
      localStorage.setItem("auth_user", JSON.stringify(res.data));
    }
    return res;
  },

  updatePassword: (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) =>
    apiClient<ApiResponse<null>>("/admin/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};