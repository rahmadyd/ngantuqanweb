import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

export type ContainerProps = {
  children: ReactNode;
  /** Lebar maksimum konten. */
  size?: "default" | "narrow" | "wide";
  as?: ElementType;
  className?: string;
};

export function Container({
  children,
  size = "default",
  as: Tag = "div",
  className,
}: ContainerProps) {
  const classes = [styles.container, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
