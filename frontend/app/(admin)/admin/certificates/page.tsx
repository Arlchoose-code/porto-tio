"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/types/certificate";
import { certificatesApi } from "@/lib/api/certificates";
import { Plus, Edit, Trash2, ExternalLink, Award } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function Page() {
  const [data, setData] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);

  const loadData = async (targetPage = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const res = await certificatesApi.getAdminCertificates({
        page: targetPage,
        per_page: 10,
        search: searchQuery,
      });
      setData(res.data || []);
      setPage(res.meta?.page || 1);
      setTotalPages(res.meta?.total_pages || 1);
      setTotal(res.meta?.total || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load certificates");
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
      await certificatesApi.deleteCertificate(deleteTarget.id);
      toast.success("Certificate deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete certificate: " + err.message);
      loadData(page, search);
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Certificate>[] = [
    {
      header: "Certificate",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted/60 overflow-hidden shrink-0 border flex items-center justify-center">
            {item.thumbnail_url || item.original_url ? (
              <img src={item.thumbnail_url || item.original_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Award className="h-5 w-5 text-amber-500" />
            )}
          </div>
          <div>
            <div className="font-bold text-foreground line-clamp-1">{item.name}</div>
            <div className="text-[11px] text-muted-foreground">{item.issuer}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Issue Date",
      cell: (item) => formatDate(item.issue_date),
    },
    {
      header: "Credential ID",
      cell: (item) => (
        <span className="font-mono text-[11px] text-muted-foreground">{item.credential_id || "-"}</span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          {item.credential_url && (
            <a href={item.credential_url} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          <Link href={`/admin/certificates/${item.id}/edit`}>
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
        title="Certifications & Accreditations"
        description="Manage professional credentials, awards, and licenses."
        action={
          <Link href="/admin/certificates/new">
            <Button size="sm" className="gap-1.5 h-8 text-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Certificate</span>
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
          searchPlaceholder="Search certificates by name or issuer..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            loadData(1, val);
          }}
        />

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Certificate"
          description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
