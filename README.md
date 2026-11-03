# Ngantuqan

Portofolio visual + toko, dibangun ulang dari proyek lama Omeng Creation.
Next.js 15 (App Router) + TypeScript, deploy ke Cloudflare Workers via `@opennextjs/cloudflare`.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Dev server Next.js (Node runtime) |
| `npm run build` | Build Next.js biasa |
| `npm run typecheck` | Cek tipe tanpa emit |
| `npm run lint` | ESLint |
| `npm run preview` | Build + jalankan di runtime Workers secara lokal (wrangler) |
| `npm run deploy` | Build + deploy ke Cloudflare Workers |
| `npm run cf-typegen` | Generate `cloudflare-env.d.ts` dari binding wrangler |

## Struktur

```
src/
  app/                 # App Router (rute publik & /studio)
  components/ui/       # Komponen dasar: Button, Pill, Card, Sticker, Badge, Marquee, Section, Container
  styles/tokens.css    # Design tokens (satu-satunya sumber warna & ukuran)
next.config.ts         # Redirect 301 rute lama + images.unoptimized
open-next.config.ts    # Konfigurasi adapter Cloudflare (cache inkremental di R2)
wrangler.jsonc         # Worker, binding R2, aset statis
```

## Fase 2 — Supabase (data & auth)

1. Buat project di [Supabase](https://supabase.com).
2. Authentication → Providers → Email: aktifkan magic link. **Matikan** public sign-up.
3. Authentication → URL Configuration: tambahkan Redirect URL  
   `http://localhost:3000/auth/callback` dan `https://DOMAIN-KAMU/auth/callback`.
4. Authentication → Users → Invite/Add user dengan emailmu.
5. SQL Editor: jalankan isi `supabase/migrations/0001_init.sql`.
6. Salin `.env.example` ke `.env.local`. Isi URL, anon key, service role, dan `ADMIN_EMAILS` (email yang sama, bisa dipisah koma).

Masuk admin: buka `/studio` (disimpan sebagai bookmark), atau klik logo di navbar **5 kali dalam 2 detik**. Pengunjung tidak melihat tautan Studio.

## Environment

Salin `.env.example` menjadi `.env.local` lalu isi nilainya. Semua rahasia hanya dibaca di server.

| Variabel | Jenis | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key (dibatasi RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | secret | Hanya dipakai di server |
| `ADMIN_EMAILS` | secret | Email admin, dipisah koma |
| `NEXT_PUBLIC_SITE_URL` | public | `https://domainmu` |
| `REVALIDATE_SECRET` | secret | Token untuk preview / revalidate |
| `RESEND_API_KEY` | secret | Kirim email form kontak |
| `CONTACT_TO_EMAIL` | secret | Tujuan email form kontak |

## Deploy ke Cloudflare

1. Buat bucket cache inkremental sekali saja:

   ```bash
   npx wrangler r2 bucket create ngantuqanweb-inc-cache
   ```

2. Isi secrets di Cloudflare Dashboard (Workers & Pages → Setting → Variables) atau lewat CLI:

   ```bash
   npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
   ```

3. Deploy:

   ```bash
   npm run deploy
   ```

`NEXT_PUBLIC_*` di-inline saat build, jadi nilainya harus tersedia sebagai environment variable build.

## Catatan versi

- `next` dipin ke `15.5.28` karena `@opennextjs/cloudflare` mensyaratkan `>=15.5.28 <16`. Cek kompatibilitas sebelum menaikkan versi major Next.js.
- Optimasi gambar bawaan Next dimatikan (`images.unoptimized: true`); gambar dikompres ke WebP saat upload di admin.
