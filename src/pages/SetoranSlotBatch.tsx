import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { useSlotsByWarga } from "@/integrations/supabase/useSlotArisanBarang";
import { useCreateSetoranSlot } from "@/integrations/supabase/useSetoranSlot";
import { usePesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";

const SetoranSlotBatch = () => {
  const [selectedWarga, setSelectedWarga] = useState<string>("");
  const [selectedBulan, setSelectedBulan] = useState<string>("");
  const [slotAmounts, setSlotAmounts] = useState<Record<string, number>>({});
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [mode, setMode] = useState<'quick' | 'manual'>('quick');

  // Data queries
  const pesertaQuery = usePesertaArisan();
  const slotsQuery = useSlotsByWarga(selectedWarga);
  const createSetoranMutation = useCreateSetoranSlot();

  // Generate bulan options dengan tahun dinamis
  const currentYear = new Date().getFullYear();
  const bulanOptions = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ].map(bulan => `${bulan} ${currentYear}`);

  // Calculate totals
  const activeSlots = slotsQuery.data?.filter(slot => slot.status_aktif) || [];
  const totalSlots = activeSlots.length;
  const selectedCount = selectedSlots.length;
  const totalAmount = selectedSlots.reduce((sum, slotId) => {
    return sum + (slotAmounts[slotId] || 10000);
  }, 0);

  // Handle batch setoran
  const handleBatchSetoran = () => {
    if (!selectedWarga || !selectedBulan || selectedSlots.length === 0) {
      toast.error("Lengkapi semua data");
      return;
    }

    const promises = selectedSlots.map(slotId => {
      return createSetoranMutation.mutateAsync({
        slot_id: slotId,
        bulan: selectedBulan,
        nominal: slotAmounts[slotId] || 10000,
        tanggal_setoran: new Date().toISOString(),
      });
    });

    Promise.all(promises)
      .then(() => {
        toast.success(`Berhasil setoran ${selectedSlots.length} slot`);
        setSelectedSlots([]);
        setSlotAmounts({});
      })
      .catch((error) => {
        toast.error(`Gagal setoran: ${error.message}`);
      });
  };

  // Handle quick fill all
  const handleQuickFillAll = () => {
    const allSlotIds = activeSlots.map(slot => slot.id);
    const amounts = {};
    allSlotIds.forEach(id => {
      amounts[id] = 10000;
    });
    setSelectedSlots(allSlotIds);
    setSlotAmounts(amounts);
    setMode('manual');
  };

  // Handle slot selection
  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  // Handle amount change
  const handleAmountChange = (slotId: string, amount: string) => {
    const numAmount = parseInt(amount) || 0;
    setSlotAmounts(prev => ({ ...prev, [slotId]: numAmount }));
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
            <div>
              <h1 className="text-2xl font-bold">Setoran Arisan Barang</h1>
              <p className="text-muted-foreground">Sistem batch untuk multiple slot</p>
            </div>
          </div>
        </div>

        {/* Form Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pilih Peserta dan Periode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Peserta Arisan</Label>
                <Select value={selectedWarga} onValueChange={setSelectedWarga}>
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
                <Label>Bulan Setoran</Label>
                <Select value={selectedBulan} onValueChange={setSelectedBulan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bulan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {bulanOptions.map((bulan) => (
                      <SelectItem key={bulan} value={bulan}>
                        {bulan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slot Management */}
        {selectedWarga && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Slot Arisan - {activeSlots[0]?.nama_warga || 'Peserta'}
                <Badge className="ml-2">{activeSlots.length} slot aktif</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <Button 
                  size="sm"
                  onClick={handleQuickFillAll}
                  disabled={activeSlots.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Isi Semua Slot ({totalSlots}× Rp 10.000)
                </Button>
                
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setMode(mode === 'quick' ? 'manual' : 'quick')}
                >
                  {mode === 'quick' ? 'Manual' : 'Quick'} Mode
                </Button>
              </div>

              {/* Slot List */}
              <div className="space-y-2">
                {activeSlots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedSlots.includes(slot.id)}
                        onCheckedChange={() => handleSlotToggle(slot.id)}
                      />
                      <div>
                        <Badge>{slot.alias}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {slot.nama_warga}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Rp</span>
                      <Input
                        type="number"
                        value={slotAmounts[slot.id] || 10000}
                        onChange={(e) => handleAmountChange(slot.id, e.target.value)}
                        className="w-24"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {selectedSlots.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Total Setoran:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedSlots.length} slot × Rp 10.000
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        {selectedSlots.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleBatchSetoran}
              disabled={createSetoranMutation.isPending || !selectedBulan}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Check className="h-4 w-4 mr-2" />
              Simpan {selectedSlots.length} Setoran
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SetoranSlotBatch;
