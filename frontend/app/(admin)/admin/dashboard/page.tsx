"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { projectsApi } from "@/lib/api/projects";
import { certificatesApi } from "@/lib/api/certificates";
import { experiencesApi } from "@/lib/api/experiences";
import { skillsApi } from "@/lib/api/skills";
import { publicationsApi } from "@/lib/api/publications";
import { mediaApi } from "@/lib/api/media";

export default function Page() {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    experiences: 0,
    skills: 0,
    publications: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [p, c, e, s, pub, m] = await Promise.allSettled([
          projectsApi.getAdminProjects({ per_page: 1 }),
          certificatesApi.getAdminCertificates({ per_page: 1 }),
          experiencesApi.getAdminExperiences({ per_page: 1 }),
          skillsApi.getAdminSkills(),
          publicationsApi.getAdminPublications({ per_page: 1 }),
          mediaApi.getMediaList({ per_page: 1 }),
        ]);

        setStats({
          projects: p.status === "fulfilled" ? p.value.meta?.total || 0 : 0,
          certificates: c.status === "fulfilled" ? c.value.meta?.total || 0 : 0,
          experiences: e.status === "fulfilled" ? e.value.meta?.total || 0 : 0,
          skills: s.status === "fulfilled" ? s.value.data?.length || 0 : 0,
          publications: pub.status === "fulfilled" ? pub.value.meta?.total || 0 : 0,
          media: m.status === "fulfilled" ? m.value.meta?.total || 0 : 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { title: "Projects", count: stats.projects, icon: FolderKanban, href: "/admin/projects", addHref: "/admin/projects/new", color: "text-blue-500 bg-blue-500/10" },
    { title: "Certificates", count: stats.certificates, icon: Award, href: "/admin/certificates", addHref: "/admin/certificates/new", color: "text-amber-500 bg-amber-500/10" },
    { title: "Work Experience", count: stats.experiences, icon: Briefcase, href: "/admin/experiences", addHref: "/admin/experiences/new", color: "text-emerald-500 bg-emerald-500/10" },
    { title: "Skills Matrix", count: stats.skills, icon: Sparkles, href: "/admin/skills", addHref: "/admin/skills/new", color: "text-indigo-500 bg-indigo-500/10" },
    { title: "Publications", count: stats.publications, icon: BookOpen, href: "/admin/publications", addHref: "/admin/publications/new", color: "text-purple-500 bg-purple-500/10" },
    { title: "Media Library", count: stats.media, icon: ImageIcon, href: "/admin/media", addHref: "/admin/media", color: "text-rose-500 bg-rose-500/10" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Dashboard Overview"
        description="Welcome back, Sulistio Murti Mulyono. Here is a live summary of your portfolio content."
      />

      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card key={idx} className="border-border/60 hover:border-primary/40 transition-all shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
                    <div className="text-2xl font-extrabold text-foreground">
                      {loading ? "..." : card.count}
                    </div>
                    <Link
                      href={card.href}
                      className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 pt-1"
                    >
                      <span>Manage records</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className={`p-3.5 rounded-2xl ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Launch & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
              <CardDescription className="text-xs">Publish new case studies, certificates, or experiences</CardDescription>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-2 gap-3">
              <Link href="/admin/projects/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-xs">
                  <Plus className="h-4 w-4 text-primary" />
                  <span>Add Project</span>
                </Button>
              </Link>
              <Link href="/admin/certificates/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-xs">
                  <Plus className="h-4 w-4 text-amber-500" />
                  <span>Add Certificate</span>
                </Button>
              </Link>
              <Link href="/admin/experiences/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-xs">
                  <Plus className="h-4 w-4 text-emerald-500" />
                  <span>Add Experience</span>
                </Button>
              </Link>
              <Link href="/admin/publications/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-10 text-xs">
                  <Plus className="h-4 w-4 text-purple-500" />
                  <span>Add Publication</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="p-5 pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-bold">System & Architecture</CardTitle>
              <CardDescription className="text-xs">Live services running on your portfolio stack</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border">
                <span>Database Status</span>
                <span className="font-semibold text-emerald-500">MySQL 8.4 Connected (`portofolio_tio`)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border">
                <span>Backend API</span>
                <span className="font-semibold text-blue-500">Go (Gin + GORM) on :8080</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border">
                <span>Revalidation Worker</span>
                <span className="font-semibold text-indigo-500">Active (SSE Queue Polling)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border">
                <span>Frontend Renderer</span>
                <span className="font-semibold text-foreground">Next.js 15 App Router</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
