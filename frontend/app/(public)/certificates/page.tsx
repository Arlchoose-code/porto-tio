import React from "react";
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import { certificatesApi } from "@/lib/api/certificates";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getPathMetadata } from "@/lib/seo-helper";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getPathMetadata(
    "/certificates",
    "Certifications & Credentials | Sulistio Murti Mulyono",
    "Verified professional certifications in AWS Cloud, Digital Marketing, Python, and Software Architecture."
  );
}

export default async function CertificatesPage() {
  let certs: any[] = [];
  try {
    const res = await certificatesApi.getPublicCertificates();
    certs = res.data || [];
  } catch (e) {
    certs = [];
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: "Certificates" }]} />

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Licenses &amp; Certifications
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Verified credentials spanning cloud computing architectures, digital marketing execution, agile methodologies, and leadership diplomas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => {
          const img = cert.medium_url || cert.original_url || cert.thumbnail_url;
          return (
            <Card
              key={cert.id}
              className="group overflow-hidden border-border/60 hover:border-primary/50 transition-all flex flex-col bg-card"
            >
              {img && (
                <div className="relative aspect-[4/3] bg-muted/30 overflow-hidden border-b border-border/40">
                  <img
                    src={img}
                    alt={cert.title}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <CardHeader className="p-5 flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {cert.issuer}
                  </Badge>
                  {cert.credential_id && (
                    <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]">
                      ID: {cert.credential_id}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {cert.title}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(cert.issue_date)}</span>
                </div>
                {cert.credential_url && (
                  <div className="pt-2">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      <span>Show Credential</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}