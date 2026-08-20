"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorSectionProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorSection({
  title = "Failed to load content",
  message = "An error occurred while fetching data from the server.",
  onRetry,
}: ErrorSectionProps) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center my-6 flex flex-col items-center justify-center">
      <AlertCircle className="h-10 w-10 text-destructive mb-3" />
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
