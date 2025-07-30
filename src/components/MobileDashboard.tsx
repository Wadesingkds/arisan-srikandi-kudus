import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  PiggyBank, 
  Dices, 
  FileText, 
  Plus,
  Bell,
  Settings,
  Menu,
  X,
  Home,
  Wallet,
  History,
  UserCheck
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface MobileDashboardProps {
  className?: string;
}

export default function MobileDashboard({ className }: MobileDashboardProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample data - replace with real data hooks
  const dashboardData = {
    totalWarga: 45,
    totalTabungan: 12500000,
    undianTerakhir: 'Arisan Uang - Periode 3',
    notifikasi: 3
  };

  const quickActions = [
    { icon: Users, label: 'Data Warga', path: '/warga', color: 'bg-blue-500' },
    { icon: PiggyBank, label: 'Catat Setoran', path: '/setoran', color: 'bg-green-500' },
    { icon: Dices, label: 'Undian Arisan', path: '/undian', color: 'bg-purple-500' },
    { icon: FileText, label: 'Laporan', path: '/laporan', color: 'bg-orange-500' }
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Beranda', path: '/', active: true },
    { icon: Users, label: 'Warga', path: '/warga', active: false },
    { icon: Wallet, label: 'Setoran', path: '/setoran', active: false },
    { icon: History, label: 'Riwayat', path: '/laporan', active: false }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-1"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-primary">Arisan RT 04 RW 01</h1>
              <p className="text-xs text-muted-foreground">Demaan, Kudus</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5" />
              {dashboardData.notifikasi > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  {dashboardData.notifikasi}
                </Badge>
              )}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={toggleMenu}>
          <div 
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => {
                    navigate(action.path);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  {action.label}
                </Button>
              ))}
              
              <hr className="my-4" />
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-12"
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-5 w-5" />
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {/* Summary Cards */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Warga</p>
                    <p className="text-xl font-bold">{dashboardData.totalWarga}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PiggyBank className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tabungan</p>
                    <p className="text-lg font-bold">{formatCurrency(dashboardData.totalTabungan)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Dices className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Undian Selesai</p>
                  <p className="text-xs text-muted-foreground">{dashboardData.undianTerakhir}</p>
                </div>
                <Badge variant="secondary" className="text-xs">Baru</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Setoran Diterima</p>
                  <p className="text-xs text-muted-foreground">5 setoran baru hari ini</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col gap-2 hover-scale"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Button */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              className="w-full max-w-sm rounded-full shadow-lg"
              onClick={() => navigate('/setoran')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Setoran Baru
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {bottomNavItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`h-16 flex-col gap-1 rounded-none ${
                item.active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
}