"use client";

import styles from "./PuckBlocks.module.css";

interface MarqueeBlockProps {
  text: string;
  direction: "left" | "right";
  speed: number;
  color: string;
}

const colorStyles: Record<string, string> = {
  brume: "var(--brume)",
  menthe: "var(--menthe)",
  limonade: "var(--limonade)",
  verveine: "var(--verveine)",
  paper: "var(--paper)",
};

export function MarqueeBlock({ text, direction, speed, color }: MarqueeBlockProps) {
  const duration = Math.max(5, 50 - speed);
  const trackStyle = {
    animationDuration: `${duration}s`,
    animationDirection: direction === "left" ? "normal" : "reverse",
  } as React.CSSProperties;

  // Split richtext by paragraphs or newlines
  const texts = text.split(/\n+/).filter(t => t.trim()).map(t => t.replace(/<[^>]*>/g, '').trim()).filter(Boolean);

  return (
    <div className={`${styles.marquee} ${styles[color]}`} style={{ backgroundColor: colorStyles[color] || colorStyles.menthe }}>
      <div className={styles.marqueeTrack} style={trackStyle}>
        {texts.flatMap((text, i) => [
          <span key={i} className={styles.marqueeText}>{text}</span>,
          <span key={`sep-${i}`} className={styles.marqueeText}> • </span>,
        ])}
      </div>
    </div>
  );
}