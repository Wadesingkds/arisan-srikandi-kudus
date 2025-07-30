import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Container, Main } from '@/components/layouts/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, CheckCircle, AlertCircle } from 'lucide-react';

interface Peserta {
  id: string;
  nama: string;
  alamat: string;
  noTelepon: string;
}

interface Setoran {
  bulan: string;
  tahun: string;
  peserta: { [key: string]: boolean };
}

interface Pemenang {
  bulan: string;
  tahun: string;
  nama: string;
  tanggal: string;
}

export default function ManualMigration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [peserta, setPeserta] = useState<Peserta[]>([]);
  const [setoran, setSetoran] = useState<Setoran[]>([]);
  const [pemenang, setPemenang] = useState<Pemenang[]>([]);
  const [tunggakan, setTunggakan] = useState<any[]>([]);

  // Step 1: Input Peserta
  const [currentPeserta, setCurrentPeserta] = useState({
    nama: '',
    alamat: '',
    noTelepon: ''
  });

  const addPeserta = () => {
    if (currentPeserta.nama) {
      setPeserta([...peserta, {
        ...currentPeserta,
        id: Date.now().toString()
      }]);
      setCurrentPeserta({ nama: '', alamat: '', noTelepon: '' });
    }
  };

  const removePeserta = (id: string) => {
    setPeserta(peserta.filter(p => p.id !== id));
  };

  // Step 2: Input Setoran
  const addSetoran = () => {
    const newSetoran: Setoran = {
      bulan: 'Januari',
      tahun: '2024',
      peserta: {}
    };
    peserta.forEach(p => {
      newSetoran.peserta[p.id] = false;
    });
    setSetoran([...setoran, newSetoran]);
  };

  // Step 3: Input Pemenang
  const addPemenang = () => {
    setPemenang([...pemenang, {
      bulan: 'Januari',
      tahun: '2024',
      nama: '',
      tanggal: ''
    }]);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const goBack = () => navigate('/');
  const goToDashboard = () => navigate('/');

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Step 1: Input Data Peserta</CardTitle>
              <CardDescription>
                Masukkan data semua peserta arisan yang sudah ada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nama Peserta</Label>
                  <Input
                    value={currentPeserta.nama}
                    onChange={(e) => setCurrentPeserta({...currentPeserta, nama: e.target.value})}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <Label>Alamat</Label>
                  <Input
                    value={currentPeserta.alamat}
                    onChange={(e) => setCurrentPeserta({...currentPeserta, alamat: e.target.value})}
                    placeholder="RT 04 RW 01 Demaan Kudus"
                  />
                </div>
                <div>
                  <Label>No. Telepon</Label>
                  <Input
                    value={currentPeserta.noTelepon}
                    onChange={(e) => setCurrentPeserta({...currentPeserta, noTelepon: e.target.value})}
                    placeholder="0812xxxxxx"
                  />
                </div>
              </div>
              <Button onClick={addPeserta} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Peserta
              </Button>

              {peserta.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Daftar Peserta ({peserta.length} orang)</h4>
                  {peserta.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{p.nama}</div>
                        <div className="text-sm text-gray-600">{p.alamat}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePeserta(p.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Step 2: Input Setoran</CardTitle>
              <CardDescription>
                Masukkan data setoran per bulan untuk setiap peserta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bulan</Label>
                  <select className="w-full p-2 border rounded">
                    {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Tahun</Label>
                  <Input type="number" placeholder="2024" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Status Setoran per Peserta:</h4>
                {peserta.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{p.nama}</span>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Sudah bayar</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Step 3: Input Pemenang & Tunggakan</CardTitle>
              <CardDescription>
                Masukkan data pemenang dan tunggakan yang ada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Data Pemenang</Label>
                <div className="space-y-2">
                  {peserta.map(p => (
                    <div key={p.id} className="flex items-center gap-2">
                      <select className="flex-1 p-2 border rounded">
                        <option>Pilih bulan</option>
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <select className="flex-1 p-2 border rounded">
                        <option>Pilih pemenang</option>
                        {peserta.map(p => (
                          <option key={p.id} value={p.nama}>{p.nama}</option>
                        ))}
                      </select>
                      <Input type="date" className="flex-1" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Data Tunggakan</Label>
                <div className="space-y-2">
                  {peserta.map(p => (
                    <div key={p.id} className="grid grid-cols-3 gap-2">
                      <span className="p-2 bg-gray-50 rounded">{p.nama}</span>
                      <select className="p-2 border rounded">
                        <option>Tidak ada tunggakan</option>
                        <option>Kas</option>
                        <option>Listrik</option>
                        <option>Lainnya</option>
                      </select>
                      <Input type="number" placeholder="Jumlah" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Step 4: Review & Konfirmasi</CardTitle>
              <CardDescription>
                Review semua data sebelum disimpan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Data Peserta ({peserta.length} orang)
                  </h4>
                  {peserta.map(p => (
                    <div key={p.id} className="text-sm text-gray-600">
                      {p.nama} - {p.alamat}
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Peringatan</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Pastikan semua data sudah benar sebelum disimpan. Data yang sudah disimpan tidak bisa diubah.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevStep}>Kembali</Button>
                  <Button className="flex-1">Simpan Data Migrasi</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container>
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Migrasi Data Manual</h1>
            <p className="text-gray-600 mt-1">Input data arisan yang sudah berjalan manual</p>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    step === i ? 'bg-blue-100 text-blue-800' : 
                    step > i ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step >= i ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step > i ? '✓' : i}
                    </div>
                    {i === 1 && 'Peserta'}
                    {i === 2 && 'Setoran'}
                    {i === 3 && 'Pemenang & Tunggakan'}
                    {i === 4 && 'Review'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Main>
        <Container>
          <div className="max-w-4xl mx-auto">
            {renderStep()}
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2"
              >
                ← Kembali ke Dashboard
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={step === 1}
                >
                  Kembali
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={step === 3}
                >
                  {step === 3 ? 'Selesai' : 'Lanjut'}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Main>
    </div>
  );
}
