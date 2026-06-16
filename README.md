# MedWaste Report

**MedWaste Report** adalah platform berbasis web yang membantu masyarakat mengelola limbah medis rumah tangga secara aman dan bertanggung jawab. Aplikasi ini menyediakan fitur pelaporan/penyerahan limbah medis, pengelolaan lokasi penerima, edukasi pengelolaan limbah medis, riwayat laporan, serta pemantauan status penanganan laporan.

Project ini dikembangkan sebagai project akhir mata kuliah **Pemrograman Berbasis Web** dengan tema **SDG 3: Good Health and Well-Being**.

---

## Tim Pengembang

Project ini dikembangkan oleh kelompok mata kuliah **Pemrograman Berbasis Web**.

Anggota:

1. Naila Hafizha (NPM:2408107010026)
2. Aqila Ruqayyah (NPM:2408107010070)

---

## Daftar Isi

- [Deskripsi Project](#deskripsi-project)
- [Tujuan Project](#tujuan-project)
- [Hubungan dengan SDG 3](#hubungan-dengan-sdg-3)
- [Aktor Pengguna](#aktor-pengguna)
- [Fitur Aplikasi](#fitur-aplikasi)
- [Jenis Limbah Medis](#jenis-limbah-medis)
- [Alur Sistem](#alur-sistem)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder](#struktur-folder)
- [Persiapan Database](#persiapan-database)
- [Cara Menjalankan Project](#cara-menjalankan-project)
- [Testing Aplikasi](#testing-aplikasi)

---

## Deskripsi Project

MedWaste Report adalah aplikasi web yang berperan sebagai wadah perantara antara masyarakat dan pihak pengelola/penerima limbah medis rumah tangga. Limbah medis rumah tangga seperti obat kedaluwarsa, masker bekas, jarum suntik, lancet, alat tes kesehatan, kapas, kasa, dan limbah kesehatan lainnya dapat membahayakan kesehatan masyarakat maupun lingkungan apabila dibuang sembarangan.

Melalui aplikasi ini, user dapat membuat pengajuan penyerahan limbah medis, memilih lokasi penerima yang sesuai, melihat panduan edukasi, serta memantau status penyerahan limbah. Admin dapat mengelola lokasi penerima, artikel edukasi, serta status pengajuan dari user.

---

## Tujuan Project

Tujuan dari MedWaste Report adalah:

1. Membantu masyarakat memilah dan menyerahkan limbah medis rumah tangga dengan lebih aman.
2. Menyediakan informasi lokasi penerima limbah medis berdasarkan jenis limbah.
3. Mengurangi risiko pembuangan limbah medis sembarangan.
4. Memberikan edukasi terkait pengelolaan limbah medis rumah tangga.
5. Membantu admin/pengelola memantau pengajuan penyerahan limbah dari masyarakat.

---

## Hubungan dengan SDG 3

Project ini mendukung **SDG 3: Good Health and Well-Being**, khususnya pada upaya mengurangi risiko penyakit dan gangguan kesehatan akibat limbah medis yang tidak dikelola dengan benar.

Limbah medis rumah tangga yang dibuang sembarangan dapat menyebabkan:

- risiko luka akibat benda tajam seperti jarum atau lancet,
- risiko penyebaran infeksi dari limbah terkontaminasi,
- pencemaran lingkungan akibat obat atau bahan farmasi,
- bahaya bagi petugas kebersihan dan masyarakat sekitar.

Dengan adanya MedWaste Report, masyarakat dapat memperoleh panduan dan akses untuk menyerahkan limbah medis ke lokasi yang sesuai, sehingga pengelolaan limbah menjadi lebih aman dan bertanggung jawab.

---

## Aktor Pengguna

Aplikasi ini memiliki dua aktor utama.

### 1. User / Masyarakat

User adalah masyarakat umum yang menggunakan aplikasi untuk:

- registrasi dan login,
- melihat informasi edukasi,
- membuat pengajuan penyerahan limbah,
- memilih lokasi penerima,
- melihat riwayat pengajuan,
- memantau status penyerahan,
- mengelola profil akun.

### 2. Admin

Admin adalah pihak pengelola sistem yang bertugas untuk:

- mengelola lokasi penerima limbah,
- mengelola artikel edukasi,
- melihat pengajuan dari user,
- mengubah status penyerahan,
- memantau ringkasan data melalui dashboard admin.

---

## Fitur Aplikasi

### Fitur User

#### 1. Register dan Login

User dapat membuat akun baru dan masuk ke sistem menggunakan email dan password. Sistem melakukan validasi agar email yang sudah terdaftar tidak dapat digunakan kembali.

#### 2. Dashboard User

Dashboard menampilkan sapaan kepada user, informasi singkat tentang aplikasi, tombol akses cepat, serta jenis limbah medis yang dapat dilaporkan.

#### 3. Edukasi Pengelolaan Limbah

User dapat melihat artikel edukasi yang dikelola oleh admin. Artikel ini berisi panduan singkat mengenai cara memilah, menyimpan, dan menyerahkan limbah medis rumah tangga.

#### 4. Pengajuan Penyerahan Limbah

User dapat membuat pengajuan penyerahan limbah dengan mengisi:

- jenis limbah,
- jumlah limbah,
- lokasi penerima,
- jadwal penyerahan,
- catatan tambahan.

#### 5. Filter Lokasi Berdasarkan Jenis Limbah

Lokasi penerima otomatis difilter berdasarkan jenis limbah yang dipilih user. Dengan begitu, user hanya melihat lokasi yang menerima kategori limbah tersebut.

#### 6. Detail Lokasi Penerima

Setelah memilih lokasi, user dapat melihat detail lokasi seperti nama lokasi, alamat, nomor telepon, hari operasional, jam operasional, dan jenis limbah yang diterima.

#### 7. Kode Penyerahan dan Panduan Pembungkusan

Setelah user berhasil membuat pengajuan, sistem akan menghasilkan **kode penyerahan** sebagai identitas laporan. Kode ini digunakan untuk memudahkan proses verifikasi saat user menyerahkan limbah ke lokasi penerima.

Contoh format kode:

```text
MWR-2026-0001

#### 8. Riwayat Penyerahan

User dapat melihat daftar pengajuan yang pernah dibuat, lengkap dengan kode penyerahan, jenis limbah, lokasi, tanggal, dan status.

#### 9. Detail Riwayat

User dapat melihat detail lengkap dari setiap pengajuan, termasuk timeline status.

#### 10. Profil User

User dapat melihat dan mengubah data profil akun.

---

### Fitur Admin

#### 1. Login Admin

Admin dapat masuk ke halaman admin menggunakan akun khusus admin.

#### 2. Dashboard Admin

Dashboard admin menampilkan ringkasan data sistem, seperti total user, total pengajuan, status penyerahan, jumlah lokasi penerima, dan ringkasan jenis limbah yang paling sering diajukan.

#### 3. Kelola Penyerahan

Admin dapat melihat seluruh pengajuan dari user dan mengubah status penyerahan.

Status yang digunakan:

```text
Dijadwalkan → Diterima Lokasi → Selesai
```

#### 4. Kelola Lokasi

Admin dapat menambah, mengedit, dan menghapus lokasi penerima limbah. Data lokasi meliputi:

- nama lokasi,
- alamat,
- nomor telepon,
- jenis limbah yang diterima,
- hari operasional,
- jam buka,
- jam tutup,
- batas maksimal jadwal penyerahan.

Hari operasional menggunakan dropdown multi-select agar admin dapat memilih lebih dari satu hari tanpa mengetik bebas. Jam buka dan jam tutup menggunakan input waktu agar tidak dapat diisi secara sembarangan.

#### 5. Kelola Edukasi

Admin dapat menambah, mengedit, dan menghapus artikel edukasi. Data edukasi meliputi:

- judul artikel,
- kategori,
- isi artikel/panduan.

---

## Jenis Limbah Medis

Jenis limbah medis dalam aplikasi disederhanakan menjadi tiga kategori utama agar sesuai dengan konteks masyarakat umum.

### 1. Limbah Benda Tajam (Sharps)

Contoh:

- jarum suntik,
- lancet cek gula darah,
- ampul pecah,
- benda medis tajam kecil.

### 2. Limbah Padat Infeksius (Kantong Kuning)

Contoh:

- masker bekas,
- sarung tangan bekas,
- perban,
- kasa,
- kapas,
- swab,
- alat tes kesehatan bekas yang terkontaminasi.

### 3. Limbah Farmasi (Kantong Cokelat)

Contoh:

- obat kedaluwarsa,
- sisa obat,
- sirup,
- salep,
- kemasan obat tertentu.

---

## Alur Sistem

### Alur User

1. User melakukan registrasi akun.
2. User login ke sistem.
3. User membaca edukasi jika diperlukan.
4. User memilih jenis limbah yang ingin diserahkan.
5. Sistem menampilkan lokasi penerima yang sesuai.
6. User memilih lokasi dan jadwal penyerahan.
7. User mengirim pengajuan penyerahan limbah.
8. Sistem membuat kode penyerahan.
9. User dapat melihat pengajuan melalui halaman riwayat.
10. Status pengajuan diperbarui oleh admin.

### Alur Admin

1. Admin login ke dashboard admin.
2. Admin mengelola data lokasi penerima.
3. Admin mengelola artikel edukasi.
4. Admin melihat pengajuan penyerahan dari user.
5. Admin mengubah status penyerahan.
6. Perubahan status dapat dilihat oleh user pada halaman riwayat.

---

## Teknologi yang Digunakan

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL
- phpMyAdmin

### Tools Pendukung

- XAMPP
- Visual Studio Code
- Live Server
- GitHub

---

## Struktur Folder


Struktur folder project secara umum:

```text
MedWaste/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── node_modules/
│   ├── routes/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── database/
│   └── medwaste.sql
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── pages/
│   │   ├── user/
│   │   └── admin/
│   └── index.html
│
└── README.md

---

## Persiapan Database

Sebelum menjalankan backend, database harus diimport terlebih dahulu melalui phpMyAdmin.

Langkah-langkah:

1. Jalankan XAMPP.
2. Start **Apache** dan **MySQL**.
3. Buka phpMyAdmin melalui browser:

```text
http://localhost/phpmyadmin
```

4. Buat database baru, misalnya:

```text
medwaste
```

5. Import file SQL dari folder database:

```text
database/medwaste.sql
```

6. Pastikan tabel berhasil muncul di phpMyAdmin.

---

## Cara Menjalankan Project

### 1. Jalankan Database

Pastikan XAMPP sudah aktif:

- Apache: Running
- MySQL: Running

### 2. Jalankan Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Jika menggunakan PowerShell dan `npm` diblokir, gunakan:

```bash
npm.cmd install
```

Jalankan server:

```bash
npm start
```

atau:

```bash
npm.cmd start
```

Jika berhasil, server akan berjalan pada port backend, misalnya:

```text
http://localhost:3000
```

Untuk mengecek backend, buka:

```text
http://localhost:3000
```

Jika muncul pesan seperti berikut, backend sudah berjalan:

```text
MedWaste API Running
```

### 3. Jalankan Frontend

Buka folder frontend di Visual Studio Code, lalu jalankan menggunakan Live Server.

Contoh URL frontend:

```text
http://127.0.0.1:5500
```

atau:

```text
http://localhost:5500
```

---

## Testing Aplikasi

### Testing Backend

Tes endpoint API melalui browser:

```text
http://localhost:3000/api/locations
```

```text
http://localhost:3000/api/articles
```

Jika data JSON muncul, berarti backend berhasil terhubung ke database.

