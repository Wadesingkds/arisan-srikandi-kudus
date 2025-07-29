import { useQuery } from '@tanstack/react-query';
import { supabase } from './client';

export type PesertaUndian = {
  user_id: string;
  nama: string;
};

/**
 * Ambil peserta undian yang belum pernah menang di periode & kategori berjalan
 * @param periodeId uuid periode aktif
 * @param kategori 'uang' | 'barang'
 */
export function usePesertaUndian(periodeId: string | null, kategori: 'uang' | 'barang') {
  return useQuery<PesertaUndian[], Error>({
    queryKey: ['peserta-undian', periodeId, kategori],
    enabled: !!periodeId,
    queryFn: async () => {
      if (!periodeId) return [];
      // Ambil semua anggota dari profiles
      const { data: anggota, error: err1 } = await supabase
        .from('profiles')
        .select('user_id, nama');
      if (err1) throw err1;
      // Ambil yang sudah menang di hasil_undian periode & kategori ini
      const { data: pemenang, error: err2 } = await supabase
        .from('hasil_undian')
        .select('anggota_id')
        .eq('periode_id', periodeId)
        .eq('kategori', kategori)
        .in('status_konfirmasi', ['menunggu', 'disetujui']);
      if (err2) throw err2;
      const sudahMenang = new Set((pemenang ?? []).map(p => p.anggota_id));
      // Filter anggota yang belum pernah menang
      return (anggota ?? []).filter(a => !sudahMenang.has(a.user_id));
    },
  });
}
