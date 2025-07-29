import { useQuery } from '@tanstack/react-query';
import { supabase } from './client';

export type PeriodeUndian = {
  id: string;
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
};

/**
 * Ambil periode undian aktif (tanggal_selesai null atau >= hari ini)
 */
export function usePeriodeUndianAktif() {
  return useQuery<PeriodeUndian | null, Error>({
    queryKey: ['periode-undian-aktif'],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('periode_undian')
        .select('*')
        .or(`tanggal_selesai.is.null,tanggal_selesai.gte.${today}`)
        .order('tanggal_mulai', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as PeriodeUndian | null;
    },
  });
}
