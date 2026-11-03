import Link from "next/link";
import type { ReactNode } from "react";
import { bgColor, type ColorToken, type Scale } from "./tokens";
import styles from "./Card.module.css";

export type CardProps = {
  children: ReactNode;
  /** Warna permukaan hanya dari token desain. Default: paper. */
  color?: ColorToken;
  /** Preset padding dalam. Default: md. */
  padding?: Scale;
  /** Jika diisi, seluruh kartu menjadi tautan. */
  href?: string;
  external?: boolean;
  className?: string;
};

export function Card({
  children,
  color = "paper",
  padding = "md",
  href,
  external = false,
  className,
}: CardProps) {
  const classes = [styles.card, styles[padding], href ? styles.interactive : null, className]
    .filter(Boolean)
    .join(" ");

  const style = { backgroundColor: bgColor(color) };

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          style={style}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
