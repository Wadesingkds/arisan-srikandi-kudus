import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Warga = () => {
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
            <h1 className="text-2xl font-bold">Data Warga</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Warga
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama warga..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Warga RT 04 RW 01</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fitur manajemen data warga akan segera tersedia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Warga;