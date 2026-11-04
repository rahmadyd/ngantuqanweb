import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getSettings, isShopEnabled } from "@/lib/settings";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: "Toko - " + settings.site_title };
}

export default async function ShopPage() {
  const shopEnabled = await isShopEnabled();
  
  if (!shopEnabled) {
    const settings = await getSettings();
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

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <h1 style={{ color: "var(--ink)", marginBottom: "var(--space-lg)" }}>Katalog Produk</h1>
      {products && products.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
          {products.map((product) => (
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
                <a 
                  href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(product.title)}`}
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
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {product.is_sold_out ? "Habis" : "Order via WhatsApp"}
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>Belum ada produk di toko.</p>
      )}
    </div>
  );
}