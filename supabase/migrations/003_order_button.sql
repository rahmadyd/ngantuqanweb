-- Migrasi: order_label di items, order_button_label di site_settings, update RLS
-- File: supabase/migrations/003_order_button.sql
-- Idempoten: gunakan IF NOT EXISTS / ON CONFLICT DO NOTHING

-- 1. Tambah kolom order_label ke tabel items
ALTER TABLE items ADD COLUMN IF NOT EXISTS order_label text;

-- 2. Tambah site_settings key order_button_label (default "Beli sekarang")
INSERT INTO site_settings (key, value, updated_at)
VALUES ('order_button_label', '"Beli sekarang"'::jsonb, now())
ON CONFLICT (key) DO NOTHING;

-- 3. Update RLS policy: publik boleh baca order_button_label (tambah ke existing policy)
-- Policy site_settings_public_read_keys sudah ada, update untuk include order_button_label
DROP POLICY IF EXISTS site_settings_public_read_keys ON site_settings;

CREATE POLICY site_settings_public_read_keys ON site_settings
  FOR SELECT
  USING (key IN ('shop_enabled', 'wa_number', 'site_title', 'site_description', 'shop_closed_message', 'order_button_label'));

-- 4. Komentar dokumentasi
COMMENT ON COLUMN items.order_label IS 'Label custom untuk tombol order item ini (mis. "Beli via Shopee", "Pesan via WhatsApp")';
COMMENT ON TABLE site_settings IS 'key order_button_label: label default tombol order saat item.order_label kosong';