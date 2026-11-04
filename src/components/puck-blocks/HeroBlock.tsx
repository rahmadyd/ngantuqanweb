"use client";

import styles from "./PuckBlocks.module.css";

interface HeroBlockProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundToken: string;
  imageUrl: string;
}

const validBackgroundTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;

const backgroundStyles: Record<string, string> = {
  brume: "var(--brume)",
  menthe: "var(--menthe)",
  limonade: "var(--limonade)",
  verveine: "var(--verveine)",
  paper: "var(--paper)",
};

export function HeroBlock({ title, subtitle, ctaText, ctaLink, backgroundToken, imageUrl }: HeroBlockProps) {
  const validToken = validBackgroundTokens.includes(backgroundToken as typeof validBackgroundTokens[number]) 
    ? backgroundToken 
    : "brume";
  const bgStyle = backgroundStyles[validToken] || backgroundStyles.brume;
  return (
    <section className={`${styles.hero} ${styles[validToken]}`} style={{ backgroundColor: bgStyle }}>
      <div className={styles.container}>
        {imageUrl && (
          <div className={styles.imageWrapper}>
            <img src={imageUrl} alt={title || "Hero image"} className={styles.image} width={600} height={400} />
          </div>
        )}
        <div className={styles.content}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {ctaText && ctaLink && (
            <a href={ctaLink} className={styles.cta}>
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}