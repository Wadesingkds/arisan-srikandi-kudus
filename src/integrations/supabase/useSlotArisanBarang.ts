import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { toast } from 'sonner';

export interface SlotArisanBarang {
  id: string;
  warga_id: string;
  alias: string;
  status_aktif: boolean;
  tanggal_daftar: string;
  tanggal_nonaktif: string | null;
  created_at: string;
  updated_at: string;
  nama_warga?: string;
  no_wa?: string;
}

export interface CreateSlotData {
  warga_id: string;
  alias: string;
}

// Hook untuk mendapatkan semua slot aktif
export function useActiveSlots() {
  return useQuery<SlotArisanBarang[], Error>({
    queryKey: ['active-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_slots_with_warga')
        .select('*')
        .order('alias', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

// Hook untuk mendapatkan slot berdasarkan warga
export function useSlotsByWarga(wargaId: string) {
  return useQuery<SlotArisanBarang[], Error>({
    queryKey: ['slots-by-warga', wargaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slot_arisan_barang')
        .select(`*, warga(nama, no_wa)`)
        .eq('warga_id', wargaId)
        .order('alias', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!wargaId,
  });
}

// Hook untuk membuat slot baru
export function useCreateSlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSlotData) => {
      const { data: result, error } = await supabase
        .from('slot_arisan_barang')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-slots'] });
      queryClient.invalidateQueries({ queryKey: ['slots-by-warga'] });
      toast.success('Slot berhasil dibuat');
    },
    onError: (error) => {
      toast.error(`Gagal membuat slot: ${error.message}`);
    },
  });
}

// Hook untuk menonaktifkan slot
export function useDeactivateSlot() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (slotId: string) => {
      const { data, error } = await supabase
        .from('slot_arisan_barang')
        .update({ 
          status_aktif: false,
          tanggal_nonaktif: new Date().toISOString()
        })
        .eq('id', slotId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-slots'] });
      queryClient.invalidateQueries({ queryKey: ['slots-by-warga'] });
      toast.success('Slot berhasil dinonaktifkan');
    },
    onError: (error) => {
      toast.error(`Gagal menonaktifkan slot: ${error.message}`);
    },
  });
}

// Hook untuk menghitung total slot aktif
export function useTotalActiveSlots() {
  return useQuery<number, Error>({
    queryKey: ['total-active-slots'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('slot_arisan_barang')
        .select('*', { count: 'exact', head: true })
        .eq('status_aktif', true);

      if (error) throw error;
      return count || 0;
    },
  });
}

// Hook untuk mendapatkan slot yang siap untuk undian
export function useSlotsForLottery() {
  return useQuery<SlotArisanBarang[], Error>({
    queryKey: ['slots-for-lottery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_slots_with_warga')
        .select('*')
        .order('alias', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}
