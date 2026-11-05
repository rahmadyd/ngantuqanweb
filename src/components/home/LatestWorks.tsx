"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Button } from "@/components/ui";
import styles from "./LatestWorks.module.css";

interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
  slug?: string;
}

interface LatestWorksProps {
  label: string;
  items: WorkItem[];
  ctaLabel: string;
  ctaHref: string;
}

export function LatestWorks({ label, items, ctaLabel, ctaHref }: LatestWorksProps) {
  return (
    <section className={styles.section} aria-labelledby="latest-works-title">
      <Container className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>{label}</span>
        </div>
        <div className={styles.grid} role="list">
          {items.map((item) => (
            <article key={item.id} className={styles.capsuleCard} role="listitem">
              <div className={styles.capsuleWrapper}>
                <div className={styles.dome}>
                  {item.slug ? (
                    <Link href={`/karya/${item.slug}`}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={300}
                        height={200}
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={300}
                      height={200}
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                </div>
                <div className={styles.base} />
              </div>
              <div className={styles.badge} aria-label={`Karya nomor ${item.id}`}>
                {item.id}
              </div>
              <div className={styles.category} aria-label={`Kategori: ${item.category}`}>
                {item.category}
              </div>
              <h3 className={styles.title}>{item.title}</h3>
            </article>
          ))}
        </div>
        <div className={styles.ctaWrapper}>
          <Button variant="primary" size="lg" href={ctaHref}>
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}