import Link from "next/link";
import type { ReactNode } from "react";
import { bgColor, type Scale } from "./tokens";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "pop";

const VARIANT_COLOR = {
  primary: "menthe",
  secondary: "paper",
  pop: "pop",
} as const;

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: Scale;
  /** Jika diisi, komponen dirender sebagai tautan. */
  href?: string;
  /** Buka di tab baru (untuk tautan eksternal). */
  external?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  fullWidth = false,
  type = "button",
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[size],
    fullWidth ? styles.fullWidth : null,
    disabled ? styles.disabled : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = { backgroundColor: bgColor(VARIANT_COLOR[variant]) };

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          style={style}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} style={style} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      style={style}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
