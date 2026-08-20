"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ArrowUpRight,
  Home,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { PublicSiteInfo } from "@/types/settings";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  siteInfo?: PublicSiteInfo;
}

export function Navbar({ siteInfo }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Experience", href: "/experiences", icon: Briefcase },
    { name: "Education", href: "/educations", icon: GraduationCap },
    { name: "Skills", href: "/skills", icon: Sparkles },
    { name: "Certificates", href: "/certificates", icon: Award },
    { name: "Publications", href: "/publications", icon: BookOpen },
  ];

  // Dynamic branding from site settings
  const fullTitle = siteInfo?.site_setting?.title || "Sulistio Murti Mulyono — Digital Business & PM";
  const parts = fullTitle.split("—");
  const brandName = parts[0]?.trim() || "Sulistio Murti Mulyono";
  const brandSub = parts[1]?.trim() || siteInfo?.site_setting?.description?.substring(0, 30) || "Digital Business & PM";
  const logoUrl = siteInfo?.site_setting?.logo;
  const contactEmail = siteInfo?.site_setting?.email || "tiomurti4@gmail.com";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" prefetch={true} className="flex items-center gap-2.5 group">
          {logoUrl && !logoError ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border/40 bg-muted/30 shadow-sm shrink-0">
              <img
                src={logoUrl}
                alt={brandName}
                className="w-full h-full object-cover"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
              {brandName.charAt(0) || "T"}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors line-clamp-1">
              {brandName}
            </span>
            <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block line-clamp-1">
              {brandSub}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link href={`mailto:${contactEmail}`} target="_blank">
            <Button size="sm" className="h-8 px-3 text-xs gap-1 rounded-full shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
              <span>Contact</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer (1-Column Vertical List with Smooth Framer Motion Animation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, idx) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                const IconComponent = link.icon;

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                        <span className="text-xs font-medium">{link.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              <div className="pt-3 mt-2 border-t border-border/40 flex justify-between items-center text-[11px] text-muted-foreground px-2">
                <span className="font-medium text-foreground">{brandName}</span>
                <span>{contactEmail}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}