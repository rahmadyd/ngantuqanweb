import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageRenderer } from "@/lib/blocks/page-renderer";
import { createSupabaseServer } from "@/lib/supabase/server";
import { generateHomeMetadata } from "@/lib/metadata";
import { isShopEnabled } from "@/lib/settings";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;
  if (code) {
    redirect(`/auth/callback?code=${code}`);
  }

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

  const shopEnabled = await isShopEnabled();

  // Editor preview shows draft data; public shows published_data
  const puckData = isPreviewForThisPage
    ? pageData.data
    : pageData.published_data;

  return (
    <>
      <PageRenderer data={puckData} shopEnabled={shopEnabled} />
    </>
  );
}
