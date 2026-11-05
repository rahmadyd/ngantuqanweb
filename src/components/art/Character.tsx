"use client";

import styles from "./Character.module.css";

export function Character({ className, peek = "left", ...props }: React.SVGProps<SVGSVGElement> & { className?: string; peek?: "left" | "right" }) {
  const isLeft = peek === "left";

  return (
    <svg
      viewBox="0 0 100 140"
      className={`${styles.character} ${className || ""}`}
      aria-hidden="true"
      style={{ transform: isLeft ? "scaleX(1)" : "scaleX(-1)" }}
      {...props}
    >
      <defs>
        <filter id="charShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="var(--ink)" />
        </filter>
      </defs>
      <g filter="url(#charShadow)">
        {/* Body */}
        <ellipse cx="50" cy="110" rx="30" ry="25" fill="var(--brume)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="50" cy="60" r="28" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Ears */}
        <ellipse cx="22" cy="50" rx="10" ry="15" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        <ellipse cx="78" cy="50" rx="10" ry="15" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Eyes */}
        <ellipse cx="40" cy="55" rx="6" ry="8" fill="var(--ink)" />
        <ellipse cx="60" cy="55" rx="6" ry="8" fill="var(--ink)" />
        <circle cx="43" cy="52" r="2" fill="var(--paper)" />
        <circle cx="63" cy="52" r="2" fill="var(--paper)" />
        {/* Nose */}
        <ellipse cx="50" cy="65" rx="4" ry="3" fill="var(--pop)" />
        {/* Mouth */}
        <path d="M40 75 Q50 82 60 75" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
        {/* Hair tuft */}
        <path d="M50 35 Q45 25 50 30 Q55 25 50 35" fill="var(--ink)" />
        {/* Peeking hand */}
        {isLeft ? (
          <path d="M15 90 Q5 80 10 70 Q15 65 20 75 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        ) : (
          <path d="M85 90 Q95 80 90 70 Q85 65 80 75 Z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        )}
      </g>
    </svg>
  );
}