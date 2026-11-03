import { Badge } from "@/components/ui";
import { getSettings } from "@/lib/settings";
import { ComingSoon } from "../coming-soon";
import styles from "../studio.module.css";

export default async function StudioSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <Badge color={settings.shop_enabled ? "verveine" : "pop"}>
        Shop {settings.shop_enabled ? "nyala" : "mati"}
      </Badge>
      <dl className={styles.note} style={{ marginBlock: "var(--space-md)" }}>
        <div>
          <dt>Judul</dt>
          <dd>{settings.site_title}</dd>
        </div>
        <div>
          <dt>WhatsApp</dt>
          <dd>{settings.wa_number}</dd>
        </div>
      </dl>
      <ComingSoon title="Pengaturan" phase="Fase 5 (toggle shop)" />
    </div>
  );
}
