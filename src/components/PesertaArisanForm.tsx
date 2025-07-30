import { useTambahPesertaArisan, useEditPesertaArisan, PesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Shield } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: PesertaArisan | null;
}

export default function PesertaArisanForm({ open, onClose, initialData }: Props) {
  const [nama, setNama] = useState("");
  const [noWa, setNoWa] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{ nama?: string; noWa?: string }>({});
  const tambah = useTambahPesertaArisan();
  const edit = useEditPesertaArisan();

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      if (initialData) {
        // Edit mode: populate with existing data
        setNama(initialData.nama || "");
        setNoWa(initialData.no_wa || "");
        setRole(initialData.role || "");
      } else {
        // Add mode: clear all fields
        setNama("");
        setNoWa("");
        setRole("");
      }
      setErrors({});
    }
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors: { nama?: string; noWa?: string } = {};
    
    if (!nama.trim()) {
      newErrors.nama = "Nama peserta wajib diisi";
    } else if (nama.trim().length < 2) {
      newErrors.nama = "Nama minimal 2 karakter";
    }
    
    if (noWa && !/^[0-9+\-\s()]+$/.test(noWa)) {
      newErrors.noWa = "Format nomor WA tidak valid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      if (initialData) {
        await edit.mutateAsync({ id: initialData.id, nama: nama.trim(), no_wa: noWa.trim() || null, role: role === "peserta" ? null : (role as "ketua_rt" | "bendahara" | "admin") });
      } else {
        await tambah.mutateAsync({ nama: nama.trim(), no_wa: noWa.trim() || null, role: role === "peserta" ? null : (role as "ketua_rt" | "bendahara" | "admin"), user_id: crypto.randomUUID() });
      }
      onClose();
    } catch (error) {
      console.error('Error saving peserta:', error);
    }
  };

  const isLoading = tambah.isPending || edit.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {initialData ? "Edit Peserta Arisan" : "Tambah Peserta Arisan"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Ubah informasi peserta arisan yang sudah ada." : "Tambahkan peserta baru ke dalam arisan."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nama" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nama Peserta *
            </Label>
            <Input 
              id="nama"
              placeholder="Masukkan nama lengkap peserta" 
              value={nama} 
              onChange={e => setNama(e.target.value)}
              className={errors.nama ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="noWa" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Nomor WhatsApp
            </Label>
            <Input 
              id="noWa"
              placeholder="Contoh: 081234567890" 
              value={noWa} 
              onChange={e => setNoWa(e.target.value)}
              className={errors.noWa ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.noWa && <p className="text-sm text-destructive">{errors.noWa}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role/Jabatan
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role (opsional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peserta">Peserta Biasa</SelectItem>
                <SelectItem value="Ketua">Ketua</SelectItem>
                <SelectItem value="ketua_rt">Ketua RT</SelectItem>
                <SelectItem value="bendahara">Bendahara</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
                initialData ? "Simpan Perubahan" : "Tambah Peserta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
