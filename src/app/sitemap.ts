import { MetadataRoute } from "next";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createSupabaseServer();
  const settings = await getSettings();

  // Static pages from pages table
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("status", "published");

  const staticPages = (pages ?? []).map((page) => ({
    url: page.slug === "home" ? `${baseUrl}/` : `${baseUrl}/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: page.slug === "home" ? 1.0 : 0.8,
  }));

  // Project items
  const { data: projects } = await supabase
    .from("items")
    .select("slug, updated_at")
    .eq("kind", "project")
    .eq("is_published", true);

  const projectUrls = (projects ?? []).map((project) => ({
    url: `${baseUrl}/karya/${project.slug}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Shop items (only if shop enabled)
  let shopUrls: MetadataRoute.Sitemap = [];
  if (settings.shop_enabled) {
    const { data: shopItems } = await supabase
      .from("items")
      .select("slug, updated_at")
      .eq("kind", "shop")
      .eq("is_published", true);

    shopUrls = (shopItems ?? []).map((item) => ({
      url: `${baseUrl}/karya/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/myproject`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  if (settings.shop_enabled) {
    staticRoutes.push({
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    });
  }

  return [
    ...staticRoutes,
    ...staticPages,
    ...projectUrls,
    ...shopUrls,
  ];
}