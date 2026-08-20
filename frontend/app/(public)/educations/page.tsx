import React from "react";
import type { Metadata } from "next";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { educationsApi } from "@/lib/api/educations";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getPathMetadata } from "@/lib/seo-helper";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPathMetadata(
    "/educations",
    "Education & Academic Background | Sulistio Murti Mulyono",
    "Academic credentials in Finance Management (GPA 3.72) and Information Systems in Serbia."
  );
}

export default async function EducationsPage() {
  let educations: any[] = [];
  try {
    const res = await educationsApi.getPublicEducations();
    educations = res.data || [];
  } catch {
    educations = [];
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: "Education" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Education &amp; Academic Credentials
        </h1>
        <p className="text-sm text-muted-foreground">
          Higher education degrees combining business finance and information systems engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {educations.map((edu) => (
          <div key={edu.id} className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm space-y-3 hover:border-primary/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base">{edu.degree}</h3>
              <p className="text-xs font-semibold text-primary">{edu.institution}</p>
              <p className="text-xs text-muted-foreground">{edu.field_of_study}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(edu.start_date)} — {edu.end_date ? formatDate(edu.end_date) : "Present"}
              </span>
              {edu.grade && (
                <span className="font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  GPA: {edu.grade}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}