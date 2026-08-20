"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectsApi } from "@/lib/api/projects";
import { Project } from "@/types/project";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { Badge } from "@/components/ui/badge";
import { formatFullDate } from "@/lib/utils";
import { Loader2, Calendar, Eye, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await projectsApi.getProjectById(id);
        setProject(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Project not found</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <PreviewBanner backUrl={`/admin/projects/${id}/edit`} />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.category && (
              <Badge variant="default" className="text-xs">
                {project.category.name}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatFullDate(project.created_at)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="text-lg text-primary font-medium">{project.subtitle}</p>
          )}
        </div>

        {(project.medium_url || project.original_url) && (
          <div className="rounded-2xl overflow-hidden border shadow-md aspect-video max-h-[480px]">
            <img
              src={project.medium_url || project.original_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {project.description && (
          <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Executive Summary</h3>
            <p className="text-sm text-foreground font-medium">{project.description}</p>
          </div>
        )}

        {project.content && (
          <div
            className="prose dark:prose-invert prose-blue max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        )}
      </div>
    </div>
  );
}
