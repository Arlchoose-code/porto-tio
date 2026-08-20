"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectInput } from "@/lib/validations/project.schema";
import { projectsApi } from "@/lib/api/projects";
import { ProjectCategory } from "@/types/project";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { SlugField } from "@/components/shared/SlugField";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { RichEditor } from "@/components/shared/RichEditor";
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
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      content: "",
      thumbnail_url: "",
      medium_url: "",
      original_url: "",
      demo_url: "",
      repo_url: "",
      status: "published",
      featured: false,
      order: 0,
    },
  });

  const watchTitle = watch("title");
  const watchSlug = watch("slug");
  const watchCover = watch("original_url");
  const watchContent = watch("content");
  const watchStatus = watch("status");
  const watchCategory = watch("category_id");

  useEffect(() => {
    async function loadInitData() {
      try {
        const catRes = await projectsApi.getCategories();
        setCategories(catRes.data || []);

        if (isEdit && id) {
          const res = await projectsApi.getProjectById(id);
          const p = res.data;
          setValue("category_id", p.category_id);
          setValue("title", p.title);
          setValue("slug", p.slug);
          setValue("subtitle", p.subtitle || "");
          setValue("description", p.description || "");
          setValue("content", p.content || "");
          setValue("thumbnail_url", p.thumbnail_url || "");
          setValue("medium_url", p.medium_url || "");
          setValue("original_url", p.original_url || "");
          setValue("demo_url", p.demo_url || "");
          setValue("repo_url", p.repo_url || "");
          setValue("status", p.status);
          setValue("featured", p.featured);
          setValue("order", p.order);
        } else if (catRes.data?.length) {
          setValue("category_id", catRes.data[0].id);
        }
      } catch (err: any) {
        toast.error("Failed to load project details: " + err.message);
      } finally {
        setFetching(false);
      }
    }
    loadInitData();
  }, [id, isEdit]);

  // Auto-generate slug when creating
  useEffect(() => {
    if (!isEdit && watchTitle) {
      const generated = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generated);
    }
  }, [watchTitle, isEdit]);

  const onSubmit = async (data: ProjectInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await projectsApi.updateProject(id, data);
        toast.success("Project updated successfully!");
      } else {
        await projectsApi.createProject(data);
        toast.success("Project created successfully!");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
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
        title={isEdit ? "Edit Project" : "Create New Project"}
        description="Fill out the project details, images, and content."
        action={
          <Link href="/admin/projects">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Projects</span>
            </Button>
          </Link>
        }
      />

      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormWrapper
            title={isEdit ? "Edit Project Details" : "Project Information"}
            description="All changes trigger background revalidation for the public frontend."
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>{isEdit ? "Update Project" : "Publish Project"}</span>
              </Button>
            }
          >
            <div className="space-y-6">
              {/* Category & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Category</Label>
                  <Select
                    value={watchCategory ? String(watchCategory) : ""}
                    onValueChange={(val) => setValue("category_id", Number(val))}
                  >
                    <SelectTrigger className="h-10 text-xs">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Publication Status</Label>
                  <Select
                    value={watchStatus}
                    onValueChange={(val: any) => setValue("status", val)}
                  >
                    <SelectTrigger className="h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published (Visible)</SelectItem>
                      <SelectItem value="draft">Draft (Hidden)</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Project Title *</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g. 2024 Indonesian Overseas General Election"
                  className="h-10 text-xs"
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Subtitle / Role Hook</Label>
                <Input
                  {...register("subtitle")}
                  placeholder="e.g. Head of Finance, Logistics & HR — Supervised by KPU RI"
                  className="h-10 text-xs"
                />
              </div>

              {/* Slug Field */}
              <SlugField
                value={watchSlug}
                onChange={(val) => setValue("slug", val)}
                isEditing={isEdit}
                error={errors.slug?.message}
              />

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Executive Summary / Short Description *</Label>
                <Input
                  {...register("description")}
                  placeholder="Concise 1-3 sentence summary of the project impact and role"
                  className="h-10 text-xs"
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>

              {/* Featured Image */}
              <ImageUploadField
                label="Cover Image"
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

              {/* External URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Demo / Live Website URL</Label>
                  <Input
                    {...register("demo_url")}
                    placeholder="https://example.com"
                    className="h-10 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Repository / Source Code URL</Label>
                  <Input
                    {...register("repo_url")}
                    placeholder="https://github.com/..."
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              {/* Deep Dive Rich Content */}
              <RichEditor
                label="Full Case Study Content (HTML / Markdown supported)"
                value={watchContent || ""}
                onChange={(val) => setValue("content", val)}
              />
            </div>
          </FormWrapper>
        </form>
      </div>
    </div>
  );
}
