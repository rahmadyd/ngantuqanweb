"use client";

import Link from "next/link";
import { Marquee } from "@/components/ui";
import { Container } from "@/components/ui";
import styles from "./Footer.module.css";

interface SocialLink {
  label: string;
  href: string;
}

interface FooterProps {
  marqueeText: string;
  socialLinks: SocialLink[];
  copyright: string;
}

export function Footer({ marqueeText, socialLinks, copyright }: FooterProps) {
  return (
    <footer className={styles.footer} role="contentinfo">
      <Marquee
        items={[marqueeText, marqueeText, marqueeText]}
        direction="left"
        speed={30}
        className={styles.marquee}
        aria-hidden="true"
      />
      <Container className={styles.container}>
        <div className={styles.content}>
          <nav className={styles.social} aria-label="Media sosial">
            {socialLinks.map((link) => (
              <Link key={link.label} href={link.href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className={styles.copyright}>{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}