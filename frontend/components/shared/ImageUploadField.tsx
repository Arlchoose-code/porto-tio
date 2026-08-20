"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MediaLibraryModal } from "./MediaLibraryModal";
import { Image as ImageIcon, Trash2, FolderOpen } from "lucide-react";

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (urls: { original: string; medium?: string; thumbnail?: string }) => void;
  onClear?: () => void;
  description?: string;
}

export function ImageUploadField({
  label = "Featured Image",
  value,
  onChange,
  onClear,
  description,
}: ImageUploadFieldProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs font-semibold text-foreground">{label}</Label>}
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}

      {value ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-xl border border-border/60 bg-muted/20">
          <div className="relative group rounded-lg border border-border/60 overflow-hidden bg-background aspect-video w-36 shrink-0 shadow-sm flex items-center justify-center">
            {!imageError ? (
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
                <span className="text-[9px]">Custom Asset</span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="text-xs font-mono truncate text-muted-foreground" title={value}>
              {value}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 text-xs gap-1.5"
                onClick={() => setModalOpen(true)}
              >
                <FolderOpen className="h-3.5 w-3.5 text-primary" />
                <span>Change Image</span>
              </Button>

              {onClear && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1"
                  onClick={() => {
                    setImageError(false);
                    onClear();
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setModalOpen(true)}
          className="border-2 border-dashed border-border/80 rounded-xl p-5 text-center bg-muted/10 hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Select from Media Library</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Pick existing assets or upload new image files</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 pointer-events-none mt-1"
            >
              <FolderOpen className="h-3.5 w-3.5 text-primary" />
              <span>Open Media Library</span>
            </Button>
          </div>
        </div>
      )}

      <MediaLibraryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={(img) => {
          setImageError(false);
          onChange(img);
        }}
      />
    </div>
  );
}