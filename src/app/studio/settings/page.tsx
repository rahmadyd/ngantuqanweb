"use client";

import { useState, useEffect } from "react";
import styles from "../studio.module.css";

export const dynamic = "force-dynamic";

export default function StudioSettingsPage() {
  const [shopEnabled, setShopEnabled] = useState(false);
  const [settings, setSettings] = useState({
    shop_enabled: false,
    site_title: "",
    wa_number: "",
    order_button_label: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
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

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <span className={styles.badge} style={{ background: shopEnabled ? "var(--verveine)" : "var(--pop)" }}>
          Shop {shopEnabled ? "nyala" : "mati"}
        </span>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <input
            type="checkbox"
            checked={shopEnabled}
            onChange={handleToggle}
            disabled={saving}
          />
          <span>Nyalakan Toko</span>
        </label>
      </div>

      <div style={{ marginBlock: "var(--space-lg)" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "var(--space-md)", color: "var(--ink)" }}>Pengaturan Situs</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-md)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.875rem" }}>Judul Situs</label>
            <input
              name="site_title"
              value={settings.site_title}
              onChange={handleInputChange}
              style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.875rem" }}>Nomor WhatsApp</label>
            <input
              name="wa_number"
              type="tel"
              value={settings.wa_number}
              onChange={handleInputChange}
              placeholder="628xxxxxxxxxx"
              style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.7 }}>Tanpa +62 atau 0, contoh: 6281234567890</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.875rem" }}>Label Tombol Order Default</label>
            <input
              name="order_button_label"
              value={settings.order_button_label}
              onChange={handleInputChange}
              style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem" }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--ink)", opacity: 0.7 }}>Digunakan saat item.order_label kosong</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <label style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.875rem" }}>Pesan Toko Tutup</label>
            <textarea
              name="shop_closed_message"
              value={settings.shop_closed_message}
              onChange={handleInputChange}
              rows={3}
              style={{ padding: "var(--space-sm) var(--space-md)", border: "2.5px solid var(--ink)", borderRadius: "var(--radius-md)", background: "var(--paper)", color: "var(--ink)", fontFamily: "inherit", fontSize: "1rem", resize: "vertical" }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-xl)", display: "flex", gap: "var(--space-md)" }}>
        <button
          onClick={handleToggle}
          disabled={saving}
          style={{
            padding: "var(--space-md) var(--space-xl)",
            background: shopEnabled ? "var(--pop)" : "var(--verveine)",
            color: "var(--paper)",
            border: "2.5px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "2px 2px 0 var(--ink)" : "4px 4px 0 var(--ink)",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Menyimpan..." : shopEnabled ? "Matikan Toko" : "Nyalakan Toko"}
        </button>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          style={{
            padding: "var(--space-md) var(--space-xl)",
            background: "var(--ink)",
            color: "var(--paper)",
            border: "2.5px solid var(--ink)",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "2px 2px 0 var(--ink)" : "4px 4px 0 var(--ink)",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Semua Setting"}
        </button>
      </div>

      <p style={{ marginBlock: "var(--space-md)", fontSize: "0.875rem" }}>Perubahan akan terlihat di publik tanpa redeploy.</p>
    </div>
  );
}