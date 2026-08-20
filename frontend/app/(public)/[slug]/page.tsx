import React from "react";
import { notFound } from "next/navigation";
import { pagesApi } from "@/lib/api/pages";
import { BreadcrumbWithJsonLD } from "@/components/shared/BreadcrumbWithJsonLD";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await pagesApi.getPublicPage(slug);
    const page = res.data;
    return {
      title: page.meta_title || page.title,
      description: page.meta_description,
    };
  } catch {
    return {
      title: "Page Details",
    };
  }
}

export default async function StaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page;
  try {
    const res = await pagesApi.getPublicPage(slug);
    page = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">
      <BreadcrumbWithJsonLD items={[{ name: page.title }]} />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
        {page.title}
      </h1>

      <div
        className="prose dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:text-muted-foreground prose-p:text-muted-foreground text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
