"use client";

import styles from "./PuckBlocks.module.css";

interface RichTextBlockProps {
  content: string;
}

function renderHtml(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.firstChild;
}

export function RichTextBlock({ content }: RichTextBlockProps) {
  if (!content) {
    return (
      <div className={styles.richText} style={{ minHeight: "var(--space-xl)", opacity: 0.5 }}>
        <em>Konten rich text (klik untuk edit)</em>
      </div>
    );
  }

  return (
    <div
      className={styles.richText}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}