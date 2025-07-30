import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, Calendar, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { usePengeluaranRT, useTotalPengeluaranByKategori } from "@/integrations/supabase/usePengeluaran";
import PengeluaranTable from "@/components/PengeluaranTable";
import PengeluaranForm from "@/components/PengeluaranForm";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function Pengeluaran() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  
  const { data: allPengeluaran, isLoading } = usePengeluaranRT();
  const { data: totalByKategori } = useTotalPengeluaranByKategori();

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleAddPengeluaran = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalPengeluaran = () => {
    return allPengeluaran?.reduce((sum, item) => sum + item.nominal, 0) || 0;
  };

  const filteredPengeluaran = useMemo(() => {
    if (!allPengeluaran) return [];
    
    return allPengeluaran.filter(item => {
      const matchesSearch = !searchTerm.trim() || 
        item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.penerima?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.penerima_nama?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesKategori = kategoriFilter === "all" || item.kategori === kategoriFilter;
      
      return matchesSearch && matchesKategori;
    });
  }, [allPengeluaran, searchTerm, kategoriFilter]);

  const kategoriOptions = [
    { value: "all", label: "Semua Kategori" },
    { value: "arisan_uang", label: "Arisan Uang" },
    { value: "arisan_barang", label: "Arisan Barang" },
    { value: "sosial", label: "Sosial" },
    { value: "tabungan_lebaran", label: "Tabungan Lebaran" },
    { value: "tabungan_piknik", label: "Tabungan Piknik" },
    { value: "lainnya", label: "Lainnya" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-2xl font-bold">Pengeluaran Kas RT 04 RW 01</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? "Memuat..." : `${filteredPengeluaran.length} dari ${allPengeluaran?.length || 0} pengeluaran`}
              </p>
            </div>
          </div>
          <Button onClick={handleAddPengeluaran} className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengeluaran
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(getTotalPengeluaran())}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Jumlah Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {allPengeluaran?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kategori Terbanyak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {totalByKategori?.[0]?.kategori 
                  ? kategoriOptions.find(k => k.value === totalByKategori[0].kategori)?.label 
                  : 'Belum ada'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary by Category */}
        {totalByKategori && totalByKategori.length > 0 && (
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Ringkasan per Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {totalByKategori.map(item => {
                    const kategori = kategoriOptions.find(k => k.value === item.kategori);
                    return (
                      <div key={item.kategori} className="text-center">
                        <Badge variant="outline" className="mb-2">
                          {kategori?.label}
                        </Badge>
                        <div className="text-sm font-semibold">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari deskripsi atau penerima..."
              className="pl-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter kategori" />
            </SelectTrigger>
            <SelectContent>
              {kategoriOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setKategoriFilter(''); }}>
            Reset
          </Button>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daftar Pengeluaran Kas RT 04 RW 01
              {searchTerm && (
                <span className="text-sm font-normal text-muted-foreground">
                  (hasil pencarian: "{searchTerm}")
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PengeluaranTable 
              data={filteredPengeluaran}
              isLoading={isLoading}
              onEdit={(pengeluaran) => { 
                setEditData(pengeluaran); 
                setModalOpen(true); 
              }} 
            />
          </CardContent>
        </Card>

        <PengeluaranForm 
          open={modalOpen} 
          onClose={handleCloseModal} 
          initialData={editData} 
        />
      </div>
    </div>
  );
}
