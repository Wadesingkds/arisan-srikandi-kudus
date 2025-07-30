import { useHapusPesertaArisan, PesertaArisan } from "@/integrations/supabase/usePesertaArisan";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Edit, Trash2, User } from "lucide-react";

interface Props {
  data: PesertaArisan[];
  isLoading: boolean;
  onEdit: (peserta: PesertaArisan) => void;
}

export default function PesertaArisanTable({ data, isLoading, onEdit }: Props) {
  const hapusPeserta = useHapusPesertaArisan();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Memuat data peserta...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">Belum ada peserta</p>
          <p className="text-sm text-muted-foreground">Klik "Tambah Peserta" untuk menambahkan peserta pertama</p>
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nama</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">No WA</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((peserta, idx) => (
              <tr key={peserta.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{peserta.nama}</div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {peserta.no_wa || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {peserta.role || 'Peserta'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(peserta)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {confirmId === peserta.id ? (
                      <div className="flex gap-1">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => hapusPeserta.mutate(peserta.id, { onSettled: () => setConfirmId(null) })}
                          disabled={hapusPeserta.isPending}
                          className="h-8 px-3 text-xs"
                        >
                          {hapusPeserta.isPending ? "..." : "Yakin?"}
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
                        onClick={() => setConfirmId(peserta.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
