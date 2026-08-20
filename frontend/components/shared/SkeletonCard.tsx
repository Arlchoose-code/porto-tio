import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonCard() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="h-48 bg-muted/60" />
      <CardHeader className="space-y-2">
        <div className="h-4 w-1/3 rounded bg-muted/60" />
        <div className="h-6 w-3/4 rounded bg-muted/60" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-3 w-full rounded bg-muted/60" />
        <div className="h-3 w-5/6 rounded bg-muted/60" />
      </CardContent>
    </Card>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
