import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { FolderKanban, ArrowUpRight } from "lucide-react";
import { projectsApi } from "@/lib/api/projects";
import { getPathMetadata } from "@/lib/seo-helper";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPathMetadata(
    "/projects",
    "Projects & Case Studies | Sulistio Murti Mulyono",
    "Explore key technology, civic leadership, and digital business projects led by Sulistio Murti Mulyono."
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  const [projectsRes, catsRes] = await Promise.allSettled([
    projectsApi.getPublicProjects({ category, search, per_page: 20 }),
    projectsApi.getCategories(),
  ]);

  const projects = projectsRes.status === "fulfilled" ? projectsRes.value.data : [];
  const categories = catsRes.status === "fulfilled" ? catsRes.value.data : [];

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: "Projects" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Projects &amp; Case Studies
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Detailed case studies across civic election management, Web3 blockchain solutions, student e-commerce platforms, and digital client initiatives.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/40">
        <Link href="/projects">
          <Button
            size="sm"
            variant={!category ? "default" : "outline"}
            className="rounded-full text-xs h-8"
          >
            All Categories ({projects.length})
          </Button>
        </Link>
        {categories.map((cat) => {
          const isSelected = category === cat.slug;
          return (
            <Link key={cat.id} href={`/projects?category=${cat.slug}`}>
              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className="rounded-full text-xs h-8"
              >
                {cat.name}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <FolderKanban className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-semibold">No Projects Found</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search criteria or selecting another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const cover = proj.medium_url || proj.original_url || proj.thumbnail_url;
            return (
              <Card
                key={proj.id}
                className="group flex flex-col overflow-hidden border-border/60 hover:border-primary/50 transition-all hover:shadow-lg bg-card"
              >
                {cover && (
                  <div className="relative aspect-video overflow-hidden bg-muted/40 border-b border-border/40">
                    <img
                      src={cover}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {proj.category && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-[10px] backdrop-blur-md bg-background/80 font-medium">
                          {proj.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="p-5 flex-1 space-y-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {proj.title}
                    </CardTitle>
                    {proj.subtitle && (
                      <p className="text-xs text-primary font-medium line-clamp-1">
                        {proj.subtitle}
                      </p>
                    )}
                  </div>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {proj.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                  <Link
                    href={`/projects/${proj.slug}`}
                    className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline"
                  >
                    <span>Read Case Study</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}