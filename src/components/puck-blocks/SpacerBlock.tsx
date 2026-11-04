"use client";

import styles from "./PuckBlocks.module.css";

interface SpacerBlockProps {
  size: "S" | "M" | "L";
}

const sizeStyles: Record<string, string> = {
  S: "var(--space-md)",
  M: "var(--space-xl)",
  L: "var(--space-2xl)",
};

export function SpacerBlock({ size }: SpacerBlockProps) {
  const height = sizeStyles[size] || sizeStyles.M;
  return <div className={styles.spacer} style={{ height }} aria-hidden="true" />;
}