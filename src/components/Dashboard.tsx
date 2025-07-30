import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Container, Grid, Main } from "@/components/layouts/Layout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FileText, TrendingUp, Users, DollarSign, Trophy, Calendar, Upload, Download, PiggyBank, Coins, CreditCard, Plus, AlertCircle, MessageCircle, Phone, CheckCircle2, Settings } from "lucide-react";
import DrawModal from "./DrawModal";
import { whatsappService } from "@/lib/whatsapp";
import ApiSettings from "./ApiSettings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [reminderMethod, setReminderMethod] = useState('whatsapp');
  const [customMessage, setCustomMessage] = useState('');
  const [winner, setWinner] = useState('');

  const handleDrawLottery = () => {
    const peserta = ['Ibu Sari', 'Pak Budi', 'Ibu Rina', 'Pak Ahmad', 'Ibu Dewi', 'Ibu Ani', 'Pak Joko', 'Ibu Murni'];
    const pemenang = peserta[Math.floor(Math.random() * peserta.length)];
    setWinner(pemenang);
    setShowDrawModal(true);
  };

  const handleReminderClick = (debt: any) => {
    setSelectedDebt(debt);
    setCustomMessage(generateDefaultMessage(debt));
    setShowReminderModal(true);
  };

  const generateDefaultMessage = (debt: any) => {
    return `Assalamualaikum ${debt.name.split(' ')[0]},\n\n` +
           `Ini pengingat untuk pembayaran arisan RT 04 RW 01:\n` +
           `Tunggakan: ${debt.debt}\n` +
           `Jumlah: ${debt.amount}\n\n` +
           `Mohon segera diselesaikan. Terima kasih.\n\n` +
           `Salam,\nKetua Arisan RT 04 RW 01`;
  };

  const [sentReminders, setSentReminders] = useState<Set<string>>(new Set());
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [apiStatus, setApiStatus] = useState<'configured' | 'not_configured'>('not_configured');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  // Check WhatsApp API configuration on mount and when settings change
  useEffect(() => {
    const checkApiConfig = () => {
      const savedSettings = localStorage.getItem('arisanApiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const config = {
          apiKey: settings.apiKey || '',
          apiUrl: settings.apiUrl || '',
          sender: settings.sender || ''
        };
        
        whatsappService.updateConfig(config);
        
        const isConfigured = whatsappService.isConfigured();
        setApiStatus(isConfigured ? 'configured' : 'not_configured');
        
        console.log('Loaded WhatsApp config from storage:', {
          apiKey: config.apiKey ? '***' + config.apiKey.slice(-4) : 'empty',
          apiUrl: config.apiUrl,
          sender: config.sender,
          isConfigured
        });
      } else {
        setApiStatus('not_configured');
      }
    };

    checkApiConfig();
    
    // Listen for storage changes
    window.addEventListener('storage', checkApiConfig);
    return () => window.removeEventListener('storage', checkApiConfig);
  }, []);

  const handleApiConfigured = (configured: boolean) => {
    setApiStatus(configured ? 'configured' : 'not_configured');
    if (configured) {
      setActiveTab('dashboard');
    }
  };

  const sendReminder = async () => {
    if (!selectedDebt) return;
    
    setSendingStatus('sending');
    
    try {
      const name = selectedDebt.name.split(' ')[0];
      const message = whatsappService.generateReminderMessage(
        name,
        selectedDebt.debt,
        selectedDebt.amount
      );
      
      const success = await whatsappService.sendTextMessage(
        selectedDebt.phone,
        customMessage || message
      );
      
      if (success) {
        const reminderId = `${selectedDebt.name}-${Date.now()}`;
        setSentReminders(prev => new Set(prev).add(reminderId));
        setSendingStatus('success');
      } else {
        setSendingStatus('error');
      }
    } catch (error) {
      console.error('Failed to send reminder:', error);
      setSendingStatus('error');
    }
    
    setTimeout(() => {
      setShowReminderModal(false);
      setSendingStatus('idle');
    }, 2000);
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
            
            {/* Tab Navigation */}
            <div className="border-t border-gray-200 pt-4">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan API
                  {apiStatus === 'not_configured' && (
                    <span className="ml-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </nav>
            </div>
          </Container>
        </header>

        {/* Main Content */}
        {activeTab === 'dashboard' && (
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
              <Button variant="outline" onClick={() => navigate('/peserta-arisan')}>
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
                <DollarSign className="mr-2 h-4 w-4" />
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
              <CardTitle>Penarikan Tabungan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Proses penarikan tabungan kolektif
              </CardDescription>
              <Button variant="outline" onClick={() => navigate('/penarikan-tabungan')}>
                <DollarSign className="mr-2 h-4 w-4" />
                Penarikan Kolektif
              </Button>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>
                Catat pengeluaran arisan
              </CardDescription>
              <Button variant="outline" onClick={() => navigate('/pengeluaran')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Catat Pengeluaran
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
                onClick={() => navigate('/migrasi-saldo')}
                className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <AlertCircle className="h-4 w-4" />
                Migrasi Saldo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/manual-migration')}
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Input Manual
              </Button>
              <Button 
                onClick={() => navigate('/import')}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Upload className="h-4 w-4" />
                Import Data CSV
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
            <CardTitle className="flex items-center justify-between">
              <span>Tunggakan</span>
              <Badge variant="default" className="ml-2 bg-red-500 text-white">3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {[{
              id: "ibu-dewi",
              name: "Ibu Dewi (D.04-15)",
              debt: "Kas Nov, Listrik Nov",
              amount: "Rp 10.000",
              phone: "81234567890"
            }, {
              id: "pak-ahmad",
              name: "Pak Ahmad (D.04-22)",
              debt: "Kas Okt-Nov, Dana Sosial Nov",
              amount: "Rp 12.000",
              phone: "81234567891"
            }, {
              id: "ibu-sri",
              name: "Ibu Sri (D.04-07)",
              debt: "Listrik Nov",
              amount: "Rp 5.000",
              phone: "81234567892"
            }].map((debt, index) => {
              const isRecentlyReminded = Array.from(sentReminders).some(id => 
                id.includes(debt.name.split(' ')[0])
              );
              
              return (
                <div key={debt.id} className="flex justify-between items-center p-4 bg-destructive/5 rounded-lg mb-3 last:mb-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{debt.name}</p>
                    <p className="text-xs text-muted-foreground">{debt.debt}</p>
                    <p className="text-xs text-gray-500 mt-1">📱 {debt.phone}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm font-medium text-destructive">{debt.amount}</p>
                    <Button 
                      size="sm" 
                      variant={isRecentlyReminded ? "secondary" : "outline"}
                      className="text-xs h-7 px-2 gap-1"
                      onClick={() => handleReminderClick(debt)}
                      disabled={isRecentlyReminded}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {isRecentlyReminded ? "Terkirim" : "Kirim"}
                    </Button>
                  </div>
                </div>
              );
            })}
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

        {/* Reminder Modal */}
        <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kirim Pengingat Pembayaran</DialogTitle>
              <DialogDescription>
                Kirim pengingat kepada {selectedDebt?.name} untuk pembayaran tunggakan
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Metode Pengiriman</label>
                <Select value={reminderMethod} onValueChange={setReminderMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        SMS
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Pesan</label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="text-sm"
                  placeholder="Tulis pesan pengingat..."
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                <strong>Info:</strong> Pesan akan dikirim ke nomor WhatsApp/SMS yang terdaftar.
              </div>
            </div>

            {apiStatus === 'not_configured' && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Info:</strong> WhatsApp API belum dikonfigurasi. 
                    <br />Silakan tambahkan environment variables untuk fitur ini.
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowReminderModal(false)}
                className="flex-1"
                disabled={sendingStatus === 'sending'}
              >
                Batal
              </Button>
              <Button 
                onClick={sendReminder}
                className="flex-1"
                disabled={sendingStatus === 'sending' || apiStatus === 'not_configured'}
              >
                {sendingStatus === 'sending' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengirim...
                  </>
                ) : sendingStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Terkirim
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Kirim Notifikasi
                  </>
                )}
              </Button>
            </div>
            
            {sendingStatus === 'success' && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Notifikasi berhasil dikirim ke {selectedDebt?.name} via WhatsApp!
                </div>
              </div>
            )}
            
            {sendingStatus === 'error' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  Gagal mengirim notifikasi. Silakan coba lagi.
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </Main>
        )}

        {activeTab === 'settings' && (
          <Main>
            <ApiSettings onApiConfigured={handleApiConfigured} />
          </Main>
        )}
    </div>
  );
}