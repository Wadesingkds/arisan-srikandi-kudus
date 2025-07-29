import { supabase } from './client';

export async function updateHasilUndian({
  id,
  status_konfirmasi,
  catatan,
}: {
  id: string;
  status_konfirmasi: 'disetujui' | 'ditolak';
  catatan?: string | null;
}) {
  const { data, error } = await supabase
    .from('hasil_undian')
    .update({ status_konfirmasi, catatan })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
