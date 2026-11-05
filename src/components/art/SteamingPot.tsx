"use client";

import { useState, useEffect } from "react";
import styles from "./SteamingPot.module.css";

export function SteamingPot({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  const [steamOffset, setSteamOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamOffset((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 80 100"
      className={`${styles.pot} ${className || ""}`}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <filter id="potShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="var(--ink)" />
        </filter>
      </defs>
      <g filter="url(#potShadow)">
        {/* Pot body */}
        <path
          d="M15 90 Q15 70 25 60 L55 60 Q65 70 65 90 Z"
          fill="var(--brume)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />
        {/* Pot handle */}
        <path
          d="M65 70 Q75 60 75 50 Q75 40 65 30"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Lid */}
        <path
          d="M15 60 Q25 50 40 50 Q55 50 65 60"
          fill="var(--menthe)"
          stroke="var(--ink)"
          strokeWidth="2.5"
        />
        <circle cx="40" cy="50" r="8" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Steam bubbles */}
        {[0, 1, 2].map((i) => (
          <g key={i} style={{ opacity: (steamOffset + i) % 3 === 0 ? 1 : 0.3, transition: "opacity 0.8s" }}>
            <circle
              cx={35 + i * 8}
              cy={35 - (steamOffset * 10) % 30}
              r={6 - (steamOffset % 3) * 1.5}
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <circle
              cx={45 + i * 8}
              cy={25 - (steamOffset * 10) % 30}
              r={4 - (steamOffset % 3) * 1}
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}