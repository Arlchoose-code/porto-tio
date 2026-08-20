"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicationSchema, PublicationInput } from "@/lib/validations/publication.schema";
import { publicationsApi } from "@/lib/api/publications";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FormWrapper } from "@/components/admin/FormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function PublicationFormPage() {
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
    formState: { errors },
  } = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      journal: "",
      index_type: "SINTA 4",
      publication_date: new Date().toISOString().split("T")[0],
      doi: "",
      url: "",
      abstract: "",
      authors: "Sulistio Murti Mulyono",
      order: 0,
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      publicationsApi.getPublicationById(id).then((res) => {
        const p = res.data;
        setValue("title", p.title);
        setValue("journal", p.journal);
        setValue("index_type", p.index_type || "SINTA 4");
        setValue("publication_date", p.publication_date ? p.publication_date.split("T")[0] : "");
        setValue("doi", p.doi || "");
        setValue("url", p.url || "");
        setValue("abstract", p.abstract || "");
        setValue("authors", p.authors || "");
        setValue("order", p.order);
        setFetching(false);
      }).catch((e) => {
        toast.error("Failed to load publication: " + e.message);
        setFetching(false);
      });
    }
  }, [id, isEdit]);

  const onSubmit = async (data: PublicationInput) => {
    try {
      setLoading(true);
      if (isEdit) {
        await publicationsApi.updatePublication(id, data);
        toast.success("Publication updated successfully!");
      } else {
        await publicationsApi.createPublication(data);
        toast.success("Publication published successfully!");
      }
      router.push("/admin/publications");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save publication");
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
        title={isEdit ? "Edit Scientific Publication" : "New Scientific Publication"}
        description="Provide research title, journal index (SINTA), authors, and abstract."
        action={
          <Link href="/admin/publications">
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
            title={isEdit ? "Edit Publication Details" : "Publication Information"}
            actions={
              <Button type="submit" disabled={loading} size="sm" className="gap-1.5 text-xs">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>Save Publication</span>
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Article Title *</Label>
                <Input {...register("title")} placeholder="e.g. Analisis Perbedaan Abnormal Return dan Trading Volume..." className="h-10 text-xs" />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Journal Name *</Label>
                  <Input {...register("journal")} placeholder="e.g. Jurnal Riset Manajemen dan Bisnis" className="h-10 text-xs" />
                  {errors.journal && <p className="text-xs text-red-500">{errors.journal.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Indexing Level</Label>
                  <Input {...register("index_type")} placeholder="e.g. SINTA 4 / Scopus" className="h-10 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Publication Date *</Label>
                  <Input {...register("publication_date")} type="date" className="h-10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">DOI</Label>
                  <Input {...register("doi")} placeholder="10.35829/jrmb.v9i2.142" className="h-10 text-xs font-mono" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Article Link / URL</Label>
                <Input {...register("url")} placeholder="https://jurnal.example.com/..." className="h-10 text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Authors</Label>
                <Input {...register("authors")} placeholder="Sulistio Murti Mulyono, dkk." className="h-10 text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Abstract</Label>
                <Textarea {...register("abstract")} placeholder="Paste article abstract here..." rows={4} className="text-xs leading-relaxed" />
              </div>
            </div>
          </FormWrapper>
        </form>
      </div>
    </div>
  );
}