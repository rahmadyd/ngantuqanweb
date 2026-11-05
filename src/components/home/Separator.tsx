"use client";

import { Marquee } from "@/components/ui";
import { Container } from "@/components/ui";
import styles from "./Separator.module.css";

interface SeparatorProps {
  label: string;
  background?: "verveine" | "menthe" | "limonade" | "brume";
}

export function Separator({ label, background = "verveine" }: SeparatorProps) {
  return (
    <section className={styles.section} style={{ background: `var(--${background})` }} aria-hidden="true">
      <Container className={styles.container}>
        <div className={styles.marqueeWrapper}>
          <Marquee
            items={[label, label, label]}
            direction="left"
            speed={25}
            className={styles.marquee}
          />
          <div className={styles.labelWrapper}>
            <span className={styles.arrowLeft} aria-hidden="true">←</span>
            <span className={styles.label} role="heading" aria-level={2}>{label}</span>
            <span className={styles.arrowRight} aria-hidden="true">→</span>
          </div>
        </div>
      </Container>
    </section>
  );
}