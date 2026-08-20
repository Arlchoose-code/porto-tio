import { apiClient } from "./client";
import { ApiResponse, ApiResponseWithMeta } from "@/types/common";
import { Certificate } from "@/types/certificate";
import { CertificateInput } from "@/lib/validations/certificate.schema";

export const certificatesApi = {
  getPublicCertificates: () =>
    apiClient<ApiResponse<Certificate[]>>("/certificates"),

  getAdminCertificates: (params?: { page?: number; per_page?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.per_page) query.set("per_page", params.per_page.toString());
    if (params?.search) query.set("search", params.search);
    return apiClient<ApiResponseWithMeta<Certificate[]>>(`/admin/certificates?${query.toString()}`);
  },

  getCertificateById: (id: number | string) =>
    apiClient<ApiResponse<Certificate>>(`/admin/certificates/${id}`),

  createCertificate: (data: CertificateInput) =>
    apiClient<ApiResponse<Certificate>>("/admin/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCertificate: (id: number | string, data: CertificateInput) =>
    apiClient<ApiResponse<Certificate>>(`/admin/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCertificate: (id: number | string) =>
    apiClient<ApiResponse<null>>(`/admin/certificates/${id}`, {
      method: "DELETE",
    }),
};
