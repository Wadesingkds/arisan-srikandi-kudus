-- Tabel periode_undian: menyimpan periode undian arisan
create table if not exists public.periode_undian (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tanggal_mulai date not null,
  tanggal_selesai date,
  created_at timestamp with time zone default now()
);

-- Tabel hasil_undian: hasil undian per periode, kategori, dan status konfirmasi
create table if not exists public.hasil_undian (
  id uuid primary key default gen_random_uuid(),
  periode_id uuid references public.periode_undian(id) on delete cascade,
  kategori text not null check (kategori in ('uang', 'barang')),
  anggota_id uuid references public.profiles(user_id) on delete set null,
  tanggal_undian timestamp with time zone default now(),
  status_konfirmasi text not null check (status_konfirmasi in ('menunggu', 'disetujui', 'ditolak')) default 'menunggu',
  keterangan text,
  constraint unique_undian_per_periode unique (periode_id, kategori, anggota_id)
);

-- Index untuk pencarian cepat
create index if not exists hasil_undian_periode_idx on public.hasil_undian(periode_id, kategori, status_konfirmasi);
