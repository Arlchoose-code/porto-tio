import React from "react";
import Link from "next/link";
import { Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewBannerProps {
  backUrl: string;
}

export function PreviewBanner({ backUrl }: PreviewBannerProps) {
  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-sm font-medium flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span>Preview Mode — You are viewing this item as it appears to visitors</span>
      </div>
      <Link href={backUrl}>
        <Button size="sm" variant="secondary" className="h-7 text-xs gap-1 bg-white text-slate-900 hover:bg-slate-100">
          <ArrowLeft className="h-3 w-3" />
          Back to Editor
        </Button>
      </Link>
    </div>
  );
}
