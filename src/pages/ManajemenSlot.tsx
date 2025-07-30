import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useActiveSlots } from "@/integrations/supabase/useSlotArisanBarang";
import { useCreateSlot, useDeactivateSlot } from "@/integrations/supabase/useSlotArisanBarang";
import { usePesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManajemenSlot = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState<string>("");
  const [aliasInput, setAliasInput] = useState<string>("");
  
  // Data queries
  const slotsQuery = useActiveSlots();
  const pesertaQuery = usePesertaArisan();
  const createSlotMutation = useCreateSlot();
  const deactivateSlotMutation = useDeactivateSlot();

  // Handler untuk membuat slot baru
  const handleCreateSlot = () => {
    if (!selectedPeserta || !aliasInput.trim()) {
      toast.error("Silakan pilih peserta dan masukkan alias");
      return;
    }

    createSlotMutation.mutate({
      peserta_id: selectedPeserta,
      alias: aliasInput.trim(),
    });

    setOpenModal(false);
    setSelectedPeserta("");
    setAliasInput("");
  };

  // Handler untuk menonaktifkan slot
  const handleDeactivateSlot = (slotId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menonaktifkan slot ini?")) {
      deactivateSlotMutation.mutate(slotId);
    }
  };

  // Generate alias otomatis
  const generateAlias = (nama: string, existingSlots: number) => {
    const base = nama.substring(0, 3).toUpperCase();
    const suffix = String.fromCharCode(65 + existingSlots); // A, B, C, ...
    return `${base} ${suffix}`;
  };

  // Hitung jumlah slot per peserta
  const slotsPerPeserta = slotsQuery.data?.reduce((acc, slot) => {
    if (!acc[slot.peserta_id]) {
      acc[slot.peserta_id] = [];
    }
    acc[slot.peserta_id].push(slot);
    return acc;
  }, {} as Record<string, typeof slotsQuery.data>) || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Manajemen Slot Arisan Barang</h1>
              <p className="text-muted-foreground">Kelola slot arisan per peserta</p>
            </div>
          </div>
          <Button onClick={() => setOpenModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Slot
          </Button>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Slot Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{slotsQuery.data?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(slotsPerPeserta).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rata-rata Slot/Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(slotsPerPeserta).length > 0 
                  ? Math.round((slotsQuery.data?.length || 0) / Object.keys(slotsPerPeserta).length)
                  : 0
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Slot per Peserta */}
        <div className="grid gap-6">
          {pesertaQuery.data?.map((peserta) => {
            const pesertaSlots = slotsPerPeserta[peserta.id] || [];
            
            return (
              <Card key={peserta.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{peserta.nama}</CardTitle>
                  <p className="text-sm text-muted-foreground">{peserta.no_wa}</p>
                </CardHeader>
                <CardContent>
                  {pesertaSlots.length > 0 ? (
                    <div className="grid gap-2">
                      {pesertaSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-background"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="default">{slot.alias}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Terdaftar: {new Date(slot.tanggal_daftar).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivateSlot(slot.id)}
                            disabled={deactivateSlotMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Belum memiliki slot arisan barang
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Modal Tambah Slot */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Slot Baru</DialogTitle>
              <DialogDescription>
                Buat slot arisan barang untuk peserta yang dipilih
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Pilih Peserta</label>
                <Select value={selectedPeserta} onValueChange={setSelectedPeserta}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peserta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pesertaQuery.data?.map((peserta) => (
                      <SelectItem key={peserta.id} value={peserta.id}>
                        {peserta.nama} - {peserta.no_wa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Alias Slot</label>
                <input
                  type="text"
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                  placeholder="Contoh: Ani A"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Gunakan alias unik untuk setiap slot
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setOpenModal(false)}
              >
                Batal
              </Button>
              <Button 
                onClick={handleCreateSlot}
                disabled={!selectedPeserta || !aliasInput.trim()}
              >
                Buat Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManajemenSlot;
