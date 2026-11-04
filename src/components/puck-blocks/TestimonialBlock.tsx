"use client";

import styles from "./PuckBlocks.module.css";

interface TestimonialBlockProps {
  name: string;
  role: string;
  text: string;
  company: string;
  rating: number;
}

export function TestimonialBlock({ name, role, text, company, rating }: TestimonialBlockProps) {
  const stars = "★".repeat(Math.max(1, Math.min(5, Math.round(rating))));

  return (
    <article className={styles.testimonial}>
      <div className={styles.rating} aria-label={`Rating ${rating} dari 5`}>
        {stars}
      </div>
      <blockquote className={styles.text}>
        &ldquo;{text}&rdquo;
      </blockquote>
      <footer className={styles.footer}>
        <cite className={styles.name}>{name}</cite>
        {role && <span className={styles.role}>{role}</span>}
        {company && <span className={styles.company}>{company}</span>}
      </footer>
    </article>
  );
}