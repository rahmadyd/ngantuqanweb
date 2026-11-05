"use client";

import { useEffect, useState } from "react";
import styles from "./Eye.module.css";

export function Eye({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 60 60"
      className={`${styles.eye} ${className || ""}`}
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth="2.5"
      />
      <ellipse
        cx="30"
        cy="30"
        rx={blink ? 20 : 8}
        ry={blink ? 2 : 10}
        fill="var(--ink)"
        style={{ transformOrigin: "center", transition: "ry 0.1s, rx 0.1s" }}
      />
      {!blink && (
        <circle cx="38" cy="22" r="3" fill="var(--paper)" />
      )}
    </svg>
  );
}