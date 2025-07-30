import { useHapusPengeluaranRT, PengeluaranRT } from "@/integrations/supabase/usePengeluaran";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit, Trash2, Calendar, DollarSign, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  data: PengeluaranRT[];
  isLoading: boolean;
  onEdit: (pengeluaran: PengeluaranRT) => void;
}

export default function PengeluaranTable({ data, isLoading, onEdit }: Props) {
  const hapusPengeluaran = useHapusPengeluaranRT();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getKategoriBadge = (kategori: string) => {
    const badges = {
      arisan_uang: { label: 'Arisan Uang', color: 'bg-blue-100 text-blue-800' },
      arisan_barang: { label: 'Arisan Barang', color: 'bg-green-100 text-green-800' },
      sosial: { label: 'Sosial', color: 'bg-purple-100 text-purple-800' },
      tabungan_lebaran: { label: 'Tabungan Lebaran', color: 'bg-orange-100 text-orange-800' },
      tabungan_piknik: { label: 'Tabungan Piknik', color: 'bg-pink-100 text-pink-800' },
      lainnya: { label: 'Lainnya', color: 'bg-gray-100 text-gray-800' },
    };
    return badges[kategori as keyof typeof badges] || badges.lainnya;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Memuat data pengeluaran...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">Belum ada pengeluaran</p>
          <p className="text-sm text-muted-foreground">Tambahkan pengeluaran pertama untuk memulai</p>
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tanggal</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Kategori</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deskripsi</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nominal</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Penerima</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => {
              const kategoriBadge = getKategoriBadge(item.kategori);
              return (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={kategoriBadge.color}>
                      {kategoriBadge.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-xs">
                    {item.deskripsi}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {formatCurrency(item.nominal)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {item.penerima?.nama || item.penerima_nama || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {confirmId === item.id ? (
                        <div className="flex gap-1">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => hapusPengeluaran.mutate(item.id, { onSettled: () => setConfirmId(null) })}
                            disabled={hapusPengeluaran.isPending}
                            className="h-8 px-3 text-xs"
                          >
                            {hapusPengeluaran.isPending ? "..." : "Yakin?"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setConfirmId(null)}
                            className="h-8 px-3 text-xs"
                          >
                            Batal
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setConfirmId(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
