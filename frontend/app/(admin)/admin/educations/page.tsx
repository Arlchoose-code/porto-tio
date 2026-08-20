"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Education } from "@/types/education";
import { educationsApi } from "@/lib/api/educations";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await educationsApi.getAdminEducations();
      setData(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load educations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      await educationsApi.deleteEducation(deleteTarget.id);
      toast.success("Education record deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadData();
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Education>[] = [
    {
      header: "Institution & Degree",
      cell: (item) => (
        <div>
          <div className="font-bold text-foreground">{item.institution}</div>
          <div className="text-[11px] text-primary font-medium">{item.degree} {item.major ? `• ${item.major}` : ""}</div>
        </div>
      ),
    },
    {
      header: "Years",
      cell: (item) => `${item.start_year} — ${item.end_year}`,
    },
    {
      header: "GPA",
      cell: (item) => item.gpa || "-",
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/educations/${item.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(item)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Education Background"
        description="Manage university degrees, international study programs, and academic records."
        action={
          <Link href="/admin/educations/new">
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Education</span>
            </Button>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        <DataTable columns={columns} data={data} loading={loading} />

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Education"
          description={`Are you sure you want to delete "${deleteTarget?.institution}"?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
