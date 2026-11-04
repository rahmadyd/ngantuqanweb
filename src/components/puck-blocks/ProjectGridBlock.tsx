"use client";

import { useEffect, useState } from "react";
import styles from "./PuckBlocks.module.css";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

interface ProjectItem {
  slug: string;
  title: string;
  cover_image: string | null;
  sort_order: number;
}

interface ProjectGridBlockProps {
  quantity: "4" | "6" | "all";
  showFilter: boolean;
  showTab: boolean;
}

export function ProjectGridBlock({ quantity, showFilter, showTab }: ProjectGridBlockProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = createSupabaseBrowser();
        let query = supabase.from("items").select("*").eq("kind", "project").eq("is_published", true).order("sort_order");
        
        if (quantity !== "all") {
          query = query.limit(parseInt(quantity, 10));
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [quantity]);

  if (loading) {
    return <div className={styles.projectGrid}>Memuat proyek...</div>;
  }

  return (
    <section className={styles.projectGrid}>
      <div className={styles.header}>
        <h2 className={styles.title}>Proyek</h2>
      </div>
      <div className={styles.grid}>
        {projects.map(project => (
          <article key={project.slug} className={styles.projectCard}>
            {project.cover_image && (
              <img src={project.cover_image} alt={project.title} className={styles.image} width={400} height={250} />
            )}
            <div className={styles.content}>
              <h3 className={styles.title}>{project.title}</h3>
            </div>
          </article>
        ))}
        {projects.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--ink)", opacity: 0.6, padding: "var(--space-xl)" }}>
            Belum ada proyek.
          </p>
        )}
      </div>
    </section>
  );
}