import React from "react";
import type { Metadata } from "next";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { skillsApi } from "@/lib/api/skills";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { getPathMetadata } from "@/lib/seo-helper";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPathMetadata(
    "/skills",
    "Skills & Technical Competencies | Sulistio Murti Mulyono",
    "Core competencies in Digital Business, Cloud Computing, Financial Modeling, and Agile Delivery."
  );
}

export default async function SkillsPage() {
  let categories: any[] = [];
  try {
    const res = await skillsApi.getPublicSkills();
    categories = res.data || [];
  } catch {
    categories = [];
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: "Skills" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Skills &amp; Competencies Matrix
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Multi-disciplinary toolkit encompassing digital project management, software technologies, financial engineering, and international team diplomacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm space-y-4 hover:border-primary/40 transition-all">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{cat.name}</span>
              </h3>
              {cat.description && (
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills?.map((skill: any) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="text-xs px-3 py-1 bg-muted/60 hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {skill.name}
                  {skill.proficiency && (
                    <span className="ml-1.5 text-[10px] text-muted-foreground">
                      ({skill.proficiency}%)
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}