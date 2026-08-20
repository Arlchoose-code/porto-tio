"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
  error?: string;
}

export function SlugField({
  value,
  onChange,
  isEditing = false,
  error,
}: SlugFieldProps) {
  const [isLocked, setIsLocked] = useState(isEditing);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">URL Slug</Label>
        {isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            {isLocked ? "Unlock slug" : "Lock slug"}
          </Button>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLocked}
        placeholder="url-friendly-slug"
        className="font-mono text-xs"
      />
      {isEditing && !isLocked && (
        <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          Changing this slug may break existing bookmarks or external links.
        </p>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
