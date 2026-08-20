"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Publication } from "@/types/publication";
import { publicationsApi } from "@/lib/api/publications";
import { Plus, Edit, Trash2, ExternalLink, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function AdminPublicationsPage() {
  const [data, setData] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null);

  const loadData = async (targetPage = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const res = await publicationsApi.getAdminPublications({
        page: targetPage,
        per_page: 10,
        search: searchQuery,
      });
      setData(res.data || []);
      setPage(res.meta?.page || 1);
      setTotalPages(res.meta?.total_pages || 1);
      setTotal(res.meta?.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load publications");
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
      await publicationsApi.deletePublication(deleteTarget.id);
      toast.success("Publication deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadData(page, search);
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Publication>[] = [
    {
      header: "Paper Title & Journal",
      cell: (item) => (
        <div className="space-y-0.5">
          <div className="font-bold text-foreground line-clamp-1">{item.title}</div>
          <div className="text-[11px] text-muted-foreground">{item.journal} {item.doi ? `• DOI: ${item.doi}` : ""}</div>
        </div>
      ),
    },
    {
      header: "Indexing Level",
      cell: (item) => (
        <Badge variant="default" className="text-[10px] bg-blue-600 font-semibold">
          {item.index_type || "SINTA 4"}
        </Badge>
      ),
    },
    {
      header: "Publication Date",
      cell: (item) => formatDate(item.publication_date),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Open Publisher URL">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          <Link href={`/admin/publications/${item.id}/edit`}>
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
        title="Scientific Publications"
        description="Manage peer-reviewed articles, journal indexing (SINTA), and research papers."
        action={
          <Link href="/admin/publications/new">
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Publication</span>
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
          searchPlaceholder="Search papers by title or journal..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            loadData(1, val);
          }}
        />

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Publication"
          description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}