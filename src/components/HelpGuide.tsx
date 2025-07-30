import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle,
  UserPlus,
  DollarSign,
  Calendar
} from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <UserPlus className="h-12 w-12 text-blue-500" />,
      title: "Daftarkan Peserta",
      description: "Klik tombol 'Tambah Peserta' untuk mendaftarkan teman-teman yang ikut arisan",
      tip: "Isi nama lengkap dan nomor HP ya!"
    },
    {
      icon: <DollarSign className="h-12 w-12 text-green-500" />,
      title: "Catat Pembayaran",
      description: "Klik tombol 'Catat Bayar' saat teman sudah membayar arisan",
      tip: "Sistem akan otomatis menghitung totalnya"
    },
    {
      icon: <Calendar className="h-12 w-12 text-purple-500" />,
      title: "Lihat Jadwal Undian",
      description: "Klik tombol 'Lihat Undian' untuk tahu kapan undian berikutnya",
      tip: "Pemenang akan otomatis diumumkan!"
    }
  ];

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Panduan Penggunaan
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {steps[currentStep].icon}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800">
              {steps[currentStep].title}
            </h3>
            
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tips:</strong> {steps[currentStep].tip}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Sebelumnya</span>
            </Button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} dari {steps.length}
            </span>

            <Button
              onClick={nextStep}
              className="flex items-center space-x-1"
            >
              <span>{currentStep === steps.length - 1 ? 'Selesai' : 'Selanjutnya'}</span>
              {currentStep === steps.length - 1 ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
