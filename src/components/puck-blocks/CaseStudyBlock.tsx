"use client";

import styles from "./PuckBlocks.module.css";

interface CaseStudyBlockProps {
  title: string;
  client: string;
  project: string;
  outcome: string;
  imageUrl: string;
}

export function CaseStudyBlock({ title, client, project, outcome, imageUrl }: CaseStudyBlockProps) {
  return (
    <section className={styles.caseStudy}>
      <div className={styles.container}>
        {imageUrl && (
          <div className={styles.imageWrapper}>
            <img src={imageUrl} alt={title} className={styles.image} width={800} height={500} />
          </div>
        )}
        <div className={styles.content}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <div className={styles.meta}>
            {client && <p className={styles.metaItem}><strong>Klien:</strong> {client}</p>}
            {project && <p className={styles.metaItem}><strong>Proyek:</strong> {project}</p>}
          </div>
          {outcome && (
            <div className={styles.outcome}>
              <h3 className={styles.outcomeTitle}>Hasil</h3>
              <p className={styles.outcomeText}>{outcome}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}