import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useSlotsForLottery } from "@/integrations/supabase/useSlotArisanBarang";
import { useCreateSetoranSlot } from "@/integrations/supabase/useSetoranSlot";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

const UndianSlot = () => {
  // State modal untuk undian
  const [openModal, setOpenModal] = useState<'uang' | 'barang' | null>(null);
  const [winner, setWinner] = useState<string>("");
  const [winnerSlotId, setWinnerSlotId] = useState<string>("");
  const [excludedSlots, setExcludedSlots] = useState<string[]>([]);
  
  // Data untuk undian
  const slotsQuery = useSlotsForLottery();
  const createSetoranMutation = useCreateSetoranSlot();

  // Filter slot aktif
  const activeSlots = slotsQuery.data?.filter(slot => slot.status_aktif) || [];

  // Handler untuk jalankan undian
  function handleUndian(kategori: 'uang' | 'barang') {
    if (!activeSlots || activeSlots.length === 0) {
      toast.error("Tidak ada slot aktif untuk diundi");
      return;
    }

    // Filter slot yang belum menang di periode ini
    const eligibleSlots = activeSlots.filter(slot => 
      !excludedSlots.includes(slot.id)
    );

    if (eligibleSlots.length === 0) {
      toast.error("Semua slot sudah menang di periode ini");
      return;
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * eligibleSlots.length);
    const selectedSlot = eligibleSlots[randomIndex];
    
    setWinner(selectedSlot.alias);
    setWinnerSlotId(selectedSlot.id);
    setOpenModal(kategori);
  }

  // Handler untuk menyimpan hasil undian
  function handleSaveResult() {
    if (!winnerSlotId) return;

    // Simpan hasil undian sebagai setoran (simulasi hadiah)
    const hadiahData = {
      slot_id: winnerSlotId,
      bulan: new Date().toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      }),
      nominal: 10000, // Nilai hadiah
      tanggal_setoran: new Date().toISOString(),
    };

    createSetoranMutation.mutate(hadiahData);
    
    // Tambahkan ke excluded slots
    setExcludedSlots(prev => [...prev, winnerSlotId]);
    
    toast.success(`Pemenang ${winner} berhasil disimpan`);
    setOpenModal(null);
  }

  // Statistik undian
  const totalSlots = activeSlots.length;
  const totalPeserta = new Set(activeSlots.map(slot => slot.warga_id)).size;

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
              <h1 className="text-2xl font-bold">Arisan Barang - Sistem Slot</h1>
              <p className="text-muted-foreground">Undian berbasis slot alias</p>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Slot Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSlots}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPeserta}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Slot Belum Menang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeSlots.length - excludedSlots.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Slot Aktif */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daftar Slot Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            {slotsQuery.isLoading ? (
              <div className="text-center py-4">Memuat data...</div>
            ) : (
              <div className="grid gap-2">
                {activeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      excludedSlots.includes(slot.id)
                        ? 'bg-muted/50 opacity-60'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={excludedSlots.includes(slot.id) ? "secondary" : "default"}
                      >
                        {slot.alias}
                      </Badge>
                      <div>
                        <div className="font-medium">{slot.nama_warga}</div>
                        <div className="text-sm text-muted-foreground">
                          {slot.no_wa}
                        </div>
                      </div>
                    </div>
                    {excludedSlots.includes(slot.id) && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tombol Undian */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleUndian('barang')}
            disabled={activeSlots.length === 0}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Jalankan Undian Arisan Barang
          </Button>
        </div>

        {/* Modal Hasil Undian */}
        <Dialog open={!!openModal} onOpenChange={setOpenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hasil Undian Arisan Barang</DialogTitle>
              <DialogDescription>
                Pemenang undian berdasarkan slot alias
              </DialogDescription>
            </DialogHeader>
            
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">{winner}</div>
              <div className="text-muted-foreground">
                Slot ini berhasil memenangkan arisan barang!
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleSaveResult}
                disabled={createSetoranMutation.isPending}
              >
                Simpan Hasil Undian
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setOpenModal(null)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UndianSlot;
