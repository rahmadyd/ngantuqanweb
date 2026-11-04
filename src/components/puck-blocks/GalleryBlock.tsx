"use client";

import styles from "./PuckBlocks.module.css";

interface GalleryBlockProps {
  images: string[];
  columns: "2" | "3" | "4";
}

export function GalleryBlock({ images, columns }: GalleryBlockProps) {
  const validColumns = ["2", "3", "4"].includes(columns) ? columns : "3";
  const colCount = parseInt(validColumns, 10);

  if (!images.length) {
    return (
      <section className={styles.gallery}>
        <p style={{ gridColumn: `1 / -1`, textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
          Belum ada gambar.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.gallery}>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
        {images.map((img, idx) => (
          <div key={img} className={styles.galleryItem}>
            <img src={img} alt={`Galeri ${idx + 1}`} className={styles.image} width={600} height={400} loading={idx < 4 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>
    </section>
  );
}