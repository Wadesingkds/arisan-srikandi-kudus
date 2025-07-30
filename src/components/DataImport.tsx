import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Upload, Download, FileText } from 'lucide-react';

export default function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'peserta' | 'setoran' | 'tunggakan'>('peserta');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleImport = () => {
    if (!file) return;
    // Logic untuk import data akan diimplementasikan
    console.log('Importing:', file.name, 'Type:', importType);
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
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Import Data Arisan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pilih Jenis Import */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Jenis Data yang akan diimport:</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="importType"
                value="peserta"
                checked={importType === 'peserta'}
                onChange={(e) => setImportType(e.target.value as any)}
                className="mr-2"
              />
              Data Peserta
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="importType"
                value="setoran"
                checked={importType === 'setoran'}
                onChange={(e) => setImportType(e.target.value as any)}
                className="mr-2"
              />
              Data Setoran & Undian
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="importType"
                value="tunggakan"
                checked={importType === 'tunggakan'}
                onChange={(e) => setImportType(e.target.value as any)}
                className="mr-2"
              />
              Data Tunggakan
            </label>
          </div>
        </div>

        {/* Download Template */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Download template:</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate(importType)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template {importType}
            </Button>
          </div>
        </div>

        {/* Upload File */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload file CSV:</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Drag & drop atau klik untuk upload
              </p>
              <p className="text-xs text-gray-500">
                File CSV dengan format sesuai template
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
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Pilih File
            </label>
          </div>
          {file && (
            <div className="text-sm text-green-600">
              File dipilih: {file.name}
            </div>
          )}
        </div>

        {/* Tombol Import */}
        <Button
          onClick={handleImport}
          disabled={!file}
          className="w-full"
        >
          Import Data
        </Button>

        {/* Panduan */}
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Panduan:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Download template terlebih dahulu</li>
            <li>Isi data sesuai format yang ada</li>
            <li>Upload file CSV yang sudah diisi</li>
            <li>Data akan diproses otomatis</li>
          </ul>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
