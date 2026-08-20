"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Media } from "@/types/media";
import { mediaApi } from "@/lib/api/media";
import { UploadCloud, Trash2, Search, Loader2, Copy, Check, Eye, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminMediaLibraryPage() {
  const [data, setData] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [inspectTarget, setInspectTarget] = useState<Media | null>(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await mediaApi.getMediaList({ per_page: 50, search });
      setData(res.data || []);
    } catch (e: any) {
      toast.error("Failed to load media: " + (e.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const res = await mediaApi.uploadMedia(files[0]);
      toast.success("Uploaded & WebP multi-size generated!");
      setData((prev) => [res.data, ...prev]);
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Failed to process image"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setData((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      await mediaApi.deleteMedia(deleteTarget.id);
      toast.success("Media asset deleted permanently");
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
      loadMedia();
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredData = data.filter((item) =>
    item.original_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Media Assets Library"
        description="Upload, inspect, and manage all images with pure Go automated multi-size pipeline."
        action={
          <label className="cursor-pointer">
            <Button size="sm" disabled={uploading} className="gap-1.5 h-8 text-xs">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
              <span>Upload New File</span>
            </Button>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        }
      />

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Total Assets: <strong className="text-foreground">{filteredData.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 border rounded-2xl bg-card/40">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-xs text-muted-foreground">Loading media assets...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 border rounded-2xl bg-card/40 text-center space-y-3">
            <div className="p-4 rounded-full bg-muted/60 text-muted-foreground">
              <ImageIcon className="h-8 w-8 opacity-60" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">No media assets found</p>
              <p className="text-xs text-muted-foreground mt-0.5">Upload images above to use across projects, certificates, and content.</p>
            </div>
            <label className="cursor-pointer pt-2">
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload First Image</span>
              </Button>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredData.map((item) => {
              const preview = item.thumbnail_url || item.original_url;
              return (
                <div
                  key={item.id}
                  className="group rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-square bg-muted/30 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={preview}
                      alt={item.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-full bg-white/90 text-slate-900 hover:bg-white"
                        onClick={() => setInspectTarget(item)}
                        title="Inspect URLs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-full bg-white/90 text-slate-900 hover:bg-white"
                        onClick={() => handleCopyUrl(item.original_url, item.id)}
                        title="Copy Original URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7 rounded-full"
                        onClick={() => setDeleteTarget(item)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2.5 space-y-1 bg-card">
                    <div className="text-xs font-semibold truncate text-foreground" title={item.original_name}>
                      {item.original_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                      <span>{(item.file_size / 1024).toFixed(0)} KB</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Media Details Dialog */}
        <Dialog open={!!inspectTarget} onOpenChange={(open) => !open && setInspectTarget(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Media Asset Details</DialogTitle>
            </DialogHeader>
            {inspectTarget && (
              <div className="space-y-4 pt-2">
                <div className="aspect-video w-full rounded-xl overflow-hidden border bg-muted/20">
                  <img
                    src={inspectTarget.medium_url || inspectTarget.original_url}
                    alt={inspectTarget.original_name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Original URL (1920px)</label>
                    <div className="flex gap-2">
                      <Input readOnly value={inspectTarget.original_url} className="h-8 font-mono text-[11px]" />
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleCopyUrl(inspectTarget.original_url, 1)}>
                        Copy
                      </Button>
                    </div>
                  </div>
                  {inspectTarget.medium_url && (
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Medium URL (900px)</label>
                      <div className="flex gap-2">
                        <Input readOnly value={inspectTarget.medium_url} className="h-8 font-mono text-[11px]" />
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleCopyUrl(inspectTarget.medium_url, 2)}>
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                  {inspectTarget.thumbnail_url && (
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Thumbnail URL (400px)</label>
                      <div className="flex gap-2">
                        <Input readOnly value={inspectTarget.thumbnail_url} className="h-8 font-mono text-[11px]" />
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleCopyUrl(inspectTarget.thumbnail_url, 3)}>
                          Copy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete Media Asset"
          description={`Are you sure you want to delete "${deleteTarget?.original_name}"?`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}