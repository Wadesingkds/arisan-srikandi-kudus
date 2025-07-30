import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Phone, 
  MessageCircle, 
  HelpCircle,
  CheckCircle,
  Trophy
} from 'lucide-react';
import { 
  PesertaModal, 
  SetoranModal, 
  KontakModal, 
  UndianModal 
} from './organisms/SimpleModals';

export default function SimpleDashboard() {
  const [showHelp, setShowHelp] = useState(false);
  const [showPesertaModal, setShowPesertaModal] = useState(false);
  const [showSetoranModal, setShowSetoranModal] = useState(false);
  const [showKontakModal, setShowKontakModal] = useState(false);
  const [showUndianModal, setShowUndianModal] = useState(false);
  const [winner, setWinner] = useState('');
  const [peserta, setPeserta] = useState([
    { nama: 'Ibu Sari', no: 'D.04-12', status: 'Aktif' },
    { nama: 'Pak Budi', no: 'D.04-08', status: 'Aktif' },
    { nama: 'Ibu Rina', no: 'D.04-03', status: 'Aktif' },
    { nama: 'Pak Ahmad', no: 'D.04-05', status: 'Aktif' },
    { nama: 'Ibu Dewi', no: 'D.04-07', status: 'Aktif' }
  ]);
  const [setoranData, setSetoranData] = useState([
    { nama: 'Ibu Sari', jumlah: 12000, tanggal: '2024-07-30' },
    { nama: 'Pak Budi', jumlah: 12000, tanggal: '2024-07-29' },
    { nama: 'Ibu Rina', jumlah: 12000, tanggal: '2024-07-28' }
  ]);

  const handleDrawLottery = () => {
    const pesertaAktif = peserta.filter(p => p.status === 'Aktif');
    const pemenang = pesertaAktif[Math.floor(Math.random() * pesertaAktif.length)];
    setWinner(pemenang.nama);
    setShowUndianModal(true);
  };

  const totalSetoranBulanIni = setoranData.reduce((sum, s) => sum + s.jumlah, 0);
  const stats = [
    { label: "Total Peserta", value: `${peserta.length} orang`, icon: Users, color: "text-blue-600" },
    { label: "Setoran Bulan Ini", value: `Rp ${totalSetoranBulanIni.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
    { label: "Sudah Undian", value: "3 kali", icon: Calendar, color: "text-purple-600" },
    { label: "Pemenang Terakhir", value: winner || "Belum ada", icon: CheckCircle, color: "text-orange-600" }
  ];

  const quickActions = [
    {
      title: "Lihat data peserta",
      description: `${peserta.length} peserta aktif arisan`,
      icon: Users,
      color: "border-blue-200 bg-blue-50 hover:bg-blue-100",
      action: () => setShowPesertaModal(true)
    },
    {
      title: "Cek setoran hari ini",
      description: `${setoranData.length} setoran tercatat`,
      icon: DollarSign,
      color: "border-green-200 bg-green-50 hover:bg-green-100",
      action: () => setShowSetoranModal(true)
    },
    {
      title: "Lihat jadwal undian",
      description: "Klik untuk mulai undian",
      icon: Calendar,
      color: "border-purple-200 bg-purple-50 hover:bg-purple-100",
      action: handleDrawLottery
    },
    {
      title: "Hubungi admin",
      description: "Admin siap membantu",
      icon: Phone,
      color: "border-orange-200 bg-orange-50 hover:bg-orange-100",
      action: () => setShowKontakModal(true)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Mode Lengkap
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Arisan RT 04 RW 01 Demaan Kudus
          </h1>
          <p className="text-lg text-gray-600">
            Mode Sederhana - Mudah digunakan untuk semua peserta
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Ringkasan Cepat */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Kartu Aksi Cepat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={action.action}
                  >
                    {action.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bantuan Cepat */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Butuh Bantuan?
              </CardTitle>
            </CardHeader>
            <div className="text-center mt-8">
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Petunjuk
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Mode Lengkap
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>🎯 Mode ini dirancang khusus untuk user awam</p>
              <p>📱 Semua fitur bisa dipakai tanpa ribet</p>
              <p>💡 Klik tombol di atas untuk fitur yang diinginkan</p>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>💝 Aplikasi Arisan RT 04 RW 01 Demaan Kudus</p>
            <p>Untuk kebersamaan yang lebih baik</p>
          </div>
        </div>

        <PesertaModal 
          isOpen={showPesertaModal}
          onClose={() => setShowPesertaModal(false)}
          peserta={peserta}
        />
        
        <SetoranModal 
          isOpen={showSetoranModal}
          onClose={() => setShowSetoranModal(false)}
          setoranData={setoranData}
        />
        
        <KontakModal 
          isOpen={showKontakModal}
          onClose={() => setShowKontakModal(false)}
        />
        
        <UndianModal 
          isOpen={showUndianModal}
          onClose={() => setShowUndianModal(false)}
          winner={winner}
          onRedraw={handleDrawLottery}
        />
      </div>
      <PesertaModal 
        isOpen={showPesertaModal}
        onClose={() => setShowPesertaModal(false)}
        peserta={peserta}
      />
      
      <SetoranModal 
        isOpen={showSetoranModal}
        onClose={() => setShowSetoranModal(false)}
        setoranData={setoranData}
      />
      
      <KontakModal 
        isOpen={showKontakModal}
        onClose={() => setShowKontakModal(false)}
      />
      
      <UndianModal 
        isOpen={showUndianModal}
        onClose={() => setShowUndianModal(false)}
        winner={winner}
        onRedraw={handleDrawLottery}
      />
    </div>
  );
}
