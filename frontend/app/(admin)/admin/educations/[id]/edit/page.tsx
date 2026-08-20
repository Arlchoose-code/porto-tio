"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, EducationInput } from "@/lib/validations/education.schema";
import { educationsApi } from "@/lib/api/educations";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
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
    formState: { errors },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      major: "",
      gpa: "",
      start_year: 2020,
      end_year: 2026,
      description: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      educationsApi.getEducationById(id).then((res) => {
        const e = res.data;
        setValue("institution", e.institution);
        setValue("degree", e.degree || "");
        setValue("major", e.major || "");
        setValue("gpa", e.gpa || "");
        setValue("start_year", e.start_year);
        setValue("end_year", e.end_year);
        setValue("description", e.description || "");
        setValue("order", e.order);
        setFetching(false);
      }).catch((e) => {
        toast.error("Failed to load: " + e.message);
        setFetching(false);
      });
    }
  }, [id, isEdit]);

  const onSubmit = async (data: EducationInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await educationsApi.updateEducation(id, data);
        toast.success("Education updated!");
      } else {
        await educationsApi.createEducation(data);
        toast.success("Education created!");
      }
      router.push("/admin/educations");
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
        title={isEdit ? "Edit Education" : "New Education"}
        description="Provide institution, major, GPA, and student activities."
        action={
          <Link href="/admin/educations">
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
            title={isEdit ? "Edit Education" : "Education Details"}
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save Education</span>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Institution Name *</Label>
                <Input {...register("institution")} placeholder="e.g. Institut Bisnis Nusantara / University of Belgrade" className="h-10 text-xs" />
                {errors.institution && <p className="text-xs text-red-500">{errors.institution.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Degree</Label>
                  <Input {...register("degree")} placeholder="e.g. Bachelor's Degree (S.E.)" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Major / Specialization</Label>
                  <Input {...register("major")} placeholder="e.g. Finance Management" className="h-10 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Start Year</Label>
                  <Input {...register("start_year")} type="number" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">End Year</Label>
                  <Input {...register("end_year")} type="number" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Cumulative GPA</Label>
                  <Input {...register("gpa")} placeholder="e.g. 3.72 / 4.00" className="h-10 text-xs font-mono" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Academic Achievements & Leadership</Label>
                <Textarea {...register("description")} placeholder="Describe competitions won, scholarships, broadcast clubs..." rows={4} className="text-xs" />
              </div>
            </div>
          </FormWrapper>
        </form>
      </div>
    </div>
  );
}
