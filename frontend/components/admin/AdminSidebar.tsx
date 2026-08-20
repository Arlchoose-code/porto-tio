"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Settings,
  Globe,
  ExternalLink,
  LogOut,
  X,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { User as AuthUser } from "@/types/auth";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (onClose) onClose();
      await authApi.logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (err: any) {
      toast.error("Logout failed: " + err.message);
    }
  };

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Experiences", href: "/admin/experiences", icon: Briefcase },
    { name: "Educations", href: "/admin/educations", icon: GraduationCap },
    { name: "Skills", href: "/admin/skills", icon: Sparkles },
    { name: "Publications", href: "/admin/publications", icon: BookOpen },
    { name: "Pages", href: "/admin/pages", icon: FileText },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "Site & SEO Settings", href: "/admin/settings", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-xl border-r border-border/40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-border/40 flex items-center justify-between shrink-0">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            T
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none text-foreground">Tio CMS</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Admin Management</p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Area: View Public Site + User & Theme & Logout Controls */}
      <div className="p-3 border-t border-border/40 space-y-2 shrink-0 bg-muted/20">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>View Public Site</span>
          </div>
          <ExternalLink className="h-3 w-3" />
        </Link>

        {/* Bottom Control Strip: Theme Toggle + Logout */}
        <div className="flex items-center justify-between pt-1 px-1 border-t border-border/30">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-[11px] text-muted-foreground hidden sm:inline">Theme</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 px-2.5 text-xs gap-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
            title="Sign out of admin"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Slide-over with Framer Motion */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}