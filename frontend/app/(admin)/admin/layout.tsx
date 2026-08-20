"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminUIProvider, useAdminUI } from "@/components/admin/AdminLayoutContext";
import { authApi } from "@/lib/api/auth";
import { Loader2 } from "lucide-react";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAdminUI();

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      <AdminSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoginPage) return;

    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuthenticated(true);
    } else {
      router.replace("/admin/login");
    }

    // Verify token validity in background
    authApi.getMe().catch(() => {
      setAuthenticated(false);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      router.replace("/admin/login");
    });
  }, [isLoginPage, router]);

  // Login page gets an isolated full-screen container
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
  }

  // During SSR and before mount, render consistent container to eliminate hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-medium text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <AdminUIProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminUIProvider>
  );
}