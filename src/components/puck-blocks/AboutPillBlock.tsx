"use client";

import styles from "./PuckBlocks.module.css";

interface AboutPillBlockProps {
  label: string;
  paragraph: string;
  linkText: string;
  linkUrl: string;
}

export function AboutPillBlock({ label, paragraph, linkText, linkUrl }: AboutPillBlockProps) {
  return (
    <div className={styles.aboutPill}>
      {label && <span className={styles.label}>{label}</span>}
      {paragraph && <p className={styles.paragraph}>{paragraph}</p>}
      {linkText && linkUrl && (
        <a href={linkUrl} className={styles.link}>
          {linkText}
        </a>
      )}
    </div>
  );
}