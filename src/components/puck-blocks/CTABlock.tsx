"use client";

import styles from "./PuckBlocks.module.css";

interface CTABlockProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundToken: string;
}

const validBackgroundTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;

const backgroundStyles: Record<string, string> = {
  brume: "var(--brume)",
  menthe: "var(--menthe)",
  limonade: "var(--limonade)",
  verveine: "var(--verveine)",
  paper: "var(--paper)",
};

export function CTABlock({ title, subtitle, buttonText, buttonLink, backgroundToken }: CTABlockProps) {
  const validToken = validBackgroundTokens.includes(backgroundToken as typeof validBackgroundTokens[number])
    ? backgroundToken
    : "brume";
  const bgStyle = backgroundStyles[validToken] || backgroundStyles.brume;

  return (
    <section className={`${styles.cta} ${styles[validToken]}`} style={{ backgroundColor: bgStyle }}>
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {buttonText && buttonLink && (
          <a href={buttonLink} className={styles.button}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}