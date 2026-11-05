"use client";

import styles from "./Pipe.module.css";

export function Pipe({ className, horizontal = false, ...props }: React.SVGProps<SVGSVGElement> & { className?: string; horizontal?: boolean }) {
  return (
    <svg
      viewBox={horizontal ? "0 0 200 40" : "0 0 40 200"}
      className={`${styles.pipe} ${className || ""}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <filter id="pipeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="var(--ink)" />
        </filter>
      </defs>
      <g filter="url(#pipeShadow)">
        {horizontal ? (
          <>
            <rect x="0" y="8" width="200" height="24" rx="4" fill="var(--verveine)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="12" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="180" cy="20" r="12" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.5" />
          </>
        ) : (
          <>
            <rect x="8" y="0" width="24" height="200" rx="4" fill="var(--verveine)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="20" cy="20" r="12" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="20" cy="180" r="12" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.5" />
          </>
        )}
      </g>
    </svg>
  );
}