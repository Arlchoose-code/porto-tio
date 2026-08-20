"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skill, SkillCategory } from "@/types/skill";
import { skillsApi } from "@/lib/api/skills";
import { Plus, Edit, Trash2, Tags, Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminSkillsPage() {
  const [data, setData] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  // Category Management State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [savingCat, setSavingCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatDesc, setEditingCatDesc] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillsRes, catsRes] = await Promise.all([
        skillsApi.getAdminSkills(),
        skillsApi.getCategories(),
      ]);
      setData(skillsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load skills");
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
      await skillsApi.deleteSkill(deleteTarget.id);
      toast.success("Skill deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadData();
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setSavingCat(true);
      const res = await skillsApi.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        order: categories.length + 1,
      });
      setCategories((prev) => [...prev, res.data]);
      setNewCatName("");
      setNewCatDesc("");
      toast.success(`Skill category "${res.data.name}" added successfully!`);
    } catch (err: any) {
      toast.error("Failed to add category: " + err.message);
    } finally {
      setSavingCat(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCatName.trim()) return;
    try {
      const res = await skillsApi.updateCategory(id, {
        name: editingCatName.trim(),
        description: editingCatDesc.trim(),
        order: 1,
      });
      setCategories((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      setEditingCatId(null);
      toast.success("Skill category updated!");
    } catch (err: any) {
      toast.error("Failed to update: " + err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await skillsApi.deleteCategory(id);
      toast.success("Skill category deleted");
    } catch (err: any) {
      toast.error("Failed to delete category: " + err.message);
      skillsApi.getCategories().then((res) => setCategories(res.data || []));
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Skill>[] = [
    {
      header: "Skill Name",
      cell: (item) => (
        <div className="font-bold text-foreground">{item.name}</div>
      ),
    },
    {
      header: "Category",
      cell: (item) => {
        const cat = categories.find((c) => c.id === item.category_id);
        return (
          <Badge variant="outline" className="text-xs font-medium">
            {cat?.name || "Uncategorized"}
          </Badge>
        );
      },
    },
    {
      header: "Proficiency Level",
      cell: (item) => (
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-24 bg-muted/60 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${item.proficiency}%` }} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">{item.proficiency}%</span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/skills/${item.id}/edit`}>
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
        title="Skills Matrix"
        description="Organize technical skills, management competencies, and proficiency levels."
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

            <Link href="/admin/skills/new">
              <Button size="sm" className="gap-1.5 h-8 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>New Skill</span>
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading}
          searchPlaceholder="Search skills by name..."
          searchValue={search}
          onSearchChange={setSearch}
        />

        {/* Delete Dialog */}
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Skill"
          description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
          onConfirm={handleDelete}
        />

        {/* Skill Category Modal */}
        <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base">
                <Tags className="h-4 w-4 text-primary" />
                Skill Categories Management
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add, edit, or remove categories to organize the skill proficiency matrix.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <form onSubmit={handleCreateCategory} className="p-3 rounded-xl border bg-muted/20 space-y-2.5">
                <Label className="text-xs font-semibold">Add New Skill Category</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Category Name (e.g. Cloud & Infrastructure)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="Description (e.g. AWS, Docker, CI/CD pipelines)"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <Button type="submit" size="sm" disabled={savingCat || !newCatName.trim()} className="h-7 text-xs gap-1 w-full">
                  {savingCat ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                  <span>Save Skill Category</span>
                </Button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <Label className="text-xs font-semibold text-muted-foreground">Existing Categories ({categories.length})</Label>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-lg border border-border/60 bg-card flex items-center justify-between gap-2"
                  >
                    {editingCatId === cat.id ? (
                      <div className="flex-1 flex flex-col gap-1.5">
                        <Input
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="h-7 text-xs"
                        />
                        <Input
                          value={editingCatDesc}
                          onChange={(e) => setEditingCatDesc(e.target.value)}
                          placeholder="Description"
                          className="h-7 text-xs"
                        />
                        <div className="flex gap-1.5 justify-end">
                          <Button size="sm" className="h-6 text-xs px-2" onClick={() => handleUpdateCategory(cat.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setEditingCatId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-xs text-foreground">{cat.name}</span>
                          {cat.description && (
                            <p className="text-[10px] text-muted-foreground line-clamp-1">{cat.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-blue-500 hover:bg-blue-500/10"
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditingCatName(cat.name);
                              setEditingCatDesc(cat.description || "");
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
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}