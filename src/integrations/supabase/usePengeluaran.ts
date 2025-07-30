import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';

// Define types for pengeluaran_rt table
export interface PengeluaranRT {
  id: string;
  tanggal: string;
  kategori: string;
  nominal: number;
  deskripsi: string;
  penerima_id?: string | null;
  penerima_nama?: string | null;
  penerima?: {
    nama: string;
    no_wa?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface PengeluaranRTInsert {
  tanggal: string;
  kategori: string;
  nominal: number;
  deskripsi: string;
  penerima_id?: string | null;
  penerima_nama?: string | null;
}

export interface PengeluaranRTUpdate {
  tanggal?: string;
  kategori?: string;
  nominal?: number;
  deskripsi?: string;
  penerima_id?: string | null;
  penerima_nama?: string | null;
}

// Fetch all pengeluaran RT
export function usePengeluaranRT() {
  return useQuery({
    queryKey: ['pengeluaran'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pengeluaran_rt')
        .select(`*, penerima:profiles(nama, no_wa)`)
        .order('tanggal', { ascending: false });
      if (error) throw error;
      return data as PengeluaranRT[];
    },
  });
}

// Tambah pengeluaran RT
export function useTambahPengeluaranRT() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPengeluaran: PengeluaranRTInsert) => {
      const { data, error } = await supabase
        .from('pengeluaran_rt')
        .insert([newPengeluaran])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran-rt'] });
    },
  });
}

// Edit pengeluaran RT
export function useEditPengeluaranRT() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...update }: PengeluaranRTUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('pengeluaran_rt')
        .update(update)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran-rt'] });
    },
  });
}

// Hapus pengeluaran RT
export function useHapusPengeluaranRT() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pengeluaran_rt')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran-rt'] });
    },
  });
}

// Filter pengeluaran by date range
export function usePengeluaranRTByDateRange(startDate: string, endDate: string) {
  return useQuery<PengeluaranRT[], Error>({
    queryKey: ['pengeluaran-rt', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pengeluaran_rt')
        .select(`*, penerima:profiles(nama, no_wa)`)
        .gte('tanggal', startDate)
        .lte('tanggal', endDate)
        .order('tanggal', { ascending: false });
      if (error) throw error;
      return data as PengeluaranRT[];
    },
    enabled: !!startDate && !!endDate,
  });
}

// Get total pengeluaran by kategori
export function useTotalPengeluaranByKategori() {
  return useQuery<{
    kategori: string;
    total: number;
  }[], Error>({
    queryKey: ['total-pengeluaran-kategori'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pengeluaran_rt')
        .select('kategori, nominal')
        .order('kategori');
      if (error) throw error;
      
      const totals = (data || []).reduce((acc, item: any) => {
        const existing = acc.find(t => t.kategori === item.kategori);
        if (existing) {
          existing.total += item.nominal;
        } else {
          acc.push({ kategori: item.kategori, total: item.nominal });
        }
        return acc;
      }, [] as { kategori: string; total: number }[]);
      
      return totals;
    },
  });
}
