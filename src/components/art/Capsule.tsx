"use client";

import styles from "./Capsule.module.css";

export function Capsule({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={`${styles.capsule} ${className || ""}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <filter id="capsuleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="var(--ink)" />
        </filter>
      </defs>
      <g filter="url(#capsuleShadow)">
        {/* Base/alas */}
        <rect x="10" y="110" width="80" height="20" rx="4" fill="var(--ink)" />
        {/* Body tube */}
        <rect x="15" y="30" width="70" height="80" rx="8" fill="var(--brume)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Top dome */}
        <ellipse cx="50" cy="30" rx="35" ry="15" fill="var(--menthe)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Pipe on side */}
        <rect x="85" y="50" width="15" height="40" rx="3" fill="var(--verveine)" stroke="var(--ink)" strokeWidth="2.5" />
        <circle cx="92.5" cy="45" r="7" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Window */}
        <ellipse cx="50" cy="70" rx="20" ry="15" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="50" cy="70" r="5" fill="var(--ink)" />
      </g>
    </svg>
  );
}