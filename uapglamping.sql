-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 28, 2025 at 05:21 PM
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
-- Database: `uap_glamping`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `id_activity` int(11) NOT NULL,
  `name_activity` varchar(100) NOT NULL,
  `detail_activity` text DEFAULT NULL,
  `price_activity` decimal(10,2) NOT NULL,
  `image1` varchar(255) DEFAULT NULL,
  `image2` varchar(255) DEFAULT NULL,
  `image3` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`id_activity`, `name_activity`, `detail_activity`, `price_activity`, `image1`, `image2`, `image3`, `is_active`) VALUES
(1, 'Kayak', 'Enjoy a kayaking activity on a serene lake with stunning views.', 10.00, 'kayak1.jpg', 'kayak2.jpg', 'kayak3.jpg', 1),
(2, 'Stand Up Paddle', 'Stand Up Paddle allows you to stand on a board and paddle across calm waters.', 10.00, 'sup1.jfif', 'sup2.avif', 'sup3.jpg', 1),
(3, 'ATV Ride (Package A)', 'A 3 km ATV ride for 30 minutes with low difficulty, suitable for beginners and first-time riders.', 30.00, 'atv1.jpg', 'atv2.jpg', 'atv3.jpg', 1),
(4, 'ATV Ride (Package B)', 'A 5 km round-trip ATV ride for 2 hours with moderate difficulty, ideal for riders seeking a more adventurous experience.', 50.00, 'ATV2.jpg', 'ATV3.jpg', 'ATV1.jpg', 1),
(9, 'flying fox', 'GAGAGAGAGAGGA', 100.00, 'act_695157386c079.png', 'act_695157386c3b7.png', 'act_695157386c59b.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `activity_booking`
--

CREATE TABLE `activity_booking` (
  `id_bookingActivity` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(100) DEFAULT NULL,
  `activity_name` varchar(100) NOT NULL,
  `activity_date` date NOT NULL,
  `activity_time` time NOT NULL,
  `participants` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_booking`
--

INSERT INTO `activity_booking` (`id_bookingActivity`, `customer_name`, `customer_email`, `customer_phone`, `activity_name`, `activity_date`, `activity_time`, `participants`, `created_at`) VALUES
(1, 'peah', 'rifahrizal13@gmail.com', '0182684973', 'ATV(A)', '2025-12-25', '17:30:00', 3, '2025-12-22 05:32:21'),
(2, 'asiah', 'rifahrizal13@gmail.com', '0182684973', 'Kayak', '2026-01-31', '17:30:00', 2, '2025-12-24 15:30:42');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `username`, `email`, `name`, `password`) VALUES
(1, 'adminGlamping', 'glamping.uap@upsi.edu.my', 'Admin Glamping', '$2y$10$9IURdmlI4HrCJ4pWNgQOEea0nleNJotKnMW7v6Abj/Z4q17iOHXgS');

-- --------------------------------------------------------

--
-- Table structure for table `admin_settings`
--

CREATE TABLE `admin_settings` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id_booking` int(11) NOT NULL,
  `email_customer` varchar(100) NOT NULL,
  `id_package` int(11) DEFAULT NULL,
  `booking_date` date NOT NULL,
  `days` int(11) NOT NULL,
  `total_payment` decimal(10,2) NOT NULL,
  `payment_proof` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id_booking`, `email_customer`, `id_package`, `booking_date`, `days`, `total_payment`, `payment_proof`) VALUES
(47, 'd20221102554@siswa.upsi.edu.my', NULL, '2025-12-29', 1, 600.00, '1766595974_DomeVIP_3.jpg'),
(48, 'd20221102554@siswa.upsi.edu.my', NULL, '2025-12-29', 2, 1440.00, '1766596082_KhemahBesar_3.jpg'),
(50, 'peah@gmail.com', NULL, '2025-12-25', 2, 1600.00, '1766596549_glampingAbout.jpeg'),
(51, 'd20221102554@siswa.upsi.edu.my', NULL, '2025-12-31', 1, 1070.00, '1766920181_camping1.jpeg'),
(52, 'peah@gmail.com', NULL, '2026-02-04', 2, 3000.00, '1766931945_big1.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `booking_detail`
--

CREATE TABLE `booking_detail` (
  `id_booking_detail` int(11) NOT NULL,
  `id_booking` int(11) NOT NULL,
  `id_package` int(11) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_detail`
--

INSERT INTO `booking_detail` (`id_booking_detail`, `id_booking`, `id_package`, `qty`, `price`, `created_at`) VALUES
(38, 47, 1, 1, 600.00, '2025-12-24 17:05:57'),
(39, 48, 5, 2, 360.00, '2025-12-24 17:07:46'),
(41, 50, 1, 1, 800.00, '2025-12-24 17:15:25'),
(42, 51, 2, 1, 710.00, '2025-12-28 11:09:15'),
(43, 51, 5, 1, 360.00, '2025-12-28 11:09:15'),
(44, 52, 2, 1, 880.00, '2025-12-28 14:25:22'),
(45, 52, 5, 1, 520.00, '2025-12-28 14:25:22'),
(46, 52, 7, 1, 100.00, '2025-12-28 14:25:22');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `email_customer` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`email_customer`, `name`, `gender`, `mobile`, `address`, `password`, `created_at`) VALUES
('d20221102554@siswa.upsi.edu.my', 'PUTRI NURASIAH BINTI BAHRIN', 'Female', '018-2684973', 'Sungai Besar, Selangor', '$2y$10$AdyenYW76WYg4.WISsUckegsaFWfohhYb0KNSGFnA/9uxo3aMViDy', '2025-12-25 00:38:03'),
('drummimaisarah@gmail.com', 'UMMI MAISARAH BINTI SUFIAN', 'Female', '0139189726', 'Jalan Ampang 2/8K, 68000, Selangor', '$2y$10$Ql28zKD1LCGruPMuKAkkA.P/U1A0qAnomZR1u1r6AtKHODWawSnLy', '2025-12-22 12:57:07'),
('peah@gmail.com', 'NURIF\'AH BINTI RIZAL', 'Female', '0125671891', 'KHAR Blok 1 G-02-03, Universiti Pendidikan Sultan Idris, Kampus Sultan Azlan Shah, Proton City, 35900, Perak', '$2y$10$ozC8DA8ioda.MHsoP8mSwuruGBzUKp.kqDVDG./V5Oy0mBIMBzYEe', '2025-12-22 12:57:07'),
('rania@gmail.com', 'SITI RANIA BINTI MANAT ', 'Female', '0145671891', 'Blok 1-7-01, Taman Bahtera, Jalan Bahtera 2/5G, Hulu Selangor,43100, Selangor', '$2y$10$CSXCXAGP9jIphwxPkl5ZseicT4PnDeZiH.Ag7MojbwWf5nyqlzQdm', '2025-12-22 12:57:07'),
('safina@gmail.com', 'SAFINA BINTI MAHMUD', 'Female', '0138765432', 'PPR Pantai Dalam, Jalan Bangsar 3, 59100, Kuala Lumpur', '$2y$10$hEhM.uJBf9WU2TP8Wp2AE.OoiW2OIjiWrBQp6oQ9mh7ULJY9ADBKq', '2025-12-22 12:57:07'),
('suzana@gmail.com', 'SUZANA BINTI ALI', 'Female', '0198765457', 'Jalan Bendahara 1A, Kuala Selangor,45000, Selangor\r\n', '$2y$10$oh60galo9Luu0oWXscPqj.RYM//BAO9TsfOEfVT5G/ayx7cbtqkh6', '2025-12-22 12:57:07'),
('zurianaafiz13@gmail.com', 'ZURIANA BINTI AFIZ', 'Female', '018-2684973', 'Lot 49, Taman Bahagia, Taman Universiti, Bahtera, 35900, Kuala Selangor', '$2y$10$R3ePa8GqExig2naSa1U.4euSmwKGXgi7o07jTXHr79mhJHdIFW/.i', '2025-12-22 12:57:07');

-- --------------------------------------------------------

--
-- Table structure for table `package`
--

CREATE TABLE `package` (
  `id_package` int(11) NOT NULL,
  `name_package` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `facility` text DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `image_package` varchar(255) DEFAULT NULL,
  `image_package1` varchar(255) DEFAULT NULL,
  `image_package2` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package`
--

INSERT INTO `package` (`id_package`, `name_package`, `description`, `facility`, `capacity`, `quantity`, `image_package`, `image_package1`, `image_package2`, `is_active`) VALUES
(1, 'DOME (VIP)', 'Experience a premium glamping stay with elegant interior design, complete privacy, and a relaxing lake-side atmosphere — perfect for couples or small families seeking comfort in nature.', 'Air-condition\r\n1 Queen Bed\r\nBathroom\r\nLake view\r\nTelevision\r\nCar Parking\r\nWatching Tower\r\nToilet\r\nWalkway\r\nPantry', 4, 3, 'dome1.jpeg', 'dome2.jpeg', 'dome3.jpeg', 1),
(2, 'BIG TENT', 'A spacious and comfortable tent designed for families or groups, offering ample space to relax, gather, and enjoy a memorable outdoor stay together.', 'Air-condition\r\n4 Queen Bed\r\nElectrical plug\r\nCar Parking\r\nWatching Tower\r\nToilet\r\nWalkway\r\nPantry', 8, 5, 'big1.jpeg', 'big2.jpeg', 'big3.jpeg', 1),
(5, 'SMALL TENT', 'A cozy and practical tent ideal for small groups, combining comfort and affordability for a simple yet enjoyable glamping experience.', 'Air-condition\r\n2 Queen Bed\r\nElectrical plug\r\nCar Parking\r\nWatching Tower\r\nToilet\r\nWalkway\r\nPantry', 4, 5, 'small1.jpeg', 'small2.jpeg', 'small3.jpeg', 1),
(7, 'CARAVAN PARK', 'A dedicated space for caravan and camper van guests, providing essential facilities for a convenient and enjoyable outdoor stay.', 'Car Parking\r\nWatching Tower\r\nToilet\r\nWalkway\r\nPantry', NULL, 5, 'caravan1.jpeg', 'caravan2.jpeg', 'caravan3.jpeg', 1),
(9, 'CAMPING GROUNDING', 'An open camping area for nature lovers who prefer a traditional outdoor experience, surrounded by fresh air and scenic surroundings.', 'Car Parking\r\nWatching Tower\r\nToilet\r\nWalkway\r\nPantry', 0, 5, 'camping1.jpeg', 'camping2.jpeg', 'camping3.jpeg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `package_availability`
--

CREATE TABLE `package_availability` (
  `id` int(11) NOT NULL,
  `id_package` int(11) NOT NULL,
  `book_date` date NOT NULL,
  `booked_qty` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_availability`
--

INSERT INTO `package_availability` (`id`, `id_package`, `book_date`, `booked_qty`) VALUES
(54, 1, '2025-12-29', 1),
(55, 5, '2025-12-29', 2),
(58, 1, '2025-12-25', 1),
(59, 1, '2025-12-26', 1),
(60, 2, '2025-12-31', 1),
(61, 5, '2025-12-31', 1),
(62, 2, '2026-02-04', 1),
(63, 2, '2026-02-05', 1),
(64, 5, '2026-02-04', 1),
(65, 5, '2026-02-05', 1),
(66, 7, '2026-02-04', 1),
(67, 7, '2026-02-05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `price`
--

CREATE TABLE `price` (
  `id_price` int(11) NOT NULL,
  `id_package` int(11) NOT NULL,
  `user_category` enum('public','upsi') NOT NULL,
  `day_type` enum('weekday','weekend') NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price`
--

INSERT INTO `price` (`id_price`, `id_package`, `user_category`, `day_type`, `price`) VALUES
(1, 1, 'upsi', 'weekday', 600.00),
(7, 5, 'upsi', 'weekday', 360.00),
(11, 2, 'upsi', 'weekday', 710.00),
(16, 7, 'upsi', 'weekday', 80.00),
(18, 9, 'upsi', 'weekday', 50.00),
(20, 1, 'public', 'weekday', 800.00),
(22, 2, 'public', 'weekday', 880.00),
(24, 5, 'public', 'weekday', 520.00),
(26, 7, 'public', 'weekday', 100.00),
(28, 9, 'public', 'weekday', 70.00),
(30, 1, 'upsi', 'weekend', 700.00),
(31, 2, 'upsi', 'weekend', 840.00),
(32, 5, 'upsi', 'weekend', 420.00),
(33, 7, 'upsi', 'weekend', 80.00),
(34, 9, 'upsi', 'weekend', 50.00),
(35, 1, 'public', 'weekend', 900.00),
(36, 2, 'public', 'weekend', 1040.00),
(37, 5, 'public', 'weekend', 520.00),
(38, 7, 'public', 'weekend', 120.00),
(39, 9, 'public', 'weekend', 70.00);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id_review` int(11) NOT NULL,
  `email_customer` varchar(100) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `review_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id_review`, `email_customer`, `rating`, `comment`, `gambar`, `review_date`) VALUES
(10, 'drummimaisarah@gmail.com', 5, 'ok', NULL, '2025-12-19 16:57:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id_activity`);

--
-- Indexes for table `activity_booking`
--
ALTER TABLE `activity_booking`
  ADD PRIMARY KEY (`id_bookingActivity`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `admin_settings`
--
ALTER TABLE `admin_settings`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id_booking`),
  ADD KEY `email_customer` (`email_customer`),
  ADD KEY `id_package` (`id_package`);

--
-- Indexes for table `booking_detail`
--
ALTER TABLE `booking_detail`
  ADD PRIMARY KEY (`id_booking_detail`),
  ADD KEY `fk_booking_detail_booking` (`id_booking`),
  ADD KEY `fk_booking_detail_package` (`id_package`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`email_customer`);

--
-- Indexes for table `package`
--
ALTER TABLE `package`
  ADD PRIMARY KEY (`id_package`);

--
-- Indexes for table `package_availability`
--
ALTER TABLE `package_availability`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_pkg_date` (`id_package`,`book_date`);

--
-- Indexes for table `price`
--
ALTER TABLE `price`
  ADD PRIMARY KEY (`id_price`),
  ADD UNIQUE KEY `id_package` (`id_package`,`user_category`,`day_type`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id_review`),
  ADD KEY `review_ibfk_1` (`email_customer`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `id_activity` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `activity_booking`
--
ALTER TABLE `activity_booking`
  MODIFY `id_bookingActivity` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_settings`
--
ALTER TABLE `admin_settings`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id_booking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `booking_detail`
--
ALTER TABLE `booking_detail`
  MODIFY `id_booking_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `package`
--
ALTER TABLE `package`
  MODIFY `id_package` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `package_availability`
--
ALTER TABLE `package_availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `price`
--
ALTER TABLE `price`
  MODIFY `id_price` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`email_customer`) REFERENCES `customer` (`email_customer`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`id_package`) REFERENCES `package` (`id_package`);

--
-- Constraints for table `booking_detail`
--
ALTER TABLE `booking_detail`
  ADD CONSTRAINT `fk_booking_detail_booking` FOREIGN KEY (`id_booking`) REFERENCES `booking` (`id_booking`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_detail_package` FOREIGN KEY (`id_package`) REFERENCES `package` (`id_package`) ON DELETE CASCADE;

--
-- Constraints for table `package_availability`
--
ALTER TABLE `package_availability`
  ADD CONSTRAINT `package_availability_ibfk_1` FOREIGN KEY (`id_package`) REFERENCES `package` (`id_package`);

--
-- Constraints for table `price`
--
ALTER TABLE `price`
  ADD CONSTRAINT `price_ibfk_1` FOREIGN KEY (`id_package`) REFERENCES `package` (`id_package`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`email_customer`) REFERENCES `customer` (`email_customer`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
