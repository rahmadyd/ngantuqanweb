"use client";

import { Container } from "@/components/ui";
import { Button } from "@/components/ui";
import { Capsule, Star, Cloud } from "@/components/art";
import styles from "./Hero.module.css";

interface HeroProps {
  title: string;
  subtitle: string;
  tagline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  shopEnabled: boolean;
}

export function Hero({
  title,
  subtitle,
  tagline,
  ctaPrimary,
  ctaSecondary,
  shopEnabled,
}: HeroProps) {
  return (
    <section className={styles.section} aria-labelledby="hero-title">
      <Container className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <h1 id="hero-title" className={styles.title}>
              {title}
            </h1>
            <p className={styles.subtitle}>{subtitle}</p>
            <div className={styles.ctaGroup}>
              <Button variant="primary" size="lg" href={ctaPrimary.href}>
                {ctaPrimary.label}
              </Button>
              {shopEnabled && (
                <Button variant="secondary" size="lg" href={ctaSecondary.href}>
                  {ctaSecondary.label}
                </Button>
              )}
            </div>
            <p className={styles.tagline}>{tagline}</p>
          </div>
          <div className={styles.illustration} aria-hidden="true">
            <div className={styles.floatingWrapper}>
              <Capsule className={styles.capsule} />
              <Star size={32} className={styles.star1} />
              <Star size={24} className={styles.star2} />
              <Star size={16} className={styles.star3} />
              <Cloud className={styles.cloud1} />
              <Cloud className={styles.cloud2} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}