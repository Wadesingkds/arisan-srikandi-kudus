import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Sparkles, 
  X, 
  RotateCcw,
  Share2
} from 'lucide-react';

interface DrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: string;
  onRedraw: () => void;
}

export default function DrawModal({ 
  isOpen, 
  onClose, 
  winner, 
  onRedraw 
}: DrawModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    const message = `🎉 Selamat kepada ${winner} yang menjadi pemenang arisan bulan ini! 🎊`;
    if (navigator.share) {
      navigator.share({
        title: 'Pemenang Arisan',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      alert('Pesan berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full mx-auto">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 rounded-2xl opacity-20 animate-pulse" />
        
        <Card className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
            <div className="relative">
              <Trophy className="h-16 w-16 text-white mx-auto mb-2 animate-bounce" />
              <Sparkles className="absolute top-0 right-0 h-4 w-4 text-yellow-200 animate-ping" />
              <Sparkles className="absolute bottom-0 left-0 h-4 w-4 text-yellow-200 animate-ping" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              🎉 Yeay! Pemenangnya Keluar! 🎉
            </CardTitle>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Winner announcement */}
            <div className="text-center">
              <div className="text-4xl mb-2">👑</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {winner}
              </div>
              <p className="text-lg text-gray-600">
                Selamat! Kamu adalah pemenang arisan bulan ini! 🎊
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}} />
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan Kabar Gembira
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onRedraw}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Undi Ulang
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClose}
                >
                  <X className="h-4 w-4 mr-2" />
                  Tutup
                </Button>
              </div>
            </div>

            {/* Fun message */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Semoga yang lain beruntung di bulan depan! 💝
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
