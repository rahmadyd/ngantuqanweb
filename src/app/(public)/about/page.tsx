import { Metadata } from "next";
import Link from "next/link";
import { Render } from "@puckeditor/core";
import config from "@/puck.config.server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { generatePageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PuckData {
  root: {
    props: {
      title?: string;
    };
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("pages").select("data, seo_description").eq("slug", slug).single();
  const puckData = data?.data as PuckData | null;
  const seoDescription = data?.seo_description ?? undefined;
  return generatePageMetadata({
    title: puckData?.root?.props?.title ?? slug,
    description: seoDescription,
    path: `/${slug}`,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();
  
  const { data: pageData, error } = await supabase
    .from("pages")
    .select("published_data, status")
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
  
  return <Render config={config} data={pageData.published_data as unknown as PuckData} />;
}