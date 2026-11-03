import {
  Badge,
  Button,
  Card,
  Container,
  Marquee,
  Pill,
  Section,
  Sticker,
} from "@/components/ui";
import { isShopEnabled } from "@/lib/settings";

const tokens = ["brume", "menthe", "limonade", "verveine", "pop"] as const;

export default async function Home() {
  const shopEnabled = await isShopEnabled();

  return (
    <main>
      <Marquee
        items={["Ngantuqan", "Ilustrasi", "Project", "Merch", "Sticker"]}
        background="menthe"
      />

      <Section background="brume" space="lg">
        <Container>
          <div
            style={{
              position: "relative",
              display: "grid",
              gap: "var(--space-lg)",
              justifyItems: "start",
            }}
          >
            <Sticker top="-8px" right="4%" rotate={8} size="md" color="limonade">
              new!
            </Sticker>
            <Pill color="paper" size="sm">
              Fase 2 · Data &amp; auth
            </Pill>
            <h1>Portofolio dan toko yang berisik, tapi rapi.</h1>
            <p style={{ maxWidth: "56ch", fontSize: "1.125rem" }}>
              Design system sudah aktif. Login Studio, allowlist admin, dan pengaturan situs
              mulai tersambung.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
              <Button href="/myproject" variant="primary" size="lg">
                Lihat Project
              </Button>
              {shopEnabled ? (
                <Button href="/shop" variant="secondary" size="lg">
                  Buka Shop
                </Button>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section background="paper" space="md">
        <h2>Tombol</h2>
        <p style={{ marginBlockEnd: "var(--space-md)" }}>
          Varian primary, secondary, dan pop. Ukuran S / M / L.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-md)",
            marginBlockEnd: "var(--space-md)",
          }}
        >
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="pop">Pop</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-md)",
          }}
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section background="limonade" space="md">
        <h2>Pill, Badge, Sticker</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "var(--space-md)",
            marginBlockStart: "var(--space-md)",
          }}
        >
          <Pill color="paper">Pill paper</Pill>
          <Pill color="brume">Pill brume</Pill>
          <Pill color="verveine">Pill verveine</Pill>
          <Badge color="pop">New</Badge>
          <Badge color="verveine" rotate={-4}>
            Habis
          </Badge>
          <Badge color="menthe">Terbatas</Badge>
        </div>
      </Section>

      <Section background="verveine" space="md">
        <h2>Kartu</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-lg)",
            marginBlockStart: "var(--space-md)",
          }}
        >
          <Card color="paper">
            <Badge>Project</Badge>
            <h3 style={{ marginBlockStart: "var(--space-sm)" }}>Judul Karya</h3>
            <p>Kartu dengan hard shadow dan border tebal.</p>
          </Card>
          <Card color="brume" padding="lg">
            <Badge color="verveine">Padding L</Badge>
            <h3 style={{ marginBlockStart: "var(--space-sm)" }}>Kartu Brume</h3>
            <p>Warna permukaan tetap berasal dari token desain.</p>
          </Card>
          <Card color="limonade" href="/myproject">
            <Badge color="pop">Klik</Badge>
            <h3 style={{ marginBlockStart: "var(--space-sm)" }}>Kartu Tautan</h3>
            <p>Seluruh kartu bisa menjadi tautan.</p>
          </Card>
        </div>
      </Section>

      <Section background="ink" space="md">
        <h2 style={{ color: "var(--limonade)" }}>Token warna</h2>
        <p style={{ color: "var(--brume)", marginBlockEnd: "var(--space-md)" }}>
          Hanya lima token palet yang boleh dipakai block.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "var(--space-md)",
          }}
        >
          {tokens.map((token) => (
            <div
              key={token}
              style={{
                border: "var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: `var(--${token})`,
                color: "var(--ink)",
                padding: "var(--space-md)",
                fontFamily: "var(--font-display)",
              }}
            >
              {token}
            </div>
          ))}
        </div>
      </Section>

      <Marquee
        items={["Ngantuqan", "Cek lagi nanti", "Fun fun fun"]}
        background="pop"
        direction="right"
        speed={30}
      />
    </main>
  );
}
