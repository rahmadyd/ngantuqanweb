"use client";

import { useState, useEffect, useCallback } from "react";
import { Section } from "@/components/ui";
import { reorderItems } from "./actions";

export const dynamic = "force-dynamic";

interface ItemData {
  id: string;
  slug: string;
  kind: "project" | "shop";
  title: string;
  is_published: boolean;
  is_sold_out: boolean;
  cover_image: string | null;
  sort_order: number;
}

interface NewItemData {
  slug: string;
  kind: "project" | "shop";
  title: string;
  is_published: boolean;
  is_sold_out: boolean;
  cover_image: string;
}

export default function StudioItemsPage() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [newItem, setNewItem] = useState<NewItemData>({
    slug: "",
    kind: "project",
    title: "",
    is_published: true,
    is_sold_out: false,
    cover_image: "",
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { createSupabaseBrowser } = await import("@/lib/supabase/browser");
    const supabase = createSupabaseBrowser();
    const { data, error } = await supabase.from("items").select("*").order("sort_order");
    if (error) throw error;
    setItems(data || []);
  };

  const handleSave = async () => {
    try {
      const { createSupabaseBrowser } = await import("@/lib/supabase/browser");
      const supabase = createSupabaseBrowser();
      const { error } = await supabase
        .from("items")
        .upsert(
          {
            slug: newItem.slug,
            kind: newItem.kind as "project" | "shop",
            title: newItem.title,
            is_published: newItem.is_published,
            is_sold_out: newItem.is_sold_out,
            cover_image: newItem.cover_image,
          },
          { onConflict: "slug" }
        );
      if (error) throw error;
      loadItems();
      setNewItem({
        slug: "",
        kind: "project",
        title: "",
        is_published: true,
        is_sold_out: false,
        cover_image: "",
      });
      await fetch("/api/puck/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Yakin menghapus?")) return;
    try {
      const { createSupabaseBrowser } = await import("@/lib/supabase/browser");
      const supabase = createSupabaseBrowser();
      await supabase.from("items").delete().match({ slug });
      setItems(items.filter((i: ItemData) => i.slug !== slug));
      await fetch("/api/puck/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
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

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggingId) {
      setDragOverId(id);
    }
  }, [draggingId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const sourceIndex = items.findIndex(item => item.id === sourceId);
    const targetIndex = items.findIndex(item => item.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    // Create new order
    const newItems = [...items];
    const [draggedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    // Update sort_order
    const updates = newItems.map((item, index) => ({
      id: item.id,
      sort_order: index,
    }));

    try {
      await reorderItems(updates);
      setItems(newItems);
    } catch (err) {
      console.error("Gagal mengurutkan:", err);
      alert("Gagal mengubah urutan");
    } finally {
      setDraggingId(null);
      setDragOverId(null);
    }
  }, [items, draggingId]);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

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
                kind: (e.target.value === "shop" ? "shop" : "project") as "project" | "shop",
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
        <p style={{ fontSize: "0.875rem", color: "var(--ink)", opacity: 0.7, marginBottom: "var(--space-md)" }}>
          Drag & drop untuk mengubah urutan (sort_order tersimpan otomatis)
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--ink)" }}>
              <th style={{ padding: 8, textAlign: "left", width: "40px" }}>⋮⋮</th>
              <th style={{ padding: 8, textAlign: "left" }}>Gambar</th>
              <th style={{ padding: 8, textAlign: "left" }}>Judul</th>
              <th style={{ padding: 8, textAlign: "left" }}>Tipe</th>
              <th style={{ padding: 8, textAlign: "left", width: "80px" }}>Urutan</th>
              <th style={{ padding: 8, textAlign: "left" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: ItemData) => (
              <tr
                key={item.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                style={{
                  borderBottom: "1px solid #e0e0e0",
                  background: draggingId === item.id ? "var(--brume)" : dragOverId === item.id ? "var(--limonade)" : "transparent",
                  cursor: "grab",
                  transition: "background 0.15s ease",
                }}
              >
                <td style={{ padding: 8, textAlign: "center", cursor: "grab" }}>
                  <span style={{ fontSize: "1.25rem", color: "var(--ink)", opacity: 0.5, userSelect: "none" }}>⋮⋮</span>
                </td>
                <td style={{ padding: 8 }}>
                  {item.cover_image && (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                    />
                  )}
                </td>
                <td style={{ padding: 8 }}>{item.title}</td>
                <td style={{ padding: 8 }}>
                  {item.kind === "project" ? "Project" : "Produk"}
                </td>
                <td style={{ padding: 8, textAlign: "center", fontWeight: 600, color: "var(--ink)" }}>
                  {item.sort_order}
                </td>
                <td style={{ padding: 8 }}>
                  {item.is_sold_out ? (
                    <span style={{ color: "var(--pop)", fontWeight: "bold" }}>Habis</span>
                  ) : (
                    <a href={`/studio/items/${item.id}`} style={{ marginRight: 8, color: "var(--ink)", textDecoration: "underline", cursor: "pointer" }}>Edit</a>
                  )}
                  {item.is_published ? (
                    <button onClick={() => handleDelete(item.slug)}>Hapus</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}