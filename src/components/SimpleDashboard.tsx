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
  AlertCircle
} from 'lucide-react';
import DrawModal from './DrawModal';

export default function SimpleDashboard() {
  const [showHelp, setShowHelp] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
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
    setShowDrawModal(true);
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
      action: () => {
        const daftarPeserta = peserta.map(p => `${p.nama} (${p.no})`).join('\n');
        alert(`📋 Daftar Peserta Arisan:\n\n${daftarPeserta}\n\nSemua dalam keadaan baik!`);
      }
    },
    {
      title: "Cek setoran hari ini",
      description: `${setoranData.length} setoran tercatat`,
      icon: DollarSign,
      color: "border-green-200 bg-green-50 hover:bg-green-100",
      action: () => {
        const totalSetoran = setoranData.reduce((sum, s) => sum + s.jumlah, 0);
        const daftarSetoran = setoranData.map(s => `${s.nama}: Rp ${s.jumlah.toLocaleString()}`).join('\n');
        alert(`💰 Setoran Terbaru:\n\n${daftarSetoran}\n\nTotal: Rp ${totalSetoran.toLocaleString()}`);
      }
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
      action: () => {
        const kontak = "Admin: Ibu Ani (0812-3456-7890)\n\nJam kerja:\nSenin-Jumat: 08.00-17.00\nSabtu: 08.00-12.00";
        alert(`📞 Kontak Admin:\n\n${kontak}\n\nSiap membantu kapan saja!`);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Halo, Selamat Datang! 👋</h1>
          <p className="text-purple-100">Aplikasi Arisan Sederhana untuk Semua</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Ringkasan Cepat */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 text-center">
                <div className={`h-8 w-8 ${stat.color} mx-auto mb-2`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tombol Cepat */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Mau ngapain hari ini?
          </h2>
          
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`w-full p-4 rounded-xl border-2 ${action.color} transition-all hover:scale-105`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8">
                  <action.icon className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </div>
            </button>
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
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowHelp(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Lihat Petunjuk Penggunaan
            </Button>
            
            <div className="text-sm text-gray-600">
              <p>🎯 Mode ini dirancang khusus untuk user awam</p>
              <p>📱 Semua fitur bisa dipakai tanpa ribet</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>💝 Aplikasi Arisan Srikandi Kudus</p>
          <p>Untuk kebersamaan yang lebih baik</p>
        </div>
      </div>

      <DrawModal 
        isOpen={showDrawModal}
        onClose={() => setShowDrawModal(false)}
        winner={winner}
        onRedraw={handleDrawLottery}
      />
    </div>
  );
}
