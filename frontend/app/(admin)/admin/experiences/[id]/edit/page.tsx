"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, ExperienceInput } from "@/lib/validations/experience.schema";
import { experiencesApi } from "@/lib/api/experiences";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      employment_type: "Full-time",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      is_current: false,
      description: "",
      order: 0,
    },
  });

  const watchType = watch("employment_type");
  const watchCurrent = watch("is_current");

  useEffect(() => {
    if (isEdit && id) {
      experiencesApi.getExperienceById(id).then((res) => {
        const e = res.data;
        setValue("company", e.company);
        setValue("position", e.position);
        setValue("location", e.location || "");
        setValue("employment_type", e.employment_type || "Full-time");
        setValue("start_date", e.start_date ? e.start_date.split("T")[0] : "");
        setValue("end_date", e.end_date ? e.end_date.split("T")[0] : "");
        setValue("is_current", e.is_current);
        setValue("description", e.description || "");
        setValue("order", e.order);
        setFetching(false);
      }).catch((e) => {
        toast.error("Failed to load: " + e.message);
        setFetching(false);
      });
    }
  }, [id, isEdit]);

  const onSubmit = async (data: ExperienceInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await experiencesApi.updateExperience(id, data);
        toast.success("Experience updated!");
      } else {
        await experiencesApi.createExperience(data);
        toast.success("Experience created!");
      }
      router.push("/admin/experiences");
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
        title={isEdit ? "Edit Experience" : "New Experience"}
        description="Add details about your professional or organizational tenure."
        action={
          <Link href="/admin/experiences">
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
            title={isEdit ? "Edit Experience" : "Experience Details"}
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save Experience</span>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Position / Title *</Label>
                  <Input {...register("position")} placeholder="e.g. Project Manager / President" className="h-10 text-xs" />
                  {errors.position && <p className="text-xs text-red-500">{errors.position.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Company / Organization *</Label>
                  <Input {...register("company")} placeholder="e.g. Tenhal Bekerja Bersama / PPI Serbia" className="h-10 text-xs" />
                  {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input {...register("location")} placeholder="e.g. Belgrade, Serbia / Jakarta" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Employment Type</Label>
                  <Select
                    value={watchType}
                    onValueChange={(val) => setValue("employment_type", val)}
                  >
                    <SelectTrigger className="h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Organizational">Organizational / Volunteer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Start Date *</Label>
                  <Input {...register("start_date")} type="date" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">End Date</Label>
                    <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchCurrent}
                        onChange={(e) => {
                          setValue("is_current", e.target.checked);
                          if (e.target.checked) setValue("end_date", "");
                        }}
                      />
                      <span>Currently Active</span>
                    </label>
                  </div>
                  <Input
                    {...register("end_date")}
                    type="date"
                    disabled={watchCurrent}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Key Achievements & Responsibilities</Label>
                <Textarea {...register("description")} placeholder="Describe the budget managed, team size, leadership milestones, and impact..." rows={5} className="text-xs leading-relaxed" />
              </div>
            </div>
          </FormWrapper>
        </form>
      </div>
    </div>
  );
}
