import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Users, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import { useCreateSetoran } from "@/integrations/supabase/useSetoran";
import { useKategoriIuran } from "@/integrations/supabase/useKategoriIuran";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const Setoran = () => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [anggota, setAnggota] = useState("");
  const [selectedAnggota, setSelectedAnggota] = useState<string[]>([]);
  const [jenisIuran, setJenisIuran] = useState("");
  const [jumlah, setJumlah] = useState<number | undefined>(undefined);
  const [jumlahManual, setJumlahManual] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const { data: peserta, isLoading: loadingPeserta } = usePesertaArisan();
  const { data: kategoriIuran, isLoading: loadingIuran, error: errorIuran } = useKategoriIuran();
  const createSetoranMutation = useCreateSetoran();

  const handleBatchSubmit = async () => {
    if (selectedAnggota.length === 0) {
      toast.error("Pilih minimal 1 anggota");
      return;
    }
    if (!jenisIuran || !jumlah || !tanggal) {
      toast.error("Lengkapi semua data");
      return;
    }

    try {
      const promises = selectedAnggota.map(anggotaId => 
        createSetoranMutation.mutateAsync({
          warga_id: anggotaId,
          jenis_iuran: jenisIuran,
          nominal: jumlah,
          tanggal: tanggal
        })
      );
      await Promise.all(promises);
      toast.success(`Berhasil mencatat setoran untuk ${selectedAnggota.length} anggota`);
      setSelectedAnggota([]);
      setJenisIuran("");
      setJumlah(undefined);
      setTanggal("");
    } catch (error) {
      toast.error("Gagal mencatat setoran");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <h1 className="text-2xl font-bold">Catat Setoran</h1>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                mode === 'single' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              Single
            </button>
            <button
              type="button"
              onClick={() => setMode('batch')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                mode === 'batch' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Batch
            </button>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              Form Setoran Iuran {mode === 'batch' ? '(Batch)' : '(Single)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'single' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Anggota */}
                <div>
                  <label className="block mb-1 font-medium">Nama Anggota</label>
                  {loadingPeserta ? (
                    <div className="text-sm text-gray-500">Memuat data peserta...</div>
                  ) : (
                    <Select value={anggota} onValueChange={setAnggota}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih anggota" />
                      </SelectTrigger>
                      <SelectContent>
                        {peserta?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                <Button type="submit" disabled={createSetoranMutation.isPending || !anggota || !jenisIuran || !jumlah || !tanggal}>
                  {createSetoranMutation.isPending ? "Menyimpan..." : "Simpan Setoran"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Multi-select Anggota */}
                <div>
                  <label className="block mb-2 font-medium">Pilih Anggota</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                    {loadingPeserta ? (
                      <div className="text-sm text-gray-500">Memuat data peserta...</div>
                    ) : (
                      peserta?.map((p) => (
                        <label key={p.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <Checkbox
                            checked={selectedAnggota.includes(p.id.toString())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAnggota([...selectedAnggota, p.id.toString()]);
                              } else {
                                setSelectedAnggota(selectedAnggota.filter(id => id !== p.id.toString()));
                              }
                            }}
                          />
                          <span>{p.nama}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedAnggota.length} anggota terpilih
                  </div>
                </div>

                {/* Form untuk semua anggota */}
                <div className="space-y-4">
                  {/* Jenis Iuran */}
                  <div>
                    <label className="block mb-1 font-medium">Jenis Iuran</label>
                    {loadingIuran ? (
                      <div className="text-sm text-gray-500">Memuat data jenis iuran...</div>
                    ) : (
                      <Select value={jenisIuran} onValueChange={setJenisIuran}>
                        <SelectTrigger>
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
                                {item.nama} - {formatCurrency(item.nominal)}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty">Belum ada data jenis iuran</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Jumlah */}
                  <div>
                    <label className="block mb-1 font-medium">Jumlah Setoran</label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      value={jumlah === undefined ? '' : jumlah}
                      onChange={(e) => setJumlah(e.target.valueAsNumber)}
                      min="0"
                      placeholder="Isi jumlah setoran"
                    />
                  </div>

                  {/* Tanggal */}
                  <div>
                    <label className="block mb-1 font-medium">Tanggal Setoran</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 border rounded p-2"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        placeholder="dd mmmm yyyy (contoh: 20 Agustus 2025)"
                      />
                      <CalendarPopover tanggal={tanggal} setTanggal={setTanggal} />
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedAnggota.length > 0 && jumlah && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="text-sm font-medium text-blue-800">
                        Total: {selectedAnggota.length} anggota × {formatCurrency(jumlah)} = {formatCurrency(selectedAnggota.length * jumlah)}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleBatchSubmit}
                    disabled={createSetoranMutation.isPending || selectedAnggota.length === 0 || !jenisIuran || !jumlah || !tanggal}
                  >
                    {createSetoranMutation.isPending ? "Menyimpan..." : `Simpan ${selectedAnggota.length} Setoran`}
                  </Button>
                </div>
              </div>
            )}
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