"use client";

import Link from "next/link";
import { Marquee } from "@/components/ui";
import { Container } from "@/components/ui";
import styles from "./NavBar.module.css";

interface NavBarProps {
  items: Array<{ href: string; label: string }>;
  pathname?: string;
  marqueeText: string;
}

export function NavBar({ items, pathname = "/", marqueeText }: NavBarProps) {
  return (
    <nav className={styles.navBar} aria-label="Navigasi utama">
      <Container className={styles.container}>
        <Marquee
          items={[marqueeText, marqueeText, marqueeText]}
          direction="left"
          speed={30}
          className={styles.marquee}
        />
        <div className={styles.tabs} role="tablist">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.tab} ${pathname === item.href ? styles.active : ""}`}
              role="tab"
              aria-selected={pathname === item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Marquee
          items={[marqueeText, marqueeText, marqueeText]}
          direction="right"
          speed={30}
          className={styles.marquee}
        />
      </Container>
    </nav>
  );
}