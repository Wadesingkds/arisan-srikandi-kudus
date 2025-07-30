import { useTambahPengeluaranRT, useEditPengeluaranRT, PengeluaranRT } from "@/integrations/supabase/usePengeluaran";
import { usePesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, DollarSign, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: PengeluaranRT | null;
}

const kategoriOptions = [
  { value: 'arisan_uang', label: 'Arisan Uang' },
  { value: 'arisan_barang', label: 'Arisan Barang' },
  { value: 'sosial', label: 'Sosial' },
  { value: 'tabungan_lebaran', label: 'Tabungan Lebaran' },
  { value: 'tabungan_piknik', label: 'Tabungan Piknik' },
  { value: 'lainnya', label: 'Lainnya' },
];

export default function PengeluaranForm({ open, onClose, initialData }: Props) {
  const [tanggal, setTanggal] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [kategori, setKategori] = useState(initialData?.kategori || 'arisan_uang');
  const [nominal, setNominal] = useState(initialData?.nominal?.toString() || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [penerimaId, setPenerimaId] = useState(initialData?.penerima_id || undefined);
  const [penerimaNama, setPenerimaNama] = useState(initialData?.penerima_nama || '');
  const [errors, setErrors] = useState<{
    kategori?: string;
    nominal?: string;
    deskripsi?: string;
  }>({});

  const tambah = useTambahPengeluaranRT();
  const edit = useEditPengeluaranRT();
  const { data: peserta } = usePesertaArisan();

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode
        setTanggal(format(new Date(initialData.tanggal), 'yyyy-MM-dd'));
        setKategori(initialData.kategori);
        setNominal(initialData.nominal.toString());
        setDeskripsi(initialData.deskripsi);
        setPenerimaId(initialData.penerima_id || '');
        setPenerimaNama(initialData.penerima_nama || '');
      } else {
        // Add mode
        setTanggal(format(new Date(), 'yyyy-MM-dd'));
        setKategori('arisan_uang'); // Default value to prevent empty string
        setNominal('');
        setDeskripsi('');
        setPenerimaId('');
        setPenerimaNama('');
      }
      setErrors({});
    }
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors: {
      kategori?: string;
      nominal?: string;
      deskripsi?: string;
    } = {};

    if (!kategori) {
      newErrors.kategori = "Kategori wajib dipilih";
    }
    if (!nominal || parseFloat(nominal) <= 0) {
      newErrors.nominal = "Nominal wajib diisi dan lebih dari 0";
    }
    if (!deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const pengeluaranData = {
      tanggal,
      kategori,
      nominal: parseFloat(nominal),
      deskripsi,
      penerima_id: penerimaId || null,
      penerima_nama: penerimaNama || null,
    };

    try {
      if (initialData) {
        await edit.mutateAsync({ id: initialData.id, ...pengeluaranData });
      } else {
        await tambah.mutateAsync(pengeluaranData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving pengeluaran:', error);
    }
  };

  const isLoading = tambah.isPending || edit.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Pengeluaran' : 'Tambah Pengeluaran RT'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Edit data pengeluaran kas RT'
              : 'Tambahkan pengeluaran baru untuk kas RT'
          }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tanggal
            </Label>
            <Input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Kategori
            </Label>
            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger className={errors.kategori ? "border-destructive" : ""}>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && <p className="text-sm text-destructive">{errors.kategori}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nominal" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Nominal
            </Label>
            <Input
              id="nominal"
              type="number"
              placeholder="Masukkan nominal"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className={errors.nominal ? "border-destructive" : ""}
              required
            />
            {errors.nominal && <p className="text-sm text-destructive">{errors.nominal}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Deskripsi
            </Label>
            <Input
              id="deskripsi"
              placeholder="Contoh: Pemenang arisan Bu Ani"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className={errors.deskripsi ? "border-destructive" : ""}
              required
            />
            {errors.deskripsi && <p className="text-sm text-destructive">{errors.deskripsi}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="penerima" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Penerima
            </Label>
            <Select value={penerimaId || undefined} onValueChange={setPenerimaId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih penerima (opsional)" />
              </SelectTrigger>
              <SelectContent>
                {peserta?.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {initialData ? "Menyimpan..." : "Menambah..."}
                </div>
              ) : (
                initialData ? "Simpan" : "Tambah"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
