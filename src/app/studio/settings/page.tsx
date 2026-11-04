"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import styles from "../studio.module.css";

export default function StudioSettingsPage() {
  const [shopEnabled, setShopEnabled] = useState(false);
  const [settings, setSettings] = useState({
    shop_enabled: false,
    site_title: "",
    wa_number: "",
    shop_closed_message: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setShopEnabled(data.shop_enabled);
      }
    } catch (err) {
      console.error("Gagal memuat setting:", err);
    }
  };

  const handleToggle = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_enabled: !shopEnabled }),
      });
      if (res.ok) {
        setShopEnabled(!shopEnabled);
        alert("Settingan tersimpan");
        fetchSettings();
      } else {
        alert("Gagal menyimpan settingan");
      }
    } catch (err) {
      alert("Gagal menyimpan settingan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Badge color={shopEnabled ? "verveine" : "pop"}>Shop {shopEnabled ? "nyala" : "mati"}</Badge>
      <div style={{ marginBlock: "var(--space-md)" }}>
        <label>
          <input
            type="checkbox"
            checked={shopEnabled}
            onChange={handleToggle}
            disabled={saving}
            style={{ marginRight: "var(--space-sm)" }}
          />
          Nyalakan Toko
        </label>
        <label>
          <input
            type="checkbox"
            checked={!shopEnabled}
            onChange={handleToggle}
            disabled={saving}
            style={{ marginLeft: "var(--space-sm)" }}
          />
          Matikan Toko
        </label>
      </div>
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
      <p style={{ marginBlock: "var(--space-md)", fontSize: "0.875rem" }}>Perubahan akan terlihat di publik tanpa redeploy.</p>
    </div>
  );
}