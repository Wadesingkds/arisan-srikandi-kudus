import { Button } from "@/components/ui/button";
import { ArrowLeft, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Undian = () => {
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
            <h1 className="text-2xl font-bold">Undian Arisan</h1>
          </div>
          <Button>
            <Shuffle className="h-4 w-4 mr-2" />
            Jalankan Undian
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Arisan Uang
                <Badge variant="secondary">Aktif</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Rp 500.000</p>
              <p className="text-sm text-muted-foreground">Nominal per periode</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Arisan Barang
                <Badge variant="secondary">Aktif</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">15 Slot</p>
              <p className="text-sm text-muted-foreground">Total peserta</p>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Undian</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur undian arisan akan segera tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Undian;