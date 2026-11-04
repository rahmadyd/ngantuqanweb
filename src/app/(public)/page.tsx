import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
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
  
  if (error || !pageData) {
    return notFound();
  }
  
  if (isPreviewForThisPage) {
    return <Render config={config} data={pageData.data as unknown as PuckData} />;
  }
  
  if (pageData.status !== "published") {
    return notFound();
  }
  
  return <Render config={config} data={pageData.published_data as unknown as PuckData} />;
}