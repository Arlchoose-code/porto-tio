"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Page as PageType } from "@/types/page";
import { pagesApi } from "@/lib/api/pages";
import { Plus, Edit, Trash2, ExternalLink, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function AdminPagesListPage() {
  const [data, setData] = useState<PageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PageType | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await pagesApi.getAdminPages();
      setData(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load static pages");
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
      await pagesApi.deletePage(deleteTarget.id);
      toast.success("Page deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadData();
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<PageType>[] = [
    {
      header: "Page Title & URL",
      cell: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-foreground">{item.title}</div>
          <div className="text-[11px] text-muted-foreground font-mono">/{item.slug}</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Last Updated",
      cell: (item) => formatDate(item.updated_at),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/${item.slug}`} target="_blank">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View Public Page">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/admin/pages/${item.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(item)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            title="Delete"
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
        title="Custom Static Pages"
        description="Create and manage standalone content pages such as About, Curriculum Vitae, or Terms."
        action={
          <Link href="/admin/pages/new">
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Page</span>
            </Button>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        <DataTable columns={columns} data={data} loading={loading} />

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Page"
          description={`Are you sure you want to permanently delete page "/${deleteTarget?.slug}"?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}