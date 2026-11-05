"use client";

import styles from "./Cloud.module.css";

export function Cloud({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={`${styles.cloud} ${className || ""}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="var(--ink)" />
        </filter>
      </defs>
      <g filter="url(#cloudShadow)">
        <ellipse cx="40" cy="50" rx="35" ry="25" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        <ellipse cx="85" cy="35" rx="40" ry="30" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        <ellipse cx="135" cy="45" rx="35" ry="25" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
        <ellipse cx="170" cy="55" rx="25" ry="20" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}