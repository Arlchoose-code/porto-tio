import type { Metadata } from "next";
import { seoApi } from "./api/seo";
import { settingsApi } from "./api/settings";

export async function getPathMetadata(
  path: string,
  fallbackTitle: string,
  fallbackDesc: string
): Promise<Metadata> {
  let metaTitle = fallbackTitle;
  let metaDesc = fallbackDesc;
  let ogImage = "";

  try {
    const res = await seoApi.getSeoForPath(path);
    if (res.data) {
      if (res.data.meta_title) metaTitle = res.data.meta_title;
      if (res.data.meta_description) metaDesc = res.data.meta_description;
      if (res.data.og_image) ogImage = res.data.og_image;
    }
  } catch {
    // Graceful fallback to default title
  }

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}