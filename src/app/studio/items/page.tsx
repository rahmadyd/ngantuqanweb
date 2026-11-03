"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui";

export default function StudioItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    slug: "",
    kind: "project",
    title: "",
    cover_image: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { createSupabaseServer } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.from("items").select("*").order("sort_order");
    if (error) throw error;
    setItems(data || []);
  };

  const handleSave = async () => {
    try {
      const { createSupabaseServer } = await import("@/lib/supabase/server");
      const supabase = await createSupabaseServer();
      const { error } = await supabase
        .from("items")
        .upsert(
          {
            slug: newItem.slug,
            kind: newItem.kind as "project" | "shop",
            title: newItem.title,
            cover_image: newItem.cover_image,
          },
          { onConflict: "slug" }
        );
      if (error) throw error;
      loadItems();
      setNewItem({ slug: "", kind: "project", title: "", cover_image: "" });
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Yakin menghapus?")) return;
    try {
      const { createSupabaseServer } = await import("@/lib/supabase/server");
      const supabase = await createSupabaseServer();
      await supabase.from("items").delete().match({ slug });
      setItems(items.filter((i: any) => i.slug !== slug));
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    import("@/app/studio/actions").then(({ uploadImage }) => {
      uploadImage(formData).then((r) => {
        if (r.error) alert(r.error);
        else setNewItem({ ...newItem, cover_image: r.url ?? "" });
      });
    });
  };

  return (
    <Section background="brume" space="lg" containerSize="wide">
      <h1>Karya</h1>

      <div style={{ marginBottom: 24 }}>
        <h2>Buat Karya Baru</h2>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Slug</label>
          <input
            value={newItem.slug}
            onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Tipe</label>
          <select
            value={newItem.kind}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                kind: (e.target.value as string | undefined) ?? "project",
              })
            }
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          >
            <option value="project">Project</option>
            <option value="shop">Produk</option>
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Judul</label>
          <input
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 4 }}>Gambar Samping</label>
          <button style={{ marginBottom: 8 }}>Upload Gambar Samping</button>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </div>

        <button onClick={() => { handleSave(); }} style={{ marginTop: 8, marginLeft: 8 }}>
          Simpan
        </button>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Daftar Karya</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--ink)" }}>
              <th style={{ padding: 8, textAlign: "left" }}>Gambar</th>
              <th style={{ padding: 8, textAlign: "left" }}>Judul</th>
              <th style={{ padding: 8, textAlign: "left" }}>Tipe</th>
              <th style={{ padding: 8, textAlign: "left" }}>Urutan</th>
              <th style={{ padding: 8, textAlign: "left" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.slug} style={{ borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: 8 }}>
                  {item.cover_image && (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td style={{ padding: 8 }}>{item.title}</td>
                <td style={{ padding: 8 }}>
                  {item.kind === "project" ? "Project" : "Produk"}
                </td>
                <td style={{ padding: 8 }}>{item.sort_order}</td>
                <td style={{ padding: 8 }}>
                  <button style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(item.slug)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}