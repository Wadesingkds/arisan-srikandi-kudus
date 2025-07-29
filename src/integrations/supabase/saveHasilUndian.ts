import { supabase } from './client';

export async function saveHasilUndian({
  periode_id,
  kategori,
  anggota_id,
  nama,
}: {
  periode_id: string;
  kategori: 'uang' | 'barang';
  anggota_id: string;
  nama: string;
}) {
  const { data, error } = await supabase
    .from('hasil_undian')
    .insert([
      {
        periode_id,
        kategori,
        anggota_id,
        nama,
        tanggal_undi: new Date().toISOString(),
        status_konfirmasi: 'menunggu',
        catatan: null,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}
