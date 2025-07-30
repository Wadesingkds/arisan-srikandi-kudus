import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PesertaArisanTable from "@/components/PesertaArisanTable";
import PesertaArisanForm from "@/components/PesertaArisanForm";
import { useState, useMemo } from "react";
import { usePesertaArisan } from "@/integrations/supabase/usePesertaArisan";

const PesertaArisan = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allPeserta, isLoading } = usePesertaArisan();

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null); // Clear editData when modal closes
  };

  const handleAddPeserta = () => {
    setEditData(null); // Ensure editData is null for new peserta
    setModalOpen(true);
  };

  // Filter peserta based on search term
  const filteredPeserta = useMemo(() => {
    if (!allPeserta) return [];
    if (!searchTerm.trim()) return allPeserta;
    
    return allPeserta.filter(peserta => 
      peserta.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.no_wa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peserta.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPeserta, searchTerm]);

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
            <div>
              <h1 className="text-2xl font-bold">Data Peserta Arisan</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? "Memuat..." : `${filteredPeserta.length} dari ${allPeserta?.length || 0} peserta`}
              </p>
            </div>
          </div>
          <Button onClick={handleAddPeserta} className="shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Peserta
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, nomor WA, atau role peserta..."
              className="pl-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              Daftar Peserta Arisan RT 04 RW 01
              {searchTerm && (
                <span className="text-sm font-normal text-muted-foreground">
                  (hasil pencarian: "{searchTerm}")
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PesertaArisanTable 
              data={filteredPeserta}
              isLoading={isLoading}
              onEdit={(peserta) => { 
                setEditData(peserta); 
                setModalOpen(true); 
              }} 
            />
          </CardContent>
        </Card>
        <PesertaArisanForm open={modalOpen} onClose={handleCloseModal} initialData={editData} />
      </div>
    </div>
  );
};

export default PesertaArisan;
