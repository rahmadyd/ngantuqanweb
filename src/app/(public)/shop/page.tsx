import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";
import { isShopEnabled } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const enabled = await isShopEnabled();
  return {
    title: "Shop",
    robots: enabled ? undefined : { index: false, follow: false },
  };
}

export default async function ShopPage() {
  if (!(await isShopEnabled())) notFound();

  return (
    <PlaceholderPage
      title="Shop"
      body="Katalog produk dari tabel items (kategori shop) menyusul di Fase 3."
    />
  );
}
