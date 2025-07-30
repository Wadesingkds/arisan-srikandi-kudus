import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Container, Main } from '@/components/layouts/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function MigrasiSaldo() {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState({
    arisan: 0,
    arisanBarang: 0,
    uangKas: 0,
    uangListrik: 0,
    uangSosial: 0,
    tabunganPiknik: 0,
    tabunganLebaran: 0,
    total: 0
  });

  const handleSaldoChange = (field: keyof typeof saldo, value: number) => {
    const newSaldo = { ...saldo, [field]: value };
    newSaldo.total = 
      newSaldo.arisan + 
      newSaldo.arisanBarang + 
      newSaldo.uangKas + 
      newSaldo.uangListrik + 
      newSaldo.uangSosial + 
      newSaldo.tabunganPiknik + 
      newSaldo.tabunganLebaran;
    setSaldo(newSaldo);
  };

  const handleSave = () => {
    // Simulate saving to database
    alert(`Saldo berhasil disimpan!\nTotal: Rp ${saldo.total.toLocaleString('id-ID')}`);
    navigate('/');
  };

  return (
    <Container>
      <Main>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span>Migrasi Saldo - Semua Tabungan</span>
              </CardTitle>
              <CardDescription>
                Input saldo keseluruhan tanpa detail per anggota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Arisan</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.arisan}
                    onChange={(e) => handleSaldoChange('arisan', Number(e.target.value))}
                  />
                  <CardDescription>Total saldo arisan uang</CardDescription>
                </div>
                
                <div>
                  <Label>Arisan Barang</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.arisanBarang}
                    onChange={(e) => handleSaldoChange('arisanBarang', Number(e.target.value))}
                  />
                  <CardDescription>Total saldo arisan barang</CardDescription>
                </div>

                <div>
                  <Label>Uang Kas</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.uangKas}
                    onChange={(e) => handleSaldoChange('uangKas', Number(e.target.value))}
                  />
                  <CardDescription>Total saldo uang kas RT/RW</CardDescription>
                </div>

                <div>
                  <Label>Uang Listrik</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.uangListrik}
                    onChange={(e) => handleSaldoChange('uangListrik', Number(e.target.value))}
                  />
                  <CardDescription>Total saldo uang listrik</CardDescription>
                </div>

                <div>
                  <Label>Uang Sosial</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.uangSosial}
                    onChange={(e) => handleSaldoChange('uangSosial', Number(e.target.value))}
                  />
                  <CardDescription>Total saldo uang sosial</CardDescription>
                </div>

                <div>
                  <Label>Tabungan Piknik</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.tabunganPiknik}
                    onChange={(e) => handleSaldoChange('tabunganPiknik', Number(e.target.value))}
                  />
                  <CardDescription>Total tabungan piknik</CardDescription>
                </div>

                <div>
                  <Label>Tabungan Lebaran</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={saldo.tabunganLebaran}
                    onChange={(e) => handleSaldoChange('tabunganLebaran', Number(e.target.value))}
                  />
                  <CardDescription>Total tabungan lebaran</CardDescription>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-800">
                  Total Saldo: Rp {saldo.total.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Simpan Saldo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Kembali
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </Container>
  );
}
