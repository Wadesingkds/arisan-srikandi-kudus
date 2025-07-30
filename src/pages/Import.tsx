import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Container, Main } from '@/components/layouts/Layout';
import { Upload, Download, FileText, CheckCircle } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'peserta' | 'setoran' | 'tunggakan'>('peserta');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsLoading(true);
    // Simulasi import data
    setTimeout(() => {
      setIsLoading(false);
      alert(`Berhasil import ${importType} dari file ${file.name}`);
    }, 2000);
  };

  const downloadTemplate = (type: string) => {
    const templates = {
      peserta: '/templates/template-peserta.csv',
      setoran: '/templates/template-setoran.csv',
      tunggakan: '/templates/template-tunggakan.csv'
    };
    window.open(templates[type as keyof typeof templates], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <Container>
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Import Data Arisan</h1>
            <p className="text-gray-600 mt-1">Import data peserta, setoran, dan tunggakan dengan mudah</p>
          </div>
        </Container>
      </header>

      <Main>
        <Container>
          <Grid cols={1} gap={6}>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Pilih Jenis Data</CardTitle>
                <CardDescription>
                  Pilih jenis data yang akan diimport
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="importType"
                      value="peserta"
                      checked={importType === 'peserta'}
                      onChange={(e) => setImportType(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Data Peserta</div>
                      <div className="text-sm text-gray-600">Import data peserta arisan</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="importType"
                      value="setoran"
                      checked={importType === 'setoran'}
                      onChange={(e) => setImportType(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Data Setoran & Undian</div>
                      <div className="text-sm text-gray-600">Import data setoran dan hasil undian</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="importType"
                      value="tunggakan"
                      checked={importType === 'tunggakan'}
                      onChange={(e) => setImportType(e.target.value as any)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Data Tunggakan</div>
                      <div className="text-sm text-gray-600">Import data tunggakan peserta</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Download Template</CardTitle>
                <CardDescription>
                  Download template sesuai format yang sudah disediakan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate(importType)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template {importType}
                </Button>
                <div className="text-sm text-gray-600">
                  File akan berformat CSV yang bisa dibuka di Excel
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Upload file yang sudah diisi sesuai template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Drag & drop file CSV atau klik untuk upload
                    </p>
                    <p className="text-xs text-gray-500">
                      Pastikan format sesuai dengan template yang sudah di-download
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mt-4"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih File
                  </label>
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    File dipilih: {file.name}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent>
                <Button
                  onClick={handleImport}
                  disabled={!file || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Memproses...' : 'Import Data'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Main>
    </div>
  );
}
