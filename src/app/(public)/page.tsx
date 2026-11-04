import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Render } from "@puckeditor/core";
import config from "@/puck.config.server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { generateHomeMetadata } from "@/lib/metadata";


interface PuckData {
  root: {
    props: {
      title?: string;
    };
  };
}

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

export default async function HomePage() {
  const supabase = await createSupabaseServer();
  const slug = "home";
  
  const cookieStore = await cookies();
  const isPreview = cookieStore.get("preview_mode")?.value === "true";
  const previewSlug = cookieStore.get("preview_slug")?.value;
  const isPreviewForThisPage = isPreview && previewSlug === slug;
  
  const { data: pageData, error } = await supabase
    .from("pages")
    .select("data, published_data, status")
    .eq("slug", slug)
    .single();
  
  // Fallback for missing/unpublished pages
  if (error || !pageData || pageData.status !== "published") {
    return (
      <div style={{ 
        padding: "var(--space-2xl)", 
        textAlign: "center", 
        color: "var(--ink)",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "var(--space-md)" }}>
          Halaman Belum Tersedia
        </h1>
        <p style={{ maxWidth: "40ch", marginBottom: "var(--space-lg)" }}>
          Halaman ini belum dipublikasikan atau belum dibuat.
        </p>
        <Link href="/" style={{ 
          display: "inline-block",
          padding: "var(--space-sm) var(--space-lg)",
          background: "var(--ink)",
          color: "var(--paper)",
          fontWeight: 700,
          textDecoration: "none",
          border: "2.5px solid var(--ink)",
          borderRadius: "var(--radius-md)",
          boxShadow: "2px 2px 0 var(--ink)",
        }}>
          Kembali ke Beranda
        </Link>
      </div>
    );
  }
  
  if (isPreviewForThisPage) {
    return <Render config={config} data={pageData.data as unknown as PuckData} />;
  }
  
  return <Render config={config} data={pageData.published_data as unknown as PuckData} />;
}