import { Badge, Button, Card } from "@/components/ui";
import { getSettings } from "@/lib/settings";
import styles from "./studio.module.css";

const shortcuts = [
  { href: "/studio/pages", title: "Halaman", body: "Daftar halaman dan editor drag-drop." },
  { href: "/studio/items", title: "Karya", body: "Project dan produk." },
  { href: "/studio/media", title: "Media", body: "Pustaka gambar." },
  { href: "/studio/messages", title: "Pesan", body: "Masukan dari form kontak." },
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
      <Button href="/" variant="secondary">
        Lihat situs publik
      </Button>
    </>
  );
}
