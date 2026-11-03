import type { Metadata } from "next";
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
import styles from "./design.module.css";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const palette = [
  { token: "brume", value: "#C2F2E4" },
  { token: "menthe", value: "#35C8B4" },
  { token: "limonade", value: "#EDF7BE" },
  { token: "verveine", value: "#A4CF4A" },
  { token: "ink", value: "#0C3B35" },
  { token: "paper", value: "#FFFFFF" },
  { token: "pop", value: "#FF6B6B" },
] as const;

export default function DesignPage() {
  return (
    <main>
      <Marquee
        items={["Design system", "Ngantuqan", "Fun", "Rapi"]}
        background="menthe"
      />

      <Section background="brume" space="lg">
        <div className={styles.hero}>
          <Pill color="limonade" size="sm">
            Halaman demo · sementara
          </Pill>
          <h1>Fondasi visual Ngantuqan.</h1>
          <p className={styles.lead}>
            Semua komponen dasar memakai token warna, border tebal, radius besar, dan hard
            shadow. Halaman ini dipakai untuk menguji tampilan sebelum masuk ke konten asli.
          </p>
          <div className={styles.row}>
            <Button variant="primary" size="lg">
              Primary
            </Button>
            <Button variant="secondary" size="lg">
              Secondary
            </Button>
            <Button variant="pop" size="lg">
              Pop
            </Button>
          </div>
        </div>
      </Section>

      <Section background="paper" space="md">
        <h2 className={styles.sectionHeading}>Token warna</h2>
        <p className={styles.caption}>
          Teks di atas brume, menthe, limonade, dan verveine selalu memakai <code>--ink</code>.
        </p>
        <div className={styles.swatches}>
          {palette.map(({ token, value }) => (
            <div
              key={token}
              className={styles.swatch}
              style={{ backgroundColor: `var(--${token})` }}
            >
              <span className={styles.swatchName}>{token}</span>
              <span className={styles.swatchValue}>{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section background="limonade" space="md">
        <h2 className={styles.sectionHeading}>Tipografi</h2>
        <div className={styles.stack}>
          <h1>Display — Bagel Fat One</h1>
          <h2>Heading dua</h2>
          <h3>Heading tiga</h3>
          <p>
            Body — DM Sans. Paragraf ini menunjukkan ukuran teks dasar, jarak baris, dan
            warna ink agar nyaman dibaca di layar kecil maupun besar.
          </p>
        </div>
      </Section>

      <Section background="paper" space="md">
        <h2 className={styles.sectionHeading}>Button</h2>
        <p className={styles.caption}>Tiga varian dan tiga ukuran, plus keadaan nonaktif.</p>
        <div className={styles.row}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="pop">Pop</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button variant="pop" size="lg" href="/design">
            Tautan
          </Button>
        </div>
      </Section>

      <Section background="brume" space="md">
        <h2 className={styles.sectionHeading}>Pill &amp; Badge</h2>
        <div className={styles.row}>
          <Pill color="paper">Pill paper</Pill>
          <Pill color="limonade">Pill limonade</Pill>
          <Pill color="verveine" size="sm">
            Pill kecil
          </Pill>
          <Badge color="pop">New</Badge>
          <Badge color="verveine" rotate={-4}>
            Habis
          </Badge>
          <Badge color="menthe" rotate={3}>
            Terbatas
          </Badge>
        </div>
      </Section>

      <Section background="verveine" space="md">
        <h2 className={styles.sectionHeading}>Card</h2>
        <div className={styles.grid}>
          <Card color="paper">
            <Badge>Project</Badge>
            <h3 style={{ marginBlockStart: "var(--space-sm)" }}>Kartu dasar</h3>
            <p>Border tebal, radius besar, dan hard shadow.</p>
          </Card>
          <Card color="limonade" padding="lg">
            <Badge color="verveine">Padding L</Badge>
            <h3 style={{ marginBlockStart: "var(--space-sm)" }}>Kartu lega</h3>
            <p>Padding besar untuk konten yang butuh napas.</p>
          </Card>
          <Card color="menthe" href="/myproject">
            <Badge color="pop">Klik</Badge>
            <h3 style={{ marginBlockStart: "var(--space-sm)" }}>Kartu tautan</h3>
            <p>Seluruh permukaan kartu menjadi tautan.</p>
          </Card>
        </div>
      </Section>

      <Section background="paper" space="md">
        <h2 className={styles.sectionHeading}>Sticker</h2>
        <p className={styles.caption}>
          Elemen dekoratif, selalu <code>aria-hidden</code>, dengan rotasi kecil.
        </p>
        <div className={styles.stickerStage}>
          <Sticker top="-14px" left="24px" rotate={-8} color="pop" size="md">
            wow!
          </Sticker>
          <Sticker top="28px" right="32px" rotate={7} color="limonade" size="lg">
            baru
          </Sticker>
          <Sticker bottom="-16px" left="45%" rotate={-3} color="menthe" size="sm">
            keren
          </Sticker>
          <p>Area contoh penempatan sticker bertumpuk di atas konten.</p>
        </div>
      </Section>

      <Section background="paper" space="md">
        <h2 className={styles.sectionHeading}>Token bentuk</h2>
        <dl className={styles.tokens}>
          <div className={styles.token}>
            <dt>Radius</dt>
            <dd>12 / 20 / 32 / pill</dd>
          </div>
          <div className={styles.token}>
            <dt>Border</dt>
            <dd>2.5px solid ink</dd>
          </div>
          <div className={styles.token}>
            <dt>Hard shadow</dt>
            <dd>4px 4px 0 ink</dd>
          </div>
          <div className={styles.token}>
            <dt>Max width</dt>
            <dd>1280px</dd>
          </div>
          <div className={styles.token}>
            <dt>Header</dt>
            <dd>72px</dd>
          </div>
          <div className={styles.token}>
            <dt>Fokus</dt>
            <dd>outline pop + offset</dd>
          </div>
        </dl>
      </Section>

      <Section background="ink" space="md">
        <Container>
          <h2 style={{ color: "var(--limonade)" }}>Cek keyboard</h2>
          <p style={{ color: "var(--brume)", marginBlock: "var(--space-sm) 0" }}>
            Tekan Tab untuk memastikan outline fokus terlihat jelas di semua elemen interaktif.
          </p>
          <div className={styles.row} style={{ marginBlockStart: "var(--space-md)" }}>
            <Button variant="primary">Fokus saya</Button>
            <Button variant="secondary" href="/design">
              Atau saya
            </Button>
          </div>
        </Container>
      </Section>

      <Marquee
        items={["Fondasi selesai", "Lanjut konten", "Ngantuqan"]}
        background="pop"
        direction="right"
        speed={28}
      />
    </main>
  );
}
