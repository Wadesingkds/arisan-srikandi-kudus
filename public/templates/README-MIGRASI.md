# Panduan Migrasi Data Arisan

## 📋 Template File untuk Import Data

### 1. Template Peserta (`template-peserta.csv`)
Kolom yang harus diisi:
- **Nama_Peserta**: Nama lengkap peserta
- **Alamat**: Alamat lengkap (RT 04 RW 01 Demaan Kudus)
- **No_Telepon**: Nomor HP/WhatsApp
- **Email**: Email (opsional)
- **RT**: 04 (otomatis)
- **RW**: 01 (otomatis)
- **Tanggal_Bergabung**: Format YYYY-MM-DD

### 2. Template Setoran & Undian (`template-setoran.csv`)
Kolom yang harus diisi:
- **Bulan**: Nama bulan (Januari, Februari, dst)
- **Tahun**: Tahun (2024, 2025, dst)
- **Tanggal_Undian**: Format YYYY-MM-DD
- **Pemenang_Undian**: Nama pemenang
- **Jumlah_Undian**: Nominal yang dimenangkan
- **Status_Setoran**: Lunas/Tunggakan

### 3. Template Tunggakan (`template-tunggakan.csv`)
Kolom yang harus diisi:
- **Nama_Peserta**: Nama peserta yang memiliki tunggakan
- **Jenis_Tunggakan**: Kas/Listrik/Lainnya
- **Jumlah_Tunggakan**: Nominal tunggakan
- **Bulan_Tunggakan**: Bulan yang memiliki tunggakan
- **Keterangan**: Penjelasan tambahan

## 🎯 Cara Menggunakan Template

### Untuk Excel:
1. Download file template (.csv)
2. Buka dengan Excel/Google Sheets
3. Isi data sesuai contoh yang ada
4. Simpan kembali sebagai .csv
5. Upload ke aplikasi

### Untuk Input Manual:
1. Ikuti wizard 4-langkah di aplikasi
2. Input peserta satu per satu
3. Input setoran per bulan
4. Input pemenang historis
5. Review data sebelum simpan

## ⚠️ Tips Penting

- **Validasi data**: Pastikan jumlah setoran × peserta = total dana
- **Backup manual**: Simpan catatan manual sebagai backup
- **Verifikasi bersama**: Minta peserta lain cek data
- **Mulai dari terbaru**: Input data bulan terakhir yang sudah selesai

## 🔄 Contoh Data
Semua template sudah berisi contoh data yang bisa diedit sesuai kondisi riil arisan Anda.
