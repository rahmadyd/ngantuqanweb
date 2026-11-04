"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

interface SearchItem {
  slug: string;
  kind: "project" | "shop";
  title: string;
  summary: string | null;
  cover_image: string | null;
  tags: string[];
  price_idr: number | null;
  is_sold_out: boolean;
}

export function SearchClient({ shopEnabled }: { shopEnabled: boolean }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const supabase = createSupabaseBrowser();
      let queryBuilder = supabase
        .from("items")
        .select("slug, kind, title, summary, cover_image, tags, price_idr, is_sold_out")
        .eq("is_published", true);
      if (!shopEnabled) {
        queryBuilder = queryBuilder.neq("kind", "shop");
      }
      const { data, error } = await queryBuilder;
      if (!error) setItems(data || []);
    };
    fetchAll();
  }, [shopEnabled]);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        (item.summary || "").toLowerCase().includes(q) ||
        (item.tags || []).some(tag => tag.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div style={{ padding: "var(--space-xl)", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "var(--ink)", marginBottom: "var(--space-xl)" }}>
        Pencarian
      </h1>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <label htmlFor="search-input" style={{ display: "block", marginBottom: "var(--space-sm)", fontWeight: 600, color: "var(--ink)" }}>
          Cari proyek atau produk
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          style={{
            width: "100%",
            padding: "var(--space-md)",
            fontSize: "1.125rem",
            border: "2.5px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            background: "var(--paper)",
            color: "var(--ink)",
            outline: "none",
          }}
        />
      </div>

      {query.trim() && (
        <p style={{ color: "var(--ink)", opacity: 0.7, marginBottom: "var(--space-lg)" }}>
          {filtered.length} hasil untuk {`"${query}"`}
        </p>
      )}

      {query.trim() && filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-2xl)" }}>
          Tidak ditemukan hasil untuk {`"${query}"`}
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-lg)" }}>
        {query.trim() ? (
          filtered.map(item => (
            <article
              key={item.slug}
              style={{
                border: "2.5px solid var(--ink)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "4px 4px 0 var(--ink)",
                overflow: "hidden",
                background: "var(--paper)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {item.cover_image && (
                <Link href={`/karya/${item.slug}`}>
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }}
                    width={400}
                    height={250}
                  />
                </Link>
              )}
              <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", gap: "var(--space-xs)", marginBottom: "var(--space-xs)", flexWrap: "wrap" }}>
                  <span style={{
                    padding: "var(--space-xs) var(--space-sm)",
                    background: item.kind === "project" ? "var(--brume)" : "var(--limonade)",
                    color: "var(--ink)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    borderRadius: "var(--radius-sm)",
                    textTransform: "uppercase",
                  }}>
                    {item.kind === "project" ? "Project" : "Produk"}
                  </span>
                  {item.tags && (
                    <span style={{
                      padding: "var(--space-xs) var(--space-sm)",
                      background: "var(--paper)",
                      color: "var(--ink)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      border: "1px solid var(--ink)",
                      borderRadius: "var(--radius-sm)",
                    }}>
                      {item.tags}
                    </span>
                  )}
                </div>
                <Link href={`/karya/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-xs)" }}>
                    {item.title}
                  </h3>
                </Link>
                <p style={{ color: "var(--ink)", opacity: 0.7, fontSize: "0.875rem", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {item.summary || "Tidak ada ringkasan."}
                </p>
                {item.kind === "shop" && (
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-sm)" }}>
                    <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--verveine)" }}>
                      {item.price_idr ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.price_idr) : "Hubungi"}
                    </span>
                    {item.is_sold_out && <span style={{ color: "var(--pop)", fontWeight: 700, fontSize: "0.75rem" }}>Habis</span>}
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
            Mulai ketik untuk mencari proyek atau produk.
          </p>
        )}
      </div>
    </div>
  );
}
