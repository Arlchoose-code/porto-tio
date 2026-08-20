import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static routes
  const routes = [
    "",
    "/projects",
    "/experiences",
    "/educations",
    "/skills",
    "/certificates",
    "/publications",
    "/about",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const res = await fetch("http://localhost:8080/api/projects?per_page=100", { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data?.data) {
      const projectRoutes = data.data.map((proj: any) => ({
        url: `${baseUrl}/projects/${proj.slug}`,
        lastModified: proj.updated_at || new Date().toISOString(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
      return [...routes, ...projectRoutes];
    }
  } catch (e) {
    console.error("Error fetching projects for sitemap", e);
  }

  return routes;
}
