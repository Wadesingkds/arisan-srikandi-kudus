-- Create slot_arisan_barang table for slot-based goods lottery system
CREATE TABLE IF NOT EXISTS slot_arisan_barang (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    warga_id UUID NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
    alias VARCHAR(50) NOT NULL UNIQUE,
    status_aktif BOOLEAN DEFAULT TRUE,
    tanggal_daftar TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tanggal_nonaktif TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_slot_arisan_barang_warga_id ON slot_arisan_barang(warga_id);
CREATE INDEX IF NOT EXISTS idx_slot_arisan_barang_alias ON slot_arisan_barang(alias);
CREATE INDEX IF NOT EXISTS idx_slot_arisan_barang_status ON slot_arisan_barang(status_aktif);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_slot_arisan_barang_updated_at BEFORE UPDATE ON slot_arisan_barang
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for active slots with warga info
CREATE OR REPLACE VIEW active_slots_with_warga AS
SELECT 
    s.id,
    s.warga_id,
    s.alias,
    w.nama,
    w.no_wa,
    w.aktif,
    s.tanggal_daftar,
    s.status_aktif
FROM slot_arisan_barang s
JOIN warga w ON s.warga_id = w.id
WHERE s.status_aktif = TRUE;

-- Create function to generate unique alias
CREATE OR REPLACE FUNCTION generate_unique_alias(warga_name VARCHAR, suffix VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    base_alias VARCHAR;
    counter INTEGER := 1;
    final_alias VARCHAR;
BEGIN
    base_alias := SUBSTRING(warga_name FROM 1 FOR 3);
    final_alias := base_alias || ' ' || suffix;
    
    WHILE EXISTS (SELECT 1 FROM slot_arisan_barang WHERE alias = final_alias) LOOP
        counter := counter + 1;
        final_alias := base_alias || ' ' || suffix || counter;
    END LOOP;
    
    RETURN final_alias;
END;
$$ LANGUAGE plpgsql;
