"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type ItemData = {
  slug: string;
  kind: "project" | "shop";
  title: string;
  summary: string | null;
  body_md: string | null;
  cover_image: string | null;
  images: string[];
  price_idr: number | null;
  order_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  is_sold_out: boolean;
};

export function KaryaDetail({ item }: { item: ItemData }) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setLightboxIndex(i => (i - 1 + (item.images?.length || 0)) % (item.images?.length || 0));
      if (e.key === "ArrowRight") setLightboxIndex(i => (i + 1) % (item.images?.length || 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, item]);

  const allImages = item.cover_image
    ? [item.cover_image, ...item.images].filter(Boolean)
    : item.images.filter(Boolean);

  const renderMarkdown = (md: string) => {
    return md
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--ink); text-decoration: underline;">$1</a>')
      .replace(/^> (.*$)/gim, "<blockquote style='border-left: 4px solid var(--ink); padding-left: var(--space-md); margin: var(--space-md) 0; color: var(--ink); opacity: 0.7;'>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>[\s\S]*?<\/li>)/gi, "<ul>$1</ul>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(.+)$/gim, "<p>$1</p>")
      .replace(/<p><h([23])>/g, "<h$1>")
      .replace(/<\/h([23])><\/p>/g, "</h$1>")
      .replace(/<p><ul>/g, "<ul>")
      .replace(/<\/ul><\/p>/g, "</ul>");
  };

  return (
    <div style={{ padding: "var(--space-xl)", maxWidth: "900px", margin: "0 auto" }}>
      <Link
        href={item.kind === "project" ? "/myproject" : "/shop"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-xs)",
          marginBottom: "var(--space-xl)",
          color: "var(--ink)",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Kembali ke {item.kind === "project" ? "Proyek" : "Toko"}
      </Link>

      <article>
        <header style={{ marginBottom: "var(--space-xl)" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "var(--ink)", margin: "var(--space-md) 0", lineHeight: 1.1 }}>
            {item.title}
          </h1>
          <p style={{ color: "var(--ink)", opacity: 0.7, fontSize: "1.125rem", maxWidth: "60ch" }}>
            {item.summary}
          </p>
        </header>

        <div style={{ marginBottom: "var(--space-2xl)" }}>
          {allImages.length > 0 && (
            <div style={{ display: "grid", gap: "var(--space-md)", gridTemplateColumns: allImages.length > 1 ? "repeat(auto-fit, minmax(250px, 1fr))" : "1fr" }}>
              {allImages.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                  style={{
                    border: "2.5px solid var(--ink)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--paper)",
                    cursor: "zoom-in",
                    padding: 0,
                  }}
                >
                  <img
                    src={img}
                    alt={`${item.title} - Gambar ${idx + 1}`}
                    style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", display: "block" }}
                    width={800}
                    height={500}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "var(--space-2xl)", borderTop: "2.5px solid var(--ink)", paddingTop: "var(--space-xl)" }}>
          <div
            style={{
              color: "var(--ink)",
              lineHeight: 1.8,
              fontSize: "1.0625rem",
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body_md ?? "") }}
          />
        </div>

        {item.kind === "project" && (item.live_url || item.repo_url) && (
          <div style={{ marginBottom: "var(--space-xl)", display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
            {item.live_url && (
              <a
                href={item.live_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "var(--space-sm) var(--space-xl)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  fontWeight: 700,
                  textDecoration: "none",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "4px 4px 0 var(--ink)",
                }}
              >
                Lihat Live
              </a>
            )}
            {item.repo_url && (
              <a
                href={item.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "var(--space-sm) var(--space-xl)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  fontWeight: 700,
                  textDecoration: "none",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "2px 2px 0 var(--ink)",
                }}
              >
                Lihat Repo
              </a>
            )}
          </div>
        )}
      </article>

      {item.kind === "shop" && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "var(--space-md) var(--space-xl)",
            background: "var(--paper)",
            borderTop: "2.5px solid var(--ink)",
            boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-md)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--verveine)" }}>
              {item.price_idr ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(item.price_idr) : "Harga: Hubungi Kami"}
            </div>
            {item.is_sold_out && (
              <div style={{ color: "var(--pop)", fontWeight: 700, marginTop: "var(--space-xs)" }}>
                Stok Habis
              </div>
            )}
          </div>
          <button
            disabled={item.is_sold_out}
            onClick={() => {
              if (item.order_url) window.open(item.order_url, "_blank", "noopener,noreferrer");
              else router.push(`/karya/${item.slug}?order=true`);
            }}
            style={{
              padding: "var(--space-md) var(--space-2xl)",
              background: "var(--ink)",
              color: "var(--paper)",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              boxShadow: item.is_sold_out ? "2px 2px 0 var(--ink)" : "4px 4px 0 var(--ink)",
              cursor: item.is_sold_out ? "not-allowed" : "pointer",
              opacity: item.is_sold_out ? 0.5 : 1,
            }}
          >
            {item.is_sold_out ? "Habis" : "Order via WhatsApp"}
          </button>
        </div>
      )}

      {lightboxOpen && (
        <div
          className="lightbox"
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(12, 59, 53, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length); }}
            style={{
              position: "absolute",
              left: "var(--space-xl)",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "var(--space-md)",
              background: "var(--paper)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "50%",
              fontSize: "1.5rem",
              cursor: "pointer",
              boxShadow: "4px 4px 0 var(--ink)",
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <img
            src={allImages[lightboxIndex]}
            alt={`${item.title} - Gambar ${lightboxIndex + 1}`}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "8px 8px 0 var(--ink)",
            }}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % allImages.length); }}
            style={{
              position: "absolute",
              right: "var(--space-xl)",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "var(--space-md)",
              background: "var(--paper)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "50%",
              fontSize: "1.5rem",
              cursor: "pointer",
              boxShadow: "4px 4px 0 var(--ink)",
            }}
            aria-label="Next"
          >
            ›
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            style={{
              position: "absolute",
              top: "var(--space-xl)",
              right: "var(--space-xl)",
              padding: "var(--space-md)",
              background: "var(--pop)",
              color: "var(--paper)",
              border: "2.5px solid var(--ink)",
              borderRadius: "50%",
              fontSize: "1.5rem",
              cursor: "pointer",
              boxShadow: "4px 4px 0 var(--ink)",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
