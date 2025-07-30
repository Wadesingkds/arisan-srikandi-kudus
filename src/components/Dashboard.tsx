import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, PiggyBank, Coins, TrendingUp, Calendar, AlertTriangle, Plus, FileText, CreditCard } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 py-6 bg-sky-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard RT 04 RW 01</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">Demaan, Kudus</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Peserta Arisan
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">30</div>
              <p className="text-xs text-success">
                <span className="inline-flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  28 aktif
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Kas
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">Rp 850K</div>
              <p className="text-xs text-muted-foreground">
                +120K bulan ini
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Arisan Aktif
              </CardTitle>
              <Coins className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">Periode 3</div>
              <p className="text-xs text-muted-foreground">
                18 belum menang
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tunggakan
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">5</div>
              <p className="text-xs text-muted-foreground">
                Peserta Arisan tertunggak
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Button variant="outline" className="h-auto py-4 px-3 flex flex-col gap-2" onClick={() => navigate('/setoran')}>
                <PiggyBank className="h-6 w-6 text-primary" />
                <span className="text-xs">Catat Setoran</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3 flex flex-col gap-2" onClick={() => navigate('/undian')}>
                <Coins className="h-6 w-6 text-accent" />
                <span className="text-xs">Undian Arisan</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3 flex flex-col gap-2" onClick={() => navigate('/peserta-arisan')}>
                <Users className="h-6 w-6 text-warning" />
                <span className="text-xs">Data Peserta Arisan</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3 flex flex-col gap-2" onClick={() => navigate('/pengeluaran')}>
                <CreditCard className="h-6 w-6 text-info" />
                <span className="text-xs">Pengeluaran</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-3 flex flex-col gap-2" onClick={() => navigate('/laporan')}>
                <FileText className="h-6 w-6 text-success" />
                <span className="text-xs">Laporan</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity & Arisan Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Arisan Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Status Arisan Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Arisan Uang</p>
                    <p className="text-sm text-muted-foreground">Rp 20.000 per orang</p>
                  </div>
                  <Badge variant="secondary">Belum undian</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Arisan Barang</p>
                    <p className="text-sm text-muted-foreground">Rp 10.000 per slot</p>
                  </div>
                  <Badge variant="secondary">Belum undian</Badge>
                </div>
              </div>
              
              <Button variant="default" className="w-full bg-sky-700 hover:bg-sky-600">
                <Coins className="h-4 w-4 mr-2" />
                Lakukan Undian
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[{
                time: "2 jam lalu",
                action: "Setoran kas",
                person: "Ibu Sari (D.04-12)",
                amount: "Rp 12.000"
              }, {
                time: "5 jam lalu",
                action: "Arisan menang",
                person: "Pak Budi (D.04-08)",
                amount: "Barang"
              }, {
                time: "1 hari lalu",
                action: "Tabungan lebaran",
                person: "Ibu Rina (D.04-03)",
                amount: "Rp 50.000"
              }].map((activity, index) => <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.person}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.amount}
                    </Badge>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tunggakan Alert */}
        <Card className="shadow-card border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Peringatan Tunggakan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
            }].map((debt, index) => <div key={index} className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
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
                </div>)}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>;
}