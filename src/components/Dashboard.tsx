import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Container, Grid, Main } from "@/components/layouts/Layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FileText, TrendingUp, Users, DollarSign, Trophy, Calendar, Upload, Download, PiggyBank, Coins, CreditCard, Plus } from "lucide-react";
import DrawModal from "./DrawModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [winner, setWinner] = useState('');

  const handleDrawLottery = () => {
    const peserta = ['Ibu Sari', 'Pak Budi', 'Ibu Rina', 'Pak Ahmad', 'Ibu Dewi', 'Ibu Ani', 'Pak Joko', 'Ibu Murni'];
    const pemenang = peserta[Math.floor(Math.random() * peserta.length)];
    setWinner(pemenang);
    setShowDrawModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Arisan RT 04 RW 01</h1>
              <p className="text-gray-600 mt-1">Kelola arisan Demaan Kudus dengan mudah dan efisien</p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Main>
        {/* Summary Cards */}
        <Grid cols={4} gap={6}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Total Peserta</span>
                <Users className="h-5 w-5 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">8</div>
              <CardDescription>peserta aktif</CardDescription>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Setoran Bulan Ini</span>
                <PiggyBank className="h-5 w-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">Rp 96.000</div>
              <CardDescription>8 peserta × Rp 12.000</CardDescription>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Total Undian</span>
                <Calendar className="h-5 w-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">12</div>
              <CardDescription>sudah dilakukan</CardDescription>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Dana Terkumpul</span>
                <Coins className="h-5 w-5 text-orange-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">Rp 1.440.000</div>
              <CardDescription>total 12 bulan</CardDescription>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid cols={4} gap={6}>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Peserta Arisan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Kelola data peserta arisan
              </CardDescription>
              <Button variant="outline" onClick={() => navigate('/warga')}>
                <Users className="mr-2 h-4 w-4" />
                Lihat Peserta
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Setoran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Catat setoran peserta
              </CardDescription>
              <Button variant="outline" onClick={() => navigate('/setoran')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Kelola Setoran
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Undian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Lakukan undian bulanan
              </CardDescription>
              <Button variant="outline" onClick={handleDrawLottery}>
                <Calendar className="mr-2 h-4 w-4" />
                Lakukan Undian
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Laporan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Lihat laporan keuangan
              </CardDescription>
              <Button variant="outline" onClick={() => navigate('/laporan')}>
                <FileText className="mr-2 h-4 w-4" />
                Lihat Laporan
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Ringkasan Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap={4}>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <CardDescription>Peserta Aktif</CardDescription>
                <Badge variant="success">8 orang</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <CardDescription>Setoran Bulan Ini</CardDescription>
                <Badge variant="success">✅ Lunas</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <CardDescription>Pemenang Terakhir</CardDescription>
                <Badge variant="info">Ibu Rina (15 Juli 2024)</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <CardDescription>Jadwal Undian Berikutnya</CardDescription>
                <Badge variant="warning">15 Agustus 2024</Badge>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Data Import */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              <span>Import Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>
              Pilih metode migrasi data yang sesuai
            </CardDescription>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/peserta-arisan')}
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Lihat Peserta
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/manual-migration')}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Input Manual
              </Button>
              <div className="text-xs text-gray-500">
                Download template di: <br />
                <a href="/templates/template-peserta.csv" className="text-blue-600 hover:underline">Template Peserta</a> | 
                <a href="/templates/template-setoran.csv" className="text-blue-600 hover:underline">Template Setoran</a> | 
                <a href="/templates/template-tunggakan.csv" className="text-blue-600 hover:underline">Template Tunggakan</a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Aktivitas Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[{
                time: "2 jam lalu",
                action: "Setoran kas",
                person: "Ibu Sari (D.04-12)",
                amount: "Rp 12.000",
                status: "success"
              }, {
                time: "4 jam lalu",
                action: "Setoran kas",
                person: "Pak Budi (D.04-12)",
                amount: "Rp 12.000",
                status: "success"
              }, {
                time: "1 hari lalu",
                action: "Undian bulanan",
                person: "Ibu Rina",
                amount: "Pemenang undian",
                status: "info"
              }].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.person}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{activity.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tunggakan */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Tunggakan</CardTitle>
          </CardHeader>
          <CardContent>
            {[{
              name: "Ibu Dewi (D.04-15)",
              debt: "Kas Nov, Listrik Nov",
              amount: "Rp 10.000"
            }, {
              name: "Pak Ahmad (D.04-22)",
              debt: "Kas Okt-Nov, Dana Sosial Nov",
              amount: "Rp 12.000"
            }, {
              name: "Ibu Sri (D.04-07)",
              debt: "Listrik Nov",
              amount: "Rp 5.000"
            }].map((debt, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{debt.name}</p>
                  <p className="text-xs text-muted-foreground">{debt.debt}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-destructive">{debt.amount}</p>
                  <Button size="sm" variant="outline" className="mt-1 text-xs h-6">
                    Reminder
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Draw Modal */}
        {showDrawModal && (
          <DrawModal
            isOpen={showDrawModal}
            onClose={() => setShowDrawModal(false)}
            winner={winner}
            onRedraw={handleDrawLottery}
          />
        )}
      </Main>
    </div>
  );
}