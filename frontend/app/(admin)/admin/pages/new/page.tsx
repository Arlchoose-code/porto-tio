"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema, PageInput } from "@/lib/validations/page.schema";
import { pagesApi } from "@/lib/api/pages";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { SlugField } from "@/components/shared/SlugField";
import { RichEditor } from "@/components/shared/RichEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function StaticPageFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(id));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PageInput>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "published",
      meta_title: "",
      meta_description: "",
    },
  });

  const watchTitle = watch("title");
  const watchSlug = watch("slug");
  const watchStatus = watch("status");
  const watchContent = watch("content");

  useEffect(() => {
    if (isEdit && id) {
      pagesApi.getPageById(id).then((res) => {
        const p = res.data;
        setValue("title", p.title);
        setValue("slug", p.slug);
        setValue("content", p.content || "");
        setValue("status", p.status);
        setValue("meta_title", p.meta_title || "");
        setValue("meta_description", p.meta_description || "");
        setFetching(false);
      }).catch((e) => {
        toast.error("Failed to load page: " + e.message);
        setFetching(false);
      });
    }
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

  const onSubmit = async (data: PageInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await pagesApi.updatePage(id, data);
        toast.success("Page updated successfully!");
      } else {
        await pagesApi.createPage(data);
        toast.success("Page published successfully!");
      }
      router.push("/admin/pages");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save page");
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
        title={isEdit ? "Edit Custom Page" : "Create New Custom Page"}
        description="Compose custom content, slug path, and SEO metadata for standalone pages."
        action={
          <Link href="/admin/pages">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Pages</span>
            </Button>
          </Link>
        }
      />

      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormWrapper
            title={isEdit ? "Edit Page Content" : "Page Information"}
            description="Changes automatically invalidate edge cache and trigger on-demand revalidation."
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>{isEdit ? "Save Changes" : "Publish Page"}</span>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Page Title *</Label>
                <Input {...register("title")} placeholder="e.g. About Sulistio Murti Mulyono" className="h-10 text-xs" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SlugField
                  value={watchSlug}
                  onChange={(val) => setValue("slug", val)}
                  isEditing={isEdit}
                  error={errors.slug?.message}
                />
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
                      <SelectItem value="published">Published (Live)</SelectItem>
                      <SelectItem value="draft">Draft (Hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">SEO Meta Title</Label>
                  <Input {...register("meta_title")} placeholder="Optional custom title for search engines" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">SEO Meta Description</Label>
                  <Input {...register("meta_description")} placeholder="Short snippet for social previews" className="h-10 text-xs" />
                </div>
              </div>

              <RichEditor
                label="Page Body Content (HTML / Markdown supported)"
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