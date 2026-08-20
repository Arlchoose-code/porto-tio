import React from "react";
import type { Metadata } from "next";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { experiencesApi } from "@/lib/api/experiences";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getPathMetadata } from "@/lib/seo-helper";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPathMetadata(
    "/experiences",
    "Work Experience & Leadership | Sulistio Murti Mulyono",
    "Professional journey spanning project management, election finance coordination, and student diplomacy."
  );
}

export default async function ExperiencesPage() {
  let experiences: any[] = [];
  try {
    const res = await experiencesApi.getPublicExperiences();
    experiences = res.data || [];
  } catch {
    experiences = [];
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: "Experience" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Work Experience &amp; Leadership
        </h1>
        <p className="text-sm text-muted-foreground">
          Proven track record leading multi-disciplinary international teams, managing budgets, and coordinating global initiatives.
        </p>
      </div>

      <div className="relative border-l-2 border-primary/30 ml-4 space-y-8 py-2">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-6 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform" />
            <div className="p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-2 group-hover:border-primary/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="font-bold text-base text-foreground">{exp.title}</h3>
                  <p className="text-xs font-semibold text-primary">{exp.company}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
              </div>
              {exp.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{exp.location}</span>
                </div>
              )}
              {exp.description && (
                <div
                  className="text-xs text-muted-foreground leading-relaxed pt-1 prose dark:prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}