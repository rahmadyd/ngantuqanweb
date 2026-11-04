import { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { createSupabaseServer } from "@/lib/supabase/server";

export interface PageMeta {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  path?: string;
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function getCanonicalUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function generatePageMetadata({
  title,
  description,
  ogImage,
  ogType = "website",
  path = "/",
}: PageMeta): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl(path);
  const ogImageUrl = ogImage ?? `${getBaseUrl()}/opengraph-image`;
  
  const settings = await getSettings();
  const siteName = settings.site_title ?? "Ngantuqan";
  const defaultDescription = settings.site_description ?? "Portofolio visual dan toko karya Ngantuqan. Project, ilustrasi, dan produk digital.";
  
  return {
    title: {
      default: title,
      template: `%s · ${siteName}`,
    },
    description: description ?? defaultDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      url: canonicalUrl,
      title: title,
      description: description ?? defaultDescription,
      siteName: "Ngantuqan",
      locale: "id_ID",
      images: ogImage ? [{ url: ogImage }] : [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description ?? defaultDescription,
      images: ogImage ? [ogImage] : [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateItemMetadata(
  slug: string,
  settings: Awaited<ReturnType<typeof import("@/lib/settings").getSettings>>
): Promise<Metadata> {
  const { createSupabaseServer } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServer();
  
  const { data: item } = await supabase
    .from("items")
    .select("title, summary, cover_image, kind, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  
  if (!item) {
    return {
      title: "Tidak Ditemukan",
      description: "Halaman tidak ditemukan",
    };
  }
  
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl(`/karya/${slug}`);
  const ogImageUrl = item.cover_image ?? `${getBaseUrl()}/opengraph-image`;
  const siteName = "Ngantuqan";
  const defaultDescription = "Portofolio visual dan toko karya Ngantuqan. Project, ilustrasi, dan produk digital.";
  
  const title = `${item.title} · ${item.kind === "shop" ? "Toko" : "Proyek"}`;
  const description = item.summary ?? "Portofolio visual dan toko karya Ngantuqan.";
  
  return {
    title: {
      default: title,
      template: `%s · Ngantuqan`,
    },
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: title,
      description: description,
      siteName: "Ngantuqan",
      locale: "id_ID",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateShopMetadata(settings: Awaited<ReturnType<typeof import("@/lib/settings").getSettings>>): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl("/shop");
  const siteName = "Ngantuqan";
  const defaultDescription = "Katalog produk Ngantuqan. Produk kreatif, merch, dan produk digital.";
  
  return {
    title: `Toko · ${settings.site_title}`,
    description: defaultDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `Toko · ${settings.site_title}`,
      description: defaultDescription,
      siteName: "Ngantuqan",
      locale: "id_ID",
      images: [{ url: `${getBaseUrl()}/opengraph-image`, width: 1200, height: 630, alt: "Toko Ngantuqan" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Toko · ${settings.site_title}`,
      description: defaultDescription,
      images: [`${getBaseUrl()}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateSearchMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = getBaseUrl();
  const canonicalUrl = getCanonicalUrl("/search");
  const siteName = "Ngantuqan";
  
  return {
    title: "Pencarian",
    description: "Cari proyek dan produk di Ngantuqan",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: "Pencarian · Ngantuqan",
      description: "Cari proyek dan produk di Ngantuqan",
      siteName: "Ngantuqan",
      locale: "id_ID",
      images: [{ url: `${getBaseUrl()}/opengraph-image`, width: 1200, height: 630, alt: "Pencarian Ngantuqan" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pencarian · Ngantuqan",
      description: "Cari proyek dan produk di Ngantuqan",
      images: [`${getBaseUrl()}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateHomeMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = getBaseUrl();
  const canonicalUrl = getBaseUrl();
  const siteName = "Ngantuqan";
  const defaultDescription = "Portofolio visual dan toko karya Ngantuqan. Project, ilustrasi, dan produk digital.";
  
  return {
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description: defaultDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: siteName,
      description: defaultDescription,
      siteName: "Ngantuqan",
      locale: "id_ID",
      images: [{ url: `${getBaseUrl()}/opengraph-image`, width: 1200, height: 630, alt: "Ngantuqan" }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: defaultDescription,
      images: [`${getBaseUrl()}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}