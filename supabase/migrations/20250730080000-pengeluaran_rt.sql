-- Create pengeluaran_rt table for RT 04 RW 01
CREATE TABLE public.pengeluaran_rt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  kategori TEXT NOT NULL CHECK (kategori IN (
    'arisan_uang', 'arisan_barang', 'sosial', 
    'tabungan_lebaran', 'tabungan_piknik', 'lainnya'
  )),
  nominal DECIMAL(12,2) NOT NULL CHECK (nominal > 0),
  deskripsi TEXT NOT NULL,
  penerima_id UUID REFERENCES public.profiles(id),
  penerima_nama TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_pengeluaran_tanggal ON public.pengeluaran_rt(tanggal);
CREATE INDEX idx_pengeluaran_kategori ON public.pengeluaran_rt(kategori);
CREATE INDEX idx_pengeluaran_penerima ON public.pengeluaran_rt(penerima_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_pengeluaran_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pengeluaran_updated_at_trigger
  BEFORE UPDATE ON public.pengeluaran_rt
  FOR EACH ROW
  EXECUTE FUNCTION update_pengeluaran_updated_at();

-- Enable RLS
ALTER TABLE public.pengeluaran_rt ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin can manage pengeluaran" ON public.pengeluaran_rt
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('admin', 'ketua_rt', 'bendahara')
  );
