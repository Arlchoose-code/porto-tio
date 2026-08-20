"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAdminUI } from "./AdminLayoutContext";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  const { toggleSidebar } = useAdminUI();

  return (
    <header className="min-h-16 border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
      {/* Left: Mobile Hamburger Toggle + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden h-9 w-9 rounded-xl border-border/60 shrink-0"
          aria-label="Toggle admin sidebar"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </Button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground line-clamp-1">{title}</h2>
          {description && (
            <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">{description}</p>
          )}
        </div>
      </div>

      {/* Right: Action Buttons (Add, Filter, Save, etc.) */}
      {action && (
        <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}