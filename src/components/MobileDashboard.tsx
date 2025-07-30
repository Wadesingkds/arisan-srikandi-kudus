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
  UserCheck,
  CreditCard
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
    { icon: Users, label: 'Data Peserta', path: '/peserta-arisan', color: 'bg-blue-500' },
    { icon: PiggyBank, label: 'Catat Setoran', path: '/setoran', color: 'bg-green-500' },
    { icon: CreditCard, label: 'Pengeluaran', path: '/pengeluaran', color: 'bg-red-500' },
    { icon: Dices, label: 'Undian', path: '/undian', color: 'bg-purple-500' }
  ];

  const bottomNavItems = [
    { icon: Home, label: 'Beranda', path: '/', active: true },
    { icon: Users, label: 'Peserta', path: '/peserta-arisan', active: false },
    { icon: Wallet, label: 'Setoran', path: '/setoran', active: false },
    { icon: CreditCard, label: 'Pengeluaran', path: '/pengeluaran', active: false },
    { icon: History, label: 'Riwayat', path: '/laporan', active: false }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/20 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 hover:bg-muted/50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-primary">Arisan RT 04 RW 01</h1>
              <p className="text-xs text-muted-foreground">Demaan, Kudus</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-muted/50">
              <Bell className="h-5 w-5" />
              {dashboardData.notifikasi > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 text-[10px] p-0 flex items-center justify-center"
                >
                  {dashboardData.notifikasi}
                </Badge>
              )}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-medium">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={toggleMenu}>
          <div 
            className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border/20">
              <h2 className="font-semibold text-lg">Menu</h2>
              <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-1">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 text-sm"
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
              
              <hr className="my-3 border-border/20" />
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 text-sm"
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        <div className="p-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="hover:shadow-md transition-all duration-200 border-border/50 bg-white/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Peserta</p>
                    <p className="text-2xl font-bold text-blue-600">{dashboardData.totalWarga}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all duration-200 border-border/50 bg-white/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 rounded-xl">
                    <PiggyBank className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Tabungan</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(dashboardData.totalTabungan)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-border/50 bg-white/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Aktivitas Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Dices className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Undian Selesai</p>
                  <p className="text-xs text-muted-foreground">{dashboardData.undianTerakhir}</p>
                </div>
                <Badge variant="secondary" className="text-xs">Baru</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
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
          <Card className="border-border/50 bg-white/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="h-24 flex-col gap-2 border border-border/30 hover:border-primary/50 hover:shadow-md rounded-lg p-3 transition-all duration-200 bg-white/50"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`p-2.5 rounded-xl ${action.color} shadow-sm`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="w-full max-w-sm rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl transition-all duration-200"
              onClick={() => navigate('/setoran')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Setoran Baru
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border/20 shadow-lg">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {bottomNavItems.map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 transition-all duration-200 ${
                item.active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={`h-5 w-5 ${item.active ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
                  <PiggyBank className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Tabungan</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(dashboardData.totalTabungan)}</p>
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
                  variant="ghost"
                  className="h-24 flex-col gap-2 border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-3 rounded-xl ${action.color} shadow-sm`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border/20 shadow-lg">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {bottomNavItems.map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 transition-all duration-200 ${
              item.active 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className={`h-5 w-5 ${item.active ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  </div>
);