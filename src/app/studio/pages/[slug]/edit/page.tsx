"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import config from "@/puck.config.client";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EMPTY_PAGE_DATA: Data = {
  content: [],
  root: { props: { title: "" } },
};

export default function StudioPageEdit() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [data, setData] = useState<Data>(EMPTY_PAGE_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const supabase = createSupabaseBrowser();
        const { data: pageData, error } = await supabase
          .from("pages")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (error && error.code !== "PGRST116") throw error;
        
        if (pageData?.data) {
          setData(pageData.data as Data);
        } else {
          setData(EMPTY_PAGE_DATA);
        }
      } catch (err) {
        console.error("Gagal memuat halaman:", err);
        setData(EMPTY_PAGE_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  // Debounced auto-save draft to pages.data (2s delay)
  useEffect(() => {
    if (loading || !isDirty) return;
    const timer = setTimeout(async () => {
      try {
        const supabase = createSupabaseBrowser();
        await supabase.from("pages").upsert({
          slug,
          title: data.root?.props?.title || slug,
          data,
          status: "draft",
          updated_at: new Date().toISOString(),
        });
        setLastSaved(new Date());
        setIsDirty(false);
        console.log("Auto-saved draft");
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [data, loading, isDirty, slug]);

  const handlePublish = async (publishedData: Data) => {
    setSaving(true);
    try {
      const supabase = createSupabaseBrowser();
      
      await supabase.from("pages").upsert({
        slug,
        title: publishedData.root?.props?.title || slug,
        data: publishedData,
        published_data: publishedData,
        status: "published",
        updated_at: new Date().toISOString(),
      });
      
      setLastSaved(new Date());
      setIsDirty(false);
      
      await fetch(`/api/puck/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      
      alert("Halaman diterbitkan!");
    } catch (err) {
      console.error("Gagal menerbitkan:", err);
      alert("Gagal menerbitkan: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    try {
      const secret = process.env.REVALIDATE_SECRET;
      if (!secret) {
        alert("REVALIDATE_SECRET tidak dikonfigurasi");
        return;
      }
      
      await fetch(`/api/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, token: secret }),
      });
      
      const previewUrl = `/${slug}?preview=true`;
      window.open(previewUrl, "_blank");
    } catch (err) {
      console.error("Preview failed:", err);
      alert("Gagal membuka pratinjau");
    }
  };

  const handleSave = async (draftData: Data) => {
    setSaving(true);
    try {
      const supabase = createSupabaseBrowser();
      
      await supabase.from("pages").upsert({
        slug,
        title: draftData.root?.props?.title || slug,
        data: draftData,
        status: "draft",
        updated_at: new Date().toISOString(),
      });
      
      setLastSaved(new Date());
      setIsDirty(false);
      alert("Draft disimpan!");
    } catch (err) {
      console.error("Gagal menyimpan draft:", err);
      alert("Gagal menyimpan: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--ink)" }}>
        Memuat editor...
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ 
        padding: "var(--space-md) var(--space-xl)", 
        borderBottom: "2.5px solid var(--ink)", 
        background: "var(--paper)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "var(--space-md)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <h1 style={{ margin: 0, fontSize: "1.25rem", color: "var(--ink)" }}>Editor: {slug}</h1>
          <span style={{ 
            padding: "var(--space-xs) var(--space-md)", 
            background: "var(--ink)", 
            color: "var(--paper)", 
            borderRadius: "var(--radius-md)", 
            fontSize: "0.75rem",
            fontWeight: 700,
          }}>DRAFT</span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button
            onClick={() => router.push(`/studio/pages`)}
            style={{
              padding: "var(--space-sm) var(--space-lg)",
              background: "var(--paper)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "2px 2px 0 var(--ink)",
            }}
          >
            Kembali
          </button>
          <button
            onClick={() => handleSave(data)}
            disabled={saving}
            style={{
              padding: "var(--space-sm) var(--space-lg)",
              background: "var(--brume)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "2px 2px 0 var(--ink)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button
            onClick={() => handlePublish(data)}
            disabled={saving}
            style={{
              padding: "var(--space-sm) var(--space-lg)",
              background: "var(--verveine)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "2px 2px 0 var(--ink)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Menerbitkan..." : "Terbitkan"}
          </button>
          <button
            onClick={handlePreview}
            disabled={saving}
            style={{
              padding: "var(--space-sm) var(--space-lg)",
              background: "var(--menthe)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "2px 2px 0 var(--ink)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            Pratinjau
          </button>
        </div>
      </header>
      <main style={{ flex: 1, overflow: "auto" }}>
        <Puck
          config={config}
          data={data}
          onChange={(d) => { setData(d); setIsDirty(true); }}
          onPublish={handlePublish}
          viewports={[
            { width: 360, height: "auto", label: "Mobile" },
            { width: 768, height: "auto", label: "Tablet" },
            { width: 1280, height: "auto", label: "Desktop" },
            { width: "100%", height: "auto", label: "Full" },
          ]}
        />
      </main>
      {lastSaved && (
        <footer style={{ 
          padding: "var(--space-xs) var(--space-xl)", 
          borderTop: "1px solid var(--ink)", 
          background: "var(--paper)",
          fontSize: "0.75rem",
          color: "var(--ink)",
          opacity: 0.7,
        }}>
          Terakhir disimpan: {lastSaved.toLocaleTimeString()}
        </footer>
      )}
    </div>
  );
}