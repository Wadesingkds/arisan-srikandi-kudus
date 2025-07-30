import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Filter, TrendingUp, TrendingDown, Wallet, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useLaporanKeuanganSummary, useDetailSetoran, useDetailTabungan, useRekapBulanan } from "@/integrations/supabase/useLaporanKeuangan";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Laporan = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("ringkasan");

  const { data: summary, isLoading: loadingSummary } = useLaporanKeuanganSummary();
  const { data: detailSetoran, isLoading: loadingSetoran } = useDetailSetoran();
  const { data: detailTabungan, isLoading: loadingTabungan } = useDetailTabungan();
  const { data: rekapBulanan, isLoading: loadingRekap } = useRekapBulanan();

  const filteredSetoran = detailSetoran?.filter(
    (item) => selectedPeriod === "all" || item.bulan === selectedPeriod
  );
  const filteredTabungan = detailTabungan?.filter(
    (item) => selectedPeriod === "all" || item.tanggal.includes(selectedPeriod)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportPDF = () => {
    const data = {
      summary,
      setoran: filteredSetoran,
      tabungan: filteredTabungan,
      rekap: rekapBulanan,
      exportDate: new Date().toLocaleDateString('id-ID')
    };
    
    const textContent = `LAPORAN KEUANGAN ARISAN RT 04 RW 01 DEMAAN KUDUS
Tanggal Export: ${data.exportDate}

RINGKASAN KEUANGAN:
- Total Pemasukan: ${formatCurrency(summary?.total_pemasukan || 0)}
- Total Pengeluaran: ${formatCurrency(summary?.total_pengeluaran || 0)}
- Saldo Akhir: ${formatCurrency(summary?.saldo_akhir || 0)}
- Total Peserta: ${summary?.total_peserta || 0}

DETAIL SETORAN (${filteredSetoran?.length || 0} transaksi):
${filteredSetoran?.map(s => 
  `- ${s.nama_peserta}: ${formatCurrency(s.nominal)} (${s.jenis_iuran}, ${s.bulan})`
).join('\n') || 'Belum ada data setoran'}

DETAIL TABUNGAN (${filteredTabungan?.length || 0} transaksi):
${filteredTabungan?.map(t => 
  `- ${t.nama_peserta}: ${formatCurrency(t.nominal)} (${t.jenis})`
).join('\n') || 'Belum ada data tabungan'}

REKAP BULANAN:
${rekapBulanan?.map(r => 
  `- ${r.bulan}: ${formatCurrency(r.total_pemasukan)} pemasukan, ${r.jumlah_transaksi} transaksi`
).join('\n') || 'Belum ada data rekap'}`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laporan-keuangan-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loadingSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
              <p className="text-muted-foreground">Pantau keuangan arisan secara real-time</p>
            </div>
          </div>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Periode</SelectItem>
                {rekapBulanan?.map((item) => (
                  <SelectItem key={item.bulan} value={item.bulan}>
                    {item.bulan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Pemasukan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(summary?.total_pemasukan || 0)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                dari {summary?.total_setoran || 0} setoran & {summary?.total_tabungan || 0} tabungan
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(summary?.total_pengeluaran || 0)}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Hadiah undian & pengeluaran lainnya
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Saldo Akhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(summary?.saldo_akhir || 0)}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Total saldo kas arisan
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Peserta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {summary?.total_peserta || 0}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Anggota aktif arisan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="setoran">Setoran</TabsTrigger>
            <TabsTrigger value="tabungan">Tabungan</TabsTrigger>
            <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
          </TabsList>

          <TabsContent value="ringkasan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grafik Keuangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>Grafik keuangan akan ditampilkan di sini</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setoran" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detail Setoran</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daftar seluruh setoran dari peserta arisan
                </p>
              </CardHeader>
              <CardContent>
                {loadingSetoran ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Nama Peserta</TableHead>
                          <TableHead>Jenis Iuran</TableHead>
                          <TableHead>Nominal</TableHead>
                          <TableHead>Bulan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSetoran?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.nama_peserta}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.jenis_iuran}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(item.nominal)}
                            </TableCell>
                            <TableCell>{item.bulan}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredSetoran?.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Belum ada data setoran
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tabungan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detail Tabungan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daftar seluruh tabungan peserta arisan
                </p>
              </CardHeader>
              <CardContent>
                {loadingTabungan ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Nama Peserta</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead>Nominal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTabungan?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {new Date(item.tanggal).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.nama_peserta}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.jenis}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(item.nominal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredTabungan?.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Belum ada data tabungan
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rekap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rekap Bulanan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ringkasan keuangan per bulan
                </p>
              </CardHeader>
              <CardContent>
                {loadingRekap ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Bulan</TableHead>
                          <TableHead>Total Pemasukan</TableHead>
                          <TableHead>Total Pengeluaran</TableHead>
                          <TableHead>Jumlah Transaksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rekapBulanan?.map((item) => (
                          <TableRow key={item.bulan}>
                            <TableCell className="font-medium">{item.bulan}</TableCell>
                            <TableCell className="text-green-600 font-medium">
                              {formatCurrency(item.total_pemasukan)}
                            </TableCell>
                            <TableCell className="text-red-600 font-medium">
                              {formatCurrency(item.total_pengeluaran)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {item.jumlah_transaksi} transaksi
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {rekapBulanan?.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Belum ada data rekap bulanan
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Laporan;