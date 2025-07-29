import { useQuery } from '@tanstack/react-query';
import { supabase } from './client';

export type HasilUndian = {
  id: string;
  periode_id: string;
  kategori: 'uang' | 'barang';
  anggota_id: string;
  nama: string;
  tanggal_undi: string;
  status_konfirmasi: 'menunggu' | 'disetujui' | 'ditolak';
  catatan: string | null;
};

export function useRiwayatUndian(periodeId: string | null, kategori: 'uang' | 'barang') {
  return useQuery<HasilUndian[], Error>({
    queryKey: ['riwayat-undian', periodeId, kategori],
    enabled: !!periodeId,
    queryFn: async () => {
      if (!periodeId) return [];
      const { data, error } = await supabase
        .from('hasil_undian')
        .select('*')
        .eq('periode_id', periodeId)
        .eq('kategori', kategori)
        .order('tanggal_undi', { ascending: false });
      if (error) throw error;
      return data as HasilUndian[];
    },
  });
}
