-- Fix RLS policies for existing tables
-- Enable RLS for existing tables
ALTER TABLE public.kategori_iuran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tabungan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.undian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warga ENABLE ROW LEVEL SECURITY;

-- Create basic policies for all tables (read access for authenticated users)
-- kategori_iuran policies
CREATE POLICY "Authenticated users can view kategori_iuran" 
ON public.kategori_iuran FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage kategori_iuran" 
ON public.kategori_iuran FOR ALL USING (auth.role() = 'authenticated');

-- setoran policies  
CREATE POLICY "Authenticated users can view setoran" 
ON public.setoran FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage setoran" 
ON public.setoran FOR ALL USING (auth.role() = 'authenticated');

-- tabungan policies
CREATE POLICY "Authenticated users can view tabungan" 
ON public.tabungan FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tabungan" 
ON public.tabungan FOR ALL USING (auth.role() = 'authenticated');

-- undian policies
CREATE POLICY "Authenticated users can view undian" 
ON public.undian FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage undian" 
ON public.undian FOR ALL USING (auth.role() = 'authenticated');

-- users policies
CREATE POLICY "Authenticated users can view users" 
ON public.users FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage users" 
ON public.users FOR ALL USING (auth.role() = 'authenticated');

-- wa_log policies
CREATE POLICY "Authenticated users can view wa_log" 
ON public.wa_log FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage wa_log" 
ON public.wa_log FOR ALL USING (auth.role() = 'authenticated');

-- warga policies
CREATE POLICY "Authenticated users can view warga" 
ON public.warga FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage warga" 
ON public.warga FOR ALL USING (auth.role() = 'authenticated');

-- Fix function search path issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';