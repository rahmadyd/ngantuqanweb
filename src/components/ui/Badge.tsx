import type { ReactNode } from "react";
import { bgColor, type ColorToken } from "./tokens";
import styles from "./Badge.module.css";

export type BadgeProps = {
  children: ReactNode;
  color?: ColorToken;
  rotate?: number;
  className?: string;
};

export function Badge({
  children,
  color = "pop",
  rotate,
  className,
}: BadgeProps) {
  const classes = [styles.badge, className].filter(Boolean).join(" ");

  return (
    <span
      className={classes}
      style={{
        backgroundColor: bgColor(color),
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {children}
    </span>
  );
}
