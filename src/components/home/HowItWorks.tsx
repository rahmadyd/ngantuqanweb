"use client";

import { Container } from "@/components/ui";
import { Pipe, Character, SteamingPot } from "@/components/art";
import styles from "./HowItWorks.module.css";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: "chat" | "design" | "done";
}

interface HowItWorksProps {
  steps: Step[];
}

export function HowItWorks({ steps }: HowItWorksProps) {
  const renderIcon = (icon: Step["icon"]) => {
    switch (icon) {
      case "chat":
        return (
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" className={styles.icon}>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="var(--ink)" />
          </svg>
        );
      case "design":
        return (
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" className={styles.icon}>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V9h10v2zM8 7h2v2H8V7zm0 4h2v2H8v-2zM8 15h2v2H8v-2z" fill="var(--ink)" />
          </svg>
        );
      case "done":
        return (
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" className={styles.icon}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="var(--ink)" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className={styles.section} aria-labelledby="how-it-works-title">
      <Container className={styles.container}>
        <div className={styles.decorLeft} aria-hidden="true">
          <Character peek="left" className={styles.character} />
        </div>
        <div className={styles.decorRight} aria-hidden="true">
          <SteamingPot className={styles.pot} />
        </div>
        <div className={styles.content}>
          <h2 id="how-it-works-title" className={styles.title}>
            Cara Kerja
          </h2>
          <div className={styles.horizontalLayout} role="list">
            <Pipe horizontal className={styles.pipe} />
            {steps.map((step, index) => (
              <div key={step.number} className={styles.stepWrapper} role="listitem">
                <article className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                  </div>
                  <div className={styles.iconWrapper}>
                    {renderIcon(step.icon)}
                  </div>
                  <p className={styles.stepDesc}>{step.description}</p>
                </article>
                {index < steps.length - 1 && <Pipe horizontal className={styles.pipe} />}
              </div>
            ))}
          </div>
          <div className={styles.verticalLayout} role="list">
            {steps.map((step) => (
              <div key={step.number} className={styles.stepWrapperVertical} role="listitem">
                <Pipe className={styles.pipeVertical} />
                <article className={styles.stepCardVertical}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                  </div>
                  <div className={styles.iconWrapper}>
                    {renderIcon(step.icon)}
                  </div>
                  <p className={styles.stepDesc}>{step.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}