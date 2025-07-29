import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useState } from "react";
import { usePesertaUndian } from "@/integrations/supabase/usePesertaUndian";
import { usePeriodeUndianAktif } from "@/integrations/supabase/usePeriodeUndianAktif";
import { saveHasilUndian } from "@/integrations/supabase/saveHasilUndian";

const Undian = () => {
  // State modal: 'uang' | 'barang' | null
  const [openModal, setOpenModal] = useState<'uang'|'barang'|null>(null);
  // State pemenang (nama)
  const [winner, setWinner] = useState<string>("");
  // Simpan user_id pemenang untuk penyimpanan
  const [winnerId, setWinnerId] = useState<string>("");
  // State exclude id untuk undi ulang
  const [excludedId, setExcludedId] = useState<string|null>(null);
  // Ambil periode undian aktif
  const periodeAktif = usePeriodeUndianAktif();
  const periodeId = periodeAktif.data?.id ?? null;
  // Ambil peserta undian uang/barang
  const pesertaUang = usePesertaUndian(periodeId, 'uang');
  const pesertaBarang = usePesertaUndian(periodeId, 'barang');

  // Handler jalankan undian
  function handleUndian(kategori: 'uang'|'barang') {
    const peserta = kategori === 'uang' ? pesertaUang.data : pesertaBarang.data;
    if (!peserta || peserta.length === 0) {
      setWinner('(Tidak ada peserta)');
      setOpenModal(kategori);
      return;
    }
    // Exclude id jika undi ulang
    const filtered = excludedId ? peserta.filter(p => p.user_id !== excludedId) : peserta;
    if (filtered.length === 0) {
      setWinner('(Tidak ada peserta tersisa)');
      setOpenModal(kategori);
      return;
    }
    const rand = Math.floor(Math.random() * filtered.length);
    setWinner(filtered[rand].nama);
    setWinnerId(filtered[rand].user_id);
    setExcludedId(filtered[rand].user_id);
    setOpenModal(kategori);
  }

  // Handler undi ulang
  function handleUndiUlang() {
    if (!openModal) return;
    handleUndian(openModal);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Undian Arisan</h1>
          </div>
          {!periodeId && (
            <div className="text-sm text-red-500 font-semibold mr-4">
              Tidak ada periode undian aktif. Silakan buat periode baru terlebih dahulu.
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="default" onClick={() => { setExcludedId(null); handleUndian('uang'); }} disabled={!periodeId}>
              <Shuffle className="h-4 w-4 mr-2" />
              Jalankan Undian Uang
            </Button>
            <Button variant="secondary" onClick={() => { setExcludedId(null); handleUndian('barang'); }} disabled={!periodeId}>
              <Shuffle className="h-4 w-4 mr-2" />
              Jalankan Undian Barang
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Arisan Uang
                <Badge variant="secondary">Aktif</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Rp 500.000</p>
              <p className="text-sm text-muted-foreground">Nominal per periode</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Arisan Barang
                <Badge variant="secondary">Aktif</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15 Slot</p>
              <p className="text-sm text-muted-foreground">Total peserta</p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Undian</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Riwayat undian uang */}
            <RiwayatUndianTable kategori="uang" periodeId={periodeId} />
            {/* Riwayat undian barang */}
            <RiwayatUndianTable kategori="barang" periodeId={periodeId} />
          </CardContent>
        </Card>
      </div>

      {/* Modal Konfirmasi Pemenang Undian (UI Saja) */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 max-w-md w-full transition-all duration-300 animate-scale-in flex flex-col items-center">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              {/* Icon trophy elegan */}
              <span className="inline-block bg-white border border-gray-200 rounded-full p-3 shadow-md">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path fill="#fbbf24" d="M7 21v-2a4 4 0 0 1 4-4 4 4 0 0 1 4 4v2"/>
                  <path stroke="#a21caf" strokeWidth="1.5" d="M7 21v-2a4 4 0 0 1 4-4 4 4 0 0 1 4 4v2"/>
                  <path stroke="#fbbf24" strokeWidth="1.5" d="M12 17v-4m0 0c-4.418 0-8-1.343-8-3V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5c0 1.657-3.582 3-8 3Z"/>
                </svg>
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center mt-8 text-neutral-800 drop-shadow tracking-wide animate-fade-in">
              Konfirmasi Pemenang Undian {openModal === 'uang' ? 'Uang' : 'Barang'}
            </h2>
            <div className="mb-6 mt-2 text-center">
              <p className="text-lg text-muted-foreground">Pemenang:</p>
              <p className="text-3xl font-extrabold text-primary drop-shadow animate-pop-in">{winner || '(nama pemenang)'}</p>
            </div>
            <div className="flex gap-4 justify-center w-full mt-4">
              <Button variant="outline" size="lg" className="rounded-full px-6 py-2 text-base font-semibold border-gray-300 hover:bg-gray-100 transition" onClick={() => setOpenModal(null)}>
                Batal
              </Button>
              <Button variant="secondary" size="lg" className="rounded-full px-6 py-2 text-base font-semibold bg-muted text-primary shadow hover:bg-gray-200 transition" onClick={handleUndiUlang}>
                Undi Ulang
              </Button>
              <Button
                variant="default"
                size="lg"
                className="rounded-full px-6 py-2 text-base font-semibold bg-primary text-white shadow hover:bg-primary/90 transition"
                onClick={async () => {
                  if (!periodeId || !openModal || !winnerId || !winner) return;
                  try {
                    await saveHasilUndian({
                      periode_id: periodeId,
                      kategori: openModal,
                      anggota_id: winnerId,
                      nama: winner,
                    });
                    setOpenModal(null);
                    alert('Pemenang berhasil disimpan!');
                  } catch (e) {
                    alert('Gagal menyimpan hasil undian: ' + (e as any)?.message);
                  }
                }}
              >
                Setujui
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen tabel riwayat undian
type RiwayatUndianTableProps = {
  kategori: 'uang' | 'barang';
  periodeId: string | null;
};

function RiwayatUndianTable({ kategori, periodeId }: RiwayatUndianTableProps) {
  const { data, isLoading, error } = useRiwayatUndian(periodeId, kategori);
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-primary">
        Riwayat Undian {kategori === 'uang' ? 'Uang' : 'Barang'}
      </h3>
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Memuat...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">Gagal memuat data: {error.message}</p>
      ) : !data || data.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada riwayat undian.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 border">No</th>
                <th className="px-2 py-1 border">Nama</th>
                <th className="px-2 py-1 border">Tanggal</th>
                <th className="px-2 py-1 border">Status</th>
                <th className="px-2 py-1 border">Catatan</th>
                <th className="px-2 py-1 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} className={row.status_konfirmasi === 'disetujui' ? 'bg-green-50' : row.status_konfirmasi === 'ditolak' ? 'bg-red-50' : ''}>
                  <td className="px-2 py-1 border text-center">{i + 1}</td>
                  <td className="px-2 py-1 border">{row.nama}</td>
                  <td className="px-2 py-1 border">{new Date(row.tanggal_undi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-2 py-1 border capitalize font-semibold">
                    {row.status_konfirmasi}
                  </td>
                  <td className="px-2 py-1 border">{row.catatan ?? '-'}</td>
                  <td className="px-2 py-1 border text-center">
                    {row.status_konfirmasi === 'menunggu' && (
                      <div className="flex gap-1 justify-center">
                        <button
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                          onClick={async () => {
                            if (!window.confirm('Setujui pemenang ini?')) return;
                            try {
                              await import('@/integrations/supabase/updateHasilUndian').then(mod => mod.updateHasilUndian({ id: row.id, status_konfirmasi: 'disetujui' }));
                              alert('Pemenang disetujui!');
                              refetch();
                            } catch (e) {
                              alert('Gagal setujui: ' + (e as any)?.message);
                            }
                          }}
                        >
                          Setujui
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                          onClick={async () => {
                            const alasan = window.prompt('Masukkan catatan/alasan undi ulang:', 'Undi ulang manual oleh admin');
                            if (!alasan) return;
                            if (!window.confirm('Tolak dan lakukan undi ulang?')) return;
                            try {
                              await import('@/integrations/supabase/updateHasilUndian').then(mod => mod.updateHasilUndian({ id: row.id, status_konfirmasi: 'ditolak', catatan: alasan }));
                              alert('Pemenang ditolak, silakan lakukan undian ulang.');
                              refetch();
                            } catch (e) {
                              alert('Gagal: ' + (e as any)?.message);
                            }
                          }}
                        >
                          Undi Ulang
                        </button>
                      </div>
                    )}
                    {row.status_konfirmasi === 'disetujui' && (
                      <button
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs"
                        onClick={() => {
                          // NOTE: no_wa belum ada di row, harus join ke table anggota/profiles jika ingin otomatis
                          // Sementara, tampilkan alert atau gunakan window.open ke WhatsApp web dengan pesan default
                          const pesan = `Selamat ${row.nama}! Anda terpilih sebagai pemenang undian arisan kategori ${row.kategori.toUpperCase()} periode ini.`;
                          // window.open(`https://wa.me/<NO_WA>?text=${encodeURIComponent(pesan)}`);
                          alert('Fitur Kirim WA:\n' + pesan + '\n\n(No WA belum tersedia di data, silakan copy pesan ini dan kirim manual)');
                        }}
                      >
                        Kirim WA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Undian;