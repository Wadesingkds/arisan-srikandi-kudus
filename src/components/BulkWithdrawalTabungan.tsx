import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, DollarSign, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { usePesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import { useDetailTabungan } from "@/integrations/supabase/useLaporanKeuangan";
import { useTambahPengeluaranRT } from "@/integrations/supabase/usePengeluaran";

interface BulkWithdrawalTabunganProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface WithdrawalItem {
  peserta_id: string;
  nama: string;
  saldo: number;
  nominal: number;
  selected: boolean;
}

export default function BulkWithdrawalTabungan({ onClose, onSuccess }: BulkWithdrawalTabunganProps) {
  const [jenisTabungan, setJenisTabungan] = useState<'lebaran' | 'piknik'>('lebaran');
  const [tanggal, setTanggal] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [keterangan, setKeterangan] = useState('');
  const [withdrawalItems, setWithdrawalItems] = useState<WithdrawalItem[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  const { data: peserta } = usePesertaArisan();
  const { data: allTabungan } = useDetailTabungan();
  const tambahPengeluaran = useTambahPengeluaranRT();

  useEffect(() => {
    if (peserta && allTabungan) {
      const filteredTabungan = allTabungan.filter(t => 
        t.jenis === jenisTabungan && t.nominal > 0
      );
      
      // Create a map to track tabungan per peserta
      const pesertaTabunganMap = new Map();
      filteredTabungan.forEach(t => {
        const current = pesertaTabunganMap.get(t.nama_peserta) || 0;
        pesertaTabunganMap.set(t.nama_peserta, current + t.nominal);
      });

      const items = peserta
        .filter(p => pesertaTabunganMap.has(p.nama))
        .map(p => {
          const saldo = pesertaTabunganMap.get(p.nama) || 0;
          return {
            peserta_id: p.id,
            nama: p.nama,
            saldo: saldo,
            nominal: saldo,
            selected: true
          };
        });

      setWithdrawalItems(items);
    }
  }, [peserta, allTabungan, jenisTabungan]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setWithdrawalItems(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (pesertaId: string, checked: boolean) => {
    setWithdrawalItems(prev => prev.map(item => 
      item.peserta_id === pesertaId ? { ...item, selected: checked } : item
    ));
  };

  const handleNominalChange = (pesertaId: string, value: string) => {
    const nominal = parseInt(value) || 0;
    setWithdrawalItems(prev => prev.map(item => 
      item.peserta_id === pesertaId ? { ...item, nominal } : item
    ));
  };

  const handleProcessWithdrawal = async () => {
    const selectedItems = withdrawalItems.filter(item => item.selected && item.nominal > 0);
    
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu peserta untuk penarikan');
      return;
    }

    try {
      // Process each withdrawal
      for (const item of selectedItems) {
        // Add to pengeluaran (expense)
        await tambahPengeluaran.mutateAsync({
          tanggal,
          kategori: jenisTabungan === 'lebaran' ? 'tabungan_lebaran' : 'tabungan_piknik',
          nominal: item.nominal,
          deskripsi: keterangan || `Penarikan tabungan ${jenisTabungan} untuk ${item.nama}`,
          penerima_id: item.peserta_id,
          penerima_nama: item.nama
        });

        // Update tabungan balance (this would need to be implemented in the tabungan hooks)
        // For now, we'll just log it
        console.log(`Penarikan ${item.nominal} untuk ${item.nama} - ${jenisTabungan}`);
      }

      alert(`Berhasil memproses penarikan tabungan ${jenisTabungan} untuk ${selectedItems.length} peserta`);
      onSuccess();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Gagal memproses penarikan');
    }
  };

  const totalWithdrawal = withdrawalItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.nominal, 0);

  const selectedCount = withdrawalItems.filter(item => item.selected).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Penarikan Tabungan Kolektif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Jenis Tabungan</Label>
              <Select 
                value={jenisTabungan} 
                onValueChange={(value) => setJenisTabungan(value as 'lebaran' | 'piknik')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lebaran">Tabungan Lebaran</SelectItem>
                  <SelectItem value="piknik">Tabungan Piknik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tanggal Penarikan</Label>
              <Input 
                type="date" 
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>

            <div>
              <Label>Keterangan</Label>
              <Input 
                placeholder="Contoh: Penarikan menjelang lebaran"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Ringkasan Penarikan</h3>
                <p className="text-sm text-blue-700">
                  {selectedCount} peserta terpilih dari {withdrawalItems.length} peserta total
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-700">Total Penarikan</p>
                <p className="text-2xl font-bold text-blue-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalWithdrawal)}
                </p>
              </div>
            </div>
          </div>

          {/* Select All */}
          <div className="flex items-center gap-2">
            <Checkbox 
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="font-medium">
              Pilih semua peserta
            </Label>
          </div>

          {/* Participants List */}
          <div className="border rounded-lg">
            <div className="bg-gray-50 p-4 font-semibold flex items-center justify-between">
              <span>Daftar Peserta</span>
              <span>Saldo Tabungan</span>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {withdrawalItems.map((item) => (
                <div key={item.peserta_id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                  <Checkbox 
                    checked={item.selected}
                    onCheckedChange={(checked) => handleSelectItem(item.peserta_id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-sm text-gray-600">
                      Saldo: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.saldo)}
                    </p>
                  </div>

                  <div className="w-32">
                    <Input 
                      type="number"
                      value={item.nominal}
                      onChange={(e) => handleNominalChange(item.peserta_id, e.target.value)}
                      disabled={!item.selected}
                      className="text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              onClick={handleProcessWithdrawal}
              disabled={selectedCount === 0 || totalWithdrawal === 0}
            >
              Proses Penarikan Kolektif
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
