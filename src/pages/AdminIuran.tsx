import { useState } from "react";
import { Link } from "react-router-dom";
import { useKategoriIuran } from "@/integrations/supabase/useKategoriIuran";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminIuran() {
  const { data: kategoriIuran, isLoading, error, refetch } = useKategoriIuran();
  const [editId, setEditId] = useState<number | null>(null);
  const [editNominal, setEditNominal] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const startEdit = (id: number, nominal: number) => {
    setEditId(id);
    setEditNominal(nominal);
    setMsg("");
  };

  const saveEdit = async () => {
    if (editId == null) return;
    setSaving(true);
    setMsg("");
    const { error } = await supabase
      .from("kategori_iuran")
      .update({ nominal: editNominal })
      .eq("id", editId);
    setSaving(false);
    if (error) {
      setMsg("Gagal menyimpan: " + error.message);
    } else {
      setMsg("Berhasil disimpan!");
      setEditId(null);
      refetch();
    }
  };

  // State untuk tambah iuran
  const [newNama, setNewNama] = useState("");
  const [newNominal, setNewNominal] = useState(0);
  const [newWajib, setNewWajib] = useState(true);
  const [adding, setAdding] = useState(false);

  const addIuran = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMsg("");
    const { error } = await supabase
      .from("kategori_iuran")
      .insert({ nama: newNama, nominal: newNominal, wajib: newWajib });
    setAdding(false);
    if (error) {
      setMsg("Gagal menambah: " + error.message);
    } else {
      setMsg("Berhasil menambah iuran!");
      setNewNama("");
      setNewNominal(0);
      setNewWajib(true);
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link to="/">
            <Button variant="outline" size="sm">&larr; Kembali ke Dashboard</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit & Tambah Jenis Iuran</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Form tambah iuran */}
            <form className="flex flex-wrap gap-2 mb-4 items-end" onSubmit={addIuran}>
              <div>
                <label className="block text-sm">Nama Iuran</label>
                <input className="border rounded p-1 w-40" required value={newNama} onChange={e => setNewNama(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm">Nominal (Rp)</label>
                <input type="number" min={0} className="border rounded p-1 w-28" required value={newNominal} onChange={e => setNewNominal(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-1">
                <input type="checkbox" id="wajib" checked={newWajib} onChange={e => setNewWajib(e.target.checked)} />
                <label htmlFor="wajib" className="text-sm">Wajib</label>
              </div>
              <Button size="sm" type="submit" disabled={adding} className="h-9">Tambah</Button>
            </form>

            {isLoading ? (
              <div>Memuat data...</div>
            ) : error ? (
              <div className="text-red-500">Gagal memuat data</div>
            ) : (
              <table className="w-full border mt-2">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Jenis Iuran</th>
                    <th className="p-2 text-left">Nominal (Rp)</th>
                    <th className="p-2">Wajib</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {kategoriIuran?.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2">{item.nama}</td>
                      <td className="p-2">
                        {editId === item.id ? (
                          <input
                            type="number"
                            value={editNominal}
                            min={0}
                            className="border rounded p-1 w-28"
                            onChange={(e) => setEditNominal(Number(e.target.value))}
                          />
                        ) : (
                          item.nominal.toLocaleString()
                        )}
                      </td>
                      <td className="p-2">{item.wajib ? 'Ya' : 'Tidak'}</td>
                      <td className="p-2">
                        {editId === item.id ? (
                          <Button size="sm" disabled={saving} onClick={saveEdit}>
                            Simpan
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(item.id, item.nominal)}>
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {msg && <div className="mt-2 text-sm text-green-600">{msg}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
