import { Button, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <main>
      <Section background="limonade" space="lg">
        <p style={{ fontFamily: "var(--font-display)", fontSize: "4rem", lineHeight: 1 }}>404</p>
        <h1 style={{ marginBlock: "var(--space-md)" }}>Halaman ini nyasar.</h1>
        <p style={{ maxWidth: "42ch", marginBlockEnd: "var(--space-lg)" }}>
          Mungkin toko sedang tutup, atau tautannya sudah pindah rumah.
        </p>
        <Button href="/" variant="primary">
          Pulang ke home
        </Button>
      </Section>
    </main>
  );
}
