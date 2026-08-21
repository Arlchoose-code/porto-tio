import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  FolderKanban,
  Sparkles,
  Code2,
  BarChart3,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { projectsApi } from "@/lib/api/projects";
import { experiencesApi } from "@/lib/api/experiences";
import { skillsApi } from "@/lib/api/skills";
import { publicationsApi } from "@/lib/api/publications";
import { certificatesApi } from "@/lib/api/certificates";
import { settingsApi } from "@/lib/api/settings";
import { formatDate } from "@/lib/utils";
import { MotionSection, MotionDiv, MotionCard } from "@/components/shared/MotionComponents";

export const revalidate = 60; // ISR 60s

function getCategoryIcon(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("business") || normalized.includes("management")) {
    return <Briefcase className="h-4 w-4 text-emerald-500" />;
  }
  if (normalized.includes("tech") || normalized.includes("dev")) {
    return <Code2 className="h-4 w-4 text-blue-500" />;
  }
  if (normalized.includes("data") || normalized.includes("analytical")) {
    return <BarChart3 className="h-4 w-4 text-indigo-500" />;
  }
  return <Globe2 className="h-4 w-4 text-purple-500" />;
}

export default async function HomePage() {
  // Fetch data in parallel
  const [projectsRes, expRes, skillsRes, pubRes, certRes, settingsRes] = await Promise.allSettled([
    projectsApi.getPublicProjects({ featured: true, per_page: 4 }),
    experiencesApi.getPublicExperiences(),
    skillsApi.getPublicSkills(),
    publicationsApi.getPublicPublications(),
    certificatesApi.getPublicCertificates(),
    settingsApi.getPublicSettings(),
  ]);

  const featuredProjects = projectsRes.status === "fulfilled" ? projectsRes.value.data : [];
  const experiences = expRes.status === "fulfilled" ? expRes.value.data.slice(0, 4) : [];
  const skillCategories = skillsRes.status === "fulfilled" ? skillsRes.value.data : [];
  const publications = pubRes.status === "fulfilled" ? pubRes.value.data.slice(0, 3) : [];
  const certificates = certRes.status === "fulfilled" ? certRes.value.data.slice(0, 4) : [];
  const siteInfo = settingsRes.status === "fulfilled" ? settingsRes.value.data : undefined;

  const contactEmail = siteInfo?.site_setting?.email || "tiomurti4@gmail.com";
  const linkedInObj = siteInfo?.social_links?.find((s) => s.platform.toLowerCase() === "linkedin");
  const linkedInUrl = linkedInObj?.url || "https://www.linkedin.com/in/sulistiomurtimulyono";

  // Dynamic Hero content with fallback (synchronized with bio_short)
  const heroBadge = siteInfo?.site_setting?.hero_badge || "Digital Business & Project Management";
  const heroTitle = siteInfo?.site_setting?.hero_title || "Connecting Business, Technology, Data, and People.";
  const heroDescription =
    siteInfo?.site_setting?.hero_description ||
    siteInfo?.site_setting?.bio_short ||
    siteInfo?.site_setting?.description ||
    "Finance Management graduate from Institut Bisnis Nusantara and Information Systems awardee at University of Belgrade. Combining financial acumen, technical execution, and global leadership.";
  const heroImage =
    siteInfo?.site_setting?.hero_image ||
    siteInfo?.site_setting?.logo ||
    "/media/projects/avala_orig.webp";
  const heroCardTitle = siteInfo?.site_setting?.hero_card_title || "Digital Business & PM";
  const heroCardStatus = siteInfo?.site_setting?.hero_card_status || "Available";
  const heroCardSubtitle =
    siteInfo?.site_setting?.hero_card_subtitle || "Connecting Strategy, Tech, and Execution.";

  // Dynamic Key Impact Stats with fallback
  let heroStats = [
    {
      id: "stat-1",
      value: "97%",
      label: "Voter Turnout",
      description: "General Election 2024 (Serbia & Montenegro)",
      color: "primary",
    },
    {
      id: "stat-2",
      value: "IDR 1.7B",
      label: "Budget Managed",
      description: "Strict financial audit compliance under KPU RI",
      color: "indigo",
    },
    {
      id: "stat-3",
      value: "65 Countries",
      label: "Global Coordination",
      description: "OISAA / PPI Dunia Congress & Regulations",
      color: "blue",
    },
    {
      id: "stat-4",
      value: "3.72 / 4.00",
      label: "Cumulative GPA",
      description: "Finance Management — Institut Bisnis Nusantara",
      color: "emerald",
    },
  ];

  if (siteInfo?.site_setting?.hero_stats) {
    try {
      const parsed = JSON.parse(siteInfo.site_setting.hero_stats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        heroStats = parsed;
      }
    } catch (e) {
      // fallback to defaults on error
    }
  }

  const getStatColorClass = (color?: string) => {
    switch (color?.toLowerCase()) {
      case "indigo":
        return "text-indigo-500 dark:text-indigo-400";
      case "blue":
        return "text-blue-500 dark:text-blue-400";
      case "emerald":
      case "green":
        return "text-emerald-500 dark:text-emerald-400";
      case "purple":
        return "text-purple-500 dark:text-purple-400";
      case "amber":
      case "yellow":
        return "text-amber-500 dark:text-amber-400";
      case "rose":
      case "red":
        return "text-rose-500 dark:text-rose-400";
      case "primary":
      default:
        return "text-primary";
    }
  };

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Ambient Animated Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/25 via-indigo-500/20 to-purple-600/15 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline, Bio & CTAs */}
            <MotionDiv delay={0} className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold backdrop-blur-md shadow-sm">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-primary" style={{ animationDuration: "6s" }} />
                <span>{heroBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {heroTitle.includes("Business, Technology") ? (
                  <>
                    Connecting{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Business, Technology,
                    </span>{" "}
                    Data, and People.
                  </>
                ) : (
                  heroTitle
                )}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal whitespace-pre-line">
                {heroDescription}
              </p>

              {/* Quick CTA Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/projects" prefetch={true}>
                  <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 font-medium">
                    <span>Explore Projects</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/about" prefetch={true}>
                  <Button size="lg" variant="outline" className="rounded-full gap-2 border-border/80 hover:bg-accent/80 transition-all">
                    <span>Read Full Bio</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href={`mailto:${contactEmail}`}>
                  <Button size="lg" variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </MotionDiv>

            {/* Right Column: Premium Portrait Photo Card */}
            <MotionDiv delay={1} className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="w-full max-w-sm sm:max-w-md rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-3 sm:p-4 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-all">
                {/* Decorative Header Bar */}
                <div className="flex items-center justify-between px-2 pb-2.5 border-b border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-foreground">Sulistio Murti Mulyono</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground/80 tracking-wider">Profile</span>
                </div>

                {/* Main Portrait Image */}
                <div className="relative mt-3 rounded-2xl overflow-hidden aspect-[4/5] bg-muted/40 border border-border/40">
                  <img
                    src={heroImage}
                    alt="Sulistio Murti Mulyono"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent" />

                  {/* Floating Status Banner */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl border border-border/60 bg-background/85 backdrop-blur-md shadow-lg space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{heroCardTitle}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {heroCardStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {heroCardSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>

          {/* Key Impact Stats Counter Banner */}
          <MotionDiv delay={2} className={`mt-16 grid grid-cols-2 md:grid-cols-${Math.min(heroStats.length, 4)} gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-lg hover:border-primary/40 transition-colors`}>
            {heroStats.map((stat, idx) => (
              <div key={stat.id || idx} className="space-y-1 p-2">
                <div className={`text-2xl sm:text-3xl font-extrabold flex items-center gap-1 tracking-tight ${getStatColorClass(stat.color)}`}>
                  {stat.value}
                </div>
                <p className="text-xs font-semibold text-foreground">{stat.label}</p>
                {stat.description && (
                  <p className="text-[11px] text-muted-foreground">{stat.description}</p>
                )}
              </div>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <MotionSection delay={1} className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <FolderKanban className="h-4 w-4" />
              <span>Selected Case Studies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Featured Projects &amp; Initiatives
            </h2>
          </div>
          <Link href="/projects" prefetch={true}>
            <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs hover:border-primary/50 transition-all">
              <span>View All Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((project) => (
            <MotionCard key={project.id}>
              <Link
                href={`/projects/${project.slug}`}
                prefetch={true}
                className="group block h-full"
              >
                <Card className="h-full overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-card flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-800 to-indigo-950 relative overflow-hidden flex items-center justify-center p-6 text-white">
                      {project.thumbnail_url || project.original_url ? (
                        <img
                          src={project.thumbnail_url || project.original_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center space-y-2">
                          <FolderKanban className="h-10 w-10 mx-auto opacity-50 text-indigo-300" />
                          <span className="text-xs font-medium text-slate-300">Project Showcase</span>
                        </div>
                      )}
                      {project.category && (
                        <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white border-white/20 text-[10px] font-medium shadow">
                          {project.category.name}
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="p-5 pb-2">
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </CardTitle>
                      {project.subtitle && (
                        <CardDescription className="text-xs font-medium text-foreground/80 line-clamp-1">
                          {project.subtitle}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="p-5 pt-2">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </CardContent>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs text-primary font-semibold">
                    <span>Read Case Study</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </MotionCard>
          ))}
        </div>
      </MotionSection>

      {/* ================= CAREER & LEADERSHIP TIMELINE ================= */}
      <MotionSection delay={1} className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="h-4 w-4" />
              <span>Career &amp; Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Proven Track Record in High-Stakes Environments
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From leading overseas general elections to coordinating bilateral international student assemblies and managing digital development projects, Tio brings structured execution, financial rigor, and empathetic leadership.
            </p>
            <div className="pt-2">
              <Link href="/experiences" prefetch={true}>
                <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs hover:border-primary/50 transition-all">
                  <span>Full Experience Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Timeline Cards */}
          <div className="lg:col-span-7 space-y-4">
            {experiences.map((exp) => (
              <MotionCard key={exp.id}>
                <div className="p-5 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm hover:shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{exp.position}</h3>
                      {exp.is_current && (
                        <Badge variant="secondary" className="text-[10px] py-0 bg-emerald-500/10 text-emerald-500 font-semibold border-emerald-500/20">
                          Present
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-primary">{exp.company}</p>
                    {exp.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1 line-clamp-2">
                        {exp.description}
                      </p>
                    )}
                  </div>

                  <div className="text-[11px] text-muted-foreground whitespace-nowrap sm:text-right font-medium">
                    {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    {exp.location && <div className="text-[10px] text-muted-foreground/80">{exp.location}</div>}
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ================= REDESIGNED BENTO COMPETENCIES MATRIX ================= */}
      <MotionSection delay={1} className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Multidisciplinary Expertise</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Competencies &amp; Technical Toolset
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Cross-functional toolkit uniting financial strategy, modern software technologies, data analysis, and international project execution.
            </p>
          </div>

          <Link href="/skills" prefetch={true}>
            <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs hover:border-primary/50 transition-all">
              <span>View Full Skill Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat) => (
            <MotionCard key={cat.id}>
              <div className="h-full p-6 rounded-3xl border border-border/70 bg-gradient-to-b from-card/80 via-card/50 to-muted/20 backdrop-blur-xl shadow-md hover:border-primary/50 transition-all space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-muted/60 border border-border/50 shadow-inner">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground tracking-tight">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20">
                    {cat.skills?.length || 0} skills
                  </Badge>
                </div>

                {/* Skill Pills Matrix */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.skills?.map((skill) => (
                    <div
                      key={skill.id}
                      className="group/pill inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background/80 hover:bg-primary/10 border border-border/70 hover:border-primary/40 transition-all text-xs font-medium text-foreground shadow-xs cursor-default"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover/pill:bg-primary transition-colors" />
                      <span>{skill.name}</span>
                      {skill.proficiency && (
                        <span className="text-[10px] font-semibold text-muted-foreground/80 group-hover/pill:text-primary transition-colors">
                          {skill.proficiency}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </MotionSection>

      {/* ================= CERTIFICATIONS & SCIENTIFIC PUBLICATIONS ================= */}
      <MotionSection delay={1} className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>Accreditations</span>
              </div>
              <Link href="/certificates" prefetch={true} className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                <span>All Certs</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <h3 className="text-xl font-bold text-foreground">Certificates &amp; Awards</h3>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <MotionCard key={cert.id}>
                  <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm flex items-start gap-3 hover:border-primary/40 transition-all shadow-sm">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{cert.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{cert.issuer}</p>
                      <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                        Issued: {formatDate(cert.issue_date)}
                      </p>
                    </div>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-primary p-1"
                        title="Verify Credential"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>

          {/* Scientific Publications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Academic Research</span>
              </div>
              <Link href="/publications" prefetch={true} className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                <span>All Research</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <h3 className="text-xl font-bold text-foreground">Scientific Publications</h3>

            <div className="space-y-3">
              {publications.map((pub) => (
                <MotionCard key={pub.id}>
                  <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2 hover:border-primary/40 transition-all shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] font-semibold text-blue-500 border-blue-500/30">
                        {pub.index_type || "SINTA Indexed"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(pub.publication_date)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2">
                      {pub.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {pub.journal} {pub.doi ? `• DOI: ${pub.doi}` : ""}
                    </p>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ================= FINAL CONTACT BANNER ================= */}
      <MotionSection delay={1} className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Let&apos;s Build High-Impact Solutions Together
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Open to opportunities in Digital Project Management, Business Operations, Digital Business Strategy, and Technology Coordination.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <Link href={`mailto:${contactEmail}`}>
              <Button size="lg" className="rounded-full bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-lg hover:scale-105 transition-transform">
                <span>{contactEmail}</span>
              </Button>
            </Link>
            <Link href={linkedInUrl} target="_blank" rel="noreferrer">
              <Button size="lg" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-semibold hover:scale-105 transition-transform">
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}