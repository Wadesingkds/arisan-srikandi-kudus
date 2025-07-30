-- Pengeluaran RT Setup Script
-- Run this script in Supabase SQL Editor

-- Step 1: Create pengeluaran_rt table
CREATE TABLE IF NOT EXISTS pengeluaran_rt (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tanggal DATE NOT NULL,
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('arisan_uang', 'arisan_barang', 'sosial', 'tabungan_lebaran', 'tabungan_piknik', 'lainnya')),
    nominal INTEGER NOT NULL CHECK (nominal > 0),
    deskripsi TEXT NOT NULL,
    penerima_id UUID REFERENCES profiles(id),
    penerima_nama VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_pengeluaran_rt_tanggal ON pengeluaran_rt(tanggal);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_rt_kategori ON pengeluaran_rt(kategori);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_rt_penerima ON pengeluaran_rt(penerima_id);

-- Step 3: Enable RLS
ALTER TABLE pengeluaran_rt ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
CREATE POLICY "Users can view all pengeluaran" ON pengeluaran_rt
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert pengeluaran" ON pengeluaran_rt
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own pengeluaran" ON pengeluaran_rt
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own pengeluaran" ON pengeluaran_rt
    FOR DELETE USING (auth.uid() = created_by);

-- Step 5: Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pengeluaran_rt_updated_at 
    BEFORE UPDATE ON pengeluaran_rt 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Sample data for testing (optional)
-- Uncomment and modify as needed:
/*
INSERT INTO pengeluaran_rt (tanggal, kategori, nominal, deskripsi, penerima_nama) VALUES
('2024-07-30', 'arisan_uang', 500000, 'Pemenang arisan uang bulan Juli', 'Budi Santoso'),
('2024-07-25', 'sosial', 200000, 'Donasi untuk warga yang sakit', 'RT 04'),
('2024-07-20', 'tabungan_lebaran', 1000000, 'Penarikan tabungan lebaran', 'RT 04');
*/
