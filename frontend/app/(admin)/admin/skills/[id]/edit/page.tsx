"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, SkillInput } from "@/lib/validations/skill.schema";
import { skillsApi } from "@/lib/api/skills";
import { SkillCategory } from "@/types/skill";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [categories, setCategories] = useState<SkillCategory[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category_id: 1,
      name: "",
      proficiency: 85,
      icon: "Sparkles",
      order: 0,
    },
  });

  const watchCat = watch("category_id");
  const watchProf = watch("proficiency");

  useEffect(() => {
    skillsApi.getCategories().then((res) => {
      setCategories(res.data || []);
      if (!isEdit && res.data?.length) {
        setValue("category_id", res.data[0].id);
      }
    });

    if (isEdit && id) {
      skillsApi.getAdminSkills().then((res) => {
        const s = res.data?.find((x) => String(x.id) === id);
        if (s) {
          setValue("category_id", s.category_id);
          setValue("name", s.name);
          setValue("proficiency", s.proficiency);
          setValue("icon", s.icon || "Sparkles");
          setValue("order", s.order);
        }
        setFetching(false);
      });
    }
  }, [id, isEdit]);

  const onSubmit = async (data: SkillInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await skillsApi.updateSkill(id, data);
        toast.success("Skill updated!");
      } else {
        await skillsApi.createSkill(data);
        toast.success("Skill created!");
      }
      router.push("/admin/skills");
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
        title={isEdit ? "Edit Skill" : "New Skill"}
        description="Add functional competencies, tools, or languages."
        action={
          <Link href="/admin/skills">
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
            title={isEdit ? "Edit Skill" : "Skill Information"}
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save Skill</span>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Category *</Label>
                <Select
                  value={watchCat ? String(watchCat) : ""}
                  onValueChange={(val) => setValue("category_id", Number(val))}
                >
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Skill Name *</Label>
                <Input {...register("name")} placeholder="e.g. Financial Modeling / Python" className="h-10 text-xs" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <Label className="font-medium">Proficiency ({watchProf}%)</Label>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={watchProf || 80}
                  onChange={(e) => setValue("proficiency", Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </FormWrapper>
        </form>
      </div>
    </div>
  );
}
