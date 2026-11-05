import { Badge, Button, Card } from "@/components/ui";
import { getSettings } from "@/lib/settings";
import { signOut } from "./actions";
import styles from "./studio.module.css";

export const dynamic = "force-dynamic";

const shortcuts = [
  { href: "/studio/pages", title: "Halaman", body: "Daftar halaman dan editor drag-drop." },
  { href: "/studio/items", title: "Karya", body: "Project dan produk." },
  { href: "/studio/media", title: "Media", body: "Pustaka gambar." },
  { href: "/studio/messages", label: "Pesan", body: "Masukan dari form kontak." },
  { href: "/studio/settings", title: "Pengaturan", body: "Toggle shop, WA, judul situs." },
];

export default async function StudioDashboardPage() {
  const settings = await getSettings();

  return (
    <>
      <div>
        <Badge color={settings.shop_enabled ? "verveine" : "pop"}>
          Shop {settings.shop_enabled ? "nyala" : "mati"}
        </Badge>
        <h1 style={{ marginBlockStart: "var(--space-sm)" }}>Dashboard</h1>
        <p className={styles.status} style={{ marginBlockStart: "var(--space-sm)" }}>
          <span
            className={`${styles.dot} ${settings.shop_enabled ? styles.on : styles.off}`}
            aria-hidden
          />
          Halaman jualan {settings.shop_enabled ? "tampil di situs" : "disembunyikan"}.
        </p>
      </div>
      <div className={styles.grid}>
        {shortcuts.map((item) => (
          <Card key={item.href} href={item.href} color="paper">
            <div className={styles.cardLink}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginBlockStart: "var(--space-lg)", paddingBlock: "var(--space-xl)" }}>
        <div style={{ display: "flex", gap: "var(--space-md)" }}>
          <Button href="/" variant="secondary">
            Kembali ke situs publik
          </Button>
          <form action={signOut} style={{ display: "inline" }}>
            <Button type="submit" variant="secondary">
              Keluar
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
