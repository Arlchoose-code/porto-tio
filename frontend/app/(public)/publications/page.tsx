import React from "react";
import type { Metadata } from "next";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { publicationsApi } from "@/lib/api/publications";
import { BookOpen, ExternalLink, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getPathMetadata } from "@/lib/seo-helper";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPathMetadata(
    "/publications",
    "Scientific Publications | Sulistio Murti Mulyono",
    "Peer-reviewed research and academic publications in business, economics, and technology."
  );
}

export default async function PublicationsPage() {
  let publications: any[] = [];
  try {
    const res = await publicationsApi.getPublicPublications();
    publications = res.data || [];
  } catch {
    publications = [];
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: "Publications" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Scientific Publications &amp; Research
        </h1>
        <p className="text-sm text-muted-foreground">
          Peer-reviewed articles published in accredited national scientific journals (SINTA).
        </p>
      </div>

      <div className="space-y-4">
        {publications.map((pub) => (
          <div key={pub.id} className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm space-y-3 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {pub.journal_name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(pub.publication_date)}
              </span>
            </div>
            <h3 className="font-bold text-base text-foreground leading-snug">{pub.title}</h3>
            {pub.authors && (
              <p className="text-xs text-muted-foreground">Authors: {pub.authors}</p>
            )}
            {pub.abstract && (
              <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-3">
                {pub.abstract}
              </p>
            )}
            {pub.url && (
              <div className="pt-2">
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  <span>Read Article / DOI</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}