-- Create setoran_slot table for slot-based payments
CREATE TABLE IF NOT EXISTS setoran_slot (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slot_id UUID NOT NULL REFERENCES slot_arisan_barang(id) ON DELETE CASCADE,
    bulan VARCHAR(20) NOT NULL,
    nominal INTEGER NOT NULL DEFAULT 10000,
    tanggal_setoran TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'terbayar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_setoran_slot_slot_id ON setoran_slot(slot_id);
CREATE INDEX IF NOT EXISTS idx_setoran_slot_bulan ON setoran_slot(bulan);
CREATE INDEX IF NOT EXISTS idx_setoran_slot_status ON setoran_slot(status);

-- Create composite index for querying
CREATE INDEX IF NOT EXISTS idx_setoran_slot_composite ON setoran_slot(slot_id, bulan);

-- Create trigger for updated_at
CREATE TRIGGER update_setoran_slot_updated_at BEFORE UPDATE ON setoran_slot
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for setoran with slot details
CREATE OR REPLACE VIEW setoran_with_slot_details AS
SELECT 
    ss.id,
    ss.slot_id,
    ss.bulan,
    ss.nominal,
    ss.tanggal_setoran,
    ss.status,
    ss.created_at,
    ss.updated_at,
    sab.alias,
    sab.warga_id,
    w.nama,
    w.no_wa
FROM setoran_slot ss
JOIN slot_arisan_barang sab ON ss.slot_id = sab.id
JOIN warga w ON sab.warga_id = w.id;

-- Create function for rekap setoran per warga
CREATE OR REPLACE FUNCTION rekap_setoran_warga_per_bulan(bulan_filter VARCHAR DEFAULT NULL)
RETURNS TABLE(
    warga_id UUID,
    nama VARCHAR,
    total_slot INTEGER,
    total_setoran INTEGER,
    slot_aktif TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.nama,
        COUNT(DISTINCT sab.id)::INTEGER,
        COALESCE(SUM(ss.nominal), 0)::INTEGER,
        ARRAY_AGG(DISTINCT sab.alias ORDER BY sab.alias)
    FROM warga w
    JOIN slot_arisan_barang sab ON w.id = sab.warga_id
    LEFT JOIN setoran_slot ss ON sab.id = ss.slot_id 
        AND (bulan_filter IS NULL OR ss.bulan = bulan_filter)
    WHERE sab.status_aktif = TRUE
    GROUP BY w.id, w.nama
    ORDER BY w.nama;
END;
$$ LANGUAGE plpgsql;
