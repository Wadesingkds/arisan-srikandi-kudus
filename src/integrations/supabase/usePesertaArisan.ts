import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import type { Database } from './types';

export type PesertaArisan = Database['public']['Tables']['profiles']['Row'];
export type PesertaArisanInsert = Database['public']['Tables']['profiles']['Insert'];
export type PesertaArisanUpdate = Database['public']['Tables']['profiles']['Update'];

// Fetch all peserta arisan
export function usePesertaArisan() {
  return useQuery<PesertaArisan[], Error>({
    queryKey: ['peserta-arisan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PesertaArisan[];
    },
  });
}

// Tambah peserta arisan
export function useTambahPesertaArisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPeserta: PesertaArisanInsert) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newPeserta])
        .select()
        .single();
      if (error) throw error;
      return data as PesertaArisan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peserta-arisan'] });
    },
  });
}

// Edit peserta arisan
export function useEditPesertaArisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...update }: PesertaArisanUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as PesertaArisan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peserta-arisan'] });
    },
  });
}

// Hapus peserta arisan
export function useHapusPesertaArisan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peserta-arisan'] });
    },
  });
}
