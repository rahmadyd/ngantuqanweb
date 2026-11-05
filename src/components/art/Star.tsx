"use client";

import styles from "./Star.module.css";

export function Star({ className, size = 24, ...props }: React.SVGProps<SVGSVGElement> & { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`${styles.star} ${className || ""}`}
      aria-hidden="true"
      {...props}
    >
      <polygon
        points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
        fill="var(--pop)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
    </svg>
  );
}