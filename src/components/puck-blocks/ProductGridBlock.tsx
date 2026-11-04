"use client";

import { useEffect, useState } from "react";
import styles from "./PuckBlocks.module.css";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { isShopEnabled } from "@/lib/settings";

interface ProductItem {
  slug: string;
  title: string;
  cover_image: string | null;
  price?: number;
  is_sold_out: boolean;
  is_published: boolean;
  sort_order: number;
}

interface ProductGridBlockProps {
  quantity: "4" | "6" | "all";
  showFeaturedOnly: boolean;
}

export function ProductGridBlock({ quantity, showFeaturedOnly }: ProductGridBlockProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [shopEnabled, setShopEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopStatus, productsData] = await Promise.all([
          isShopEnabled(),
          (async () => {
            const supabase = createSupabaseBrowser();
            let query = supabase.from("items").select("*").eq("kind", "shop").eq("is_published", true).order("sort_order");
            
            if (showFeaturedOnly) {
              // featured logic can be added later
            }
            
            if (quantity !== "all") {
              query = query.limit(parseInt(quantity, 10));
            }
            
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
          })(),
        ]);
        
        setShopEnabled(shopStatus);
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

  return (
    <section className={styles.productGrid}>
      <div className={styles.header}>
        <h2 className={styles.title}>Produk</h2>
      </div>
      <div className={styles.grid}>
        {products.map(product => (
          <article key={product.slug} className={styles.productCard}>
            {product.cover_image && (
              <img src={product.cover_image} alt={product.title} className={styles.image} width={400} height={400} />
            )}
            <div className={styles.content}>
              <h3 className={styles.title}>{product.title}</h3>
              {product.price && <p className={styles.price}>Rp {product.price.toLocaleString("id-ID")}</p>}
              {product.is_sold_out && <p className={styles.soldOut}>Habis</p>}
              {product.is_sold_out ? (
                  <button className={styles.orderBtn} disabled>
                    Habis
                  </button>
                ) : (
                  <a 
                    href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(product.title)}`}
                    className={styles.orderBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order via WhatsApp
                  </a>
                )}
            </div>
          </article>
        ))}
        {products.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
            Belum ada produk.
          </p>
        )}
      </div>
    </section>
  );
}