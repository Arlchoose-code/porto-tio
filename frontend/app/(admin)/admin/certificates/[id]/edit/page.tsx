"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificateSchema, CertificateInput } from "@/lib/validations/certificate.schema";
import { certificatesApi } from "@/lib/api/certificates";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: "",
      issuer: "",
      issue_date: new Date().toISOString().split("T")[0],
      expiration_date: "",
      credential_id: "",
      credential_url: "",
      thumbnail_url: "",
      medium_url: "",
      original_url: "",
      description: "",
      order: 0,
    },
  });

  const watchCover = watch("original_url");

  useEffect(() => {
    if (isEdit && id) {
      certificatesApi.getCertificateById(id).then((res) => {
        const c = res.data;
        setValue("name", c.name);
        setValue("issuer", c.issuer);
        setValue("issue_date", c.issue_date ? c.issue_date.split("T")[0] : "");
        setValue("expiration_date", c.expiration_date ? c.expiration_date.split("T")[0] : "");
        setValue("credential_id", c.credential_id || "");
        setValue("credential_url", c.credential_url || "");
        setValue("thumbnail_url", c.thumbnail_url || "");
        setValue("medium_url", c.medium_url || "");
        setValue("original_url", c.original_url || "");
        setValue("description", c.description || "");
        setValue("order", c.order);
        setFetching(false);
      }).catch((e) => {
        toast.error("Failed to load: " + e.message);
        setFetching(false);
      });
    }
  }, [id, isEdit]);

  const onSubmit = async (data: CertificateInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await certificatesApi.updateCertificate(id, data);
        toast.success("Certificate updated!");
      } else {
        await certificatesApi.createCertificate(data);
        toast.success("Certificate created!");
      }
      router.push("/admin/certificates");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title={isEdit ? "Edit Certificate" : "New Certificate"}
        description="Fill out the certificate details and upload credential image."
        action={
          <Link href="/admin/certificates">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          </Link>
        }
      />

      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormWrapper
            title={isEdit ? "Edit Certificate" : "Certificate Information"}
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save Certificate</span>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Certificate / Award Name *</Label>
                <Input {...register("name")} placeholder="e.g. Belajar Prinsip Pemrograman SOLID" className="h-10 text-xs" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Issuing Organization *</Label>
                  <Input {...register("issuer")} placeholder="e.g. Dicoding Academy / BNSP" className="h-10 text-xs" />
                  {errors.issuer && <p className="text-xs text-red-500">{errors.issuer.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Issue Date *</Label>
                  <Input {...register("issue_date")} type="date" className="h-10 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Credential ID</Label>
                  <Input {...register("credential_id")} placeholder="e.g. JMZVN30W3PN9" className="h-10 text-xs font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Verification URL</Label>
                  <Input {...register("credential_url")} placeholder="https://..." className="h-10 text-xs" />
                </div>
              </div>

              <ImageUploadField
                label="Certificate Scan / Document Image"
                value={watchCover}
                onChange={(urls) => {
                  setValue("original_url", urls.original);
                  setValue("medium_url", urls.medium || urls.original);
                  setValue("thumbnail_url", urls.thumbnail || urls.original);
                }}
                onClear={() => {
                  setValue("original_url", "");
                  setValue("medium_url", "");
                  setValue("thumbnail_url", "");
                }}
              />

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Description / Competencies Covered</Label>
                <Textarea {...register("description")} placeholder="Describe the topics and skills covered in this accreditation..." rows={3} className="text-xs" />
              </div>
            </div>
          </FormWrapper>
        </form>
      </div>
    </div>
  );
}
