"use client";

import { useEffect, useState } from "react";
import styles from "./PuckBlocks.module.css";

interface ShopCTABlockProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundToken: string;
}

const backgroundStyles: Record<string, string> = {
  brume: "var(--brume)",
  menthe: "var(--menthe)",
  limonade: "var(--limonade)",
  verveine: "var(--verveine)",
  paper: "var(--paper)",
};

const validBackgroundTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;

export function ShopCTABlock({ title, subtitle, buttonText, buttonLink, backgroundToken }: ShopCTABlockProps) {
  const [shopEnabled, setShopEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setShopEnabled(d.shop_enabled === true))
      .catch(() => setShopEnabled(true));
  }, []);

  if (shopEnabled === false) return <></>;

  const validToken = validBackgroundTokens.includes(backgroundToken as typeof validBackgroundTokens[number])
    ? backgroundToken
    : "brume";
  const bgStyle = backgroundStyles[validToken] || backgroundStyles.brume;

  return (
    <section className={styles.cta} style={{ backgroundColor: bgStyle }}>
      <div className={styles.ctaContent}>
        {title && <h2 className={styles.ctaTitle}>{title}</h2>}
        {subtitle && <p className={styles.ctaSubtitle}>{subtitle}</p>}
        {buttonText && buttonLink && (
          <a href={buttonLink} className={styles.ctaButton}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}