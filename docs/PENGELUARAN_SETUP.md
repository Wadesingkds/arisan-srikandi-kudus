# Pengeluaran RT Feature - Setup Guide

## Overview
Fitur Pengeluaran RT adalah sistem manajemen pengeluaran kas untuk RT 04 RW 01 Kudus yang memungkinkan pencatatan, pengelolaan, dan pelaporan semua pengeluaran arisan.

## Database Setup

### 1. Migration Script
Untuk membuat tabel `pengeluaran_rt`, jalankan script berikut di Supabase SQL Editor:

```sql
-- Create pengeluaran_rt table
CREATE TABLE IF NOT EXISTS pengeluaran_rt (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tanggal DATE NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    nominal INTEGER NOT NULL CHECK (nominal > 0),
    deskripsi TEXT NOT NULL,
    penerima_id UUID REFERENCES profiles(id),
    penerima_nama VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_pengeluaran_rt_tanggal ON pengeluaran_rt(tanggal);
CREATE INDEX idx_pengeluaran_rt_kategori ON pengeluaran_rt(kategori);
CREATE INDEX idx_pengeluaran_rt_penerima ON pengeluaran_rt(penerima_id);

-- Enable RLS (Row Level Security)
ALTER TABLE pengeluaran_rt ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all pengeluaran" ON pengeluaran_rt
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert pengeluaran" ON pengeluaran_rt
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own pengeluaran" ON pengeluaran_rt
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own pengeluaran" ON pengeluaran_rt
    FOR DELETE USING (auth.uid() = created_by);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pengeluaran_rt_updated_at BEFORE UPDATE
    ON pengeluaran_rt FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Update Supabase Types
Setelah tabel dibuat, jalankan perintah berikut untuk update Supabase types:

```bash
# Install Supabase CLI jika belum ada
npm install -g supabase

# Login ke Supabase
supabase login

# Generate types baru
supabase gen types typescript --project-id "eyahrucbtofdnmgujkoo" --schema public > src/types/supabase.ts
```

### 3. Update Environment Variables
Pastikan `.env` file memiliki konfigurasi yang benar:

```env
VITE_SUPABASE_URL=https://eyahrucbtofdnmgujkoo.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Feature Components

### 1. Pengeluaran Page (`/pengeluaran`)
- **URL**: `/pengeluaran`
- **Access**: Semua user yang login
- **Features**: 
  - Filter berdasarkan tanggal dan kategori
  - Summary cards dengan total pengeluaran
  - Tabel data dengan pagination
  - Export data functionality

### 2. Add/Edit Form
- **Modal Dialog**: Form untuk menambah/mengedit pengeluaran
- **Validation**: Semua field wajib diisi
- **Categories**: 
  - Arisan Uang
  - Arisan Barang  
  - Sosial
  - Tabungan Lebaran
  - Tabungan Piknik
  - Lainnya

### 3. Data Table
- **Responsive**: Mobile-friendly design
- **Actions**: Edit dan Delete buttons
- **Badges**: Color-coded kategori labels
- **Currency**: Rupiah formatting

## Usage Guide

### Menambah Pengeluaran Baru
1. Klik tombol "Tambah Pengeluaran"
2. Isi form dengan informasi yang lengkap
3. Pilih kategori yang sesuai
4. Masukkan nominal dalam Rupiah
5. Simpan data

### Filter Data
- Gunakan date picker untuk filter berdasarkan tanggal
- Gunakan select dropdown untuk filter berdasarkan kategori
- Klik "Reset Filter" untuk membersihkan filter

### Export Data
- Data dapat diexport dalam format yang tersedia
- Filter akan berlaku untuk data yang diekspor

## API Endpoints

### Get All Pengeluaran
```typescript
GET /pengeluaran_rt?select=*&order=tanggal.desc
```

### Filter by Date Range
```typescript
GET /pengeluaran_rt?select=*&tanggal=gte.start_date&tanggal=lte.end_date
```

### Filter by Category
```typescript
GET /pengeluaran_rt?select=*&kategori=eq.category_name
```

## Troubleshooting

### Error: Table not found
**Solution**: Jalankan migration script di atas

### Error: RLS Policy violation
**Solution**: Pastikan user sudah login dan memiliki role yang sesuai

### Error: TypeScript errors
**Solution**: Update Supabase types setelah migration

## Development Notes

### Dependencies Added
- No new dependencies required - using existing stack

### File Structure
```
src/
├── components/
│   ├── PengeluaranTable.tsx
│   ├── PengeluaranForm.tsx
│   └── Dashboard.tsx (updated)
├── pages/
│   └── Pengeluaran.tsx
├── integrations/
│   └── supabase/
│       └── usePengeluaran.ts
└── types/
    └── pengeluaran.ts
```

## Testing Checklist
- [ ] Tabel `pengeluaran_rt` berhasil dibuat
- [ ] RLS policies aktif dan berfungsi
- [ ] CRUD operations berjalan normal
- [ ] Navigation dari dashboard berfungsi
- [ ] Form validation berfungsi
- [ ] Filter dan search berfungsi
- [ ] Export data berfungsi

## Support
Untuk pertanyaan atau masalah teknis, hubungi:
- Email: support@arisan-srikandi-kudus.com
- WhatsApp: +62 xxx-xxxx-xxxx
