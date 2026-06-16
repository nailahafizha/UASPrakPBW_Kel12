-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2026 at 04:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medwaste`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `nama`, `email`, `password`, `created_at`) VALUES
(1, 'Administrator', 'admin@medwaste.id', 'Admin123', '2026-06-15 21:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `kategori` enum('Limbah Benda Tajam','Limbah Farmasi','Limbah Padat Infeksius','Lingkungan') NOT NULL,
  `isi` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `judul`, `kategori`, `isi`, `created_at`) VALUES
(1, 'Cara Membuang Jarum Suntik', 'Limbah Benda Tajam', 'Masukkan jarum ke wadah keras sebelum diserahkan.', '2026-06-15 22:18:40'),
(2, 'Bahaya Sharps di Rumah', 'Limbah Benda Tajam', 'Benda tajam dapat melukai petugas kebersihan.', '2026-06-15 22:18:40'),
(3, 'Pengelolaan Lancet Bekas', 'Limbah Benda Tajam', 'Lancet bekas harus disimpan di wadah tertutup.', '2026-06-15 22:18:40'),
(4, 'Cara Membuang Obat Kedaluwarsa', 'Limbah Farmasi', 'Pisahkan obat dari kemasan pribadi.', '2026-06-15 22:18:40'),
(5, 'Bahaya Menyimpan Obat Rusak', 'Limbah Farmasi', 'Obat kedaluwarsa dapat berbahaya.', '2026-06-15 22:18:40'),
(6, 'Masker Bekas yang Aman', 'Limbah Padat Infeksius', 'Gunakan kantong kuning untuk masker bekas.', '2026-06-15 22:18:40'),
(7, 'Pengelolaan Perban Bekas', 'Limbah Padat Infeksius', 'Perban bekas harus dipisahkan dari sampah biasa.', '2026-06-15 22:18:40'),
(8, 'Dampak Limbah Medis', 'Lingkungan', 'Limbah medis merupakan sisa kegiatan pelayanan kesehatan yang dapat mengandung bahan infeksius, zat kimia berbahaya, maupun benda tajam. Apabila tidak dikelola dengan benar, limbah medis berpotensi mencemari lingkungan serta membahayakan kesehatan masyarakat. Contohnya, jarum suntik bekas yang dibuang sembarangan dapat menyebabkan luka dan menjadi media penyebaran penyakit menular.\n\nSelain itu, limbah farmasi seperti obat kedaluwarsa yang dibuang ke saluran air dapat mencemari sumber air dan mengganggu ekosistem. Pembakaran limbah medis tanpa prosedur yang tepat juga dapat menghasilkan zat beracun yang berbahaya bagi kualitas udara dan kesehatan manusia.\n\nOleh karena itu, setiap jenis limbah medis perlu dipilah, disimpan, dan diserahkan kepada fasilitas pengelolaan yang berizin. Dengan pengelolaan yang tepat, risiko pencemaran lingkungan dan penyebaran penyakit dapat diminimalkan sehingga tercipta lingkungan yang lebih sehat dan aman bagi masyarakat.', '2026-06-15 22:18:40'),
(9, 'Menjaga Lingkungan Rumah', 'Lingkungan', 'Pisahkan limbah medis rumah tangga dengan benar.', '2026-06-15 22:18:40'),
(10, 'Pemilahan Sampah Medis', 'Lingkungan', 'Pemilahan membantu proses pengelolaan limbah.', '2026-06-15 22:18:40');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `nama_lokasi` varchar(150) NOT NULL,
  `alamat` text NOT NULL,
  `telepon` varchar(20) NOT NULL,
  `hari_operasional` varchar(100) NOT NULL,
  `jam_buka` time NOT NULL,
  `jam_tutup` time NOT NULL,
  `batas_hari` int(11) DEFAULT 14,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `nama_lokasi`, `alamat`, `telepon`, `hari_operasional`, `jam_buka`, `jam_tutup`, `batas_hari`, `created_at`) VALUES
(1, 'Puskesmas Ulee Kareng', 'Jl. Kareng No. 5', '0651123451', 'Senin-Jumat', '08:00:00', '15:00:00', 14, '2026-06-15 22:17:21'),
(2, 'Puskesmas Batoh', 'Jl. peduli No. 8', '0651123452', 'Senin-Jumat', '08:00:00', '15:00:00', 14, '2026-06-15 22:17:21'),
(3, 'Puskesmas Lampaseh', 'Jl. Utama No. 2', '0651123453', 'Senin-Sabtu', '08:00:00', '16:00:00', 14, '2026-06-15 22:17:21'),
(4, 'Apotek Farma Sehat', 'Jl. Bakti No. 9', '0651123454', 'Senin-Minggu', '09:00:00', '21:00:00', 21, '2026-06-15 22:17:21'),
(5, 'Klinik Medika', 'Jl. Nusa No. 111', '0651123455', 'Senin-Sabtu', '08:00:00', '17:00:00', 14, '2026-06-15 22:17:21'),
(6, 'RS Harapan Ibu', 'Jl. Bangga No. 1', '0651123456', 'Senin-Minggu', '08:00:00', '20:00:00', 30, '2026-06-15 22:17:21'),
(7, 'RSUD Meuraxa', 'Jl. Mangga No. 4', '0651123457', 'Senin-Minggu', '08:00:00', '20:00:00', 30, '2026-06-15 22:17:21'),
(8, 'Apotek Kimia Farma', 'Jl. Pineung No. 7', '0651123458', 'Senin-Minggu', '09:00:00', '21:00:00', 21, '2026-06-15 22:17:21'),
(9, 'Klinik Sehat Bersama', 'Jl. Kaye No. 25', '0651123459', 'Senin-Sabtu', '08:00:00', '17:00:00', 7, '2026-06-15 22:17:21'),
(10, 'Puskesmas Peunayong', 'Jl. Bayam No. 6', '0651123460', 'Senin-Jumat', '08:00:00', '15:00:00', 7, '2026-06-15 22:17:21'),
(11, 'Klinik Peduli Bangsa', 'Jl. Merdeka No. 17', '0651676767', 'Kamis–Minggu', '09:00:00', '17:00:00', 14, '2026-06-16 01:15:28');

-- --------------------------------------------------------

--
-- Table structure for table `location_waste_types`
--

CREATE TABLE `location_waste_types` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `waste_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location_waste_types`
--

INSERT INTO `location_waste_types` (`id`, `location_id`, `waste_type_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 2, 2),
(5, 3, 2),
(6, 3, 3),
(7, 4, 3),
(8, 5, 1),
(9, 5, 2),
(10, 5, 3),
(11, 6, 1),
(12, 6, 2),
(13, 6, 3),
(14, 7, 1),
(15, 7, 2),
(16, 7, 3),
(17, 8, 3),
(18, 9, 1),
(19, 9, 2),
(20, 10, 2),
(21, 10, 3),
(22, 11, 2),
(23, 11, 3);

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `kode_penyerahan` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `waste_type_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `satuan` varchar(50) NOT NULL,
  `jadwal_penyerahan` date NOT NULL,
  `catatan` text DEFAULT NULL,
  `status` enum('Menunggu Penyerahan','Diterima Lokasi','Selesai','Dibatalkan') DEFAULT 'Menunggu Penyerahan',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `kode_penyerahan`, `user_id`, `waste_type_id`, `location_id`, `jumlah`, `satuan`, `jadwal_penyerahan`, `catatan`, `status`, `created_at`) VALUES
(1, 'MWR001', 1, 1, 1, 3, 'Kotak', '2026-06-15', NULL, 'Menunggu Penyerahan', '2026-06-15 22:19:05'),
(2, 'MWR002', 2, 2, 3, 2, 'Kantong Kuning', '2026-06-16', NULL, 'Diterima Lokasi', '2026-06-15 22:19:05'),
(3, 'MWR003', 3, 3, 4, 1, 'Kantong Cokelat', '2026-06-17', NULL, 'Selesai', '2026-06-15 22:19:05'),
(4, 'MWR004', 4, 1, 5, 4, 'Kotak', '2026-06-18', NULL, 'Menunggu Penyerahan', '2026-06-15 22:19:05'),
(5, 'MWR005', 5, 2, 6, 2, 'Kantong Kuning', '2026-06-19', NULL, 'Selesai', '2026-06-15 22:19:05'),
(6, 'MWR006', 6, 3, 8, 3, 'Kantong Cokelat', '2026-06-20', NULL, 'Dibatalkan', '2026-06-15 22:19:05'),
(7, 'MWR007', 7, 1, 7, 1, 'Kotak', '2026-06-21', NULL, 'Diterima Lokasi', '2026-06-15 22:19:05'),
(8, 'MWR008', 8, 2, 9, 2, 'Kantong Kuning', '2026-06-22', NULL, 'Menunggu Penyerahan', '2026-06-15 22:19:05'),
(9, 'MWR009', 9, 3, 10, 1, 'Kantong Cokelat', '2026-06-23', NULL, 'Selesai', '2026-06-15 22:19:05'),
(10, 'MWR010', 10, 1, 2, 5, 'Kotak', '2026-06-24', NULL, 'Menunggu Penyerahan', '2026-06-15 22:19:05'),
(11, 'MW-1781572206992', 1, 2, 10, 2, 'kantong kuning', '2026-06-23', '-', 'Dibatalkan', '2026-06-16 01:10:06'),
(12, 'MW-1781572233618', 1, 3, 8, 1, 'kantong cokelat', '2026-06-20', '-', 'Diterima Lokasi', '2026-06-16 01:10:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nomor_hp` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `nomor_hp`, `password`, `created_at`) VALUES
(1, 'Naila Hafizha', 'naila@email.com', '081234567890', 'naila123', '2026-06-15 22:10:02'),
(2, 'Najwa Putri', 'najwa@gmail.com', '081111111112', 'password123', '2026-06-15 22:10:02'),
(3, 'Aulia Rahman', 'aulia@gmail.com', '081111111113', 'password123', '2026-06-15 22:10:02'),
(4, 'Miftahul Jannah', 'miftah@gmail.com', '081111111114', 'password123', '2026-06-15 22:10:02'),
(5, 'Farhan Akbar', 'farhan@gmail.com', '081111111115', 'password123', '2026-06-15 22:10:02'),
(6, 'Dinda Safitri', 'dinda@gmail.com', '081111111116', 'password123', '2026-06-15 22:10:02'),
(7, 'Salsa Putri', 'salsa@gmail.com', '081111111117', 'password123', '2026-06-15 22:10:02'),
(8, 'Iqbal Ramadhan', 'iqbal@gmail.com', '081111111118', 'password123', '2026-06-15 22:10:02'),
(9, 'Budi Arif', 'budi@gmail.com', '081111111119', 'password123', '2026-06-15 22:10:02'),
(10, 'Aqila Ruqayyah', 'aqila@email.com', '081298765432', 'Aqila123', '2026-06-15 22:10:02'),
(11, 'Test User', 'test@gmail.com', '081234567899', 'test123', '2026-06-15 23:46:16'),
(12, 'Nala', 'nala@gmail.com', '081234567890', 'nala1234', '2026-06-16 00:41:05');

-- --------------------------------------------------------

--
-- Table structure for table `waste_types`
--

CREATE TABLE `waste_types` (
  `id` int(11) NOT NULL,
  `kode` varchar(30) NOT NULL,
  `nama_jenis` varchar(100) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `satuan_default` varchar(50) NOT NULL,
  `batas_maksimum` int(11) NOT NULL,
  `instruksi_pembungkusan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waste_types`
--

INSERT INTO `waste_types` (`id`, `kode`, `nama_jenis`, `kategori`, `satuan_default`, `batas_maksimum`, `instruksi_pembungkusan`) VALUES
(1, 'Sharps', 'Limbah Benda Tajam', 'Limbah Benda Tajam', 'Kotak', 20, 'Masukkan benda tajam ke wadah keras yang tidak mudah ditembus.'),
(2, 'Infeksius', 'Limbah Padat Infeksius', 'Limbah Padat Infeksius', 'Kantong Kuning', 5, 'Masukkan limbah ke kantong kuning dan ikat rapat.'),
(3, 'Farmasi', 'Limbah Farmasi', 'Limbah Farmasi', 'Kantong Cokelat', 10, 'Masukkan obat ke kantong cokelat atau wadah tertutup.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location_waste_types`
--
ALTER TABLE `location_waste_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`),
  ADD KEY `waste_type_id` (`waste_type_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_penyerahan` (`kode_penyerahan`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `waste_type_id` (`waste_type_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `waste_types`
--
ALTER TABLE `waste_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode` (`kode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `location_waste_types`
--
ALTER TABLE `location_waste_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `waste_types`
--
ALTER TABLE `waste_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `location_waste_types`
--
ALTER TABLE `location_waste_types`
  ADD CONSTRAINT `location_waste_types_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `location_waste_types_ibfk_2` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types` (`id`),
  ADD CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
