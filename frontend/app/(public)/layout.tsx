import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { settingsApi } from "@/lib/api/settings";
import { PublicSiteInfo } from "@/types/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteInfo: PublicSiteInfo | undefined;
  try {
    const res = await settingsApi.getPublicSettings();
    siteInfo = res.data;
  } catch (err) {
    // fallback if backend is momentarily unreachable
    siteInfo = {
      site_setting: {
        id: 1,
        title: "Sulistio Murti Mulyono — Digital Business & Project Management",
        description: "Official portfolio of Sulistio Murti Mulyono (Tio). Connecting Business, Technology, Data, and People.",
        logo: "/logo.webp",
        favicon: "/favicon.ico",
        footer_text: "© 2026 Sulistio Murti Mulyono. All rights reserved.",
        robots_txt: "User-agent: *\nAllow: /",
      },
      social_links: [
        { id: 1, platform: "LinkedIn", url: "https://www.linkedin.com/in/sulistiomurtimulyono", icon: "Linkedin", order: 1, is_active: true },
        { id: 2, platform: "Email", url: "mailto:tiomurti4@gmail.com", icon: "Mail", order: 2, is_active: true },
      ],
    };
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar siteInfo={siteInfo} />
      <main className="flex-1">{children}</main>
      <Footer siteInfo={siteInfo} />
    </div>
  );
}
