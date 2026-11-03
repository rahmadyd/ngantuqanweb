-- Skema awal Ngantuqan. Jalankan di SQL Editor Supabase (atau lewat CLI).
-- RLS aktif di semua tabel: publik hanya boleh membaca baris yang memang untuk publik.
-- Semua penulisan lewat server (service role) setelah sesi admin diverifikasi.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Halaman (layout hasil drag-drop)
-- ---------------------------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  seo_description text,
  og_image text,
  data jsonb not null default '{}'::jsonb,
  published_data jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Versi halaman (undo / riwayat)
-- ---------------------------------------------------------------------------
create table if not exists public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists page_versions_page_id_created_at_idx
  on public.page_versions (page_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Project dan produk
-- ---------------------------------------------------------------------------
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null check (kind in ('project', 'shop')),
  title text not null,
  summary text,
  body_md text,
  cover_image text,
  images text[] not null default '{}',
  tags text[] not null default '{}',
  role text,
  client text,
  year int,
  price_idr int,
  order_url text,
  live_url text,
  repo_url text,
  is_featured boolean not null default false,
  is_sold_out boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_kind_published_sort_idx
  on public.items (kind, is_published, sort_order);

-- ---------------------------------------------------------------------------
-- Pengaturan situs (key-value, nilai JSON)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Feedback / pesan masuk
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Trigger updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — tidak ada policy insert/update/delete untuk peran publik.
-- Service role melewati RLS.
-- ---------------------------------------------------------------------------
alter table public.pages enable row level security;
alter table public.page_versions enable row level security;
alter table public.items enable row level security;
alter table public.site_settings enable row level security;
alter table public.messages enable row level security;

drop policy if exists "pages_public_read_published" on public.pages;
create policy "pages_public_read_published"
  on public.pages
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "items_public_read_published" on public.items;
create policy "items_public_read_published"
  on public.items
  for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "site_settings_public_read_keys" on public.site_settings;
create policy "site_settings_public_read_keys"
  on public.site_settings
  for select
  to anon, authenticated
  using (
    key in (
      'shop_enabled',
      'wa_number',
      'site_title',
      'site_description',
      'shop_closed_message'
    )
  );

-- page_versions dan messages: tidak ada policy → tidak ada akses dari client.

-- ---------------------------------------------------------------------------
-- Seed pengaturan
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value)
values
  ('shop_enabled', 'true'::jsonb),
  ('wa_number', '"62xxxxxxxxxx"'::jsonb),
  ('site_title', '"Ngantuqan"'::jsonb),
  (
    'site_description',
    '"Portofolio visual dan toko karya Ngantuqan. Project, ilustrasi, dan produk digital."'::jsonb
  ),
  ('shop_closed_message', '"Toko sedang tutup. Cek lagi nanti ya!"'::jsonb)
on conflict (key) do nothing;

-- Halaman awal (draft kosong sampai diisi editor Puck)
insert into public.pages (slug, title, seo_description, status)
values
  ('home', 'Ngantuqan', 'Portofolio visual dan toko karya Ngantuqan.', 'draft'),
  ('about', 'Tentang', 'Profil Ngantuqan.', 'draft')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Storage: bucket media (baca publik, tulis hanya lewat service role)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');
