"use client";

import { useState, useCallback, FormEvent } from "react";
import { saveDraft, publishPage } from "./actions";
import { PageRenderer } from "@/lib/blocks/page-renderer";
import type { PageContent, Block, BlockType, BlockStyle } from "@/types/page-content";

export const dynamic = "force-dynamic";

const EMPTY_BLOCK_STYLE: BlockStyle = {
  backgroundToken: "paper",
  sticker: "none",
  animation: "none",
};

const BLOCK_TYPES = [
  "hero",
  "marquee",
  "about",
  "project",
  "product",
  "contact",
  "richtext",
] as const;

const BLOCK_LABELS: Record<string, string> = {
  hero: "Hero",
  marquee: "Marquee",
  about: "Tentang",
  project: "Karya",
  product: "Produk",
  contact: "Hubungi kami",
  richtext: "Teks bebas",
};

function newBlockId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function emptyBlock(type: string) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    type,
    props: {},
    style: { backgroundToken: "paper", sticker: "none", animation: "none" },
  };
}

type BlockWithId = Block & { id: string };

export default function PageEditor({
  slug,
  pageTitle,
  initialData,
  isPublished,
}: {
  slug: string;
  pageTitle: string;
  initialData: PageContent;
  isPublished: boolean;
}) {
  const [content, setContent] = useState<any[]>([]);
  const [pageTitleState, setPageTitleState] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok?: boolean; error?: string }>({});

  const selectedBlock = content.find((b) => b.id === selectedId);

  const addBlock = (type: string) => {
    const block = { id: newBlockId(), type, props: {}, style: { backgroundToken: "paper", sticker: "none", animation: "none" } };
    setContent((prev) => [...prev, block]);
    setSelectedId(block.id);
  };

  const moveBlock = (id: string, dir: "up" | "down") => {
    setContent((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removeBlock = (id: string) => {
    setContent((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((sid) => (sid === id ? null : sid));
  };

  const updateBlock = (id: string, patch: any) => {
    setContent((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("pageData", JSON.stringify({ root: { props: { title: pageTitleState }, content } }));
      const result = await saveDraft(undefined as any, formData);
      if (result.ok) setStatus({ ok: true, error: undefined }); else setStatus({ error: result.error });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("pageData", JSON.stringify({ root: { props: { title: pageTitleState }, content } }));
      const result = await publishPage(undefined as any, formData);
      if (result.ok) setStatus({ ok: true, error: undefined }); else setStatus({ error: result.error });
    } finally {
      setSaving(false);
    }
  };

  const blockLabels: Record<string, string> = {
    hero: "Hero",
    marquee: "Marquee",
    about: "Tentang",
    project: "Karya",
    product: "Produk",
    contact: "Hubungi kami",
    richtext: "Teks bebas",
  };

  const blockTypes = ["hero", "marquee", "about", "project", "product", "contact", "richtext"] as const;

  if (!content.length) {
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ width: "320px", borderRight: "2.5px solid var(--ink)", padding: "var(--space-lg)", overflowY: "auto", background: "var(--limonade)" }}>
          <h2 style={{ marginBlock: "0 var(--space-lg)", color: "var(--ink)" }}>Bagian Halaman</h2>
          <p style={{ color: "var(--ink)", opacity: 0.7, marginBlockEnd: "var(--space-lg)" }}>Belum ada bagian. Tambahkan bagian di bawah.</p>
          {blockTypes.map((t) => (
            <button key={t} onClick={() => { const id = newBlockId(); const block = { id, type: t, props: {}, style: { backgroundToken: "paper", sticker: "none", animation: "none" } }; setContent((prev) => [...prev, block]); setSelectedId(block.id); }} style={{ width: "100%", marginBlockEnd: "var(--space-xs)", padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", cursor: "pointer", textAlign: "left", font: "inherit" }}>+ {["Hero","Marquee","Tentang","Karya","Produk","Hubungi kami","Teks bebas"][blockTypes.indexOf(t)]}</button>
          ))}
        </div>
        <div style={{ flex: 1, padding: "var(--space-xl)" }}>
          <h1 style={{ marginBlockEnd: "var(--space-lg)", color: "var(--ink)" }}>Editor Halaman: {slug}</h1>
          <p style={{ color: "var(--ink)", opacity: 0.7 }}>Pilih atau tambahkan bagian dari daftar di kiri untuk mengeditnya.</p>
        </div>
      </div>
    );
  }

  // Extract computed values to avoid ternary in JSX
  const bgToken = selectedBlock?.style?.backgroundToken || "paper";
  const stickerVal = selectedBlock?.style?.sticker || "none";
  const stickerPos = selectedBlock?.style?.stickerPosition || "top-right";
  const animVal = selectedBlock?.style?.animation || "none";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "320px", borderRight: "2.5px solid var(--ink)", padding: "var(--space-lg)", overflowY: "auto", background: "var(--limonade)" }}>
        <h2 style={{ marginBlock: "0 var(--space-lg)", color: "var(--ink)" }}>Bagian Halaman</h2>
        <div style={{ display: "flex", gap: "var(--space-xs)", marginBlockEnd: "var(--space-lg)" }}>
          {blockTypes.map((t) => (
            <button key={t} onClick={() => { const id = newBlockId(); const block = { id, type: t, props: {}, style: { backgroundToken: "paper", sticker: "none", animation: "none" } }; setContent((prev) => [...prev, block]); setSelectedId(block.id); }} style={{ width: "100%", marginBlockEnd: "var(--space-xs)", padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", cursor: "pointer", textAlign: "left", font: "inherit" }}>+ {["Hero","Marquee","Tentang","Karya","Produk","Hubungi kami","Teks bebas"][blockTypes.indexOf(t)]}</button>
          ))}
        </div>
        {content.map((block) => (
          <div key={block.id} style={{ border: `2.5px solid ${block.id === selectedId ? "var(--ink)" : "transparent"}`, borderRadius: "var(--radius-md)", padding: "var(--space-md)", marginBlockEnd: "var(--space-sm)", background: block.id === selectedId ? "var(--paper)" : "var(--brume)", cursor: "pointer" }} onClick={() => setSelectedId(block.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--space-xs)" }}>
              <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.875rem" }}>{block.type}</span>
              <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                <button onClick={() => moveBlock(block.id, "up")} title="Naik" style={{ padding: "var(--space-xs)", background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.75rem" }}>▲</button>
                <button onClick={() => moveBlock(block.id, "down")} title="Turun" style={{ padding: "var(--space-xs)", background: "var(--ink)", color: "var(--paper)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.75rem" }}>▼</button>
                <button onClick={() => removeBlock(block.id)} title="Hapus" style={{ padding: "var(--space-xs)", background: "var(--pop)", color: "var(--paper)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.75rem" }}>×</button>
              </div>
            </div>
            <div style={{ color: "var(--ink)", opacity: 0.8, fontSize: "0.75rem" }}>{block.type}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: "var(--space-xl)", overflowY: "auto", background: "var(--paper)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ marginBlock: "0 0 var(--space-lg)", color: "var(--ink)" }}>Editor Halaman: {slug}</h1>

          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); const formData = new FormData(); formData.append("slug", slug); formData.append("pageData", JSON.stringify({ root: { props: { title: pageTitleState }, content } })); fetch("/api/studio/pages/" + slug + "/edit/save-draft", { method: "POST", body: new FormData() }).then(r => r.json()).then(res => { if (res.ok) { alert("Draft disimpan"); } else { alert(res.error || "Gagal"); } }).catch(() => alert("Gagal")); }}>
            <div style={{ marginBlockEnd: "var(--space-lg)" }}>
              <label style={{ display: "block", fontWeight: 700, color: "var(--ink)", marginBlockEnd: "var(--space-xs)" }}>Judul Halaman</label>
              <input type="text" value={pageTitleState} onChange={(e) => setPageTitleState(e.target.value)} style={{ width: "100%", padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontSize: "1rem" }} />
            </div>

            <h2 style={{ marginBlock: "var(--space-lg) var(--space-md)", color: "var(--ink)" }}>Pengaturan Bagian</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <label style={{ display: "block", fontWeight: 700, color: "var(--ink)", marginBlockEnd: "var(--space-xs)" }}>Warna Latar</label>
              <select
                value={selectedBlock?.style?.backgroundToken || "paper"}
                onChange={(e) => {
                  const val = e.target.value;
                  setContent((c) =>
                    c.map((b) =>
                      b.id === selectedBlock?.id
                        ? { ...b, style: { ...b.style, backgroundToken: val } }
                        : b
                    )
                  );
                }}
                style={{
                  width: "100%",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              >
                <option value="paper">Kertas (Putih)</option>
                <option value="brume">Brume (Hijau Muda)</option>
                <option value="menthe">Menthe (Hijau Tua)</option>
                <option value="limonade">Limonade (Kuning Muda)</option>
                <option value="verveine">Verveine (Hijau Kuning)</option>
              </select>
              <label style={{ display: "block", fontWeight: 700, color: "var(--ink)", marginBlock: "var(--space-md) 0 var(--space-xs)" }}>Sticker / Shape</label>
              <select
                value={selectedBlock?.style?.sticker || "none"}
                onChange={(e) => {
                  const val = e.target.value;
                  setContent((c) =>
                    c.map((b) =>
                      b.id === selectedBlock?.id
                        ? { ...b, style: { ...b.style, sticker: val } }
                        : b
                    )
                  );
                }}
                style={{
                  width: "100%",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              >
                <option value="none">Tanpa</option>
                <option value="circle">Lingkaran</option>
                <option value="square">Persegi</option>
                <option value="triangle">Segitiga</option>
              </select>
              <label style={{ display: "block", fontWeight: 700, color: "var(--ink)", marginBlock: "var(--space-md) 0 var(--space-xs)" }}>Posisi Sticker</label>
              <select
                value={selectedBlock?.style?.stickerPosition || "top-right"}
                onChange={(e) => {
                  const val = e.target.value;
                  setContent((c) =>
                    c.map((b) =>
                      b.id === selectedBlock?.id
                        ? { ...b, style: { ...b.style, stickerPosition: val } }
                        : b
                    )
                  );
                }}
                style={{
                  width: "100%",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              >
                <option value="top-left">Kiri Atas</option>
                <option value="top-right">Kanan Atas</option>
                <option value="bottom-left">Kiri Bawah</option>
                <option value="bottom-right">Kanan Bawah</option>
                <option value="center">Tengah</option>
              </select>
              <label style={{ display: "block", fontWeight: 700, color: "var(--ink)", marginBlock: "var(--space-md) 0 var(--space-xs)" }}>Animasi</label>
              <select
                value={selectedBlock?.style?.animation || "none"}
                onChange={(e) => {
                  const val = e.target.value;
                  setContent((c) =>
                    c.map((b) =>
                      b.id === selectedBlock?.id
                        ? { ...b, style: { ...b.style, animation: val } }
                        : b
                    )
                  );
                }}
                style={{
                  width: "100%",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              >
                <option value="none">Tidak Ada</option>
                <option value="float">Melayang</option>
              </select>
            </div>
            <div style={{ marginBlock: "var(--space-xl) 0", display: "flex", gap: "var(--space-md)" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "var(--space-sm) var(--space-xl)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  fontWeight: 700,
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 var(--ink)",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Menyimpan..." : "Simpan Draft"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  setSaving(true);
                  try {
                    const formData = new FormData();
                    formData.append("slug", slug);
                    formData.append(
                      "pageData",
                      JSON.stringify({
                        root: { props: { title: pageTitleState }, content },
                      })
                    );
                    const result = await publishPage(
                      undefined as any,
                      formData
                    );
                    if (result.ok) {
                      alert("Diterbitkan!");
                    } else {
                      alert(result.error || "Gagal");
                    }
                  } catch {
                    alert("Gagal");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "var(--space-sm) var(--space-xl)",
                  background: "var(--verveine)",
                  color: "var(--ink)",
                  fontWeight: 700,
                  border: "2.5px solid var(--ink)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 var(--ink)",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Menerbitkan..." : "Terbitkan"}
              </button>
            </div>

            <div style={{ marginBlockStart: "var(--space-xl)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <h3 style={{ margin: 0, padding: "var(--space-md)", background: "var(--ink)", color: "var(--paper)", fontSize: "0.875rem", fontWeight: 700 }}>Pratinjau</h3>
              <div style={{ padding: "var(--space-lg)" }}>
                <PageRenderer
                data={{
                  root: { props: { title: pageTitleState }, content },
                }}
                shopEnabled={true}
              />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}