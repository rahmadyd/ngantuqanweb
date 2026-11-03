import { Button } from "@/components/ui";

export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <p style={{ marginBlock: "var(--space-md)", maxWidth: "46ch" }}>
        Bagian ini menyusul di {phase}. Fondasi data dan login sudah siap.
      </p>
      <Button href="/studio" variant="secondary">
        Kembali ke dashboard
      </Button>
    </div>
  );
}
