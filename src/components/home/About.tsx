"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { Button } from "@/components/ui";
import { Eye, Cloud } from "@/components/art";
import styles from "./About.module.css";

interface AboutProps {
  consoleLines: string[];
  ctaLabel: string;
  ctaHref: string;
}

export function About({ consoleLines, ctaLabel, ctaHref }: AboutProps) {
  return (
    <section className={styles.section} aria-labelledby="about-title">
      <Container className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.decorLeft} aria-hidden="true">
            <Cloud className={styles.cloud} />
          </div>
          <div className={styles.decorRight} aria-hidden="true">
            <Cloud className={styles.cloud} />
          </div>
          <div className={styles.mainContent}>
            <Eye className={styles.eyeLeft} />
            <div className={styles.console} role="img" aria-label="Konsol Ngantuqan">
              <div className={styles.consoleTop}>
                <div className={styles.consoleButtons}>
                  <span className={styles.btnClose} aria-hidden="true" />
                  <span className={styles.btnMin} aria-hidden="true" />
                  <span className={styles.btnMax} aria-hidden="true" />
                </div>
              </div>
              <div className={styles.consoleScreen}>
                {consoleLines.map((line, i) => (
                  <p key={i} className={styles.consoleLine}>{line}</p>
                ))}
              </div>
              <div className={styles.consoleBase}>
                <Button variant="pop" size="sm" className={styles.arrowBtn} aria-label="Kiri">
                  ←
                </Button>
                <Button variant="pop" size="sm" className={styles.arrowBtn} aria-label="Kanan">
                  →
                </Button>
                <Link href={ctaHref}>
                  <Button variant="pop" size="lg" className={styles.goBtn} aria-label={ctaLabel}>
                    Go
                  </Button>
                </Link>
              </div>
            </div>
            <Eye className={styles.eyeRight} />
          </div>
        </div>
      </Container>
    </section>
  );
}