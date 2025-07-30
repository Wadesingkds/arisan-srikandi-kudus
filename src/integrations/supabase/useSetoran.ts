import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { toast } from 'sonner';

export interface Setoran {
  id: number;
  warga_id: string | null;
  jenis_iuran: string | null;
  nominal: number;
  tanggal: string;
  bulan: string;
  pengingat_terakhir: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSetoranData {
  warga_id: string;
  jenis_iuran: string;
  nominal: number;
  tanggal: string;
}

// Hook untuk mendapatkan semua setoran
export function useSetoran() {
  return useQuery<Setoran[], Error>({
    queryKey: ['setoran'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('setoran')
        .select('*')
        .order('tanggal', { ascending: false });

      if (error) throw error;
      return (data || []) as Setoran[];
    }
  });
}

// Hook untuk membuat setoran baru
export function useCreateSetoran() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSetoranData) => {
      const { data: result, error } = await supabase
        .from('setoran')
        .insert([{
          ...data, 
          bulan: new Date(data.tanggal).toLocaleString('default', { month: 'long' })
        }]);

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setoran'] });
      toast.success('Setoran berhasil disimpan');
    },
    onError: (error) => {
      toast.error('Gagal menyimpan setoran: ' + error.message);
    }
  });
}

// Hook untuk mendapatkan setoran berdasarkan bulan
export function useSetoranByBulan(bulan?: string) {
  return useQuery<Setoran[], Error>({
    queryKey: ['setoran', bulan],
    queryFn: async () => {
      let query = supabase
        .from('setoran')
        .select('*')
        .order('tanggal', { ascending: false });

      if (bulan) {
        query = query.eq('bulan', bulan);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as Setoran[];
    },
    enabled: !!bulan
  });
}
