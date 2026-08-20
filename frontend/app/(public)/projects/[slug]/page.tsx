import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectsApi } from "@/lib/api/projects";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, Eye, Globe } from "lucide-react";
import { formatFullDate } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await projectsApi.getProjectBySlug(slug);
    const project = res.data;
    return {
      title: project.title,
      description: project.description || project.subtitle,
      openGraph: {
        title: project.title,
        description: project.description || project.subtitle,
        images: project.original_url ? [project.original_url] : [],
      },
    };
  } catch {
    return {
      title: "Project Details",
    };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let project;
  try {
    const res = await projectsApi.getProjectBySlug(slug);
    project = res.data;
  } catch {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: project.original_url ? siteUrl + project.original_url : undefined,
    datePublished: project.created_at,
    author: {
      "@type": "Person",
      name: "Sulistio Murti Mulyono",
    },
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BreadcrumbWithJsonLD
        items={[
          { name: "Projects", href: "/projects" },
          { name: project.title },
        ]}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.category && (
            <Badge variant="default" className="text-xs">
              {project.category.name}
            </Badge>
          )}
          {project.featured && (
            <Badge variant="secondary" className="text-xs">
              Featured Case Study
            </Badge>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatFullDate(project.created_at)}
          </span>
          {project.views > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {project.views} views
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {project.title}
        </h1>

        {project.subtitle && (
          <p className="text-lg sm:text-xl text-primary font-medium">
            {project.subtitle}
          </p>
        )}

        {(project.demo_url || project.repo_url) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer">
                <Button size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Live Demo / Platform</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline" className="gap-2">
                  <span>Source Code</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
          </div>
        )}
      </div>

      {(project.medium_url || project.original_url) && (
        <div className="rounded-2xl overflow-hidden border border-border/60 shadow-md bg-muted/20 aspect-video max-h-[480px]">
          <img
            src={project.medium_url || project.original_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {project.description && (
        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Executive Summary</h3>
          <p className="text-sm sm:text-base leading-relaxed text-foreground font-medium">
            {project.description}
          </p>
        </div>
      )}

      {project.content && (
        <div
          className="prose dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:text-muted-foreground prose-p:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      )}

      {project.images && project.images.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border/40">
          <h3 className="text-lg font-bold text-foreground">Project Artifacts & Visuals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((img) => (
              <div key={img.id} className="space-y-1 rounded-xl overflow-hidden border bg-card">
                <img
                  src={img.medium_url || img.original_url}
                  alt={img.caption || project.title}
                  className="w-full aspect-video object-cover"
                />
                {img.caption && (
                  <p className="text-xs text-muted-foreground p-2.5 text-center">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-border/40 flex justify-between items-center">
        <Link href="/projects">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>All Projects</span>
          </Button>
        </Link>
        <Link href="mailto:tiomurti4@gmail.com">
          <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            Discuss this Case
          </Button>
        </Link>
      </div>
    </div>
  );
}
