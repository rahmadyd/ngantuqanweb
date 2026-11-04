"use client";

import styles from "./PuckBlocks.module.css";

interface StickerLayerBlockProps {
  imageUrl: string;
  label: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

const positionStyles: Record<string, React.CSSProperties> = {
  "top-left": { top: "var(--space-lg)", left: "var(--space-lg)", right: "auto", bottom: "auto" },
  "top-right": { top: "var(--space-lg)", right: "var(--space-lg)", left: "auto", bottom: "auto" },
  "bottom-left": { bottom: "var(--space-lg)", left: "var(--space-lg)", right: "auto", top: "auto" },
  "bottom-right": { bottom: "var(--space-lg)", right: "var(--space-lg)", left: "auto", top: "auto" },
  "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)", right: "auto", bottom: "auto" },
};

export function StickerLayerBlock({ imageUrl, label, position }: StickerLayerBlockProps) {
  if (!imageUrl) {
    return (
      <div className={styles.stickerLayer} style={{ opacity: 0 }} aria-hidden="true">
        <span style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.5 }}>Stiker dekoratif (tambahkan URL gambar)</span>
      </div>
    );
  }

  const posStyle = positionStyles[position] || positionStyles["top-right"];

  return (
    <div
      className={styles.stickerLayer}
      style={posStyle}
      aria-hidden="true"
      role="img"
      aria-label={label || "Stiker dekoratif"}
    >
      <img
        src={imageUrl}
        alt=""
        className={styles.sticker}
        width={150}
        height={150}
        loading="lazy"
      />
    </div>
  );
}