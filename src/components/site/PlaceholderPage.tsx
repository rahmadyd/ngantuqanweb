import { Button, Pill, Section } from "@/components/ui";

export function PlaceholderPage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <main>
      <Section background="brume" space="lg">
        <Pill color="paper" size="sm">
          Menyusul
        </Pill>
        <h1 style={{ marginBlock: "var(--space-md)" }}>{title}</h1>
        <p style={{ maxWidth: "46ch", marginBlockEnd: "var(--space-lg)" }}>{body}</p>
        <Button href="/" variant="secondary">
          Kembali ke home
        </Button>
      </Section>
    </main>
  );
}
