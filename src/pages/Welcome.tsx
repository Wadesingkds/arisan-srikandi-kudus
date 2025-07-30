import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, CheckCircle, Users, DollarSign, Calendar } from 'lucide-react';

export default function Welcome() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Kelola Peserta Arisan",
      description: "Daftarkan teman-teman yang ikut arisan dengan mudah"
    },
    {
      icon: <DollarSign className="h-12 w-12 text-success" />,
      title: "Catat Pembayaran",
      description: "Tandai siapa yang sudah bayar arisan bulan ini"
    },
    {
      icon: <Calendar className="h-12 w-12 text-warning" />,
      title: "Lihat Jadwal Undian",
      description: "Pantau jadwal undian dan pemenang arisan"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Selamat Datang di Arisan Srikandi!
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Aplikasi arisan yang mudah digunakan
            </p>
          </CardHeader>
          
          <CardContent>
            {step <= 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  {steps[step - 1].icon}
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    {steps[step - 1].title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {steps[step - 1].description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Langkah {step} dari 3
                  </span>
                  <Button 
                    onClick={() => setStep(step + 1)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {step === 3 ? 'Mulai' : 'Lanjut'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
            
            {step > 3 && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">Siap Memulai!</h3>
                <p className="text-sm text-gray-600">
                  Anda sudah siap menggunakan aplikasi arisan
                </p>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Masuk ke Aplikasi
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
