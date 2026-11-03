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
        Isi email yang sudah di-allowlist. Kami kirim magic link — tidak ada kata sandi.
      </p>
      {reason === "forbidden" ? (
        <p className={styles.note} style={{ marginBlockEnd: "var(--space-md)" }}>
          Email itu tidak ada di daftar admin.
        </p>
      ) : null}
      {reason === "unconfigured" ? (
        <p className={styles.note} style={{ marginBlockEnd: "var(--space-md)" }}>
          Supabase belum siap. Isi <code>.env.local</code> lalu jalankan ulang.
        </p>
      ) : null}
      <LoginForm />
    </Section>
  );
}
