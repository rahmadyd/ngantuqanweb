import type { ElementType, ReactNode } from "react";
import { Container } from "./Container";
import { bgColor, type ColorToken, type Scale } from "./tokens";
import styles from "./Section.module.css";

export type SectionProps = {
  children: ReactNode;
  /** Warna latar hanya dari token desain. Default: paper. */
  background?: ColorToken | "none";
  /** Preset jarak vertikal. Default: md. */
  space?: Scale;
  /** Bungkus isi dengan Container. Default: true. */
  container?: boolean;
  containerSize?: "default" | "narrow" | "wide";
  id?: string;
  as?: ElementType;
  className?: string;
};

export function Section({
  children,
  background = "paper",
  space = "md",
  container = true,
  containerSize = "default",
  id,
  as: Tag = "section",
  className,
}: SectionProps) {
  const classes = [styles.section, styles[space], className]
    .filter(Boolean)
    .join(" ");

  const content = container ? (
    <Container size={containerSize}>{children}</Container>
  ) : (
    children
  );

  return (
    <Tag id={id} className={classes} style={{ backgroundColor: bgColor(background) }}>
      {content}
    </Tag>
  );
}
