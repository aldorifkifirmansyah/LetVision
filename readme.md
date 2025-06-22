# LetVision

## Tentang

LetVision adalah aplikasi mobile berbasis React Native yang memanfaatkan teknologi machine learning untuk mendeteksi tahap pertumbuhan dan penyakit pada tanaman selada. Proyek ini dibuat untuk mata kuliah **PPL ADPL Semester 4, Kelompok 9**:

- Fionella Vernanda P. A. O (232410103021)
- Aldo Rifki Firmansyah (232410103025)
- Naufal Rifqi Prasetyo (232410103055)
- Adelia Damar Cantika (232410103092)
- Bramudya Melvan Ibrahim (232410103097)

## Deskripsi Proyek

Aplikasi LetVision bertujuan membantu petani dan pecinta tanaman selada untuk:

- Mendeteksi berbagai tahap pertumbuhan tanaman.
- Mendiagnosis potensi penyakit dengan cepat.
- Menyediakan rekomendasi nutrisi, pupuk, serta penanganan penyakit.

Proyek ini mengintegrasikan proses pengambilan gambar, analisis menggunakan model AI/ML, dan penyimpanan data lokal untuk menampilkan riwayat deteksi.

## Fitur Utama

1. **Deteksi Pertumbuhan**: Menampilkan parameter pertumbuhan (estimasi panen, rentang pH & EC).
2. **Deteksi Penyakit**: Mengidentifikasi penyakit tanaman secara otomatis dan memberikan saran penanganan.
3. **Riwayat Deteksi**: Menyimpan hasil deteksi di penyimpanan lokal (AsyncStorage), dengan fitur pin dan label kustom.
4. **Rekomendasi Nutrisi**: Menyesuaikan dosis pupuk dan pH sesuai tahap pertumbuhan.

## Teknologi

- **React Native & TypeScript**: Untuk pengembangan aplikasi mobile.
- **Expo**: Untuk build dan debugging cepat di berbagai platform.
- **Machine Learning Model**: Menganalisis gambar tanaman selada.
- **Supabase**: Menyimpan data master (tahap pertumbuhan, penyakit, dll.).
- **AsyncStorage**: Penyimpanan riwayat deteksi di perangkat.

## Persiapan dan Instalasi

1. **Kloning Repo**  
   git clone https://github.com/aldorifkifirmansyah/LetVision.git
   cd letvision

2. **Instalasi Dependensi**  
   npm install  
   (atau yarn install)

3. **Setup Environment**

   - Buat file .env dan tambahkan kredensial Supabase (SUPABASE_URL, SUPABASE_ANON_KEY).

4. **Menjalankan Aplikasi**  
   npx expo start
   - Buka di emulator atau Expo Go app di perangkat.

## Cara Kerja Singkat

1. **Ambil/unggah foto tanaman selada**.
2. **Model AI** memproses dan mendeteksi tahap pertumbuhan/penyakit.
3. **Rekomendasi** (nutrisi, pH, penanganan penyakit) ditampilkan.
4. **Riwayat** disimpan di AsyncStorage beserta label dan fitur pin.

---
