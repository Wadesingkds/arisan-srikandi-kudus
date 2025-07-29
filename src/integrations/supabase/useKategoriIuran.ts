import { useQuery } from '@tanstack/react-query';
import { supabase } from './client';

export type KategoriIuran = {
  id: number;
  nama: string;
  nominal: number;
  wajib: boolean | null;
};

export function useKategoriIuran() {
  return useQuery<KategoriIuran[], Error>({
    queryKey: ['kategori_iuran'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kategori_iuran')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return data as KategoriIuran[];
    },
  });
}
