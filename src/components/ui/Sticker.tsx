import type { CSSProperties, ReactNode } from "react";
import { bgColor, type ColorToken } from "./tokens";
import styles from "./Sticker.module.css";

export type StickerProps = {
  children: ReactNode;
  /** Posisi absolut relatif terhadap induk yang ber-position relative. */
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  /** Rotasi kecil dalam derajat. */
  rotate?: number;
  size?: "sm" | "md" | "lg";
  color?: ColorToken;
  className?: string;
};

/** Elemen dekoratif murni — selalu disembunyikan dari pembaca layar. */
export function Sticker({
  children,
  top,
  right,
  bottom,
  left,
  rotate = -6,
  size = "md",
  color = "limonade",
  className,
}: StickerProps) {
  const classes = [styles.sticker, styles[size], className]
    .filter(Boolean)
    .join(" ");

  const style = {
    top,
    right,
    bottom,
    left,
    backgroundColor: bgColor(color),
    transform: `rotate(${rotate}deg)`,
  } as CSSProperties;

  return (
    <span className={classes} style={style} aria-hidden="true">
      {children}
    </span>
  );
}
