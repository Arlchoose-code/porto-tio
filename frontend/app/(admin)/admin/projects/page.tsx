"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Project, ProjectCategory } from "@/types/project";
import { projectsApi } from "@/lib/api/projects";
import { Plus, Edit, Trash2, Eye, FolderKanban, Save, Loader2, Tags } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function AdminProjectsPage() {
  const [data, setData] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Category Manager Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatSlug, setEditingCatSlug] = useState("");

  const loadData = async (targetPage = 1, searchQuery = search) => {
    try {
      setLoading(true);
      const [res, catRes] = await Promise.all([
        projectsApi.getAdminProjects({
          page: targetPage,
          per_page: 10,
          search: searchQuery,
        }),
        projectsApi.getCategories(),
      ]);
      setData(res.data || []);
      setPage(res.meta?.page || 1);
      setTotalPages(res.meta?.total_pages || 1);
      setTotal(res.meta?.total || 0);
      setCategories(catRes.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load projects");
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
      await projectsApi.deleteProject(deleteTarget.id);
      toast.success("Project deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadData(page, search);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setSavingCat(true);
      const autoSlug = newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const res = await projectsApi.createCategory({
        name: newCatName.trim(),
        slug: autoSlug,
        order: categories.length + 1,
      });
      setCategories((prev) => [...prev, res.data]);
      setNewCatName("");
      setNewCatSlug("");
      toast.success(`Category "${res.data.name}" created successfully!`);
    } catch (err: any) {
      toast.error("Failed to create category: " + err.message);
    } finally {
      setSavingCat(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCatName.trim()) return;
    try {
      const res = await projectsApi.updateCategory(id, {
        name: editingCatName.trim(),
        slug: editingCatSlug.trim() || editingCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        order: 0,
      });
      setCategories((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      setEditingCatId(null);
      toast.success("Category updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update category: " + err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await projectsApi.deleteCategory(id);
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error("Failed to delete category: " + err.message);
      projectsApi.getCategories().then((res) => setCategories(res.data || []));
    }
  };

  const columns: Column<Project>[] = [
    {
      header: "Project",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden border border-border/40 bg-muted/30 shrink-0">
            {item.thumbnail_url || item.original_url ? (
              <img
                src={item.thumbnail_url || item.original_url}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground text-xs font-bold">
                PROJ
              </div>
            )}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="font-bold text-foreground truncate max-w-sm" title={item.title}>
              {item.title}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              {item.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (item) => (
        <span className="text-xs font-medium text-muted-foreground">
          {item.category?.name || "Uncategorized"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Date",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.created_at ? formatDate(item.created_at) : "-"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/projects/${item.slug}`} target="_blank">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="View Public Case Study"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/admin/projects/${item.id}/edit`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
              title="Edit"
            >
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
        title="Projects & Case Studies"
        description="Manage your portfolio projects, images, categories, and deep-dive case studies."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategoryModalOpen(true)}
              className="gap-1.5 h-8 text-xs"
            >
              <Tags className="h-3.5 w-3.5 text-primary" />
              <span>Manage Categories ({categories.length})</span>
            </Button>

            <Link href="/admin/projects/new">
              <Button size="sm" className="gap-1.5 h-8 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>New Project</span>
              </Button>
            </Link>
          </div>
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
          searchPlaceholder="Search projects by title..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            loadData(1, val);
          }}
        />

        {/* Delete Project Dialog */}
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Project"
          description={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
          onConfirm={handleDelete}
        />

        {/* Category Manager Modal */}
        <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <Tags className="h-4 w-4 text-primary" />
                Project Categories Management
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add, edit, or remove categories to organize your portfolio case studies.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Add New Category Form */}
              <form onSubmit={handleCreateCategory} className="p-3 rounded-xl border bg-muted/20 space-y-2.5">
                <Label className="text-xs font-semibold">Add New Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Category Name (e.g. Fintech)"
                    value={newCatName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewCatName(val);
                      setNewCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                    }}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Slug (e.g. fintech)"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <Button type="submit" size="sm" disabled={savingCat || !newCatName.trim()} className="h-7 text-xs gap-1 w-full">
                  {savingCat ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                  <span>Save New Category</span>
                </Button>
              </form>

              {/* List of Existing Categories */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <Label className="text-xs font-semibold text-muted-foreground">Existing Categories ({categories.length})</Label>
                {categories.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No categories yet.</p>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-2.5 rounded-lg border border-border/60 bg-card flex items-center justify-between gap-2"
                    >
                      {editingCatId === cat.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            className="h-7 text-xs flex-1"
                          />
                          <Button size="sm" className="h-7 text-xs px-2" onClick={() => handleUpdateCategory(cat.id)}>
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => setEditingCatId(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-xs text-foreground">{cat.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono ml-2">({cat.slug})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-blue-500 hover:bg-blue-500/10"
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditingCatName(cat.name);
                                setEditingCatSlug(cat.slug);
                              }}
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteCategory(cat.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}