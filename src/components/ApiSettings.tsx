import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Key, Save, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { whatsappService } from "@/lib/whatsapp";

// WhatsApp Configuration Utilities
interface WhatsAppConfigInput {
  apiKey: string;
  apiUrl: string;
  sender?: string;
  senderNumber?: string;
  [key: string]: any;
}

function normalizeSenderField<T extends WhatsAppConfigInput>(config: T): T & { sender: string } {
  // Jika sender belum ada, dan senderNumber ada → isi sender
  if (!config.sender && config.senderNumber) {
    return { ...config, sender: config.senderNumber };
  }
  return config as T & { sender: string };
}

interface ApiSettingsProps {
  onApiConfigured?: (configured: boolean) => void;
}

export default function ApiSettings({ onApiConfigured }: ApiSettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('https://zapin.my.id/send-message');
  const [senderNumber, setSenderNumber] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load settings dari localStorage saat mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('arisanApiSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setApiKey(settings.apiKey || '');
      setApiUrl(settings.apiUrl || 'https://zapin.my.id/send-message');
      setSenderNumber(settings.sender || settings.senderNumber || '');
      setIsConfigured(!!settings.apiKey);
      
      // Update service configuration
      if (settings.apiKey) {
        updateServiceConfig(settings);
      }
    }
  };

  const saveSettings = () => {
    const settings = {
      apiKey,
      apiUrl,
      senderNumber,
      savedAt: new Date().toISOString()
    };
    
    const normalizedConfig = normalizeSenderField(settings);
    
    localStorage.setItem('arisanApiSettings', JSON.stringify(normalizedConfig));
    setIsConfigured(true);
    updateServiceConfig(normalizedConfig);
    
    if (onApiConfigured) {
      onApiConfigured(true);
    }
  };

  const updateServiceConfig = (settings: any) => {
    // Override service configuration dengan settings dari localStorage
    (whatsappService as any).config = {
      apiKey: settings.apiKey,
      apiUrl: settings.apiUrl,
      sender: settings.senderNumber
    };
  };

  const clearSettings = () => {
    localStorage.removeItem('arisanApiSettings');
    setApiKey('');
    setApiUrl('https://api.watzap.id/v1');
    setSenderNumber('');
    setIsConfigured(false);
    setTestResult(null);
    
    // Reset service configuration
    updateServiceConfig({
      apiKey: '',
      apiUrl: 'https://api.watzap.id/v1',
      sender: '6281234567890'
    });
    
    if (onApiConfigured) {
      onApiConfigured(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Debug: Tampilkan nilai field saat ini
    console.log('Testing connection with:', {
      apiKey: apiKey ? '***' + apiKey.slice(-4) : 'empty',
      apiUrl: apiUrl,
      senderNumber: senderNumber,
      apiKeyLength: apiKey.length,
      apiUrlLength: apiUrl.length,
      senderNumberLength: senderNumber.length
    });
    
    // Validasi detail setiap field
    const errors = [];
    if (!apiKey || apiKey.trim().length === 0) errors.push('API Key kosong');
    if (!apiUrl || apiUrl.trim().length === 0) errors.push('API URL kosong');
    if (!senderNumber || senderNumber.trim().length === 0) errors.push('Nomor pengirim kosong');
    
    if (errors.length > 0) {
      setTestResult({
        success: false,
        message: `Field belum lengkap: ${errors.join(', ')}`
      });
      setIsTesting(false);
      return;
    }
    
    // Validasi format nomor pengirim
    const cleanNumber = senderNumber.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      setTestResult({
        success: false,
        message: 'Format nomor pengirim tidak valid (harus 10-15 digit)'
      });
      setIsTesting(false);
      return;
    }
    
    // Validasi format URL
    try {
      new URL(apiUrl);
    } catch {
      setTestResult({
        success: false,
        message: 'Format URL tidak valid'
      });
      setIsTesting(false);
      return;
    }
    
    try {
      // Normalize config dengan utility function
      const rawConfig = {
        apiKey: apiKey.trim(),
        apiUrl: apiUrl.trim(),
        senderNumber: senderNumber.trim()
      };
      
      const normalizedConfig = normalizeSenderField(rawConfig);
      
      // Simpan ke localStorage dan update service
      localStorage.setItem('arisanApiSettings', JSON.stringify(normalizedConfig));
      updateServiceConfig(normalizedConfig);
      
      // Test dengan service yang sudah diupdate
      const configured = whatsappService.isConfigured();
      
      if (configured) {
        setTestResult({
          success: true,
          message: '✅ API berhasil terhubung! WhatsApp siap digunakan.'
        });
      } else {
        setTestResult({
          success: false,
          message: `❌ Konfigurasi tidak valid. Periksa kembali data yang dimasukkan.`
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `🚨 Koneksi gagal: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const apiProviders = [
    { name: "Zapin", url: "https://zapin.my.id/send-message" },
    { name: "Watzap", url: "https://api.watzap.id/v1" },
    { name: "Fonnte", url: "https://api.fonnte.com/send" },
    { name: "Waifu", url: "https://api.waifu.id/send" },
    { name: "n8n Webhook", url: "https://your-n8n.app/webhook/whatsapp" },
    { name: "Custom", url: "" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan WhatsApp API</h2>
          <p className="text-gray-600">Konfigurasi API untuk mengirim reminder WhatsApp</p>
        </div>
        <Settings className="h-6 w-6 text-gray-400" />
      </div>

      {isConfigured && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            WhatsApp API sudah dikonfigurasi dan siap digunakan.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Konfigurasi API
          </CardTitle>
          <CardDescription>
            Masukkan API key dari provider WhatsApp Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showPassword ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API key WhatsApp Anda"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              API key akan disimpan secara lokal di browser Anda
            </p>
          </div>

          <div>
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              id="apiUrl"
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.watzap.id/v1"
            />
            <div className="flex gap-2 mt-2">
              {apiProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => setApiUrl(provider.url)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="senderNumber">Nomor Pengirim</Label>
            <Input
              id="senderNumber"
              type="tel"
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder="6281234567890"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nomor WhatsApp yang terdaftar di provider
            </p>
          </div>

          {testResult && (
            <Alert className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              {testResult.success ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <AlertCircle className="h-4 w-4 text-red-600" />
              }
              <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={testConnection}
              disabled={!apiKey || !apiUrl || !senderNumber || isTesting}
              variant="outline"
              className="flex-1"
            >
              {isTesting ? 'Testing...' : 'Test Koneksi'}
            </Button>
            <Button 
              onClick={saveSettings}
              disabled={!apiKey || !apiUrl || !senderNumber}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>

          {isConfigured && (
            <Button 
              onClick={clearSettings}
              variant="ghost"
              className="w-full text-red-600 hover:text-red-700"
            >
              Hapus Pengaturan
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Petunjuk Konfigurasi</CardTitle>
          <CardDescription>
            Langkah-langkah mendapatkan API key WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">1. Pilih Provider WhatsApp</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li><strong>Watzap.id</strong> - Provider lokal Indonesia</li>
              <li><strong>Fonnte.com</strong> - Provider dengan fitur lengkap</li>
              <li><strong>n8n</strong> - Self-hosted automation</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Daftar dan Dapatkan API Key</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Buat akun di provider pilihan</li>
              <li>Verifikasi nomor WhatsApp Anda</li>
              <li>Copy API key dari dashboard provider</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Masukkan ke Aplikasi</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Paste API key di field di atas</li>
              <li>Masukkan URL endpoint provider</li>
              <li>Masukkan nomor WhatsApp yang terdaftar</li>
              <li>Test koneksi dan simpan</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
