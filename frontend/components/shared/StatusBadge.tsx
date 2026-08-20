import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "published" | "draft" | "archived" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "published":
      return <Badge variant="success">Published</Badge>;
    case "draft":
      return <Badge variant="secondary">Draft</Badge>;
    case "archived":
      return <Badge variant="warning">Archived</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
