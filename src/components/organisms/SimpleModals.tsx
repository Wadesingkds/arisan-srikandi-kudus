import { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { ModalContent } from '../molecules/ModalContent';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Phone, 
  CheckCircle, 
  Trophy 
} from 'lucide-react';

interface SimpleModalsProps {
  peserta: Array<{ nama: string; no: string; status: string }>;
  setoranData: Array<{ nama: string; jumlah: number; tanggal: string }>;
  winner: string;
  onRedraw: () => void;
}

// Modal untuk data peserta
export const PesertaModal = ({ 
  isOpen, 
  onClose, 
  peserta 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  peserta: Array<{ nama: string; no: string; status: string }>;
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent
      title="📋 Daftar Peserta Arisan"
      description={`Ada ${peserta.length} peserta aktif yang ikut arisan`}
    >
      <div className="space-y-3">
        {peserta.map((p, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{p.nama}</div>
              <div className="text-sm text-gray-500">{p.no}</div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              p.status === 'Aktif' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {p.status}
            </div>
          </div>
        ))}
      </div>
    </ModalContent>
  </Modal>
);

// Modal untuk setoran
export const SetoranModal = ({ 
  isOpen, 
  onClose, 
  setoranData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  setoranData: Array<{ nama: string; jumlah: number; tanggal: string }>;
}) => {
  const totalSetoran = setoranData.reduce((sum, s) => sum + s.jumlah, 0);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        title="💰 Setoran Terbaru"
        description={`Total setoran: Rp ${totalSetoran.toLocaleString()}`}
      >
        <div className="space-y-3">
          {setoranData.map((s, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{s.nama}</div>
                <div className="text-sm text-gray-500">{s.tanggal}</div>
              </div>
              <div className="font-semibold text-blue-600">
                Rp {s.jumlah.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};

// Modal untuk kontak admin
export const KontakModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent
      title="📞 Kontak Admin"
      description="Admin siap membantu kapan saja"
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900 mb-2">Admin: Ibu Ani</div>
          <div className="text-sm text-gray-600 mb-2">📱 0812-3456-7890</div>
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">Jam kerja:</div>
            <div>Senin-Jumat: 08.00-17.00</div>
            <div>Sabtu: 08.00-12.00</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => alert('Membuka WhatsApp...')}
          >
            Chat WhatsApp
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => alert('Menelpon...')}
          >
            Telepon
          </Button>
        </div>
      </div>
    </ModalContent>
  </Modal>
);

// Modal untuk undian (dengan animasi minimal)
export const UndianModal = ({ 
  isOpen, 
  onClose, 
  winner, 
  onRedraw 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  winner: string; 
  onRedraw: () => void; 
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalContent
      title="🎉 Pemenang Undian"
      actions={
        <>
          <Button variant="outline" onClick={onRedraw}>
            Undi Ulang
          </Button>
          <Button onClick={onClose}>
            Tutup
          </Button>
        </>
      }
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Pemenang undian bulan ini adalah:</div>
          <div className="text-2xl font-bold text-gray-900">{winner}</div>
        </div>
        <div className="text-sm text-gray-500">
          Selamat! Semoga yang lain beruntung di bulan depan.
        </div>
      </div>
    </ModalContent>
  </Modal>
);
