"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicSiteInfo, SocialLink } from "@/types/settings";
import {
  Linkedin,
  Mail,
  Phone,
  Github,
  Instagram,
  Twitter,
  Globe,
  Youtube,
  MapPin,
} from "lucide-react";

interface FooterProps {
  siteInfo?: PublicSiteInfo;
}

function renderSocialIcon(icon: string) {
  const normalized = (icon || "").toLowerCase();
  switch (normalized) {
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "github":
      return <Github className="h-4 w-4" />;
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "twitter":
    case "x":
      return <Twitter className="h-4 w-4" />;
    case "mail":
    case "email":
      return <Mail className="h-4 w-4" />;
    case "phone":
    case "whatsapp":
      return <Phone className="h-4 w-4" />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}

export function Footer({ siteInfo }: FooterProps) {
  const [logoError, setLogoError] = useState(false);
  const currentYear = new Date().getFullYear();

  const brandFull = siteInfo?.site_setting?.title || "Sulistio Murti Mulyono — Digital Business & PM";
  const brandName = brandFull.split("—")[0]?.trim() || "Sulistio Murti Mulyono";
  const logoUrl = siteInfo?.site_setting?.logo;

  const bioShort =
    siteInfo?.site_setting?.bio_short ||
    siteInfo?.site_setting?.description ||
    "Finance Management graduate from Institut Bisnis Nusantara and Information Systems awardee at University of Belgrade. Combining financial acumen, technical execution, and global leadership.";

  const address = siteInfo?.site_setting?.address || "Bogor & Jakarta, Indonesia";
  const email = siteInfo?.site_setting?.email || "tiomurti4@gmail.com";
  const phone = siteInfo?.site_setting?.phone || "+62 819-1984-4369";

  const footerText =
    siteInfo?.site_setting?.footer_text ||
    `© ${currentYear} Sulistio Murti Mulyono. Connecting Business, Technology, Data, and People.`;

  const socials: SocialLink[] = siteInfo?.social_links?.filter((s) => s.is_active) || [
    { id: 1, platform: "LinkedIn", url: "https://www.linkedin.com/in/sulistiomurtimulyono", icon: "Linkedin", order: 1, is_active: true },
    { id: 2, platform: "Email", url: `mailto:${email}`, icon: "Mail", order: 2, is_active: true },
    { id: 3, platform: "WhatsApp", url: `https://wa.me/${phone.replace(/[^0-9]/g, "")}`, icon: "Phone", order: 3, is_active: true },
    { id: 4, platform: "GitHub", url: "https://github.com", icon: "Github", order: 4, is_active: true },
  ];

  return (
    <footer className="border-t border-border/40 bg-muted/20 py-12 mt-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Bio & Dynamic Logo */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              {logoUrl && !logoError ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-border/40 bg-muted/30 shadow-sm shrink-0">
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                  {brandName.charAt(0) || "T"}
                </div>
              )}
              <span className="font-bold text-base tracking-tight">{brandName}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              {bioShort}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {socials.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-accent transition-all shadow-sm"
                  title={soc.platform}
                >
                  {renderSocialIcon(soc.icon || soc.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/projects" className="hover:text-foreground transition-colors">Projects & Cases</Link></li>
              <li><Link href="/experiences" className="hover:text-foreground transition-colors">Work Experience</Link></li>
              <li><Link href="/educations" className="hover:text-foreground transition-colors">Education</Link></li>
              <li><Link href="/skills" className="hover:text-foreground transition-colors">Skill Matrix</Link></li>
              <li><Link href="/certificates" className="hover:text-foreground transition-colors">Certifications</Link></li>
              <li><Link href="/publications" className="hover:text-foreground transition-colors">Publications</Link></li>
            </ul>
          </div>

          {/* Col 3: Dynamic Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Get in Touch</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">{email}</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">{phone}</a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <p>{footerText}</p>
          <p className="flex items-center gap-1">
            Built with Go &amp; Next.js App Router
          </p>
        </div>
      </div>
    </footer>
  );
}