import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

interface ProjectItem {
  slug: string;
  title: string;
  cover_image: string | null;
  summary: string | null;
  tags: string[];
  sort_order: number;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Proyek | Ngantuqan" };
}

export default async function MyProjectPage() {
  const supabase = await createSupabaseServer();
  const { data: projects, error } = await supabase
    .from("items")
    .select("*")
    .eq("kind", "project")
    .eq("is_published", true)
    .order("sort_order");

  if (error) {
    console.error("Gagal memuat proyek:", error);
    throw error;
  }

  const categories = [...new Set((projects || []).flatMap(p => p.tags || []).filter(Boolean))] as string[];

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "var(--ink)", margin: "0 0 var(--space-md)" }}>
          Proyek Kami
        </h1>
        <p style={{ color: "var(--ink)", opacity: 0.7, maxWidth: "60ch" }}>
          Kumpulan proyek branding, web, dan desain yang telah kami kerjakan.
        </p>
      </header>

      {categories.length > 0 && (
        <nav style={{ marginBottom: "var(--space-xl)", display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <button
            className="filter-btn active"
            data-category="all"
            style={{
              padding: "var(--space-xs) var(--space-lg)",
              background: "var(--ink)",
              color: "var(--paper)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "4px 4px 0 var(--ink)",
            }}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className="filter-btn"
              data-category={cat}
              style={{
                padding: "var(--space-xs) var(--space-lg)",
                background: "var(--paper)",
                color: "var(--ink)",
                border: "2.5px solid var(--ink)",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "2px 2px 0 var(--ink)",
              }}
            >
              {cat}
            </button>
          ))}
        </nav>
      )}

      <div id="project-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-xl)" }}>
        {projects && projects.length > 0 ? (
          projects.map((project: ProjectItem) => (
            <article
              key={project.slug}
              className="project-card"
              data-category={(project.tags?.[0] || "")}
              style={{
                border: "2.5px solid var(--ink)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "4px 4px 0 var(--ink)",
                overflow: "hidden",
                background: "var(--paper)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              {project.cover_image && (
                <Link href={`/karya/${project.slug}`}>
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }}
                    width={600}
                    height={375}
                  />
                </Link>
              )}
              <div style={{ padding: "var(--space-md)", display: "flex", flexDirection: "column", flex: 1 }}>
                {project.tags?.[0] && (
                  <span style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-xs)" }}>
                    {project.tags[0]}
                  </span>
                )}
                <Link href={`/karya/${project.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--ink)", margin: "0 0 var(--space-xs)" }}>
                    {project.title}
                  </h3>
                </Link>
                <p style={{ color: "var(--ink)", opacity: 0.7, fontSize: "0.875rem", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  {project.summary || "Tidak ada ringkasan."}
                </p>
                <Link
                  href={`/karya/${project.slug}`}
                  style={{
                    marginTop: "var(--space-md)",
                    display: "inline-block",
                    padding: "var(--space-xs) var(--space-md)",
                    background: "var(--ink)",
                    color: "var(--paper)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    border: "2.5px solid var(--ink)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "2px 2px 0 var(--ink)",
                    width: "fit-content",
                  }}
                >
                  Lihat Detail
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-2xl)" }}>
            Belum ada proyek yang dipublikasikan.
          </p>
        )}
      </div>
    </div>
  );
}