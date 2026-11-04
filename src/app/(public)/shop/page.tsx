import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getSettings, isShopEnabled } from "@/lib/settings";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrderAction } from "@/lib/order";
import { generateShopMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return generateShopMetadata(settings);
}

export default async function ShopPage() {
  const [shopEnabled, settings] = await Promise.all([
    isShopEnabled(),
    getSettings(),
  ]);

  if (!shopEnabled) {
    return (
      <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--ink)" }}>
        <h1>Toko Sedang Tutup</h1>
        <p>{settings.shop_closed_message}</p>
        <p>
          <Link href="/" style={{ color: "var(--ink)", textDecoration: "underline" }}>Kembali ke beranda</Link>
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServer();
  const { data: products, error } = await supabase
    .from("items")
    .select("*")
    .eq("kind", "shop")
    .eq("is_published", true)
    .order("sort_order");

  if (error) {
    console.error("Gagal memuat produk:", error);
    throw error;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <h1 style={{ color: "var(--ink)", marginBottom: "var(--space-lg)" }}>Katalog Produk</h1>
      {products && products.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
          {(function () {
            return products.map((product) => {
              const orderAction = getOrderAction(
                {
                  order_url: product.order_url,
                  order_label: product.order_label,
                  title: product.title,
                  slug: product.slug,
                  is_sold_out: product.is_sold_out,
                  kind: "shop" as const,
                },
                {
                  wa_number: settings.wa_number,
                  order_button_label: settings.order_button_label,
                },
                baseUrl,
              );

              return (
                <article key={product.slug} style={{
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "4px 4px 0 var(--ink)",
                  overflow: "hidden",
                  background: "var(--paper)",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {product.cover_image && (
                    <img src={product.cover_image} alt={product.title} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} width={400} height={400} />
                  )}
                  <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-xs)" }}>{product.title}</h3>
                    {product.price_idr && <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--verveine)", margin: "var(--space-xs) 0" }}>Rp {product.price_idr.toLocaleString("id-ID")}</p>}
                    {product.is_sold_out && <p style={{ color: "var(--pop)", fontWeight: 700, margin: "var(--space-xs) 0" }}>Habis</p>}
                    {orderAction && (
                      <a
                        href={orderAction.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: "auto",
                          padding: "var(--space-sm) var(--space-lg)",
                          background: "var(--ink)",
                          color: "var(--paper)",
                          border: "2.5px solid var(--ink)",
                          borderRadius: "var(--radius-md)",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center",
                          boxShadow: "4px 4px 0 var(--ink)",
                          opacity: product.is_sold_out ? 0.5 : 1,
                          pointerEvents: product.is_sold_out ? "none" : "auto",
                        }}
                      >
                        {product.is_sold_out ? "Habis" : orderAction.label}
                      </a>
                    )}
                  </div>
                </article>
              );
            });
          })()}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>Belum ada produk di toko.</p>
      )}
    </div>
  );
}