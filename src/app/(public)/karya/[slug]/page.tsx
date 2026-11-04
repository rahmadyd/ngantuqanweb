import { notFound } from "next/navigation";
import { Metadata } from "next";
import { isShopEnabled, getSettings } from "@/lib/settings";
import { createSupabaseServer } from "@/lib/supabase/server";
import { KaryaDetail } from "./KaryaDetail";
import { getOrderAction } from "@/lib/order";
import { generateItemMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSettings();
  return generateItemMetadata(slug, settings);
}

export default async function KaryaPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const [settings, itemResult] = await Promise.all([
    getSettings(),
    supabase
      .from("items")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single(),
  ]);

  const { data: item, error } = itemResult;
  if (error || !item) notFound();

  if (item.kind === "shop" && !(await isShopEnabled())) notFound();

  // Hitung order action di server
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const orderAction = getOrderAction(
    {
      order_url: item.order_url,
      order_label: item.order_label,
      title: item.title,
      slug: item.slug,
      is_sold_out: item.is_sold_out,
      kind: item.kind,
    },
    {
      wa_number: settings.wa_number,
      order_button_label: settings.order_button_label,
    },
    baseUrl,
  );

  const itemWithAction = { ...item, wa_number: settings.wa_number, orderAction };

  return <KaryaDetail item={itemWithAction} />;
}
