# Prompt Layout Homepage Ngantuqan

Cara pakai:
1. `/new` di OpenCode, pilih model paling kuat yang ada, mode **Plan** (Tab).
2. Salin blok "PROMPT" di bawah, kirim. Baca rencananya, baru pindah ke **Build**.
3. Di Build kirim: `Kerjakan Tahap A, satu section per giliran. Berhenti dan laporkan setelah tiap section.`
4. Uji tiap section di browser sebelum lanjut. Tahap B dan C hanya setelah A terbukti jalan di Cloudflare preview.

---

## PROMPT (salin semua di bawah garis ini)

Bangun ulang layout halaman utama (route `/`) Ngantuqan. Baca dulu AGENTS.md dan ikuti semua aturannya. Halaman `/` saat ini crash di Cloudflare Workers, jadi halaman ini dibuat ULANG dari komponen sederhana dan tidak memakai jalur Puck. Jangan mengubah /studio, auth, atau database di tugas ini. Jangan membaca atau menampilkan isi .env.local.

### 1. Gaya visual (referensi gaya saja)
Referensinya halaman kampanye ilustrasi yang playful: warna datar pekat, garis tepi tebal, bayangan keras (hard shadow), ilustrasi karakter dan mesin kartun, pita teks berjalan (marquee), tab berbentuk pil, dan tiap section punya warna latar berbeda. Jangan menyalin ilustrasi, logo, atau teks dari referensi. Semua ilustrasi dibuat sendiri dari bentuk SVG sederhana.

Aturan gaya (wajib):
- Warna hanya dari token di tokens.css: brume #C2F2E4, menthe #35C8B4, limonade #EDF7BE, verveine #A4CF4A, ink #0C3B35, paper #FFFFFF, pop #FF6B6B. Tidak ada warna lain.
- Teks di atas brume/menthe/limonade/verveine selalu `--ink`. Teks di atas `--ink` memakai `--paper`.
- Semua kartu dan tombol: `border: 2.5px solid var(--ink)`, radius besar, `box-shadow: 4px 4px 0 var(--ink)`.
- Font: sudah ada di project (display tebal untuk judul, DM Sans untuk isi). Jangan menambah font baru.
- Pakai CSS Modules. Tanpa Tailwind dan tanpa library UI.

### 2. Susunan section dari atas ke bawah (semua teks Bahasa Indonesia, isi dummy dulu)

1. **Hero** (latar menthe)
   - Kiri: kotak judul berbingkai tebal berisi "Ngantuqan", subjudul satu kalimat, dua tombol: "Lihat Karya" (ke /myproject) dan "Ke Toko" (ke /shop, tidak dirender bila shop mati).
   - Kanan: kumpulan ilustrasi SVG buatan sendiri (mesin kapsul lucu dari kotak, lingkaran, pipa, dan bintang), beberapa elemen melayang pelan.
   - Garis kecil di bawah subjudul berisi tulisan seperti "Portofolio & toko karya".

2. **Pita navigasi** (latar brume): deretan tab berbentuk pil (Home, Karya, Toko, Tentang, Kontak), tab aktif berwarna limonade, di kedua ujung ada teks marquee "Ngantuqan" berulang. Tab "Toko" hilang bila shop mati (pakai helper getPublicNav yang sudah ada, jangan menduplikasi logika). Ini bisa memakai Header yang sudah ada kalau sudah sesuai, jangan membuat header ganda.

3. **Tentang** (latar limonade)
   - Di tengah: kartu "konsol": bingkai dengan sudut atas membulat, layar bagian dalam berisi 3 sampai 5 baris teks pendek rata tengah, alas di bawahnya berwarna pop dengan dua tombol panah kecil dan satu tombol bulat "Go" (dekoratif, tautkan ke /about).
   - Samping kiri: sepasang mata kartun SVG yang berkedip pelan. Samping kiri dan kanan tepi layar: awan putih bergaris tebal.

4. **Pita pemisah** (latar verveine): satu baris marquee, di tengahnya label pil "Karya Terbaru" dengan panah di kiri dan kanan.

5. **Karya Terbaru** (latar brume)
   - Label kecil berbingkai di atas ("KARYA" dengan dua segitiga kecil).
   - Empat kartu "kapsul": bentuk kubah di atas alas berwarna, gambar karya di dalam kubah, lencana nomor bulat di sudut, judul di bawah, pil kecil untuk kategori. Dummy: 4 kartu dengan gambar placeholder SVG.
   - Tombol "Lihat semua karya".

6. **Pita pemisah** (latar menthe): label "Produk".

7. **Produk** (latar limonade): grid 3 kolom kartu produk (gambar, nama, harga format `Rp 85.000`, tombol order). Seluruh section dan pita pemisahnya TIDAK dirender bila shop mati. Tombol order memakai helper getOrderAction bila sudah ada, kalau belum ada tampilkan tombol dummy tanpa nomor telepon yang tertulis di kode.

8. **Cara Kerja** (latar verveine)
   - Tiga kartu berurutan dihubungkan sebuah pipa horizontal: "1 Ngobrol", "2 Desain", "3 Jadi". Tiap kartu punya header kecil, ikon SVG sederhana, dan satu kalimat. Di HP kartu bertumpuk ke bawah dengan pipa vertikal.
   - Dekorasi: karakter kartun mengintip dari kiri, panci beruap dari kanan (SVG sederhana, beruap = lingkaran putih naik pelan).

9. **Hubungi Kami** (latar pop sebagai aksen, teks ink; atau brume bila kontras kurang)
   - Kartu konsol berisi form: Nama, Email, Pesan, dan tombol bulat "Go" untuk kirim.
   - Tahap ini HANYA tampilannya. Pengiriman email (Resend) dikerjakan di tugas lain. Form harus tampil tanpa error dan tombol kirim menampilkan pesan "Segera hadir" tanpa memanggil API apa pun.

10. **Footer**: pita marquee terakhir, tautan sosial dummy, hak cipta.

### 3. Aturan teknis (wajib, karena sebelumnya sering error)
- Server Component secara default. "use client" hanya untuk bagian yang benar-benar interaktif (misalnya form). Jangan mengoper fungsi, class, atau objek non-biasa dari server ke client component. Props hanya string, angka, boolean, atau array/objek biasa.
- Dilarang memakai jsdom, dompurify, `node:vm`, atau API Node apa pun. Runtime-nya Cloudflare Workers.
- Marquee dan animasi memakai CSS murni (keyframes), tanpa JavaScript. Animasi `float` (naik turun pelan) dan `marquee` dibungkus `@media (prefers-reduced-motion: no-preference)`. Dekorasi memakai `aria-hidden="true"`.
- Ilustrasi berupa komponen SVG inline di `src/components/art/` (awan, mata, bintang, kapsul, pipa, panci beruap, karakter). Tanpa gambar eksternal, tanpa file besar. Gambar karya dan produk memakai placeholder SVG lokal di `public/placeholders/` dengan `alt`, `width`, dan `height`.
- Satu file satu komponen, maksimal sekitar 120 baris per file. Tulis file satu per satu, JANGAN menulis seluruh halaman dalam satu file besar atau satu keluaran panjang.
- Setiap section menerima props sederhana (judul, teks, array item) supaya nanti bisa diisi dari data database. Untuk sekarang data berupa konstanta di `src/content/home.ts`.
- Responsif: lebar maksimum 1280 px, `clamp()` untuk ukuran teks, di bawah 768 px semua jadi satu kolom, awan dan dekorasi besar disembunyikan atau diperkecil. Tidak boleh ada scroll horizontal di body (marquee overflow disembunyikan di dalam pitanya).
- Aksesibilitas: fokus keyboard terlihat, kontras AA, hanya satu `h1`.

### 4. Tahapan
- **Tahap A (sekarang):** seluruh layout dengan konten dummy dan data statis dari `src/content/home.ts`. Tanpa Supabase, tanpa Puck. Kerjakan SATU section per giliran sesuai urutan di atas, dan berhenti setelah tiap section.
- **Tahap B (nanti, setelah A lolos uji):** hubungkan Karya Terbaru dan Produk ke tabel `items` (hanya yang `is_published`, produk mengikuti `isShopEnabled()`), dengan fallback bila data kosong.
- **Tahap C (nanti):** teks utama bisa diubah dari /studio.

### 5. Bukti yang wajib disertakan (jangan klaim selesai tanpa ini)
Untuk setiap section: file yang dibuat atau diubah, hasil `npm run build` (dan typecheck/lint), lalu langkah uji di browser. Setelah semua section Tahap A: jalankan preview runtime Cloudflare (`opennextjs-cloudflare preview` atau script yang sudah ada), buka `/`, dan laporkan status HTTP serta apakah ada error di terminal. Kalau ada bagian yang belum berfungsi, katakan terus terang.

Jangan ubah file dulu pada langkah Plan. Jelaskan struktur folder komponen, daftar section, dan urutan file yang akan dibuat, lalu tunggu persetujuan.
