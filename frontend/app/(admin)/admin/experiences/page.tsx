"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types/experience";
import { experiencesApi } from "@/lib/api/experiences";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function Page() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);

  const loadData = async (targetPage = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const res = await experiencesApi.getAdminExperiences({
        page: targetPage,
        per_page: 10,
        search: searchQuery,
      });
      setData(res.data || []);
      setPage(res.meta?.page || 1);
      setTotalPages(res.meta?.total_pages || 1);
      setTotal(res.meta?.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page, search);
  }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      await experiencesApi.deleteExperience(deleteTarget.id);
      toast.success("Experience deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadData(page, search);
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Experience>[] = [
    {
      header: "Position & Organization",
      cell: (item) => (
        <div>
          <div className="font-bold text-foreground">{item.position}</div>
          <div className="text-[11px] text-primary flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>{item.company}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      cell: (item) => (
        <Badge variant="secondary" className="text-xs">
          {item.employment_type || "Contract"}
        </Badge>
      ),
    },
    {
      header: "Period",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(item.start_date)} — {item.is_current ? "Present" : formatDate(item.end_date)}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/experiences/${item.id}/edit`}>
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
        title="Work & Leadership Experiences"
        description="Manage work history, organizational leadership roles, and responsibilities."
        action={
          <Link href="/admin/experiences/new">
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Experience</span>
            </Button>
          </Link>
        }
      />

      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          searchPlaceholder="Search by company or role..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            loadData(1, val);
          }}
        />

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Experience"
          description={`Are you sure you want to delete "${deleteTarget?.position} at ${deleteTarget?.company}"?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
