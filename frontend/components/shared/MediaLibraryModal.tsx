"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Media } from "@/types/media";
import { mediaApi } from "@/lib/api/media";
import { UploadCloud, Image as ImageIcon, Check, Loader2, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: { original: string; medium?: string; thumbnail?: string }) => void;
}

export function MediaLibraryModal({
  open,
  onOpenChange,
  onSelect,
}: MediaLibraryModalProps) {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<Media | null>(null);
  const [tab, setTab] = useState("library");

  useEffect(() => {
    if (open) {
      loadMedia();
      setUploadedPreview(null);
    }
  }, [open]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const res = await mediaApi.getMediaList({ per_page: 50, search });
      setMediaList(res.data || []);
    } catch (err: any) {
      toast.error("Failed to load media library: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setUploading(true);
      const res = await mediaApi.uploadMedia(file);
      toast.success("Image uploaded & optimized successfully!");
      setMediaList((prev) => [res.data, ...prev]);
      setSelectedItem(res.data);
      setUploadedPreview(res.data);
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleConfirmSelect = (target?: Media) => {
    const chosen = target || selectedItem;
    if (!chosen) return;
    onSelect({
      original: chosen.original_url,
      medium: chosen.medium_url,
      thumbnail: chosen.thumbnail_url,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <ImageIcon className="h-5 w-5 text-primary" />
            Media Library &amp; Asset Picker
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 mb-4 gap-2">
            <TabsList>
              <TabsTrigger value="library">Library ({mediaList.length})</TabsTrigger>
              <TabsTrigger value="upload">Upload New File</TabsTrigger>
            </TabsList>

            {tab === "library" && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadMedia()}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            )}
          </div>

          <TabsContent value="library" className="flex-1 overflow-y-auto min-h-[300px] p-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading images...</p>
              </div>
            ) : mediaList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground space-y-2">
                <ImageIcon className="h-10 w-10 opacity-30" />
                <p className="text-xs font-semibold">No media files found</p>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setTab("upload")}>
                  Upload Your First Image
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {mediaList.map((media) => {
                  const isSelected = selectedItem?.id === media.id;
                  const thumb = media.thumbnail_url || media.original_url;
                  return (
                    <div
                      key={media.id}
                      onClick={() => setSelectedItem(media)}
                      onDoubleClick={() => handleConfirmSelect(media)}
                      className={`group relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer bg-muted/30 transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/40 shadow-md"
                          : "border-border/60 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={thumb}
                        alt={media.original_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/75 p-1.5 text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {media.original_name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl my-2 bg-muted/10">
            {uploading ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-xs font-semibold">Uploading and converting image to WebP...</p>
              </div>
            ) : uploadedPreview ? (
              /* Live Upload Preview */
              <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
                <div className="relative aspect-video w-56 rounded-xl overflow-hidden border shadow-lg bg-background">
                  <img
                    src={uploadedPreview.medium_url || uploadedPreview.original_url}
                    alt={uploadedPreview.original_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground truncate max-w-xs">{uploadedPreview.original_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{(uploadedPreview.file_size / 1024).toFixed(0)} KB • WebP Optimized</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleConfirmSelect(uploadedPreview)} className="text-xs">
                    Use This Image
                  </Button>
                  <label className="cursor-pointer">
                    <Button size="sm" variant="outline" className="text-xs pointer-events-none">
                      Upload Another
                    </Button>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer space-y-3 text-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary hover:scale-105 transition-transform">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Click to upload new image</p>
                  <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, WebP (Automatically converted to 3 sizes)</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs pointer-events-none mt-2">
                  Browse Files
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </TabsContent>

          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <div className="text-xs text-muted-foreground truncate max-w-xs">
              {selectedItem ? (
                <span>Selected: <strong className="text-foreground">{selectedItem.original_name}</strong></span>
              ) : (
                <span>Click an image to select</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="text-xs"
                disabled={!selectedItem}
                onClick={() => handleConfirmSelect()}
              >
                Use Selected Image
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}