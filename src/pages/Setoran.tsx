import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Setoran = () => {
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
            <h1 className="text-2xl font-bold">Catat Setoran</h1>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih bulan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Januari 2024</SelectItem>
              <SelectItem value="2024-02">Februari 2024</SelectItem>
              <SelectItem value="2024-03">Maret 2024</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Jenis iuran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bulanan">Iuran Bulanan</SelectItem>
              <SelectItem value="arisan">Arisan</SelectItem>
              <SelectItem value="kebersihan">Kebersihan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Form Setoran Iuran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur pencatatan setoran akan segera tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setoran;