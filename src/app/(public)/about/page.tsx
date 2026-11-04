import { notFound } from "next/navigation";
import { Metadata } from "next";
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
  
  if (error || !pageData || pageData.status !== "published") {
    return notFound();
  }
  
  return <Render config={config} data={pageData.published_data as unknown as PuckData} />;
}