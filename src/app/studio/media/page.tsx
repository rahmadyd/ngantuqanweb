"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Section } from "@/components/ui";

const MediaUploader = dynamic(
  () => import("@/components/ImageUploader").then((mod) => mod.ImageUploader),
  {
    ssr: false,
    loading: () => <div style={{ padding: "var(--space-md)", color: "var(--ink)" }}>Memuat uploader...</div>,
  }
);

interface MediaItem {
  name: string;
  url: string;
  size: number;
  mime: string;
  createdAt: string;
}

export default function StudioMediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/studio/media");
      if (!res.ok) throw new Error("Gagal memuat gambar");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Gagal memuat gambar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (result: { file: File; dataUrl: string; width: number; height: number; originalSize: number; compressedSize: number }) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", result.file);
      
      const res = await fetch("/api/studio/media", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload gagal");
      }
      
      setSuccess(`Gambar berhasil diupload! (${(result.originalSize / 1024).toFixed(1)} KB → ${(result.compressedSize / 1024).toFixed(1)} KB)`);
      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!deleteConfirm) {
      setDeleteConfirm(name);
      return;
    }
    if (name !== deleteConfirm) return;
    
    try {
      const res = await fetch("/api/studio/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      
      if (!res.ok) throw new Error("Hapus gagal");
      
      setDeleteConfirm(null);
      fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hapus gagal");
    }
  };

  return (
    <Section background="brume" space="lg" containerSize="wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <h1>Pustaka Gambar</h1>
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

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <MediaUploader onUpload={handleUpload} />
        {uploading && (
          <p style={{ color: "var(--ink)", opacity: 0.7, marginTop: "var(--space-sm)" }}>
            Mengupload...
          </p>
        )}
      </div>

      <div style={{ marginTop: "var(--space-xl)" }}>
        <h2 style={{ marginBottom: "var(--space-lg)", color: "var(--ink)" }}>
          Gambar Tersimpan ({images.length})
        </h2>
        
        {loading ? (
          <p style={{ color: "var(--ink)", opacity: 0.7 }}>Memuat...</p>
        ) : images.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-2xl)" }}>
            Belum ada gambar. Upload gambar pertama di atas.
          </p>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "var(--space-lg)" 
          }}>
            {images.map((img) => (
              <div 
                key={img.name} 
                style={{ 
                  border: "2.5px solid var(--ink)", 
                  borderRadius: "var(--radius-lg)", 
                  overflow: "hidden", 
                  background: "var(--paper)",
                  position: "relative",
                }}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover" }}
                  width={400}
                  height={400}
                  loading="lazy"
                />
                <div style={{ 
                  position: "absolute", 
                  top: "var(--space-xs)", 
                  right: "var(--space-xs)",
                  zIndex: 10,
                }}>
                  <button
                    onClick={() => handleDelete(img.name)}
                    disabled={deleteConfirm === img.name}
                    style={{
                      padding: "var(--space-xs) var(--space-sm)",
                      background: deleteConfirm === img.name ? "var(--pop)" : "var(--paper)",
                      color: deleteConfirm === img.name ? "var(--paper)" : "var(--ink)",
                      border: "2.5px solid var(--ink)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "2px 2px 0 var(--ink)",
                    }}
                  >
                    {deleteConfirm === img.name ? "Hapus" : "Hapus"}
                  </button>
                </div>
                <div style={{ padding: "var(--space-sm)" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.7, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {img.name}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--ink)", opacity: 0.5, margin: "var(--space-xs) 0 0" }}>
                    {(img.size / 1024).toFixed(1)} KB · {img.mime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteConfirm && (
          <p style={{ marginTop: "var(--space-md)", color: "var(--pop)", fontWeight: 700 }}>
            ⚠️ Klik nama file lagi untuk konfirmasi hapus permanen.
          </p>
        )}
      </div>
    </Section>
  );
}