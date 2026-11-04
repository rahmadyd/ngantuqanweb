"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./PuckBlocks.module.css";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

interface ProductItem {
  slug: string;
  title: string;
  cover_image: string | null;
  price_idr: number | null;
  is_sold_out: boolean;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  order_url: string | null;
  order_label: string | null;
}

function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductGridBlock({ quantity, showFeaturedOnly }: {
  quantity: "4" | "6" | "all";
  showFeaturedOnly: boolean;
}) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [shopEnabled, setShopEnabled] = useState<boolean | null>(null);
  const [settings, setSettings] = useState({ wa_number: "6281234567890", order_button_label: "Beli sekarang" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsData] = await Promise.all([
          fetch("/api/settings").then((r) => r.json()),
          (async () => {
            const supabase = createSupabaseBrowser();
            let query = supabase
              .from("items")
              .select("slug, title, cover_image, price_idr, is_sold_out, is_published, is_featured, sort_order, order_url, order_label")
              .eq("kind", "shop")
              .eq("is_published", true)
              .order("sort_order");

            if (showFeaturedOnly) {
              query = query.eq("is_featured", true);
            }

            if (quantity !== "all") {
              query = query.limit(parseInt(quantity, 10));
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
          })(),
        ]);

        setShopEnabled(settingsRes.shop_enabled === true);
        setSettings({ wa_number: settingsRes.wa_number || "6281234567890", order_button_label: settingsRes.order_button_label || "Beli sekarang" });
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quantity, showFeaturedOnly]);

  if (loading) {
    return <div className={styles.productGrid}>Memuat produk...</div>;
  }

  if (!shopEnabled) {
    return <></>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const getOrderAction = (product: ProductItem) => {
    if (product.is_sold_out) return null;

    if (product.order_url && isValidHttpsUrl(product.order_url)) {
      return {
        href: product.order_url,
        label: product.order_label || settings.order_button_label,
      };
    }

    if (settings.wa_number) {
      const message = encodeURIComponent(`Halo, saya tertarik dengan ${product.title} (${baseUrl}/karya/${product.slug})`);
      return {
        href: `https://wa.me/${settings.wa_number}?text=${message}`,
        label: product.order_label || settings.order_button_label,
      };
    }

    return null;
  };

  function isValidHttpsUrl(url: string): boolean {
    try {
      const u = new URL(url);
      return u.protocol === "https:";
    } catch {
      return false;
    }
  }

  if (loading) {
    return <div className={styles.productGrid}>Memuat produk...</div>;
  }

  if (!shopEnabled) {
    return <></>;
  }

  return (
    <section className={styles.productGrid}>
      <div className={styles.header}>
        <h2 className={styles.title}>Produk</h2>
      </div>
      <div className={styles.grid}>
        {products.map((product) => {
          const orderAction = getOrderAction(product);
          return (
            <article key={product.slug} className={styles.productCard}>
              {product.cover_image && (
                <Link href={`/karya/${product.slug}`}>
                  <img src={product.cover_image} alt={product.title} className={styles.image} width={400} height={400} />
                </Link>
              )}
              <div className={styles.content}>
                <Link href={`/karya/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 className={styles.title}>{product.title}</h3>
                </Link>
                {product.price_idr != null && <p className={styles.price}>Rp {product.price_idr.toLocaleString("id-ID")}</p>}
                {product.is_sold_out && <p className={styles.soldOut}>Habis</p>}
                {product.is_sold_out ? (
                  <button className={styles.orderBtn} disabled>
                    Habis
                  </button>
                ) : orderAction && (
                  <a
                    href={orderAction.href}
                    className={styles.orderBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {product.is_sold_out ? "Habis" : orderAction.label}
                  </a>
                )}
              </div>
            </article>
          );
        })}
        {products.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
            Belum ada produk.
          </p>
        )}
      </div>
    </section>
  );
}