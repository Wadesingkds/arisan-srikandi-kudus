import { useQuery } from '@tanstack/react-query';
import { supabase } from './client';

export type LaporanKeuanganSummary = {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo_akhir: number;
  total_peserta: number;
  total_setoran: number;
  total_tabungan: number;
};

export type TransaksiKeuangan = {
  id: number;
  jenis: 'pemasukan' | 'pengeluaran';
  kategori: string;
  nominal: number;
  tanggal: string;
  keterangan: string;
  nama_peserta?: string;
};

export type SetoranDetail = {
  id: number;
  bulan: string;
  jenis_iuran: string;
  nominal: number;
  created_at: string;
  nama_peserta: string;
  no_wa?: string;
};

export type TabunganDetail = {
  id: number;
  jenis: string;
  nominal: number;
  tanggal: string;
  nama_peserta: string;
  no_wa?: string;
};

export function useLaporanKeuanganSummary() {
  return useQuery<LaporanKeuanganSummary, Error>({
    queryKey: ['laporan-keuangan-summary'],
    queryFn: async () => {
      // Get total setoran (pemasukan)
      const { data: setoranData, error: setoranError } = await supabase
        .from('setoran')
        .select('nominal');
      
      if (setoranError) throw setoranError;
      
      const totalSetoran = setoranData?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;
      
      // Get total tabungan (another form of pemasukan)
      const { data: tabunganData, error: tabunganError } = await supabase
        .from('tabungan')
        .select('nominal');
      
      if (tabunganError) throw tabunganError;
      
      const totalTabungan = tabunganData?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;
      
      // Get total peserta
      const { data: pesertaData, error: pesertaError } = await supabase
        .from('profiles')
        .select('id');
      
      if (pesertaError) throw pesertaError;
      
      const totalPeserta = pesertaData?.length || 0;
      
      // For now, pengeluaran is calculated from undian prizes
      // This would need to be enhanced based on actual expense tracking
      const totalPengeluaran = 0; // Placeholder - should be calculated from actual expenses
      
      return {
        total_pemasukan: totalSetoran + totalTabungan,
        total_pengeluaran: totalPengeluaran,
        saldo_akhir: totalSetoran + totalTabungan - totalPengeluaran,
        total_peserta,
        total_setoran: totalSetoran,
        total_tabungan: totalTabungan,
      };
    },
  });
}

export function useDetailSetoran(bulan?: string) {
  return useQuery<SetoranDetail[], Error>({
    queryKey: ['detail-setoran', bulan],
    queryFn: async () => {
      let query = supabase
        .from('setoran')
        .select(`
          *,
          profiles!inner(nama, no_wa)
        `)
        .order('created_at', { ascending: false });
      
      if (bulan) {
        query = query.eq('bulan', bulan);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        bulan: item.bulan || '',
        jenis_iuran: item.jenis_iuran || '',
        nominal: item.nominal || 0,
        created_at: item.created_at || '',
        nama_peserta: item.profiles?.nama || 'Tidak Diketahui',
        no_wa: item.profiles?.no_wa || '',
      })) || [];
    },
  });
}

export function useDetailTabungan() {
  return useQuery<TabunganDetail[], Error>({
    queryKey: ['detail-tabungan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tabungan')
        .select(`
          *,
          profiles!inner(nama, no_wa)
        `)
        .order('tanggal', { ascending: false });
       
      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        jenis: item.jenis || '',
        nominal: item.nominal || 0,
        tanggal: item.tanggal || '',
        nama_peserta: item.profiles?.nama || 'Tidak Diketahui',
        no_wa: item.profiles?.no_wa || '',
      })) || [];
    },
  });
}

export function useRekapBulanan() {
  return useQuery<{
    bulan: string;
    total_pemasukan: number;
    total_pengeluaran: number;
    jumlah_transaksi: number;
  }[], Error>({
    queryKey: ['rekap-bulanan'],
    queryFn: async () => {
      // Group setoran by month
      const { data: rekapData, error: rekapError } = await supabase
        .from('setoran')
        .select('bulan, nominal')
        .order('bulan', { ascending: false });
      
      if (rekapError) throw rekapError;
      
      const monthlyData: { [key: string]: { pemasukan: number; pengeluaran: number; transaksi: number } } = {};
      
      rekapData?.forEach(item => {
        const bulan = item.bulan;
        if (!monthlyData[bulan]) {
          monthlyData[bulan] = { pemasukan: 0, pengeluaran: 0, transaksi: 0 };
        }
        monthlyData[bulan].pemasukan += item.nominal || 0;
        monthlyData[bulan].transaksi += 1;
      });
      
      // Convert to array format
      return Object.entries(monthlyData).map(([bulan, data]) => ({
        bulan,
        total_pemasukan: data.pemasukan,
        total_pengeluaran: data.pengeluaran,
        jumlah_transaksi: data.transaksi,
      })).sort((a, b) => b.bulan.localeCompare(a.bulan));
    },
  });
}
