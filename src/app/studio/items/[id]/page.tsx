"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui";
import { updateItem, deleteItem } from "../actions";

interface ItemData {
  id: string;
  slug: string;
  kind: "project" | "shop";
  title: string;
  summary: string | null;
  body_md: string | null;
  cover_image: string | null;
  images: string[];
  tags: string[];
  role: string | null;
  client: string | null;
  year: number | null;
  price_idr: number | null;
  order_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  is_sold_out: boolean;
  is_published: boolean;
  sort_order: number;
}

interface FormData {
  slug: string;
  kind: "project" | "shop";
  title: string;
  summary: string;
  body_md: string;
  cover_image: string;
  images: string;
  tags: string;
  role: string;
  client: string;
  year: string;
  price_idr: string;
  order_url: string;
  live_url: string;
  repo_url: string;
  is_featured: boolean;
  is_sold_out: boolean;
  is_published: boolean;
  sort_order: string;
  alt_text: string;
}

const KIND_OPTIONS = [
  { value: "project", label: "Project" },
  { value: "shop", label: "Produk (Shop)" },
] as const;

export default function StudioItemEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    slug: "",
    kind: "project",
    title: "",
    summary: "",
    body_md: "",
    cover_image: "",
    images: "",
    tags: "",
    role: "",
    client: "",
    year: "",
    price_idr: "",
    order_url: "",
    live_url: "",
    repo_url: "",
    is_featured: false,
    is_sold_out: false,
    is_published: false,
    sort_order: "0",
    alt_text: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/studio/items/${id}`);
        if (!res.ok) {
          if (res.status === 404) return notFound();
          throw new Error("Gagal memuat item");
        }
        const data = await res.json();
        setItem(data);
        setFormData({
          slug: data.slug || "",
          kind: data.kind || "project",
          title: data.title || "",
          summary: data.summary || "",
          body_md: data.body_md || "",
          cover_image: data.cover_image || "",
          images: Array.isArray(data.images) ? data.images.join("\n") : "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          role: data.role || "",
          client: data.client || "",
          year: data.year?.toString() || "",
          price_idr: data.price_idr?.toString() || "",
          order_url: data.order_url || "",
          live_url: data.live_url || "",
          repo_url: data.repo_url || "",
          is_featured: data.is_featured || false,
          is_sold_out: data.is_sold_out || false,
          is_published: data.is_published || false,
          sort_order: data.sort_order?.toString() || "0",
          alt_text: "",
        });
      } catch (err) {
        console.error("Gagal memuat item:", err);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const imagesArr = formData.images.split("\n").map(s => s.trim()).filter(Boolean);
      const tagsArr = formData.tags.split(",").map(s => s.trim()).filter(Boolean);
      
      await updateItem(id, {
        slug: formData.slug,
        kind: formData.kind,
        title: formData.title,
        summary: formData.summary || null,
        body_md: formData.body_md || null,
        cover_image: formData.cover_image || null,
        images: imagesArr,
        tags: tagsArr,
        role: formData.role || null,
        client: formData.client || null,
        year: formData.year ? parseInt(formData.year, 10) : null,
        price_idr: formData.price_idr ? parseInt(formData.price_idr, 10) : null,
        order_url: formData.order_url || null,
        live_url: formData.live_url || null,
        repo_url: formData.repo_url || null,
        is_featured: formData.is_featured,
        is_sold_out: formData.is_sold_out,
        is_published: formData.is_published,
        sort_order: parseInt(formData.sort_order, 10) || 0,
        alt_text: formData.alt_text || null,
      });
      
      setSuccess("Item berhasil disimpan!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    setSaving(true);
    try {
      await deleteItem(id);
      setSuccess("Item berhasil dihapus!");
      setTimeout(() => router.push("/studio/items"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Section background="brume" space="lg" containerSize="wide">
        <div style={{ textAlign: "center", color: "var(--ink)", padding: "var(--space-xl)" }}>
          Memuat item...
        </div>
      </Section>
    );
  }

  if (!item) return notFound();

  return (
    <Section background="brume" space="lg" containerSize="wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <h1>Edit Item: {item.title}</h1>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button
            onClick={() => router.push("/studio/items")}
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
            Kembali ke Daftar
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          padding: "var(--space-md)", 
          background: "var(--pop)", 
          color: "var(--paper)", 
          borderRadius: "var(--radius-md)", 
          marginBottom: "var(--space-lg)",
          border: "2.5px solid var(--ink)",
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          padding: "var(--space-md)", 
          background: "var(--verveine)", 
          color: "var(--ink)", 
          borderRadius: "var(--radius-md)", 
          marginBottom: "var(--space-lg)",
          border: "2.5px solid var(--ink)",
        }}>
          {success}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)" }}>
          
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Slug <span style={{ color: "var(--pop)" }}>*</span>
            </label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Kind <span style={{ color: "var(--pop)" }}>*</span>
            </label>
            <select
              name="kind"
              value={formData.kind}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            >
              {KIND_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Title <span style={{ color: "var(--pop)" }}>*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Body Markdown
            </label>
            <textarea
              name="body_md"
              value={formData.body_md}
              onChange={handleChange}
              rows={10}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Cover Image URL
            </label>
            <input
              name="cover_image"
              value={formData.cover_image}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Alt Text Cover <span style={{ color: "var(--pop)" }}>*</span>
            </label>
            <input
              name="alt_text"
              value={formData.alt_text}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.7, marginTop: "var(--space-xs)" }}>
              Wajib diisi jika cover image diisi
            </p>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Additional Images (satu per baris)
            </label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows={4}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "monospace" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.7, marginTop: "var(--space-xs)" }}>
              Satu URL per baris. Alt text untuk gambar tambahan di-handle terpisah.
            </p>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Tags (pisah dengan koma)
            </label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Role
            </label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Client
            </label>
            <input
              name="client"
              value={formData.client}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Year
            </label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max="2100"
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Price (IDR)
            </label>
            <input
              name="price_idr"
              type="number"
              value={formData.price_idr}
              onChange={handleChange}
              min="0"
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Order URL
            </label>
            <input
              name="order_url"
              value={formData.order_url}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Live URL
            </label>
            <input
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Repo URL
            </label>
            <input
              name="repo_url"
              value={formData.repo_url}
              onChange={handleChange}
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontWeight: 600, color: "var(--ink)" }}>
              <input
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleChange}
                style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--ink)" }}
              />
              Featured
            </label>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontWeight: 600, color: "var(--ink)" }}>
              <input
                name="is_sold_out"
                type="checkbox"
                checked={formData.is_sold_out}
                onChange={handleChange}
                style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--ink)" }}
              />
              Sold Out
            </label>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", fontWeight: 600, color: "var(--ink)" }}>
              <input
                name="is_published"
                type="checkbox"
                checked={formData.is_published}
                onChange={handleChange}
                style={{ width: "1.25rem", height: "1.25rem", accentColor: "var(--ink)" }}
              />
              Published
            </label>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "var(--space-xs)", fontWeight: 600, color: "var(--ink)" }}>
              Sort Order
            </label>
            <input
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleChange}
              min="0"
              style={{ width: "100%", padding: "var(--space-sm)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)" }}
            />
          </div>

        </div>

        <div style={{ marginTop: "var(--space-xl)", display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "var(--space-md) var(--space-xl)",
              background: "var(--verveine)",
              color: "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: saving ? "2px 2px 0 var(--ink)" : "4px 4px 0 var(--ink)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            style={{
              padding: "var(--space-md) var(--space-xl)",
              background: showDeleteConfirm ? "var(--pop)" : "var(--paper)",
              color: showDeleteConfirm ? "var(--paper)" : "var(--ink)",
              border: "2.5px solid var(--ink)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: showDeleteConfirm ? "4px 4px 0 var(--ink)" : "2px 2px 0 var(--ink)",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {showDeleteConfirm ? "Konfirmasi Hapus" : "Hapus Item"}
          </button>
        </div>

        {showDeleteConfirm && (
          <p style={{ marginTop: "var(--space-md)", color: "var(--pop)", fontWeight: 700 }}>
            {"⚠️ Klik \"Konfirmasi Hapus\" lagi untuk menghapus permanen. File di storage juga akan dihapus."}
          </p>
        )}
      </form>
    </Section>
  );
}