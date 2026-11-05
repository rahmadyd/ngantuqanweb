"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import type { Json } from "@/lib/supabase/database";

export const dynamic = "force-dynamic";

interface PageData {
  id: string;
  slug: string;
  title: string;
  data: Record<string, unknown>;
  publishedData: Record<string, unknown>;
  status: "draft" | "published";
  viewportMobile: boolean;
}

interface VersionData {
  id: string;
  page_id: string;
  data: Record<string, unknown>;
  published_at: string;
  status?: string;
}

interface PageListItem {
  slug: string;
  title: string;
  data: Record<string, unknown> | null;
  published_data: Record<string, unknown> | null;
  status: string;
}

export default function StudioPagesPage() {
  const [page, setPage] = useState<PageData>({
    id: "",
    slug: "home",
    title: "Home",
    data: {},
    publishedData: {},
    status: "published",
    viewportMobile: false,
  });
  
  const [versions, setVersions] = useState<VersionData[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [pages, setPages] = useState<PageListItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = createSupabaseBrowser();
        const { data, error } = await supabase.from("pages").select("*");
        if (error) throw error;
        setPages((data || []) as PageListItem[]);
      } catch (err) {
        console.error("Gagal memuat daftar halaman:", err);
        setPages([]);
      }
    })();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "Anda punya perubahan yang belum disimpan. Lanjutkan?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleSave = async () => {
    try {
      const supabase = createSupabaseBrowser();
      await supabase.from("pages").upsert({
        slug: page.slug,
        title: page.title,
        data: page.data as Json,
        status: page.status,
        updated_at: new Date().toISOString(),
      });
      setUnsavedChanges(false);
      alert("Draft disimpan ke Supabase");
    } catch (err) {
      alert("Gagal menyimpan draft: " + (err as Error).message);
    }
  };

  const handlePublish = async () => {
    try {
      const supabase = createSupabaseBrowser();
      // Check if data has changed from published_data
      const hasChanges = JSON.stringify(page.data) !== JSON.stringify(page.publishedData);
      setUnsavedChanges(hasChanges);
      // Save snapshot to page_versions (last 20)
      const { data: existingVersions } = await supabase.from("page_versions").select("*").eq("page_id", page.id).order("created_at", { ascending: false }).limit(20);
      const newVersion = {
        page_id: page.id,
        data: page.data as Json,
        created_at: new Date().toISOString(),
      };
      if (existingVersions && existingVersions.length >= 20) {
        await supabase.from("page_versions").delete().eq("id", existingVersions[existingVersions.length - 1].id);
      }
      await supabase.from("page_versions").insert(newVersion);
      
      await supabase.from("pages").upsert({
        slug: page.slug,
        title: page.title,
        data: page.data as Json,
        published_data: page.data as Json,
        status: "published",
        updated_at: new Date().toISOString(),
      });
      
      // Call revalidate API
      await fetch(`/api/puck/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: page.slug }),
      });
      
      alert("Halaman diterbitkan");
    } catch (err) {
      alert("Gagal menerbitkan: " + (err as Error).message);
    }
  };

  const handleRestoreLast = async () => {
    if (versions.length === 0) {
      alert("Tidak ada versi untuk direstore");
      return;
    }
    const lastVersion = versions[0];
    try {
      setPage(prev => ({
        ...prev,
        data: lastVersion.data,
        publishedData: lastVersion.data,
        status: (lastVersion.status as "draft" | "published") || "draft",
      }));
      setUnsavedChanges(true);
      alert("Versi terakhir dipulihkan. Perubahan belum disimpan.");
    } catch (err) {
      alert("Gagal memulihkan versi: " + (err as Error).message);
    }
  };

  const restoreVersion = async (versionId: string) => {
    try {
      const version = versions.find((v: VersionData) => v.id === versionId);
      if (!version) return;
      setPage(prev => ({
        ...prev,
        data: version.data,
        publishedData: version.data,
        status: (version.status as "draft" | "published") || "draft",
      }));
      setUnsavedChanges(true);
    } catch (err) {
      console.error("Gagal merestore versi:", err);
    }
  };

  const handlePreview = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    const viewport = viewportMeta?.content || "";
    const newWindow = window.open(
      `/${page.slug}?preview=true&token=${token}`,
      "_blank",
      `width=800,height=600,viewport=${viewport}`
    );
    if (newWindow) newWindow.focus();
  };

  return (
    <Section background="brume" space="lg" containerSize="wide">
      <h1>Editor Halaman {page.slug}</h1>

      <div style={{ marginBottom: 24 }}>
        <h2>Detail Halaman</h2>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Slug</label>
          <input
            value={page.slug}
            onChange={(e) => setPage((prev) => ({ ...prev, slug: e.target.value }))}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Title</label>
          <input
            value={page.title}
            onChange={(e) => setPage((prev) => ({ ...prev, title: e.target.value }))}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Status</label>
          <select
            value={page.status}
            onChange={(e) => setPage((prev) => ({ ...prev, status: e.target.value as "draft" | "published" }))}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          >
            <option value="draft">Draft</option>
            <option value="published">Terbit</option>
          </select>
        </div>

        <div style={{ marginBottom: 8, height: "600px", border: "1px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--ink)" }}>Puck Editor - 6 block terkonfigurasi (Hero, Marquee, AboutPill, ProjectGrid, ProductGrid, CTA)</span>
        </div>

        <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={page.viewportMobile}
              onChange={(e) => setPage((prev) => ({ ...prev, viewportMobile: e.target.checked }))}
              style={{ transform: "var(--browser-transform, scale(1))" }}
            />
            Mobile
          </label>
          <label>
            <input
              type="checkbox"
              checked={!page.viewportMobile}
              onChange={(e) => setPage((prev) => ({ ...prev, viewportMobile: !e.target.checked }))}
              style={{ transform: "var(--browser-transform, scale(1))" }}
            />
            Desktop
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <p>Data ini di-muat dari Supabase pages.data dan akan disimpan saat Publish.</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave}>Simpan Draft</button>
          <button onClick={handlePublish}>Terbitkan</button>
          <button onClick={handlePreview}>Pratinjau</button>
        </div>

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <h3>Riwayat Versi</h3>
          {versions.length === 0 ? (
            <p>Belum ada versi tercatat.</p>
          ) : (
            <div style={{ maxHeight: "200px", overflow: "auto" }}>
              {versions.map((v: VersionData) => (
                <div key={v.id} style={{ padding: 4, borderBottom: "1px solid #e0e0e0" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--ink)" }}>{new Date(v.published_at).toLocaleString()}</span>
                  <button style={{ float: "right", fontSize: "0.75rem", marginTop: 2 }} onClick={() => restoreVersion(v.id)}>Restore</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={handleRestoreLast}>Restore Versi Terakhir</button>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Daftar Halaman</h2>
        {pages.length === 0 ? (
          <p>Belum ada halaman terdaftar.</p>
        ) : (
          <div style={{ maxHeight: "300px", overflow: "auto", marginBottom: 16 }}>
            {pages.map((p: PageListItem) => (
              <div key={p.slug} style={{ padding: 4, borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--ink)" }}>{p.title} ({p.slug})</span>
                <button style={{ fontSize: "0.75rem", marginLeft: 8 }} onClick={() => setPage({ ...page, slug: p.slug, title: p.title, data: p.data || {}, publishedData: p.published_data || {}, status: (p.status as "draft" | "published") })}>Buka</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <button style={{ padding: "4px 8px", fontSize: "0.875rem" }} onClick={() => setPage(prev => ({ ...prev, slug: `page-${Date.now()}`, title: "Halaman Baru", data: {}, publishedData: {}, status: "draft", viewportMobile: false }))}>Buat Halaman Baru</button>
        </div>
      </div>
    </Section>
  );
}