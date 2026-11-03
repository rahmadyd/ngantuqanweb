import type { ReactNode } from "react";
import { bgColor, type ColorToken } from "./tokens";
import styles from "./Pill.module.css";

export type PillProps = {
  children: ReactNode;
  color?: ColorToken;
  size?: "sm" | "md";
  className?: string;
};

export function Pill({
  children,
  color = "limonade",
  size = "md",
  className,
}: PillProps) {
  const classes = [styles.pill, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} style={{ backgroundColor: bgColor(color) }}>
      {children}
    </span>
  );
}
