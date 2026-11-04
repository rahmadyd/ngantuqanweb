"use client";

import styles from "./PuckBlocks.module.css";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

interface TimelineBlockProps {
  events: TimelineEvent[];
}

export function TimelineBlock({ events }: TimelineBlockProps) {
  if (!events.length) {
    return (
      <section className={styles.timeline}>
        <p style={{ textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
          Belum ada event.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.timeline}>
      <ol className={styles.list}>
        {events.map((event, idx) => (
          <li key={idx} className={styles.item}>
            <div className={styles.marker} />
            <div className={styles.content}>
              <time className={styles.date} dateTime={event.date}>{event.date}</time>
              <h3 className={styles.title}>{event.title}</h3>
              {event.description && <p className={styles.description}>{event.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}