"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui";
import { Button } from "@/components/ui";
import { revalidateTag } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

import Puck from "@puckeditor/core";
import config from "@/puck.config";

export default function StudioPagesPage() {
  const [page, setPage] = useState({
    slug: "home",
    title: "Home",
    data: {},
    publishedData: {},
    status: "published" as "draft" | "published",
  });

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = createSupabaseServer();
        const { data, error } = await supabase.from("pages").select("*").eq("slug", page.slug);
        if (error) throw error;
        setPage(prev => ({
          ...prev,
          data: data?.[0]?.data || {},
          publishedData: data?.[0]?.published_data || {},
        }));
      } catch (err) {
        console.error("Gagal memuat halaman:", err);
        setPage(prev => ({
          ...prev,
          data: config,
          publishedData: config,
        }));
      }
    })();
  }, [page.slug]);

  const handleSave = async () => {
    try {
      const supabase = createSupabaseServer();
      await supabase.from("pages").upsert({
        slug: page.slug,
        title: page.title,
        data: page.data,
        status: page.status,
        updated_at: new Date().toISOString(),
      });
      alert("Draft disimpan ke Supabase");
    } catch (err) {
      alert("Gagal menyimpan draft: " + err.message);
    }
  };

  const handlePublish = async () => {
    try {
      const supabase = createSupabaseServer();
      // Save snapshot to page_versions (last 20)
      const { data: existingVersions } = await supabase.from("page_versions").select("*").eq("slug", page.slug).order("created_at", { ascending: false }).limit(20);
      const newVersion = {
        slug: page.slug,
        data: page.data,
        published_at: new Date().toISOString(),
      };
      if (existingVersions && existingVersions.length >= 20) {
        await supabase.from("page_versions").delete().eq("id", existingVersions[existingVersions.length - 1].id);
      }
      await supabase.from("page_versions").insert(newVersion);
      
      await supabase.from("pages").upsert({
        slug: page.slug,
        title: page.title,
        data: page.data,
        published_data: page.data,
        status: "published",
        updated_at: new Date().toISOString(),
      });
      revalidateTag(`page:${page.slug}`);
      alert("Halaman diterbitkan");
    } catch (err) {
      alert("Gagal menerbitkan: " + err.message);
    }
  };

  const handlePreview = () => {
    alert("Pratinjau (mock)");
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

        <div style={{ marginBottom: 8 }}>
          <p>Data ini di-muat dari Supabase pages.data dan akan disimpan saat Publish.</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave}>Simpan Draft</button>
          <button onClick={handlePublish}>Terbitkan</button>
          <button onClick={handlePreview}>Pratinjau</button>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Daftar Halaman</h2>
        <p>Fungsi daftar halaman akan ditambahkan setelah editor terbentuk.</p>
      </div>
    </Section>
  );
}