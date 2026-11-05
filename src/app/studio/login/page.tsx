import { Section } from "@/components/ui";
import { LoginForm } from "./LoginForm";
import styles from "../studio.module.css";

type LoginPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function StudioLoginPage({ searchParams }: LoginPageProps) {
  const { reason } = await searchParams;

  return (
    <Section background="brume" space="lg" containerSize="narrow">
      <p className={styles.brand}>Studio</p>
      <h1 style={{ marginBlock: "var(--space-md)" }}>Masuk sebagai pemilik</h1>
      <p style={{ marginBlockEnd: "var(--space-lg)", maxWidth: "46ch" }}>
        Masuk dengan email dan kata sandi admin.
      </p>
      {reason === "forbidden" ? (
        <p className={styles.note} style={{ marginBlockEnd: "var(--space-md)" }}>
          Akses ditolak.
        </p>
      ) : null}
      {reason === "unconfigured" ? (
        <p className={styles.note} style={{ marginBlockEnd: "var(--space-md)" }}>
          Supabase belum siap.
        </p>
      ) : null}
      <LoginForm />
    </Section>
  );
}