import { useState } from "react";
import { ArrowLeft, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BulkWithdrawalTabungan from "@/components/BulkWithdrawalTabungan";

export default function PenarikanTabungan() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSuccess = () => {
    setSuccessMessage("Penarikan tabungan kolektif berhasil diproses!");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Penarikan Tabungan Kolektif</h1>
              <p className="text-gray-600">Proses penarikan tabungan untuk banyak peserta sekaligus</p>
            </div>
          </div>
        </div>

        {successMessage && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Users className="h-5 w-5" />
                <span>{successMessage}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Panduan Penarikan Kolektif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Alur Penarikan:</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Pilih jenis tabungan (Lebaran atau Piknik)</li>
                  <li>Tentukan tanggal penarikan</li>
                  <li>Pilih peserta yang akan menarik tabungan</li>
                  <li>Konfirmasi nominal penarikan (default: seluruh saldo)</li>
                  <li>Sistem otomatis mencatat penarikan & pengeluaran kas</li>
                </ol>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">
                  <strong>Catatan:</strong> Proses ini akan mengurangi saldo tabungan peserta dan otomatis mencatat sebagai pengeluaran kas RT.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Component */}
        <BulkWithdrawalTabungan 
          onClose={() => navigate(-1)}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
