import type { CSSProperties } from "react";
import { bgColor, type ColorToken } from "./tokens";
import styles from "./Marquee.module.css";

export type MarqueeProps = {
  items: string[];
  direction?: "left" | "right";
  /** Durasi satu putaran penuh dalam detik. Semakin besar semakin lambat. */
  speed?: number;
  background?: ColorToken;
  /** Pemisah antar teks. */
  separator?: string;
  className?: string;
};

export function Marquee({
  items,
  direction = "left",
  speed = 24,
  background = "menthe",
  separator = "★",
  className,
}: MarqueeProps) {
  const classes = [styles.marquee, className].filter(Boolean).join(" ");

  const trackStyle = {
    "--marquee-duration": `${speed}s`,
    "--marquee-direction": direction === "right" ? "reverse" : "normal",
  } as CSSProperties;

  const group = (
    <div className={styles.group}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className={styles.item}>
          {item}
          <span className={styles.separator} aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={classes} style={{ backgroundColor: bgColor(background) }}>
      <div className={styles.track} style={trackStyle}>
        {group}
        <div className={styles.group} aria-hidden="true">
          {items.map((item, index) => (
            <span key={`dup-${item}-${index}`} className={styles.item}>
              {item}
              <span className={styles.separator} aria-hidden="true">
                {separator}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
