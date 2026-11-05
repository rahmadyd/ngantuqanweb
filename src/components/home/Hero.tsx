"use client";

import { Container } from "@/components/ui";
import styles from "./Hero.module.css";

interface HeroProps {
  title: string;
  subtitle: string;
  tagline: string;
}

export function Hero({ title, subtitle, tagline }: HeroProps) {
  return (
    <section className={styles.section} aria-labelledby="hero-title">
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.tagline}>{tagline}</p>
        </div>
      </Container>
    </section>
  );
}