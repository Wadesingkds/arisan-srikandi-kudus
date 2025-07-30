import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useKategoriIuran } from "@/integrations/supabase/useKategoriIuran";

const Setoran = () => {
  const [anggota, setAnggota] = useState("");
  const [jenisIuran, setJenisIuran] = useState("");
  const [jumlah, setJumlah] = useState<number | undefined>(undefined);
  // Untuk deteksi apakah jumlah sudah diedit manual
  const [jumlahManual, setJumlahManual] = useState(false);
  // Format tanggal: ddmmmmyyyy (misal: 29Jul2025)
  function getToday() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const bulanIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const mmmm = bulanIndo[now.getMonth()];
    const yyyy = now.getFullYear();
    return `${dd} ${mmmm} ${yyyy}`;
  }
  const [tanggal, setTanggal] = useState(getToday());
  const [keterangan, setKeterangan] = useState("");

  // Ambil data kategori iuran dari Supabase
  const { data: kategoriIuran, isLoading: loadingIuran, error: errorIuran } = useKategoriIuran();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sederhana
    if (!anggota || !jenisIuran || !jumlah || !tanggal) {
      toast({
        title: "Gagal menyimpan setoran",
        description: "Semua field wajib diisi dengan format benar.",
        variant: "destructive",
      });
      return;
    }
    if (!/^\d{2} [A-Za-zÀ-ÿ]+ \d{4}$/.test(tanggal)) {
      toast({
        title: "Format tanggal salah",
        description: "Gunakan format dd mmmm yyyy, contoh: 20 Agustus 2025",
        variant: "destructive",
      });
      return;
    }
    // TODO: Integrasi Supabase (simpan data)
    // Ambil nama anggota dari value
    let namaAnggota = anggota;
    if (anggota === "1") namaAnggota = "Siti Aminah";
    else if (anggota === "2") namaAnggota = "Dewi Lestari";
    else if (anggota === "3") namaAnggota = "Rina Wati";
    toast({
      title: "Setoran berhasil disimpan!",
      description: `Anggota: ${namaAnggota}, Jenis: ${jenisIuran}, Jumlah: Rp${jumlah.toLocaleString()}, Tanggal: ${tanggal}`,
      variant: "default",
    });
    // Reset form jika mau (opsional)
    // setAnggota(""); setJenisIuran(""); setJumlah(undefined); setTanggal(getToday()); setKeterangan("");
  };


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
            <h1 className="text-2xl font-bold">Catat Setoran</h1>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Januari 2024</SelectItem>
              <SelectItem value="2024-02">Februari 2024</SelectItem>
              <SelectItem value="2024-03">Maret 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Jenis iuran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bulanan">Iuran Bulanan</SelectItem>
              <SelectItem value="arisan">Arisan</SelectItem>
              <SelectItem value="kebersihan">Kebersihan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Form Setoran Iuran</CardTitle>
          </CardHeader>
          <CardContent className="overflow-visible">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Pilih Anggota */}
              <div>
                <label className="block mb-1 font-medium">Nama Anggota</label>
                <Select value={anggota} onValueChange={setAnggota}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Ganti dengan data anggota dari Supabase */}
                    <SelectItem value="1">Siti Aminah</SelectItem>
                    <SelectItem value="2">Dewi Lestari</SelectItem>
                    <SelectItem value="3">Rina Wati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Jenis Iuran */}
              <div>
                <label className="block mb-1 font-medium">Jenis Iuran</label>
                {loadingIuran ? (
                  <div className="text-muted-foreground">Memuat data jenis iuran...</div>
                ) : errorIuran ? (
                  <div className="text-red-500">Gagal memuat jenis iuran</div>
                ) : (
                  <Select value={jenisIuran} onValueChange={(val) => {
                    setJenisIuran(val);
                    setJumlahManual(false); // Reset manual jika ganti jenis iuran
                    // Cari nominal default dari kategoriIuran
                    const selected = kategoriIuran?.find((item) => item.id.toString() === val);
                    if (selected && selected.nominal && selected.nominal > 0) {
                      setJumlah(selected.nominal);
                    } else {
                      setJumlah(undefined);
                    }
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis iuran" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingIuran ? (
                        <SelectItem value="loading">Memuat...</SelectItem>
                      ) : errorIuran ? (
                        <SelectItem value="error">Error memuat data</SelectItem>
                      ) : kategoriIuran && kategoriIuran.length > 0 ? (
                        kategoriIuran.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.nama} - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.nominal)}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty">Belum ada data jenis iuran</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {/* Jumlah Setoran */}
              <div>
                <label className="block mb-1 font-medium">Jumlah Setoran</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={jumlah === undefined ? '' : jumlah}
                  onChange={(e) => {
                    setJumlah(e.target.valueAsNumber);
                    setJumlahManual(true);
                  }}
                  min="0"
                  placeholder="Isi jumlah setoran"
                  disabled={jenisIuran === ""}
                />
              </div>
              {/* Tanggal Setoran */}
              <div className="flex flex-col items-center">
                <label className="block mb-1 font-medium text-center">Tanggal Setoran</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-60 border rounded p-2 text-center"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    placeholder="dd mmmm yyyy (contoh: 20 Agustus 2025)"
                    maxLength={25}
                  />
                  <CalendarPopover tanggal={tanggal} setTanggal={setTanggal} />
                </div>
                {/* Validasi format tanggal dd mmmm yyyy */}
                {tanggal && !/^\d{2} [A-Za-zÀ-ÿ]+ \d{4}$/.test(tanggal) && (
                  <div className="text-red-500 text-xs mt-1">Format: 2 digit tanggal + spasi + nama bulan (Indonesia) + spasi + 4 digit tahun. Contoh: 20 Agustus 2025</div>
                )}
              </div>
              {/* Keterangan */}
              <div>
                <label className="block mb-1 font-medium">Keterangan (opsional)</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan tambahan"
                />
              </div>
              <Button type="submit" className="w-full mt-2">
                Simpan Setoran
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Komponen CalendarPopover untuk memilih tanggal via kalender
import { Calendar } from "@/components/ui/calendar";
function CalendarPopover({ tanggal, setTanggal }: { tanggal: string; setTanggal: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  // Parse tanggal string ke Date
  function parseTanggal(str: string): Date | undefined {
    const regex = /^(\d{2}) ([A-Za-zÀ-ÿ]+) (\d{4})$/;
    const match = str.match(regex);
    if (!match) return undefined;
    const dd = parseInt(match[1], 10);
    const bulanIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const mm = bulanIndo.findIndex(b => b.toLowerCase() === match[2].toLowerCase());
    if (mm < 0) return undefined;
    const yyyy = parseInt(match[3], 10);
    return new Date(yyyy, mm, dd);
  }
  // Format Date ke dd mmmm yyyy
  function formatTanggal(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const bulanIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const mmmm = bulanIndo[date.getMonth()];
    const yyyy = date.getFullYear();
    return `${dd} ${mmmm} ${yyyy}`;
  }
  return (
    <div className="relative">
      <button
        type="button"
        className="border rounded p-2 bg-white hover:bg-gray-100"
        title="Pilih tanggal dari kalender"
        onClick={() => setOpen((v) => !v)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </button>
      {open && (
        <div className="absolute top-10 left-1 z-50 bg-white rounded shadow-lg p-2">
          <Calendar
            mode="single"
            selected={parseTanggal(tanggal)}
            onSelect={(date) => {
              if (date) setTanggal(formatTanggal(date));
              setOpen(false);
            }}

            initialFocus
          />
        </div>
      )}
    </div>
  );
}

export default Setoran;