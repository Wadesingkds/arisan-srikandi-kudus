import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Laporan = () => {
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
            <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Januari 2024</SelectItem>
              <SelectItem value="2024-02">Februari 2024</SelectItem>
              <SelectItem value="2024-03">Maret 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Jenis laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="keuangan">Keuangan</SelectItem>
              <SelectItem value="setoran">Setoran</SelectItem>
              <SelectItem value="arisan">Arisan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Pemasukan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">Rp 2.500.000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">Rp 1.200.000</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saldo Akhir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">Rp 1.300.000</p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur laporan keuangan akan segera tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Laporan;