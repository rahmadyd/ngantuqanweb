import { notFound } from "next/navigation";
import { isShopEnabled } from "@/lib/settings";
import { createSupabaseServer } from "@/lib/supabase/server";
import { KaryaDetail } from "./KaryaDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function KaryaPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !item) notFound();

  if (item.kind === "shop" && !(await isShopEnabled())) notFound();

  return <KaryaDetail item={item} />;
}
