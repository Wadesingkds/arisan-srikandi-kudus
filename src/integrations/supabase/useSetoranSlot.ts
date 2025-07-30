import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { toast } from 'sonner';

export interface SetoranSlot {
  id: string;
  slot_id: string;
  alias: string;
  bulan: string;
  nominal: number;
  tanggal_setoran: string;
  status: 'terbayar' | 'belum_bayar';
  created_at: string;
  updated_at: string;
  nama_peserta?: string;
  no_wa?: string;
}

export interface CreateSetoranSlotData {
  slot_id: string;
  bulan: string;
  nominal: number;
  tanggal_setoran: string;
}

// Hook untuk mendapatkan setoran berdasarkan bulan
export function useSetoranSlot(bulan?: string) {
  return useQuery<SetoranSlot[], Error>({
    queryKey: ['setoran-slot', bulan],
    queryFn: async () => {
      let query = supabase
        .from('setoran_slot')
        .select(`
          *,
          slot_arisan_barang!inner(
            alias,
            peserta!inner(nama, no_wa)
          )
        `)
        .order('tanggal_setoran', { ascending: false });

      if (bulan) {
        query = query.eq('bulan', bulan);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        slot_id: item.slot_id,
        alias: item.slot_arisan_barang?.alias || '',
        bulan: item.bulan || '',
        nominal: item.nominal || 0,
        tanggal_setoran: item.tanggal_setoran || '',
        status: item.status || 'belum_bayar',
        created_at: item.created_at || '',
        updated_at: item.updated_at || '',
        nama_peserta: item.slot_arisan_barang?.peserta?.nama || 'Tidak Diketahui',
        no_wa: item.slot_arisan_barang?.peserta?.no_wa || '',
      })) || [];
    },
  });
}

// Hook untuk membuat setoran baru untuk slot
export function useCreateSetoranSlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSetoranSlotData) => {
      const { data: result, error } = await supabase
        .from('setoran_slot')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setoran-slot'] });
      toast.success('Setoran slot berhasil disimpan');
    },
    onError: (error) => {
      toast.error(`Gagal menyimpan setoran: ${error.message}`);
    },
  });
}

// Hook untuk mendapatkan rekap setoran per peserta
export function useRekapSetoranPeserta(bulan?: string) {
  return useQuery<{
    warga_id: string;
    nama: string;
    total_slot: number;
    total_setoran: number;
    slot_aktif: string[];
  }[], Error>({
    queryKey: ['rekap-setoran-peserta', bulan],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('rekap_setoran_peserta_per_bulan', {
          bulan_filter: bulan
        });

      if (error) throw error;
      return data || [];
    },
  });
}

// Hook untuk mendapatkan slot yang belum bayar
export function useSlotsBelumBayar(bulan: string) {
  return useQuery<{
    slot_id: string;
    alias: string;
    warga_id: string;
    nama: string;
    nominal_harus_bayar: number;
  }[], Error>({
    queryKey: ['slots-belum-bayar', bulan],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slot_arisan_barang')
        .select(`
          *,
          warga!inner(nama, no_wa)
        `)
        .eq('status_aktif', true)
        .not('id', 'in', 
          supabase.from('setoran_slot').select('slot_id').eq('bulan', bulan)
        );

      if (error) throw error;
      
      return data?.map(item => ({
        slot_id: item.id,
        alias: item.alias,
        peserta_id: item.peserta_id,
        nama: item.warga?.nama || 'Tidak Diketahui',
        nominal_harus_bayar: 10000, // Default untuk arisan barang
      })) || [];
    },
  });
}
