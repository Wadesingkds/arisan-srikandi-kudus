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
import { supabase } from "@/integrations/supabase/client";

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
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: peserta } = usePesertaArisan();
  const { data: allTabungan } = useDetailTabungan();
  const tambahPengeluaran = useTambahPengeluaranRT();

  const handleProcessWithdrawal = async () => {
    const selectedItems = withdrawalItems.filter(item => item.selected && item.nominal > 0);
    
    if (selectedItems.length === 0) {
      alert('Tidak ada penarikan yang dipilih');
      return;
    }

    setIsProcessing(true);

    try {
      const totalPenarikan = selectedItems.reduce((sum, item) => sum + item.nominal, 0);
      
      // 1. Catat sebagai pengeluaran kas RT menggunakan hook yang ada
      await tambahPengeluaran.mutateAsync({
        kategori: jenisTabungan === 'lebaran' ? 'tabungan_lebaran' : 'tabungan_piknik',
        nominal: totalPenarikan,
        tanggal,
        deskripsi: keterangan || `Penarikan tabungan ${jenisTabungan} untuk ${selectedItems.length} peserta: ${selectedItems.map(i => i.nama).join(', ')}`
      });

      // 2. Update saldo tabungan untuk setiap peserta
      for (const item of selectedItems) {
        // Cari tabungan yang sesuai
        const { data: tabunganData } = await supabase
          .from('tabungan')
          .select('id, nominal')
          .eq('jenis', jenisTabungan)
          .eq('warga_id', item.peserta_id);

        if (tabunganData && tabunganData.length > 0) {
          const currentTabungan = tabunganData[0];
          const newNominal = Math.max(0, currentTabungan.nominal - item.nominal);

          await supabase
            .from('tabungan')
            .update({ nominal: newNominal })
            .eq('id', currentTabungan.id);
        }
      }

      alert(`Berhasil memproses penarikan tabungan ${jenisTabungan} untuk ${selectedItems.length} peserta`);
      onSuccess();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Gagal memproses penarikan');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchTabunganData = async () => {
      if (!peserta || !peserta.length) return;

      try {
        // Fetch tabungan dengan join ke tabel warga untuk mapping peserta
        const { data: tabunganData } = await supabase
          .from('tabungan')
          .select(`
            id,
            jenis,
            nominal,
            warga_id
          `)
          .eq('jenis', jenisTabungan)
          .gt('nominal', 0);

        if (tabunganData && tabunganData.length > 0) {
          // Create peserta map for quick lookup
          const pesertaMap = new Map();
          peserta.forEach(p => {
            pesertaMap.set(p.id, p.nama);
          });

          // Group tabungan by peserta_id and sum nominal
          const tabunganMap = new Map();
          tabunganData.forEach(item => {
            const current = tabunganMap.get(item.warga_id) || 0;
            tabunganMap.set(item.warga_id, current + (item.nominal || 0));
          });

          // Create withdrawal items
          const items = Array.from(tabunganMap.entries())
            .filter(([warga_id]) => pesertaMap.has(warga_id))
            .map(([warga_id, saldo]) => ({
              peserta_id: warga_id,
              nama: pesertaMap.get(warga_id) || '',
              saldo: saldo,
              nominal: saldo,
              selected: true
            }));

          setWithdrawalItems(items);
        } else {
          setWithdrawalItems([]);
        }
      } catch (error) {
        console.error('Error fetching tabungan:', error);
        setWithdrawalItems([]);
      }
    };

    if (peserta && peserta.length > 0) {
      fetchTabunganData();
    }
  }, [peserta, jenisTabungan]);

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
    setWithdrawalItems(prev => 
      prev.map(item => 
        item.peserta_id === pesertaId ? { ...item, nominal } : item
      )
    );
  };

  const handleSetFullAmount = (pesertaId: string) => {
    setWithdrawalItems(prev => 
      prev.map(item => 
        item.peserta_id === pesertaId ? { ...item, nominal: item.saldo } : item
      )
    );
  };

  const handleSubmit = async () => {
    const selectedItems = withdrawalItems.filter(item => item.selected && item.nominal > 0);
    
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu peserta untuk penarikan');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Catat sebagai pengeluaran kas RT
      const totalPenarikan = selectedItems.reduce((sum, item) => sum + item.nominal, 0);
      
      await tambahPengeluaran.mutateAsync({
        tanggal,
        kategori: jenisTabungan === 'lebaran' ? 'tabungan_lebaran' : 'tabungan_piknik',
        nominal: totalPenarikan,
        deskripsi: keterangan || `Penarikan tabungan ${jenisTabungan} untuk ${selectedItems.length} peserta: ${selectedItems.map(i => i.nama).join(', ')}`
      });

      // 2. Update saldo tabungan setiap peserta
      await updateTabunganSaldo.mutateAsync(selectedItems);

      alert(`Berhasil memproses penarikan tabungan ${jenisTabungan}`);
      onSuccess();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Gagal memproses penarikan');
    } finally {
      setIsProcessing(false);
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
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800">
                <strong>Catatan:</strong> Proses ini akan mengurangi saldo tabungan peserta dan otomatis mencatat sebagai pengeluaran kas RT. 
                <br />• <strong>Full withdrawal:</strong> Mengambil seluruh saldo (default)
                <br />• <strong>Partial withdrawal:</strong> Bisa diubah nominalnya per peserta
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left font-medium">Pilih</th>
                    <th className="p-3 text-left font-medium">Nama</th>
                    <th className="p-3 text-left font-medium">Saldo Tabungan</th>
                    <th className="p-3 text-left font-medium">Penarikan</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalItems.map((item) => (
                    <tr key={item.peserta_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={(checked) => handleSelectItem(item.peserta_id, checked as boolean)}
                        />
                      </td>
                      <td className="p-3">{item.nama}</td>
                      <td className="p-3">Rp {item.saldo.toLocaleString('id-ID')}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={item.nominal}
                            onChange={(e) => handleNominalChange(item.peserta_id, e.target.value)}
                            min="0"
                            max={item.saldo}
                            className="w-28"
                            disabled={!item.selected}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetFullAmount(item.peserta_id)}
                            className="text-xs"
                            disabled={!item.selected}
                          >
                            Full
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
