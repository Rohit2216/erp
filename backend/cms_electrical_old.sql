-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2023 at 01:55 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(150) NOT NULL,
  `contact_no` char(15) DEFAULT NULL,
  `alt_number` varchar(15) DEFAULT NULL,
  `user_type` bigint(11) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `address_1` text NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0' COMMENT '0 = Pending, 1 = Approved, 2 = Rejected',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `country` varchar(120) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `pin_code` varchar(8) DEFAULT NULL,
  `image` varchar(244) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `pan_number` varchar(50) DEFAULT NULL,
  `fb_url` varchar(244) DEFAULT NULL,
  `inst_url` varchar(244) DEFAULT NULL,
  `twitter_url` varchar(244) DEFAULT NULL,
  `linkedin_url` varchar(244) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `contact_no`, `alt_number`, `user_type`, `remember_token`, `address_1`, `status`, `is_deleted`, `country`, `city`, `pin_code`, `image`, `description`, `gst_number`, `pan_number`, `fb_url`, `inst_url`, `twitter_url`, `linkedin_url`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'superadmin1@gmail.com', '$2b$10$G5o/ryHubhH90xmEH7ot0uzmuax0LAx6IVHb.at0eu7noZbQFHXqW', '9313301020', NULL, 1, NULL, 'Noida', '1', '0', '', NULL, NULL, '/super_admin_images/16787952628084k-1.jfif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-06 12:44:51', '2023-04-12 10:05:00'),
(2, 'Contractor 1', 'con@gmail.com', '$2b$10$LihWa1/V3caZGjiR6PHikeMjQRJ/h5XaOiJIb/Ly7poQuNNiZV5b6', '9313301020', '659849885', 3, NULL, 'Noida 2', '1', '1', 'India', 'Noida', '110092', NULL, 'undefined', 'RAHU9313GT', 'GXEPK8542Q', NULL, NULL, NULL, NULL, 1, '2023-02-09 17:07:40', '2023-03-14 15:59:25'),
(3, 'Dealer123', 'delear1@gmail.com', '$2b$10$kItrIrXeWTpsowO43iLgMugPintCnJaku4Di0xCJCWbF3itIzfame', '9313301020', '8521456325', 4, NULL, 'Noida sector 6', '1', '0', 'India', 'Noida', '201301', '/user_images/16788611269364k-2.jfif', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-09 18:04:59', '2023-03-15 11:48:53'),
(5, 'Rahul ', 'admin@gmail.com', '$2b$10$je1z8w/50E2ed5uEK49xBOuc0ZHbaFNFJXTS/Tcpd4y25TTKLVXBy', '9313301020', '659849885', 8, NULL, '', '', '0', '', '', '110092', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-10 10:38:12', NULL),
(11, 'Energy Company ', 'energycompany1@gmail.com', '$2b$10$4wc/yP40/ExP5ZuTzLorUecGombgjfclTIA3DgvSp2J2x0LGq/qpC', '9313301020', '9313301020', 2, NULL, 'Moida sector-6', '1', '0', 'India', 'Noida', '2301301', '', 'this is test for profile update', 'DGD8675DFJ', NULL, '', '', '', '', 1, '2023-02-15 14:07:03', '2023-03-15 18:15:54'),
(12, 'Energy Company 3', 'energycompany2@gmail.com', '$2b$10$8vS6QufBCh4bTEvZ1rYFJee2bi6DdVe44DG14/YCKYo8ZfHd77lkO', '9313301020', '659849885', 2, NULL, '', '1', '0', '', '', '110092', NULL, 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-02-16 11:31:14', NULL),
(14, 'Energy Company 2', 'energycompany2@gmail.com', '$2b$10$7OusHF1scdvJRIbRB0yxGedfOUJZin.bGZ9U2kkncHDF37QRLpM9O', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', 'India', 'Noida', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-02-17 18:04:07', '2023-03-16 10:54:49'),
(15, 'Energy Company 4', 'energycompany1@gmail.com', '$2b$10$IAqu12OnV671685dsl3ovujY.3G835silnR0QIImlTE5VfhayqMGa', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', '', '', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-02-17 18:05:05', NULL),
(16, 'Energy Company 5', 'energycompany1@gmail.com', '$2b$10$ybANX5J2xEnBebuGhXMvF.kvFByzQxAqY0jnxLzL3b1XqLzTMMzL.', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', '', '', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-02-17 18:20:57', NULL),
(18, 'Contractor 2', 'contractor2@gmail.com', '$2b$10$YqCs2Wtz/SgVafmxCyr7Z.KgKvycdHPFE/vfQM4jm780vkPlyneWK', '9313301020', '9313301020', 3, NULL, 'Noida sector 6', '1', '1', 'India', 'Noida', '230125', '/user_images/1681282441763logo.png', 'undefined', 'undefined', 'undefined', NULL, NULL, NULL, NULL, 1, '2023-02-20 12:16:55', '2023-04-12 12:24:01'),
(24, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$LAFiVhyM9j3rR0bQejM.veVnClIiszQrLQtaAe2uwhejtZUcNrpwK', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '1', '1', 'India', 'Noida', '2301025', '/user_images/1676974615106istockphoto-1163423519-612x612.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-02-21 15:46:55', NULL),
(25, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$ml7nwzqlflsYOplIma5MI.IivQy1ZHuCYxPwT.hokNNxT8DW13oZO', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '1', '1', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-06 14:41:59', '2023-03-14 13:30:36'),
(26, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$YhUxAOYdlQF8nF9RKsfovuEpCBnWjatXBb6q5yk2LL1BuHVI34lWa', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '0', '1', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-07 14:54:51', NULL),
(27, 'Dealer 4', 'dealer4@gmail.com', '$2b$10$tAImxvYmjQO8I8Ym0mADFetVWY.qxc18/InDG6RxRKJM3rL0kO8qu', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '0', '1', 'India', 'Noida', '2301025', '/user_images/1678185413270istockphoto-1163423519-612x612.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:06:53', NULL),
(28, 'Altaf', 'superadmin@gmail.com', '$2b$10$72xdDk5qlp0ezwommGvc4u3rFa0qQk/TLauQxnB1AcHKD38gSB8km', '5165151651', '6516516511', 5, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:13:41', '2023-03-14 15:26:16'),
(29, 'Altaf', 'superadmin1@gmail.com', '$2b$10$vjQ6D46loOYJzBkr782YTeeNyjfjwTvvCNfSljKgwtkWqXKCLTfGK', '6516516516', '1465165165', 5, NULL, 'undefined', '1', '0', 'undefined', 'undefined', 'undefine', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:09:49', '2023-03-14 15:26:26'),
(30, 'Altaf', 'superadmin@gmail.com', '$2b$10$Hk1rk93/KlzUCb4uk4h3B.UKz7/IJchcHqkZzc6uzpu9Kcbq0PKrO', '9654452454', '9854525544', 4, NULL, 'fdgh6768', '2', '0', 'india', 'noida', '230301', '/user_images/1681379195351download (2).jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:10:19', '2023-04-13 15:16:52'),
(31, 'Altaf', 'superadmin1@gmail.com', '$2b$10$lUEju.1XHAXrg6UImZJISeqHvPC9elwpM0s7FB4LF5ZvTtxH4bQrW', '', '', 4, NULL, '', '0', '1', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:11:12', NULL),
(32, 'Mohit', 'superadmin@gmail.com', '$2b$10$2yPVeOMVwOsPKOQ307SHEOx0bS/ojzYJvgYnT.F07dK1uJ12JBsAC', '4851254754', '4851254754', 4, NULL, 'gsddha colony', '0', '1', 'india', 'delhi', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:15:32', NULL),
(33, 'Dealer 4', 'dealeradmin@gmail.com', '$2b$10$ACSZe1tC5t9rGmgSg9TTBeaqpN5ZWD0ZCOg7AmIz/Zd1fSpntKoGW', '7521458623', '7521452144', 4, NULL, 'faridabad', '1', '0', 'india', 'noida', '110025', '/user_images/1681378809433logo.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:17:42', '2023-04-13 15:10:16'),
(34, 'ankur', 'superadmin@gmail.com', '$2b$10$9hIou1hSHKPXBrU2Argb2OpzoWliYHG1rAdX2YdBZpFTbAdqYBmcy', '12345678421', '12345678', 4, NULL, 'gsddha colony', '0', '1', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:29:10', NULL),
(35, 'ansarul', 'superadmin@gmail.com', '$2b$10$ufb89Y9vLwF0F6QSgKL3beqMvg04P.jDeEmqvHAHaj8n0tjj6IylW', '123456785', '123456785', 4, NULL, 'h-16gg', '0', '1', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:35:37', NULL),
(36, 'imran ahmad123', 'superadmin@gmail.com', '$2b$10$0dc/RnyP.remFtAho55DtuPDSeRs2up6CuPsMOP0iM7vyOzb.3MbO', '', '', 4, NULL, 'h-16', '0', '1', 'india', '', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:21:13', NULL),
(37, 'salu admin', 'superadmin@gmail.com', '$2b$10$kG8ggIi5ZiPH1CphGAdo.OkcUSf7L2pHsaYee..1ueqJtNp.BVxSu', '6516516516', '6541651651', 4, NULL, '', '0', '1', 'india', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:23:46', '2023-03-14 15:27:03'),
(38, 'Dealer 2', 'dealer2@gmail.com', '$2b$10$rOfPlbX6Dgw4.LKyNTkTL.V2H3fRMzZXyC9j70wHCgpgH3UBYOD7W', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '0', '1', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:04:42', NULL),
(39, 'ankur', 'ankuradmin1@gmail.com', '$2b$10$waWDYIB9MVNxQHGz/KYacOqUckx374CoaTVDSAtkpY5I4bvTeVHie', '7617068524', '5416587571', 4, NULL, 'h-16/524 ratiya ', '1', '1', 'india', 'delhi', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:28:14', NULL),
(40, 'mohit', 'mohitadmin@gmail.com', '$2b$10$32t9jcylQ.xTVboiTR07Ve/dkIvRcmQLEcbjLiE2D7KndoVtCumHq', '2', '665262', 4, NULL, 'h-16', '0', '1', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 14:50:00', NULL),
(41, 'mahesh', 'maheshadmin1@gmail.com', '$2b$10$vE3pZAnb/HbC9Jcvsfbyv.2APXOYfuUw1CoWyRLvdl5qaOEBzNrZ6', '', '6254147854', 4, NULL, 'h-16 854 .gym', '1', '1', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:26:05', NULL),
(42, 'mahesh kumar', 'maheshadmin1@gmail.com', '$2b$10$ew7GrGg/O5rA45Lvw0L8B.LtZVfm2r904a/wWUP9w1MQKXY7wwARq', '1236547895', '6254147854', 4, NULL, 'h-16 854 .gym', '0', '1', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:28:01', '2023-03-10 16:31:14'),
(43, 'mahesh yadav', 'maheshadmin1@gmail.com', '$2b$10$Dz7Df4qpM.Vspams6BHEC.BSGXGQYdHo55QK994cMJxAX.JybD1h2', '2365214587', '6254147854', 4, NULL, 'h-16 854 .gym', '0', '1', 'india', 'GHAZIABAD', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:28:07', '2023-03-10 16:31:41'),
(44, 'ankurs', 'superadmin1@gmail.com', '$2b$10$GASjwO6vL76dvpkn4d/74Ol37iHnuaPVZvcZJuFAqD/Yb4wP1EKv.', '2365214577', '265515456', 4, NULL, 'h-16', '0', '1', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:32:10', NULL),
(45, 'ankurs', 'superadmin1@gmail.com', '$2b$10$XXGpDsn3l5U/EJ/4I6vRPu.zSnNylfhe9Ba3x3OrMh5bahFVz7SOO', '2365214577', '265515456', 4, NULL, 'h-16', '0', '1', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-10 16:32:19', NULL),
(46, 'Dealer 2ss', 'dealer2@gmail.com', '$2b$10$gsSWv/5S.UCPtccDQ0xncuLeRbXuFb25cRwYgj9u/OlFGQb99VpnC', '9313301020', '9313301020', 4, NULL, 'Noida sector 3', '1', '1', 'India', 'Noida', '2301025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-13 10:48:51', '2023-03-13 16:36:03'),
(47, 'Altaf ali', 'superadmin1@gmail.com', '$2b$10$5Xf0FBEvG1AbO5qHB2.KA.ld6VtZ44ETARQ50aTapENgc5lxzXFMK', '5632145624', '8965478563', 4, NULL, 'h-16/524 ratiya marg', '1', '1', 'india', 'delhi', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:04:18', NULL),
(48, 'Altaf', 'superadmin1@gmail.com', '$2b$10$jjhy.kJ3RXEE/CdYVIVWj.TiPDZG586psonPS.rkBNaC4WG1GV3yO', '555555555551', '62626265282', 4, NULL, 'h-16gg', '1', '1', 'india', 'noida', '110025', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:17:41', '2023-03-14 11:28:06'),
(49, 'Rahul Kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$.Ymufsoyh.tPDiNyPRcY5.EVvrud2nUQx6TIoaD3tkezC2NDcZPJm', '9313301030', '9821626068', 4, NULL, 'Noida 2', '1', '1', 'India', 'Noida', '230103', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:26:49', '2023-03-14 13:28:04'),
(50, 'Contractor 2', 'contractor2@gmail.com', '$2b$10$r359w45N2ii46Nz4iwVYjOCaHmYycaaJEiRw1UkdM.pzx59lvcx0e', '9313301020', '9313301020', 3, NULL, 'Noida sector 6', '1', '1', 'India', '230125', 'Noida', '', 'Contractor 2 account create check by super admin', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 13:33:15', NULL),
(51, 'Contractor sub user', 'contractsubuser45@gmail.com', '$2b$10$8HKuo/8aCaUty53iYXdPiuLm0sV6ZK5fA0hYaVUyof48vjr/fhAfq', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:16:34', NULL),
(52, 'Super Altaf', 'superadmin1@gmail.com', '$2b$10$t7Gb/lyLYOeYJPjOQ3Wt/uyDEkrp6yCfk8lMOIK75gMC5qn7svKv.', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:17:32', NULL),
(53, 'Altaf 53', 'superadmin1@gmail.com', '$2b$10$O4SYclswy0UJeVnZmg2.0uogsMYFn6WNt6fOR94GVoeQV66k9g6Ii', '9654452454', '9854525544', 3, NULL, 'fdfg', '1', '0', 'sdgfdsf', 'sdfdfg', '230301', '/user_images/1681379500954logo.png', 'undefined', 'undefined', 'undefined', NULL, NULL, NULL, NULL, 1, '2023-03-14 15:21:22', '2023-05-11 10:31:25'),
(54, 'Altaf', 'superadmin1@gmail.com', '$2b$10$RG0EqgJHrAOl7.RKSoqw5OyZ2S0LFSNYX/nGYmSM3CpV/Mwahd3JW', '6516516516', '6516516511', 3, NULL, 'gsddha colony', '1', '0', 'india', '110025', 'noida', '/user_images/1678855643302404-error.png', 'undefined', 'undefined', 'undefined', NULL, NULL, NULL, NULL, 1, '2023-03-14 15:35:25', '2023-05-11 10:31:12'),
(55, 'Altaf ali', 'superadmin1@gmail.com', '$2b$10$rgAvBK6Xg30IRPpl1oUqf.f2rR6f4z61zYNhIzlcp40gsSLkv8x5C', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:38:08', NULL),
(56, 'Altaf', 'superadmin1@gmail.com', '$2b$10$QWDqra4Yu3OmKXSNrPMe0utFzfejJjqlrvCw/T/pp9hmnalkv2wZ.', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:41:09', NULL),
(57, 'sumit123', 'superadmin1@gmail.com', '$2b$10$1jvNOIw7xtGdpYr6Uv9gcu5F61T949UyaVCrCOk0.VKYcrVgGGaIW', '1521515155', '1515151515', 3, NULL, 'h-16', '1', '0', 'india', 'noida', '110025', '/user_images/1678855653602bubble.jpg', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:42:04', '2023-03-15 10:21:27'),
(58, 'ansarul 1231', 'superadmin1@gmail.com', '$2b$10$zC80GcxtkKKJOrWs3Y/T5.8T7V4I8GE26dTHiaZrDByvyAU1iad46', '1236547996', '6515165151', 3, NULL, 'h-16gg', '1', '0', 'india', '110025', 'noida', '/user_images/1678855666078bg-2.png', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:56:34', '2023-03-15 10:17:46'),
(59, 'asasas', 'superadmin1@gmail.com', '$2b$10$aehmRXl8Fo6lyTJf4.uVR.GNkLinrUpdUc5AO6tWubUluWdKt9Vuu', 'undefined', 'undefined', 3, NULL, 'undefined', '1', '1', 'undefined', 'undefined', 'undefine', '', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:02:52', NULL),
(60, 'Altaf', 'superadmin1@gmail.com', '$2b$10$iRGQwRO.SJ32OEo6iIgj1utBzFHfmMGrVOsksYIYzOKxtd0VSTt42', '5615625125', '5165165126', 3, NULL, 'h-16', '1', '0', 'india', 'delhi', '110025', '/user_images/1678855718557profile-outside.webp', 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:05:29', '2023-03-15 10:18:38'),
(66, 'rahul kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$tasIYidhwPzguNQ69Z896Oyv8XjRCp002mWLg6QWddxHzkpRhGrIq', '9313301020', '9313301020', 2, NULL, 'Noida 2', '1', '0', 'India', 'Noida', '110092', NULL, 'scsdvdf', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 13:31:12', '2023-03-16 14:08:42'),
(67, 'Energy Company 1', 'energycompany1@gmail.com', '$2b$10$HWComP291gkWTpnuujdAyeNqZonQSuXAuPkAxbcgr96XYxohEZKdy', '9313301020', '659849885', 2, NULL, 'NOida sector 6', '1', '0', 'india', 'noida', '110092', '', 'test energy company 2 created', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 17:11:51', '2023-03-16 17:56:37'),
(68, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$YfdwWH67IOPTrYINZlLxFOXL5esClhoGiXnw9n.nC10GO5YA6.1G2', '6516516516', '6516516511', 2, NULL, 'h-16gg', '1', '0', 'asfd', 'asdf', 'asdf', '', 'asdfasdfsdfa', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 17:52:20', '2023-04-01 14:14:00'),
(69, 'altafadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$zPGqXzV8t77XH3J.dir92.YqCczpS7hTpNniyVMGk3CeurZMtECz2', '7651402477', '7651402445', 2, NULL, 'h-16', '2', '0', 'india', 'noida', '110025', '', 'done. ', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 17:57:23', NULL),
(70, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$HY8HHlNfEV/V3JIk4SYHqOV2sKSDnj1tmIKQXTvvWXmaU1F7NJ.am', '6516516516', '6516516511', 2, NULL, 'h-16', '2', '0', 'india', 'noida', '110025', NULL, 'done .', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:00:17', NULL),
(71, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$3vTrVdOTOy7p9UP6BTxgIOfvpDslckWeqXO9SJTgENsnFlQbKUrOe', '6516516516', '6516516511', 2, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', 'done', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:00:39', NULL),
(72, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$8m71HfgsaR24P4N0lscBRuUc9KtU9Hcmf4m2UigLPQQnXaZhOJGHy', '6516516516', '6516516511', 2, NULL, 'h-16', '0', '0', 'indiq', '', '110025', '', 'dobe', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:02:23', NULL),
(73, 'Rahul Updated EC OWNER', 'rahulkumar@sartiaglobal.com', '$2b$10$3RfJdB4SiHVHN3ifCcK0W.xrdHVMN.eRBKSwkGNDoU3oDAUGfuhsS', '9313301020', '9313301020', 2, NULL, 'Noida 2', '0', '0', 'India', '', '110092', '', 'asxsc', '', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:07:34', NULL),
(74, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$GnaEE2n9QuyAe40hm0/FS.T/Lvoo5vwmEnSbrAKjsTmDrl/0wJzhu', '6516516516', '6516516511', 2, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', 'done', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:27:03', NULL),
(75, '123admin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$Xsg1Zw2banJq/2ZTL8fTwO15dIcb/jl8l4RSu4o/8Z4jlrbDwsYZe', '6516516516', '', 2, NULL, 'h-16', '2', '0', 'india', 'noida', '110025', '', 'done 123', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:28:15', NULL),
(76, 'superadmin1@gmail.com', 'websiteseotool@gmail.com', '$2b$10$e/R5ZwgcDAwGr1EFfO25a.E/QnKjgA0LZEvanu.As7zxjkeqMHHji', '1521515155', '1465165165', 2, NULL, 'h-16/544', '0', '0', 'india', 'GHAZIABAD', '110025', '', 'done...', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:29:08', NULL),
(77, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$DaqhZaxa0.6tdcXO/qTaFOxVRo3/Lp78/4JnVHI.0PnqZOZ2AlXRu', '6516516516', '6516516511', 2, NULL, 'NOida sector 6', '0', '0', 'india', 'noida', '110080', '', 'h', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:30:14', NULL),
(78, 'superadmin1@gmail.com', 'rohit@gmail.com', '$2b$10$vqEeLJztuenR0puUWvT83O4e68d9.C5uSXyP.pXha3lL9HbLmHFSW', '6516516516', '6516516511', 2, NULL, 'h-16/888', '0', '0', 'india', 'noida', '110025', '', 'it is done..', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:32:12', NULL),
(79, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$9AuNSMhwpLLP5fLtlx4.v.8iKg5hXPfAghqLysqrPVkQTDWUr5FMm', '9313301020', '6516516511', 2, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', 'hhh', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:33:09', NULL),
(80, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$yHCklSiWRMbyveKyno3Xq.1jfeX10hzmGYeG5GAIQDwZnTq2d0kRi', '6516516516', '6516516511', 2, NULL, 'h-16', '1', '0', 'india', 'noida', '110025', '', 'd', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:34:12', NULL),
(81, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$m4drzuzZ4hm.msGgmLvtieIxQ51dNQCyTjdkOLOeBplUoSpHBU.Ee', '6516516516', '6516516511', 2, NULL, 'h-16', '1', '0', 'india', 'noida', '110025', '', 'd', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:36:44', NULL),
(82, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$afKx5/gYnmceSuZ82zi4veoe6gftRSd4TlGEuVv0amOi6zXgJUqqu', '6516516516', '6516516511', 2, NULL, 'h-16', '1', '0', 'india', 'noida', '110025', '', 'done', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-16 18:39:24', '2023-03-17 10:20:30'),
(83, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$wnrDBBPlMcooo8iu0HoOseCRrbiY90rp9vVXyC4MOhliNLhLgVyYK', '6516516516', '6516516511', 2, NULL, 'h-16', '0', '0', 'india', 'noida', '110025', '', 'd', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-17 10:02:55', NULL),
(84, 'altaf pvt', 'altafahmad@sartiaglobal.com', '$2b$10$1eV7pFEBTXZdOis8TwGSpeYMQ3pNgwu2zPk2gIZSS3yztb15MJlHO', '6516516516', '6516516511', 2, NULL, 'h-16', '1', '0', 'india', 'noida', '', '', 'done', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-17 10:05:56', NULL),
(85, 'superadmin1@gmail.com', 'altafahmad@sartiaglobal.com', '$2b$10$VyABH/DK0XyRwxWSASpkmu2YIk.JdF08l0qgQa18L1xFfaze7kozq', '6516516516', '6515165151', 2, NULL, 'h-16gg', '2', '0', 'india', 'Noida', '110025', '', 'dasas', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-03-17 10:21:12', '2023-04-01 14:09:38'),
(86, 'Contractor 2', 'contractor2@gmail.com', '$2b$10$ZwrNgZsF/p9lNtB/kGGNcePDXc0RG3wpvq54fdmrl9xK/YL03Xpja', '9313301020', '9313301020', 3, NULL, 'Noida sector 6', '1', '0', 'India', '230125', 'Noida', '/user_images/1679463076322image.png', 'Contractor 2 account create check by super admin', NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-22 11:01:16', NULL),
(88, 'New ALtaf', 'altaf345@gmail.com', '$2b$10$fYb4IfOOpH2N9qbyAT89uuaYGvVy6WZQPthSAyA1G3uJsjoNh9Moe', '9867545353', '9866456454', 2, NULL, 'dsdccv', '1', '0', 'dcsd', 'sdsd', '110092', '', 'sdfsdf', 'dcds', NULL, NULL, NULL, NULL, NULL, 1, '2023-04-12 10:53:43', NULL),
(94, 'rahulec1', 'rahulec1@sartiaglobal.com', '$2b$10$WTUw0eIndOH54OeF36M6C.TuRT3WO7BKQCWxpbb1U8hiLcs.g0WG2', '9654452454', '9854525544', 2, NULL, 'Noida sector-6', '1', '0', 'india', 'noida', '230301', '', 'scdsfd', 'fvedru7', NULL, NULL, NULL, NULL, NULL, 1, '2023-04-13 13:53:57', '2023-04-13 15:02:52'),
(95, 'rahulec1 updated', 'rahulec1@sartiaglobal.com', '$2b$10$J3LT2.9il3QdkBurWOX.WepV/lkXcl/q77NafdvFNFhP3YzM074.a', '9654452454', '9854525544', 2, NULL, 'fdgh6768', '0', '0', 'india', 'noida', '230301', '', 'sadasdadad dcvws', 'fvedru7', NULL, NULL, NULL, NULL, NULL, 1, '2023-04-13 15:03:26', '2023-04-13 16:11:04'),
(96, 'Dealer 12', 'dealer12@gmail.com', '$2b$10$H1UwjK1rBKlId1VOsbAcmuhPgzEXf7rrjPNWk3genVY2JxYs.Yk0G', '9654452454', '9854525544', 4, NULL, 'fdgh6768dvsd', '1', '0', 'india', 'noida', '230301', '/user_images/1681378864131logo.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-04-13 15:11:04', '2023-04-13 15:16:08'),
(97, 'Contractor 12', 'contractor12@gmail.com', '$2b$10$qtyCM4EfRcnFrFaKHU.GUu8LuWPJH15iRVcZmUl7nC0eI9.YnLbjm', '9654452454', '9854525544', 3, NULL, 'fdgh6768', '1', '0', 'india', '230301', 'noida', '/user_images/16813795430111635238757976.jpg', 'undefined', 'undefined', 'undefined', NULL, NULL, NULL, NULL, 1, '2023-04-13 15:22:23', NULL),
(98, 'pk', 'pk@gmail.com', '$2b$10$w7fWgIODEQCyVztj2ycbGOZwYmlcYv7sAwnV.rqC05FFKi97vIpyu', '9170399004', '7348234762', 4, NULL, 'secter2', '1', '1', 'india', ' noida', '0000432', '/user_images/1681903697091download.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-04-19 16:26:00', '2023-04-19 16:58:17'),
(99, 'rahul ec 12', 'rahulec12@gmail.com', '$2b$10$Q6rEqsz/8mdVQcqtYXHZPOEG8PCcLHI1rcVm.IICs2GuNC8APYBNW', '6223252365', '6223252365', 2, NULL, 'Noida 2', '1', '0', 'India', 'Noida', '230103', '', 'This is test generated ec', 'DGD8675DFJ', NULL, NULL, NULL, NULL, NULL, 1, '2023-05-11 10:19:45', NULL),
(100, 'rAHUL dEALER 12', 'RAHULDEALER12@GMAIL.COM', '$2b$10$t9M7z9EdItpo8RSCEyORWuxmcyofLFnCKDRqDUqObmxAX/VE94ICm', '6532123652', '6532123652', 4, NULL, 'NOida sector 6', '1', '0', 'India', 'Noida', '230103', '/user_images/16837811982891635238757976.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2023-05-11 10:29:58', '2023-05-11 10:30:20'),
(101, 'rAHUL CONTRACTOR 12', 'RAHULCONTRACTOR12@GMAIL.COM', '$2b$10$ABgB4txF2Gsiop.MienI7O2Z8jXwwrffv2u6yuXOML4d2PuroWnGy', '6532123652', '9821602012', 3, NULL, 'Noida 2', '0', '1', 'India', '110092', 'Noida', '/user_images/16837813372421635238757976.jpg', 'undefined', 'undefined', 'undefined', NULL, NULL, NULL, NULL, 1, '2023-05-11 10:32:17', NULL),
(102, 'Rahul contractor 12', 'RAHULCONTRACTOR12@GMAIL.COM', '$2b$10$4Drih5XL0xBKd/NzluVCdOTZNzgFXDpCHR/YAM2D.WsvQegTov5yG', '6532123652', '6532123652', 3, NULL, 'Noida 2', '1', '0', 'India', '230103', 'Noida', '/user_images/16837815575341635238757976.jpg', 'undefined', 'undefined', 'undefined', NULL, NULL, NULL, NULL, 1, '2023-05-11 10:35:57', '2023-05-11 10:36:09');

-- --------------------------------------------------------

--
-- Table structure for table `allowances`
--

CREATE TABLE `allowances` (
  `id` int(11) NOT NULL,
  `name` varchar(244) NOT NULL,
  `applied_type` enum('1','2') NOT NULL COMMENT '1 = employee wise, 2 = designation wise',
  `applied_on` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`applied_on`)),
  `value_type` enum('1','2') NOT NULL COMMENT '1 = fixed amount, 2 = percentage of basic salary',
  `value` double NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `allowances`
--

INSERT INTO `allowances` (`id`, `name`, `applied_type`, `applied_on`, `value_type`, `value`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'House Rent Allowance', '1', '[{\"applied_on\":\"2,3\"}]', '1', 6541, 1, '2023-05-08 11:33:47', NULL),
(2, 'Medical Allowance', '1', '[{\"applied_on\":\"34,29\"}]', '2', 555, 1, '2023-05-08 11:33:47', NULL),
(3, 'House Rent Allowance', '1', '[{\"applied_on\":\"3,7,8\"}]', '1', 1200, 1, '2023-05-11 11:11:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `allowances_applied_details`
--

CREATE TABLE `allowances_applied_details` (
  `id` int(11) NOT NULL,
  `allowance_id` int(11) NOT NULL,
  `applied_type` enum('1','2') NOT NULL COMMENT '1 = employee wise, 2 = designation wise',
  `applied_on` longtext NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `break_type` int(11) DEFAULT NULL,
  `leave_type` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `in_time` datetime NOT NULL,
  `out_time` datetime DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `status`, `break_type`, `leave_type`, `user_id`, `in_time`, `out_time`, `note`, `created_at`, `updated_at`) VALUES
(1, 'incomplete', NULL, NULL, 1, '2023-04-15 15:32:00', '2023-04-15 18:33:00', 'testing...', '2023-04-15 18:33:05', NULL),
(2, 'incomplete', NULL, NULL, 10, '2023-04-17 13:06:51', '2023-04-17 13:08:07', 'manually attendace mark', '2023-04-17 10:07:40', '2023-04-17 13:08:07'),
(4, 'incomplete', NULL, NULL, 10, '2023-04-15 10:09:00', '2023-04-15 18:42:00', 'back mark', '2023-04-17 12:53:54', NULL),
(5, 'incomplete', NULL, NULL, 10, '2023-04-14 09:01:00', '2023-04-14 16:02:00', 'manually mark', '2023-04-17 12:58:03', NULL),
(6, 'incomplete', NULL, NULL, 3, '2023-04-14 09:01:00', '2023-04-14 16:02:00', 'manually mark', '2023-04-17 12:58:03', NULL),
(7, 'incomplete', NULL, NULL, 2, '2023-04-14 09:01:00', '2023-04-14 16:02:00', 'manually mark', '2023-04-17 12:58:03', NULL),
(8, 'incomplete', NULL, NULL, 2, '2023-04-15 09:01:00', '2023-04-15 16:02:00', 'manually mark', '2023-04-15 12:58:03', NULL),
(9, 'incomplete', NULL, NULL, 1, '2023-04-26 10:42:17', NULL, NULL, '2023-04-26 10:42:17', NULL),
(10, 'incomplete', NULL, NULL, 1, '2023-05-04 11:56:00', NULL, NULL, '2023-05-04 11:56:00', NULL),
(11, 'incomplete', NULL, NULL, 1, '2023-05-08 09:58:52', '2023-05-08 13:09:04', NULL, '2023-05-08 09:58:52', NULL),
(12, 'Company break', 1, NULL, 1, '2023-05-08 09:58:57', NULL, NULL, '2023-05-08 09:58:57', NULL),
(13, 'incomplete', NULL, NULL, 1, '2023-05-08 10:05:46', '2023-05-08 13:09:33', NULL, '2023-05-08 10:05:46', NULL),
(14, 'incomplete', NULL, NULL, 4, '2023-05-09 09:52:00', '2023-05-09 14:50:00', 'manually mark by Rahul Kumar', '2023-05-09 14:50:27', NULL),
(15, 'incomplete', NULL, NULL, 3, '2023-05-11 09:45:00', '2023-05-11 11:09:00', 'manually mark by Rahul Kumar testing', '2023-05-11 11:09:31', NULL),
(16, 'incomplete', NULL, NULL, 5, '2023-05-11 10:21:00', '2023-05-11 18:22:00', 'testing...', '2023-05-11 18:22:10', NULL),
(17, 'incomplete', NULL, NULL, 7, '2023-05-11 18:22:00', '2023-05-11 06:22:00', 'testing...', '2023-05-11 18:22:58', NULL),
(18, 'incomplete', NULL, NULL, 6, '2023-05-11 06:30:00', '2023-05-11 18:30:00', 'testing...', '2023-05-11 18:30:41', NULL),
(19, 'incomplete', NULL, NULL, 9, '2023-05-11 06:38:00', '2023-05-11 06:38:00', 'testing...', '2023-05-11 18:39:00', NULL),
(20, 'incomplete', NULL, NULL, 1, '2023-05-12 15:34:13', '2023-05-12 17:10:23', NULL, '2023-05-12 10:16:10', '2023-05-12 15:34:13'),
(21, 'incomplete', NULL, NULL, 5, '2023-05-12 02:05:00', '2023-05-12 14:05:00', 'testing...', '2023-05-12 14:05:31', NULL),
(22, 'incomplete', NULL, NULL, 7, '2023-05-12 02:06:00', '2023-05-12 14:06:00', 'testing...', '2023-05-12 14:06:59', NULL),
(23, 'incomplete', NULL, NULL, 5, '2023-05-12 02:09:00', '2023-05-12 14:09:00', 'testing...', '2023-05-12 14:09:19', NULL),
(24, 'incomplete', NULL, NULL, 8, '2023-05-12 02:11:00', '2023-05-12 14:11:00', 'testing...', '2023-05-12 14:11:40', NULL),
(25, 'incomplete', NULL, NULL, 10, '2023-05-12 02:12:00', '2023-05-12 14:12:00', 'testing...', '2023-05-12 14:12:32', NULL),
(26, 'incomplete', NULL, NULL, 126, '2023-05-12 15:40:00', '2023-05-12 15:47:35', 'manually mark by Rahul Kumar', '2023-05-12 14:30:44', '2023-05-12 15:47:35'),
(27, 'incomplete', NULL, NULL, 7, '2023-05-09 16:12:00', '2023-05-09 19:28:00', 'testing...', '2023-05-12 15:12:35', NULL),
(28, 'incomplete', NULL, NULL, 5, '2023-05-12 15:29:53', '2023-05-12 15:30:11', 'testing...', '2023-05-12 15:13:48', '2023-05-12 15:30:11'),
(30, 'incomplete', NULL, NULL, 14, '2023-05-12 15:33:05', '2023-05-12 15:43:52', 'manually mark by Rahul Kumar testing', '2023-05-12 15:32:07', '2023-05-12 15:43:52');

-- --------------------------------------------------------

--
-- Table structure for table `breaks`
--

CREATE TABLE `breaks` (
  `id` int(11) NOT NULL,
  `break_name` varchar(255) NOT NULL,
  `break_number` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `breaks`
--

INSERT INTO `breaks` (`id`, `break_name`, `break_number`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Company break', 1, 1, 1, '2023-03-06 10:36:59', NULL),
(2, 'Lunch break', 2, 1, 1, '2023-03-14 17:48:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `company_id` int(11) NOT NULL,
  `company_unique_id` varchar(50) NOT NULL,
  `company_type` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_email` varchar(250) DEFAULT NULL,
  `company_contact` varchar(255) NOT NULL,
  `company_mobile` varchar(16) NOT NULL,
  `company_address` text NOT NULL,
  `company_contact_person` varchar(255) NOT NULL,
  `primary_contact_number` varchar(16) NOT NULL,
  `primary_contact_email` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `department` varchar(244) DEFAULT NULL,
  `company_website` varchar(244) DEFAULT NULL,
  `gst_treatment_type` varchar(244) DEFAULT NULL,
  `business_legal_name` varchar(244) NOT NULL,
  `business_trade_name` varchar(244) DEFAULT NULL,
  `pan_number` varchar(40) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `place_of_supply` varchar(244) DEFAULT NULL,
  `billings_address` text DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `is_superadmin_company` int(11) NOT NULL DEFAULT 0,
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`company_id`, `company_unique_id`, `company_type`, `company_name`, `company_email`, `company_contact`, `company_mobile`, `company_address`, `company_contact_person`, `primary_contact_number`, `primary_contact_email`, `designation`, `department`, `company_website`, `gst_treatment_type`, `business_legal_name`, `business_trade_name`, `pan_number`, `gst_number`, `place_of_supply`, `billings_address`, `shipping_address`, `is_superadmin_company`, `is_deleted`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '367313', 3, 'Sartia global 123', 'wing@thewingshiedtechnology.com', '7657842214', '9313301020', 'Noida123', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 0, '0', 1, '2023-03-16 15:14:23', '2023-04-18 13:40:01'),
(2, '446896', 2, 'Thewingshield technology', 'company@thewingshiedtechnology.com', '7548984752', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'http://192.168.1.39:3000/AddPurchaseCompanies/2', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 0, '0', 1, '2023-03-16 15:15:09', '2023-05-11 10:14:51'),
(3, '855175', 3, 'bOTH cOMPANY', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 0, '1', 1, '2023-03-16 15:15:39', NULL),
(4, '647726', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number 1', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-16 15:16:08', '2023-03-18 10:45:28'),
(5, '703455', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 13:22:11', '2023-04-18 16:15:39'),
(6, '404549', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Ankur', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 16:22:17', NULL),
(7, '636509', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 16:35:26', NULL),
(8, '553331', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 16:35:33', NULL),
(9, '212331', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '7854265548', '9313301020', 'Noida', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Registered Business – Composition', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '0', 1, '2023-03-17 16:37:04', '2023-03-20 12:52:23'),
(10, '256961', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '7685412558', '9313301020', 'Noida 123', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'https://formik.org/docs/examples/radio-group', 'Registered Business – Composition', 'IT Farm', 'trade_name', '123abc321', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 0, '0', 1, '2023-03-17 16:37:07', '2023-04-18 15:06:13'),
(11, '120573', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 16:37:08', NULL),
(12, '306058', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 16:37:10', NULL),
(13, '498756', 3, 'super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Ankur yadav', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '1', 1, '2023-03-17 16:37:11', NULL),
(14, '521257', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:19:17', NULL),
(15, '240949', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '7652485415', '9313301020', 'Noida', '7652485415', '9313301020', 'pemail@email.com', 'desig', 'depart', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '0', 1, '2023-03-17 18:20:23', '2023-03-20 12:51:02'),
(16, '327197', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:21:00', NULL),
(17, '929297', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:22:10', NULL),
(18, '221391', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:22:20', NULL),
(19, '203474', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:23:11', NULL),
(20, '421290', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:34:09', NULL),
(21, '268186', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:36:26', NULL),
(22, '955020', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', '', NULL, 1, '1', 1, '2023-03-17 18:37:00', NULL),
(23, '522000', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', NULL, NULL, 1, '1', 1, '2023-03-17 18:39:18', NULL),
(24, '949825', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', 'gst_number 1', 'supply', 'C-14, Noida sector-6', 'shipping', 1, '0', 1, '2023-03-17 18:39:43', '2023-03-18 10:55:31'),
(25, '939773', 3, 'Energy Company pvt. ltd', 'Aarif123@gmail.com', '5454154151', '5455155151', 'H-16/54 RATIYA MARG - DELHI 10050', '6465416516', '7949498484', 'aarifahm@gmail.com', 'web designing', 'it', 'http://localhost:3000/ViewEnergyCompanyDetails/68', '2', 'Sartia global', 'sartia global', 'wdf98fef1e', NULL, 'delhi', NULL, NULL, 1, '0', 1, '2023-03-18 18:35:56', NULL),
(26, '545995', 2, 'Energy Company pvt. ltd ', 'Aarif123@gmail.com', '8999999999', '9000000000', 'H-16/54 RATIYA MARG - DELHI 10050', '6465416516', '7949498484', 'aarifahm@gmail.com', 'web designing', 'it', 'http://localhost:3000/ViewEnergyCompanyDetails/68', '3', 'Sartia global', 'sartia global', 'wdf98fef1e', NULL, 'delhi', NULL, NULL, 1, '0', 1, '2023-03-18 18:38:34', '2023-04-18 16:30:04'),
(27, '261178', 3, 'Rahul Company', 'rahulkumar@sartiaglobal.cin', '9313301020', '9313301020', 'sadfsdf', 'Rahul', '9313301020', 'RAHULKUMAR@SARTIAGLOBAL.CIN', 'Developer', 'IT', 'http://192.168.0.86/gyansager/site/userlogin', '2', 'Sartia globnal', 'dasd', 'dfsd24cdf', NULL, 'Noida', NULL, NULL, 0, '0', 1, '2023-03-20 10:07:24', NULL),
(28, '475146', 3, 'Rahul Company', 'rahulkumar@sartiaglobal.cin', '9313301020', '9313301020', 'sadfsdf', 'Rahul', '9313301020', 'RAHULKUMAR@SARTIAGLOBAL.CIN', 'Developer', 'IT', 'http://192.168.0.86/gyansager/site/userlogin', '2', 'Sartia globnal', 'dasd', 'dfsd24cdf', NULL, 'Noida', NULL, NULL, 0, '0', 1, '2023-03-20 10:08:06', NULL),
(29, '888141', 3, 'Rahul Company', 'rahulkumar@sartiaglobal.cin', '9313301020', '9313301020', 'sadfsdf', 'Rahul', '9313301020', 'RAHULKUMAR@SARTIAGLOBAL.CIN', 'Developer', 'IT', 'http://192.168.0.86/gyansager/site/userlogin', '2', 'Sartia globnal', 'dasd', 'dfsd24cdf', NULL, 'Noida', NULL, NULL, 1, '1', 1, '2023-03-20 10:10:33', NULL),
(30, '191987', 2, 'Energy Company pvt. ltd', 'bothcompany@thewingshiedtechnology.com', '7658412557', '7658412557', 'h-16/523 sangam, delhi', '7658412557', '7949498484', 'pemail@email.com', 'web designing', 'it', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Unregistered Business', 'IT Farm', 'sartia global', 'wdf98fef1e', NULL, 'delhi', NULL, NULL, 1, '1', 1, '2023-03-20 11:39:30', '2023-03-20 12:45:23'),
(31, '634820', 3, 'bth super admin company', 'bothcompany@thewingshiedtechnology.com', '75489847', '9313301020', 'Noida', 'Kaveri', '9313301020', 'pemail@email.com', 'desig', 'depart', 'www.wing@thewingshiedtechnology.com', 'Regular', 'IT Farm', 'trade_name', 'pan', NULL, 'supply', NULL, NULL, 0, '0', 1, '2023-03-20 15:11:36', NULL),
(32, '358677', 2, 'Energy Company pvt. ltd', 'bothcompany@thewingshiedtechnology.com', '7657842214', '7856985411', 'done', '7856985411', '7949498484', 'pemail@email.com', 'web designing', 'depart', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Registered Business – Regular', 'IT Farm', 'sartia global', 'wdf98fef1e', NULL, 'delhi', NULL, NULL, 1, '1', 1, '2023-03-20 16:16:21', '2023-04-01 14:02:19'),
(33, '264887', 2, 'Energy Company pvt. ltd', 'bothcompany@thewingshiedtechnology.com', '7657842214', '7685412365', 'done', '1236547890', '7949498484', 'ahmad123@gmail.com', 'web designing', 'depart', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Registered Business – Composition', 'IT Farm', 'sartia global', 'pan', NULL, 'delhi', NULL, NULL, 0, '1', 1, '2023-03-20 16:20:10', '2023-03-20 16:26:48'),
(34, '270063', 1, 'Energy Company pvt. ltd3', 'bothcompany@thewingshiedtechnology.com', '7685412558', '7685412365', 'done123', '1236547890', '9313301020', 'pemail@email.com', 'web designing', 'depart', 'http://localhost:3000/ViewEnergyCompanyDetails/68', 'Registered Business – Composition', 'Sartia global', 'sartia global', 'wdf98fef1e', NULL, 'delhi', NULL, NULL, 0, '1', 1, '2023-03-20 16:29:23', NULL),
(35, '605277', 1, 'altaf', 'Aarif123@gmail.com', '7685412558', '7685412365', 'HARYANA-125/0 DUMMY ADDRESS - 100524', '1236547890', '7949498484', 'ahmad123@gmail.com', 'web designing', 'it', 'http://localhost:3000/dummy/68', 'Registered Business – Composition', 'Sartia global', 'sartia global', 'wdf98fef1e', NULL, 'delhi', NULL, NULL, 1, '1', 1, '2023-03-23 17:50:09', '2023-04-18 16:30:51'),
(36, '112327', 2, 'altaf', '', '7657842214', '9313301020', 'a', '1236547890', '7949498484', '', '', '', '', 'Registered Business – Composition', 'IT Farm', '', '', NULL, '', NULL, NULL, 1, '1', 1, '2023-04-03 18:06:47', '2023-04-03 18:06:51'),
(37, '685479', 1, 'Energy Company 348888', 'rahulkumar@sartiaglobal.cin', '9313301020', '9313301020', 'Noida sector-6, C14', 'Rahul', '9313301020', 'RAHULKUMAR@SARTIAGLOBAL.CIN', 'Developer', 'IT', 'http://192.168.0.86/gyansager/site/userlogin', 'Registered Business – Regular', 'Sartia globnal', 'dasd', 'dfsd24cdf', NULL, 'Noida', NULL, NULL, 1, '1', 1, '2023-04-12 10:14:32', '2023-04-18 16:29:38'),
(38, '784208', 1, 'Sale-12222', 'Aarif123@gmail.com', '7685412558', '9313301020', 'dfdg,56', 'Rahul', '9313301020', 'aarifahm@gmail.com', 'web designing', '', 'http://192.168.0.86/gyansager/site/userlogin', 'Registered Business – Composition', 'Sartia globnal', '', 'dfsd24cdf', NULL, '', NULL, NULL, 0, '0', 1, '2023-04-19 15:44:13', NULL),
(39, '865554', 3, 'abc lorem ipsum', 'abc@gmail.com', '8265811811', '8265811811', 'ashok nagar ', 'kaif', '8265811811', 'abc@gmail.com', 'it', 'technology', 'htrps://127.0.0.1:8000', 'Registered Business – Regular', 'abc', 'abc', 'pan8265', NULL, 'abc', NULL, NULL, 1, '0', 1, '2023-04-20 11:14:04', '2023-05-12 14:54:56'),
(40, '764823', 1, 'Rahul Company Testing', 'rahulkumar@sartiaglobal.cin', '6201220128', '6201220128', 'Noida Sector-6', 'Rahul', '6201220128', 'RAHULKUMAR@SARTIAGLOBAL.CIN', 'Developer', 'IT', 'http://192.168.0.86/gyansager/site/userlogin', 'Unregistered Business', 'Sartia globnal', 'sartia global', 'dfsd24cdf', NULL, 'Noida', NULL, NULL, 0, '0', 1, '2023-05-11 10:16:33', '2023-05-11 10:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `company_gst_details`
--

CREATE TABLE `company_gst_details` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `gst_number` varchar(255) NOT NULL,
  `shipping_address` text NOT NULL,
  `billing_address` text NOT NULL,
  `is_default` set('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_gst_details`
--

INSERT INTO `company_gst_details` (`id`, `company_id`, `gst_number`, `shipping_address`, `billing_address`, `is_default`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 24, 'RAHUL8765Q', 'noida shipping address', 'Noida billing address', '0', 1, '2023-03-17 00:00:00', '2023-03-20 10:34:32'),
(2, 24, 'KTRF2345EW', 'noida shipping address 2', 'Noida billing address 2', '1', 1, '2023-03-17 00:00:00', '2023-03-20 10:34:32'),
(3, 25, 'abcd123654', 'H-16/54 RATIYA MARG - DELHI 10050', 'H-16/54 RATIYA MARG - DELHI 10050', '0', 1, '2023-03-18 00:00:00', NULL),
(4, 25, '123asa45678', 'H-16/54 bardarpur - DELHI 10050', 'H-16/54 - DELHI 10050', '1', 1, '2023-03-18 00:00:00', NULL),
(7, 27, 'sdsdf5t5g', 'sxdsad', 'ascsa', '0', 1, '2023-03-20 00:00:00', NULL),
(8, 27, 'sdfer5675u', 'sadasd', 'ascxas', '1', 1, '2023-03-20 00:00:00', NULL),
(9, 28, 'sdsdf5t5g', 'sxdsad', 'ascsa', '0', 1, '2023-03-20 00:00:00', NULL),
(10, 28, 'sdfer5675u', 'sadasd', 'ascxas', '1', 1, '2023-03-20 00:00:00', NULL),
(11, 29, 'sdsdf5t5g', 'sxdsad', 'ascsa', '0', 1, '2023-03-20 00:00:00', NULL),
(12, 29, 'sdfer5675u', 'sadasd', 'ascxas', '1', 1, '2023-03-20 00:00:00', NULL),
(15, 30, 'RAHUL875KUmar', 'faridabad', 'FARIDABAD', '1', 1, '2023-03-20 00:00:00', '2023-03-20 12:45:23'),
(16, 15, 'adad1ad', 'h-16', 'h-522', '1', 1, '2023-03-20 00:00:00', NULL),
(17, 9, 'abcd123654', 'badarpur', 'noida', '1', 1, '2023-03-20 00:00:00', '2023-03-20 12:52:23'),
(19, 31, 'GHSG675QW', 'noida shipping address', 'Noida billing address', '0', 1, '2023-03-20 00:00:00', NULL),
(20, 31, 'KTRF2345EW', 'noida shipping address 2', 'Noida billing address 2', '1', 1, '2023-03-20 00:00:00', NULL),
(21, 32, 'adad1ad', 'delhi', 'noida', '1', 1, '2023-03-20 00:00:00', '2023-04-01 14:02:19'),
(22, 33, 'RAHUL8765Q', 'delhi', 'haryana', '1', 1, '2023-03-20 00:00:00', '2023-03-20 16:26:48'),
(23, 34, 'abcd123654', 'delhi', 'haryana', '0', 1, '2023-03-20 00:00:00', NULL),
(24, 34, '123654789', 'ncr', 'noida', '1', 1, '2023-03-20 00:00:00', NULL),
(27, 36, 'sdfsdfsdf', '', 'q', '0', 1, '2023-04-03 00:00:00', '2023-04-03 18:06:51'),
(40, 10, '123fff321', 'noida', 'agra', '0', 1, '2023-04-18 15:06:13', NULL),
(41, 10, 'RAHULGST', 'asdsf', 'asdsf', '0', 1, '2023-04-18 15:06:13', NULL),
(42, 10, 'gst 3', 'assdc', 'assdc', '1', 1, '2023-04-18 15:06:13', NULL),
(48, 5, 'RAHUL8765Q', 'noida shipping address', 'Noida billing address', '0', 1, '2023-04-18 16:15:39', NULL),
(49, 5, 'KTRF2345EW', 'noida shipping address 2', 'Noida billing address 2', '1', 1, '2023-04-18 16:15:39', NULL),
(67, 37, 'RAHUL875KUmar', 'ascasc', 'asdsdac', '0', 1, '2023-04-18 16:29:38', NULL),
(68, 37, 'sdfer5675u', 'azsc', 'ascxsc', '0', 1, '2023-04-18 16:29:38', NULL),
(69, 37, 'assdc', 'sacdsdc', 'sacdsdc', '1', 1, '2023-04-18 16:29:38', NULL),
(70, 26, 'adad1ad', 'H-16/54 RATIYA MARG - DELHI 10050', 'H-16/54 RATIYA MARG - DELHI 10050', '0', 1, '2023-04-18 16:30:04', NULL),
(71, 26, '12345678', 'H-16/54 RATIYA MARG2 - DELHI 10050', 'H-16/54 RATIYA MARG2 - DELHI 10050', '1', 1, '2023-04-18 16:30:04', NULL),
(74, 35, '123abc123', 'HARYANA-125/0 DUMMY ADDRESS - 100524', 'HARYANA-125/0 DUMMY ADDRESS - 100524', '1', 1, '2023-04-18 16:30:51', NULL),
(75, 35, '321bsd', 'noida-125/0 DUMMY ADDRESS - 100524', 'noida-125/0 DUMMY ADDRESS - 100524', '0', 1, '2023-04-18 16:30:51', NULL),
(76, 38, 'RAHUL875KUmar', 'rytyrty', 'rtyrty', '1', 1, '2023-04-19 15:44:13', NULL),
(82, 40, 'sdfsdfsdf', 'noida sector-6', 'noida sector-6', '0', 1, '2023-05-11 10:17:30', NULL),
(83, 40, 'fdgfh687thgh', 'c-14, noida sector-6', 'c-14, noida sector-6', '1', 1, '2023-05-11 10:17:30', NULL),
(84, 40, 'dcvszdvc', 'laxmi nagar', 'laxmi nagar', '0', 1, '2023-05-11 10:17:30', NULL),
(85, 39, '852', 'ashok nagar', 'ashok nagar', '1', 1, '2023-05-12 14:54:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_types`
--

CREATE TABLE `company_types` (
  `company_type_id` int(11) NOT NULL,
  `company_type_name` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_types`
--

INSERT INTO `company_types` (`company_type_id`, `company_type_name`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Sale Company', 1, '2023-03-16 12:33:24', NULL),
(2, 'Purchase Company', 1, '2023-03-16 12:33:24', NULL),
(3, 'Both', 1, '2023-03-16 12:33:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `zone_id` longtext DEFAULT NULL,
  `ro_id` longtext DEFAULT NULL,
  `sale_area_id` longtext DEFAULT NULL,
  `district_id` longtext DEFAULT NULL,
  `outlet_id` longtext DEFAULT NULL,
  `complaint_type` int(11) NOT NULL,
  `description` longtext NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '1= pending, 2= viewed, 3= approved, 4 = rejected',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `energy_company_id`, `zone_id`, `ro_id`, `sale_area_id`, `district_id`, `outlet_id`, `complaint_type`, `description`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, '[1,3,4]', '[16,15,5]', '[5,4]', '[4,5]', '[3,4,5,6]', 1, '', 2, 1, '2023-03-22 12:28:24', NULL),
(4, 1, '[1,3,5]', '[3,4,5]', '[5,4]', '[4,5]', '[3,4,5,6]', 1, '', 3, 1, '2023-03-23 17:17:40', NULL),
(5, 1, '[1,3,5]', '[3,4,5]', '[5,4]', '[4,5]', '[3,4,5,6]', 1, '', 4, 1, '2023-03-23 17:18:34', NULL),
(6, 13, '[11]', '[18]', '[14]', '[12]', '[8]', 2, 'vcnbbvnbvnmnm', 4, 1, '2023-03-23 17:19:03', '2023-04-18 10:25:29'),
(7, 13, '[11]', '[18]', '[14]', '[13]', '[9]', 1, 'dqwdqew', 4, 1, '2023-04-17 16:03:18', NULL),
(8, 13, '[11]', '[18]', '[14]', '[12]', '[8]', 3, 'sadasdffdf', 3, 1, '2023-04-17 16:23:40', NULL),
(9, 13, '[11]', '[18]', '[14]', '[13]', '[10]', 4, 'sdfsdfsg', 2, 1, '2023-04-17 16:27:50', NULL),
(10, 13, '[11]', '[18]', '[14]', '[13]', '[9]', 4, 'fghfgjhhfj', 4, 1, '2023-04-18 10:35:03', '2023-04-18 11:17:33'),
(12, 13, '[11]', '[18]', '[14]', '[13]', '[10]', 2, 'retryrty', 1, 1, '2023-04-18 12:52:47', '2023-04-18 18:19:24'),
(13, 13, '[11]', '[18]', '[14]', '[13]', '[9]', 10, 'sdfsdfsdfdf', 1, 1, '2023-04-18 18:22:19', '2023-04-18 18:25:30'),
(14, 13, '[11]', '[18]', '[14]', '[12]', '[8]', 2, 'sadasadf', 4, 1, '2023-04-18 18:22:43', NULL),
(15, 13, '[11]', '[18]', '[14]', '[13]', '[9]', 2, 'wddadf', 3, 1, '2023-04-18 18:23:25', '2023-04-18 18:23:52'),
(16, 13, '[13]', '[23]', '[15]', '[14]', '[11]', 15, 'This is test generated complaint', 3, 1, '2023-05-11 10:37:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `complaint_types`
--

CREATE TABLE `complaint_types` (
  `id` int(11) NOT NULL,
  `complaint_type_name` text NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaint_types`
--

INSERT INTO `complaint_types` (`id`, `complaint_type_name`, `energy_company_id`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Pipe line work', 2, '1', 0, '2023-04-12 12:46:48', '2023-03-23 18:12:23'),
(2, 'pipe line 230', 8, '1', 0, '1900-01-12 12:46:57', '2023-04-12 12:51:08'),
(3, 'testh', 7, '', 0, '0000-00-00 00:00:00', '2023-04-18 16:56:38'),
(4, 'efg5dvr', 9, '', 0, '0000-00-00 00:00:00', '2023-04-18 16:59:01'),
(5, 'csdc', 7, '', 1, '2023-04-12 12:56:53', '2023-04-18 16:56:19'),
(6, 'fdgfghfghfj', 3, '1', 1, '2023-04-18 16:48:56', NULL),
(7, 'ggjghjhgj', 4, '1', 1, '2023-04-18 16:49:26', NULL),
(8, 'sdasadf', 10, '', 1, '2023-04-18 16:49:55', '2023-04-18 16:59:25'),
(9, 'sadasdsd', 1, '', 1, '2023-04-18 16:50:14', '2023-04-18 17:03:32'),
(10, 'gjndghjhj', 8, '', 1, '2023-04-18 16:54:04', '2023-04-18 17:03:22'),
(11, 'kknkjnmkm', 26, '1', 1, '2023-04-18 17:00:18', NULL),
(12, 'hgjghj', 1, '', 1, '2023-04-18 17:03:41', '2023-04-18 17:03:49'),
(13, 'eytryyt', 10, '', 1, '2023-04-18 17:05:56', '2023-05-08 15:00:49'),
(14, 'ddddyyyyyyy', 0, '', 1, '2023-04-18 17:08:21', '2023-04-18 17:12:00'),
(15, 'Rahul complaint testing 12', 13, '', 1, '2023-05-11 10:36:48', '2023-05-11 10:36:52');

-- --------------------------------------------------------

--
-- Table structure for table `deductions`
--

CREATE TABLE `deductions` (
  `id` int(11) NOT NULL,
  `type` enum('1','2') NOT NULL COMMENT '1 = individual, 2 = other',
  `name` varchar(255) NOT NULL,
  `applied_type` enum('1','2') NOT NULL COMMENT '1 = employee wise, 2 = designation wise',
  `applied_on` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`applied_on`)),
  `value_type` enum('1','2') NOT NULL COMMENT '1 = fixed amount, 2 = percentage of basic salary',
  `value` double NOT NULL,
  `by_employee` double NOT NULL,
  `by_employer` double NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deductions`
--

INSERT INTO `deductions` (`id`, `type`, `name`, `applied_type`, `applied_on`, `value_type`, `value`, `by_employee`, `by_employer`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '1', 'Rahul other deductions', '1', '[{\"applied_on\":\"4,5\"}]', '2', 2, 2, 3, 1, '2023-05-08 13:34:08', NULL),
(2, '1', 'Provident Fund', '1', '[{\"applied_on\":\"3,8,11,7\"}]', '1', 300, 300, 500, 1, '2023-05-08 13:34:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `sales_area_id` int(11) NOT NULL,
  `district_name` varchar(255) NOT NULL,
  `status` int(3) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `energy_company_id`, `zone_id`, `regional_office_id`, `sales_area_id`, `district_name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 2, 4, 1, 1, 'SZRO1SA1 District name 1', 1, 1, '2023-03-06 11:04:49', '2023-03-06 11:05:01'),
(2, 8, 3, 4, 4, 'NZRO2SA2 DISTRICT NAME 2', 1, 1, '2023-03-06 11:05:29', NULL),
(3, 2, 2, 5, 5, 'WZRO1SA1 DISTRICT NAME 3', 1, 1, '2023-03-06 11:05:48', NULL),
(4, 10, 3, 3, 3, 'district', 1, 1, '2023-03-21 16:47:40', '2023-03-21 17:01:22'),
(8, 10, 3, 5, 9, 'district 2', 1, 1, '2023-03-22 11:17:56', '2023-03-22 11:18:20'),
(9, 3, 6, 15, 10, 'district 4', 1, 1, '2023-03-22 11:18:15', '2023-03-22 11:18:25'),
(10, 10, 3, 5, 12, 'district 5', 1, 1, '2023-03-22 11:18:43', '2023-03-22 11:20:48'),
(12, 13, 11, 18, 14, 'rahul ec 12 district 1', 1, 1, '2023-04-13 15:07:02', '2023-04-13 15:07:06'),
(13, 13, 11, 18, 14, 'district-111', 1, 1, '2023-04-17 14:08:02', NULL),
(14, 13, 13, 23, 15, 'rAHUL dISTRICT 12', 1, 1, '2023-05-11 10:23:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `document_category_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`image`)),
  `remark` longtext NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `document_category_id`, `user_type`, `user_id`, `image`, `remark`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 5, '\"[109]\"', '[{\"storePath\":\"/documents/16814519048461635238757976.jpg\"},{\"storePath\":\"/documents/1681451904846logo.png\"}]', 'testing updated', 1, '2023-04-14 11:27:49', '2023-04-25 13:24:37'),
(3, 8, 11, '\"[11]\"', '[]', 'hyhyhybhbjhv', 1, '2023-04-14 13:10:44', NULL),
(4, 3, 3, '\"[114,118]\"', '[{\"storePath\":\"/documents/1681458068706bg-2.png\"},{\"storePath\":\"/documents/1681458068707bg-pattern.png\"}]', 'gbkjbjkbjn', 1, '2023-04-14 13:11:08', NULL),
(5, 4, 4, '\"[115,121]\"', '[]', 'sdfasdf sdfsdg', 1, '2023-04-14 13:11:38', NULL),
(6, 2, 5, '\"[109,125,110]\"', '[{\"storePath\":\"/documents/1683875695275download (2).jpg\"},{\"storePath\":\"/documents/1683875695275download (1).jpg\"},{\"storePath\":\"/documents/1683875695275download (1).png\"}]', 'testing..', 1, '2023-04-14 13:12:22', '2023-05-12 13:19:13'),
(7, 7, 4, '\"[115]\"', '[{\"storePath\":\"/documents/1683875657055download (2).jpg\"},{\"storePath\":\"/documents/1683875657056download (1).jpg\"},{\"storePath\":\"/documents/1683875657057download (1).png\"}]', 'kj jgfty uhih', 1, '2023-04-14 13:12:55', '2023-05-12 12:44:17'),
(8, 8, 5, '\"[108,110,117,125]\"', '[{\"storePath\":\"/documents/1683875530970download (2).jpg\"},{\"storePath\":\"/documents/1683875530973download (1).jpg\"}]', 'ohoin komom', 1, '2023-04-14 13:14:08', '2023-05-12 13:01:44'),
(9, 9, 4, '\"[115,121]\"', '[]', 'jkbhukb jnion', 1, '2023-04-14 13:14:30', '2023-05-09 13:50:18'),
(11, 11, 7, '\"[9]\"', '[{\"storePath\":\"/documents/16838751443714k-1.jfif\"},{\"storePath\":\"/documents/16838751443724k-2.jfif\"}]', 'This is test generated documnet', 1, '2023-05-11 11:53:38', '2023-05-12 12:35:44');

-- --------------------------------------------------------

--
-- Table structure for table `document_categories`
--

CREATE TABLE `document_categories` (
  `id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document_categories`
--

INSERT INTO `document_categories` (`id`, `category`, `title`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'office document', 'Adhar Card', 'This category belongs to adhar card', 1, '2023-02-25 17:52:18', '2023-05-09 14:45:39'),
(2, 'Identification', 'PAN Card', 'This category belongs to adhar card', 1, '2023-02-25 17:52:30', NULL),
(3, 'Identification 1', 'Voter Id Card', 'This category belongs to adhar card', 1, '2023-02-25 17:52:38', '2023-02-27 11:10:17'),
(4, 'Identification', 'Voter Id Cardwqeder', 'This category belongs to adhar card', 1, '2023-04-01 17:19:58', '2023-04-04 10:45:06'),
(8, 'Legal Documents', 'Voter Id Card', 'This category belongs to adhar card', 1, '2023-04-13 16:49:22', '2023-05-09 14:42:35');

-- --------------------------------------------------------

--
-- Table structure for table `employee_promotion_demotions`
--

CREATE TABLE `employee_promotion_demotions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `purpose` enum('promotion','demotion') NOT NULL DEFAULT 'promotion',
  `reason` text NOT NULL,
  `new_designation` int(11) NOT NULL,
  `new_team` int(11) NOT NULL,
  `change_in_salary` enum('hike','deduction') NOT NULL DEFAULT 'hike',
  `change_in_salary_type` enum('amount','percentage') NOT NULL DEFAULT 'amount',
  `change_in_salary_value` varchar(50) NOT NULL,
  `document` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_promotion_demotions`
--

INSERT INTO `employee_promotion_demotions` (`id`, `user_id`, `purpose`, `reason`, `new_designation`, `new_team`, `change_in_salary`, `change_in_salary_type`, `change_in_salary_value`, `document`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 6, 'promotion', 'Good Work manage', 4, 23, 'hike', 'amount', '5000', '/user_images/1681975626799bg-2.png', 1, '2023-03-18 17:31:18', '2023-04-20 12:57:06'),
(2, 3, 'promotion', 'TESTING....2', 7, 23, 'hike', 'amount', '4800', '/user_images/1681975666446bg-2.png', 1, '2023-03-18 18:09:37', '2023-04-20 13:46:39'),
(3, 2, 'promotion', 'Good Work manage', 4, 2, 'hike', 'amount', '18000', '/user_images/1681974045930bubble.jpg', 1, '2023-04-19 18:25:30', '2023-04-20 12:30:45'),
(4, 8, 'promotion', 'testing... ', 4, 24, 'hike', 'percentage', '500', '/user_images/16819735703444k-2.jfif', 1, '2023-04-20 11:46:28', '2023-04-20 12:59:33'),
(5, 6, 'promotion', 'good working....', 11, 24, 'hike', 'percentage', '15', '/user_images/1683624702193Rashmi_yadav_1683371364.pdf', 1, '2023-05-09 15:01:42', '2023-05-09 15:02:28');

-- --------------------------------------------------------

--
-- Table structure for table `employee_resignations`
--

CREATE TABLE `employee_resignations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `resignation_date` date NOT NULL,
  `reason` text NOT NULL,
  `last_working_day` date DEFAULT NULL,
  `notice_period_day` int(11) DEFAULT NULL,
  `resignation_status` enum('0','1','2','3') NOT NULL DEFAULT '0' COMMENT '0 = pending request, 1 = viewed request, 2 = approved request, 3 = reject request',
  `assign_asset` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`assign_asset`)),
  `term` text DEFAULT NULL,
  `fnf` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 = not generated, 1 = generated',
  `viewed_by` int(11) DEFAULT NULL,
  `viewed_at` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `approved_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_resignations`
--

INSERT INTO `employee_resignations` (`id`, `user_id`, `resignation_date`, `reason`, `last_working_day`, `notice_period_day`, `resignation_status`, `assign_asset`, `term`, `fnf`, `viewed_by`, `viewed_at`, `approved_by`, `created_by`, `updated_by`, `created_at`, `approved_at`, `updated_at`) VALUES
(1, 1, '2023-03-20', 'this is for resignation registeration by Rahul', '2023-04-29', NULL, '0', NULL, NULL, '0', NULL, '2023-04-20 17:48:07', NULL, 1, NULL, '2023-03-20 13:47:37', NULL, '2023-04-20 18:09:36'),
(2, 2, '2023-03-20', 'this is for resignation registeration by Rahul', '2023-04-30', NULL, '1', NULL, NULL, '0', 1, '2023-03-20 16:10:54', NULL, 1, NULL, '2023-03-20 13:47:37', NULL, '2023-04-15 16:13:30'),
(3, 10, '2023-03-20', 'this is for resignation registeration by Rahul', '2023-04-26', NULL, '2', NULL, NULL, '0', 1, '2023-03-20 16:10:54', NULL, 1, NULL, '2023-03-20 13:47:37', NULL, '2023-04-15 16:13:30'),
(4, 13, '2023-03-20', 'this is for resignation registeration by Rahul', '2024-01-31', NULL, '3', NULL, NULL, '0', 1, '2023-03-20 16:10:54', NULL, 1, NULL, '2023-03-20 13:47:37', NULL, '2023-04-15 16:13:30');

-- --------------------------------------------------------

--
-- Table structure for table `employee_retirements`
--

CREATE TABLE `employee_retirements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `retirement_date` date NOT NULL,
  `asset_recovery` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `pension_status` enum('0','1') DEFAULT '0',
  `pension_amount` bigint(11) DEFAULT NULL,
  `pension_duration` varchar(255) DEFAULT NULL,
  `allow_commutation` enum('0','1') NOT NULL DEFAULT '0',
  `commute_percentage` varchar(20) DEFAULT NULL,
  `retirement_gratuity` varchar(256) DEFAULT NULL,
  `service_gratuity` varchar(256) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_retirements`
--

INSERT INTO `employee_retirements` (`id`, `user_id`, `retirement_date`, `asset_recovery`, `pension_status`, `pension_amount`, `pension_duration`, `allow_commutation`, `commute_percentage`, `retirement_gratuity`, `service_gratuity`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, '2023-03-20', '1405', '1', 10000, '20 year', '0', '0', '0', '0', 1, '2023-03-20 17:58:13', '2023-04-25 13:11:02'),
(5, 5, '2023-03-20', '140', '0', 20000, '10 year', '', '0', '0', '0', 1, '2023-04-24 10:30:26', '2023-04-25 11:30:41'),
(6, 5, '2023-03-20', '452', '1', 20000, '10 year', '0', '0', '0', '0', 1, '2023-04-25 11:31:58', '2023-04-25 12:36:43'),
(8, 7, '2023-04-27', '2527', '0', 10000, '14 year', '0', '10%', '25', '24', 1, '2023-04-25 12:42:31', '2023-04-25 12:44:47'),
(10, 7, '2023-04-13', '2527', '0', 10000, '20 year', '0', '10%', '25', '24', 1, '2023-04-25 13:03:54', '2023-04-25 13:10:34');

-- --------------------------------------------------------

--
-- Table structure for table `energy_companies`
--

CREATE TABLE `energy_companies` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `energy_companies`
--

INSERT INTO `energy_companies` (`id`, `admin_id`, `name`, `website`, `status`, `created_at`, `updated_at`) VALUES
(1, 68, 'Energy Company First', 'www.company1.com', 1, '2023-02-15 14:06:07', '2023-03-16 17:52:20'),
(2, 16, 'Energy Company 2', 'www.company1.com', 1, '2023-02-15 14:07:03', '2023-02-17 18:20:57'),
(3, 12, 'Energy Company 3', 'www.company2.com', 1, '2023-02-16 11:31:14', NULL),
(8, 84, 'Rahul Company', 'www.rahul.com', 1, '2023-03-16 13:31:12', '2023-03-17 10:05:56'),
(9, 82, 'Energy Company pvt. ltd', 'www.company1.com', 1, '2023-03-16 18:00:17', '2023-03-16 18:39:24'),
(10, 88, 'altaf pvt ltd', 'www.company1.com', 1, '2023-03-17 10:21:12', '2023-04-12 10:53:43'),
(13, 99, 'rahul ec 12', 'http://192.168.1.17:3000/AddEnergyCompany', 1, '2023-04-13 13:53:57', '2023-05-11 10:19:45');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_and_suggestions`
--

CREATE TABLE `feedback_and_suggestions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `complaint_id` int(11) NOT NULL,
  `suggestion_text` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_and_suggestions`
--

INSERT INTO `feedback_and_suggestions` (`id`, `user_id`, `complaint_id`, `suggestion_text`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 'there is something to tell you, that you are working on test mode', 1, 14, '2023-02-14 16:02:05', '2023-05-12 15:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `fnf_statements`
--

CREATE TABLE `fnf_statements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `remarks` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fnf_statements`
--

INSERT INTO `fnf_statements` (`id`, `user_id`, `remarks`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 10, 'All assets collected', 1, '2023-04-25 16:25:40', NULL),
(2, 10, 'All assets collected testing', 1, '2023-04-25 16:53:09', NULL),
(3, 4, 'All testing', 1, '2023-04-25 16:55:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `group_insurances`
--

CREATE TABLE `group_insurances` (
  `id` int(11) NOT NULL,
  `insurance_company_id` int(11) NOT NULL,
  `insurance_plan_id` int(11) NOT NULL,
  `insurance_deduction_amount` varchar(255) NOT NULL,
  `insurance_for` enum('1','2') NOT NULL COMMENT '1=for employee wise, 2= for designation wise',
  `insurance_applied_on` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group_insurances`
--

INSERT INTO `group_insurances` (`id`, `insurance_company_id`, `insurance_plan_id`, `insurance_deduction_amount`, `insurance_for`, `insurance_applied_on`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 1, 3, '4078', '1', '[{\"insurance_applied_on\":\"7,2\"}]', 1, '2023-03-18 12:44:30', '2023-04-19 11:35:18'),
(3, 5, 4, '4000', '2', '[{\"insurance_applied_on\":\"1,3,5,2,8\"}]', 1, '2023-04-15 10:37:17', NULL),
(5, 6, 4, '50000', '1', '[{\"insurance_applied_on\":\"1,3,5,2,8\"}]', 1, '2023-04-18 18:17:45', NULL),
(9, 5, 4, '40000', '2', '[{\"insurance_applied_on\":\"3,5\"}]', 1, '2023-04-19 10:55:22', '2023-04-19 16:22:51'),
(10, 5, 8, '1000', '2', '[{\"insurance_applied_on\":\"2,5\"}]', 1, '2023-04-19 11:48:10', NULL),
(11, 5, 4, '2000', '2', '[{\"insurance_applied_on\":\"1,3,8, 10\"}]', 1, '2023-04-19 11:49:47', NULL),
(12, 1, 3, '5000', '2', '[{\"insurance_applied_on\":\"2,7\"}]', 1, '2023-04-19 16:03:15', '2023-04-19 16:03:38'),
(14, 9, 12, '1200', '1', '[{\"insurance_applied_on\":\"3,4,5,8,7,9\"}]', 1, '2023-05-11 11:12:34', '2023-05-12 10:18:57');

-- --------------------------------------------------------

--
-- Table structure for table `hr_teams`
--

CREATE TABLE `hr_teams` (
  `id` int(11) NOT NULL,
  `manager_id` int(11) NOT NULL,
  `team_name` varchar(255) NOT NULL,
  `team_short_description` text DEFAULT NULL,
  `team_member` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_teams`
--

INSERT INTO `hr_teams` (`id`, `manager_id`, `team_name`, `team_short_description`, `team_member`, `created_by`, `created_at`, `updated_at`) VALUES
(20, 11, '122222', 'test', '{\"team_member\":\"101,117\"}', 1, '2023-04-04 10:54:52', '2023-04-04 11:12:03'),
(21, 11, 'ssssoooo2222', 'o0o-o0-', '{\"team_member\":\"105,117,118\"}', 1, '2023-04-04 11:06:28', '2023-04-04 11:11:58'),
(22, 11, 'erwer', 'ewtertrtrt', '{\"team_member\":\"118,117,105,121,103\"}', 1, '2023-04-04 11:12:28', NULL),
(23, 11, 'rete', '345345retret', '{\"team_member\":\"121,103,105\"}', 1, '2023-04-04 11:12:41', NULL),
(24, 11, 'Testing', 'testing mode', '{\"team_member\":\"123,122\"}', 1, '2023-04-12 15:36:06', '2023-05-12 10:39:02'),
(27, 11, 'Rahul testing team 12', 'Write something awesome about my team', '{\"team_member\":\"123,118,122,105,103,102,121,101,125,117\"}', 1, '2023-05-11 10:49:15', NULL),
(28, 11, 'Rahul testing team 12', 'Write something awesome about my team', '{\"team_member\":\"101,102,103,105,117,118,121,122,123,125,126\"}', 1, '2023-05-12 10:44:05', NULL),
(29, 11, 'Rahul testing team 12', 'Write something awesome about my team', '{\"team_member\":\"101,102,103,105,117,118,121\"}', 1, '2023-05-12 10:44:13', NULL),
(30, 11, 'Rahul testing team 12', 'Write something awesome about my team', '{\"team_member\":\"101,102,103,105,117,118,121,126\"}', 1, '2023-05-12 10:44:17', NULL),
(31, 11, 'Rahul testing team 12', 'Write something awesome about my team', '{\"team_member\":\"101,102,103,105,117,118,121,122\"}', 1, '2023-05-12 10:50:35', NULL),
(33, 11, 'Rahul testing team 12', 'Testing by rahul kumar', '{\"team_member\":\"125,121,105\"}', 1, '2023-05-12 10:54:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `insurance_companies`
--

CREATE TABLE `insurance_companies` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_code` varchar(56) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance_companies`
--

INSERT INTO `insurance_companies` (`id`, `company_name`, `company_code`, `status`, `is_deleted`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Life Insurance Corporation of India', '1956', '1', '0', 1, '2023-03-17 11:43:25', NULL),
(2, 'HDFC Standard Life Insurance Co. Ltd.', '2000', '1', '1', 1, '2023-03-17 11:43:44', NULL),
(3, 'Max Life Insurance Co. Ltd', '2000', '1', '1', 1, '2023-03-17 11:43:53', NULL),
(4, 'ICICI Prudential Life Insurance Co. Ltd.', '2000', '1', '0', 1, '2023-03-17 11:44:00', NULL),
(5, 'TATA AIG Life Insurance Co. Ltd', '2001', '1', '0', 1, '2023-03-17 11:44:18', NULL),
(6, 'Aditya Birla Sun Life Insurance Co. Ltd.', '2000', '1', '0', 1, '2023-03-17 11:44:34', NULL),
(7, 'Bajaj Allianz Life Insurance Co. Ltd.', '2001', '1', '0', 1, '2023-03-17 11:44:59', NULL),
(8, 'Exide Life Insurance Co. Ltd.', '2001', '1', '0', 1, '2023-03-17 11:45:06', NULL),
(9, 'SBI Life Insurance Co. Ltd.', '2001', '1', '0', 1, '2023-03-17 11:45:24', NULL),
(10, 'PNB MetLife India Insurance Co. Ltd.', '2007', '0', '0', 1, '2023-03-17 11:45:37', NULL),
(11, 'PNB MetLife India Insurance Co. Ltd.', '2007', '1', '0', 1, '2023-04-17 14:50:25', NULL),
(12, 'Energy Company pvt. ltd', '110056', '', '1', 1, '2023-04-17 14:53:44', NULL),
(13, 'Energy Company pvt. ltd', '110056', '0', '1', 1, '2023-04-17 14:57:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `insurance_company_plans`
--

CREATE TABLE `insurance_company_plans` (
  `plan_id` int(11) NOT NULL,
  `insurance_company_id` int(11) NOT NULL,
  `policy_name` varchar(255) NOT NULL,
  `policy_plan_number` varchar(50) DEFAULT NULL,
  `policy_code` varchar(20) DEFAULT NULL,
  `policy_type` varchar(255) NOT NULL,
  `policy_tenure` varchar(50) NOT NULL,
  `policy_start_date` date NOT NULL,
  `policy_end_date` date NOT NULL,
  `policy_premium_amount` bigint(20) NOT NULL,
  `policy_coverage_limits` bigint(20) NOT NULL,
  `policy_covered_risks` varchar(255) NOT NULL,
  `policy_deductible_amount` bigint(20) NOT NULL,
  `policy_renewal_date` date NOT NULL,
  `policy_endorsements` varchar(255) DEFAULT NULL COMMENT 'A field containing any endorsements or changes to the policy',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance_company_plans`
--

INSERT INTO `insurance_company_plans` (`plan_id`, `insurance_company_id`, `policy_name`, `policy_plan_number`, `policy_code`, `policy_type`, `policy_tenure`, `policy_start_date`, `policy_end_date`, `policy_premium_amount`, `policy_coverage_limits`, `policy_covered_risks`, `policy_deductible_amount`, `policy_renewal_date`, `policy_endorsements`, `is_deleted`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'LIC Chi Bima Jyoti', NULL, NULL, 'Bima Yojna', '20 year', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '1', 1, '2023-03-17 15:32:43', NULL),
(2, 1, 'Fund Accumulation of LIC', NULL, NULL, 'Bima Yojna', '20 year', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '1', 1, '2023-03-17 15:35:39', NULL),
(3, 1, 'Jeevan Tarun of LIC', NULL, NULL, 'Health Insurance', '20 year', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:36:06', NULL),
(4, 6, 'Activ Health Platinum Enhanced', NULL, NULL, 'Health Insurance', '586-day', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:42:23', NULL),
(5, 6, 'Activ Assure Diamond + Super Health Topup', NULL, NULL, 'Health Insurance', '586-day', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:42:52', NULL),
(6, 6, 'Arogya Sanjeevani', NULL, NULL, 'Health Insurance', '30 days', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:43:24', NULL),
(7, 5, 'Sampoorna Raksha', NULL, NULL, 'Term Insurance', '30 days', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:46:49', NULL),
(8, 5, ' Tata AI SRS Vitality Protect', NULL, NULL, 'Term Insurance', '30 days', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:47:09', NULL),
(9, 5, ' Tata AIA InstaProtect Solution', NULL, NULL, 'Term Insurance', '30 days', '2023-03-17', '2024-03-16', 100000, 100000, '1000000', 1000, '2024-03-10', NULL, '0', 1, '2023-03-17 15:47:32', NULL),
(10, 5, ' Tata AIA Maha Raksha Supreme', NULL, NULL, 'Term Insurance', '30 days', '2023-03-17', '2024-03-16', 300000, 100000, '1000000', 10000, '2024-03-10', NULL, '0', 1, '2023-03-17 16:06:24', '2023-04-17 17:00:11'),
(11, 9, 'POLICY 1', NULL, NULL, 'POLICY new', 'TENURE 1', '2023-04-17', '2023-04-18', 4500, 4200, '3600', 45002, '2023-04-20', NULL, '1', 1, '2023-04-17 16:31:21', NULL),
(12, 9, 'POLICY', NULL, NULL, 'POLICY new', 'TENURE 1', '2023-04-16', '2023-04-17', 4500, 4200, '3600', 45002, '2023-04-19', NULL, '0', 1, '2023-04-17 16:48:09', '2023-04-17 17:00:18'),
(13, 9, 'POLICY 2', NULL, NULL, 'POLICY new', 'TENURE 1', '2023-04-16', '2023-04-17', 4500, 4200, '3600', 45002, '2023-04-19', NULL, '1', 1, '2023-04-17 16:48:23', NULL),
(14, 7, 'new POLICY new', NULL, NULL, 'POLICY new', '51651', '2023-04-17', '2023-04-18', 4500, 65651, '51651', 45002, '2023-04-18', NULL, '1', 1, '2023-04-17 17:00:51', '2023-04-17 17:00:57');

-- --------------------------------------------------------

--
-- Table structure for table `item_masters`
--

CREATE TABLE `item_masters` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rate` varchar(142) NOT NULL,
  `qty` varchar(142) NOT NULL,
  `image` varchar(142) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_masters`
--

INSERT INTO `item_masters` (`id`, `name`, `rate`, `qty`, `image`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'Wire', '1450', '6', '/item_masters/1680780892236outside1.webp', 1, '2023-04-06 14:43:43', '2023-04-06 18:26:46'),
(4, 'Wire ', '1255', '9', '/item_masters/1680772427054wall.jpg', 1, '2023-04-06 14:43:47', '2023-04-06 18:26:19'),
(5, 'Dealers', '455', '7', '/item_masters/1680783449953bubble-gradient.png', 1, '2023-04-06 17:01:59', '2023-04-06 18:39:57'),
(6, 'fan', '899', '6', '/item_masters/1680784733306about-timeline.png', 1, '2023-04-06 18:08:53', '2023-04-06 18:39:47'),
(8, 'Super admin', '125', '26', '/item_masters/1680785482845404-error.png', 1, '2023-04-06 18:21:22', '2023-04-06 18:38:34'),
(9, 'Rahul Testing items', '200', '250', '/item_masters/1683782188717logo.png', 1, '2023-05-11 10:46:28', '2023-05-11 10:46:36');

-- --------------------------------------------------------

--
-- Table structure for table `leave_applications`
--

CREATE TABLE `leave_applications` (
  `id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_hours` decimal(7,2) NOT NULL,
  `total_days` decimal(5,2) NOT NULL,
  `applicant_id` int(11) NOT NULL,
  `reason` mediumtext NOT NULL,
  `supporting_documents` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','assigned') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `checked_at` datetime DEFAULT NULL,
  `checked_by` int(11) NOT NULL DEFAULT 0,
  `deleted` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leave_applications`
--

INSERT INTO `leave_applications` (`id`, `leave_type_id`, `start_date`, `end_date`, `total_hours`, `total_days`, `applicant_id`, `reason`, `supporting_documents`, `status`, `created_at`, `created_by`, `checked_at`, `checked_by`, `deleted`) VALUES
(1, 1, '2023-04-03', '2023-04-09', '48.00', '6.00', 10, 'THis is test apply leave calculate and check', NULL, 'approved', '2023-03-07 15:58:16', 1, NULL, 0, 1),
(6, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1678338338117png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'pending', '2023-03-09 10:35:38', 1, NULL, 0, 0),
(7, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1678338373732png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'pending', '2023-03-09 10:36:13', 1, NULL, 0, 0),
(8, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679489803554png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'pending', '2023-03-22 18:26:43', 1, NULL, 0, 0),
(9, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679489844470png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'pending', '2023-03-22 18:27:24', 1, NULL, 0, 0),
(10, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679489917440png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'pending', '2023-03-22 18:28:37', 1, NULL, 0, 0),
(11, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679489950442png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'rejected', '2023-03-22 18:29:10', 1, NULL, 0, 0),
(12, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679490009048png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'approved', '2023-03-22 18:30:09', 1, NULL, 0, 0),
(13, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679490034102png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'approved', '2023-03-22 18:30:34', 1, NULL, 0, 0),
(14, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1679490050183png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'rejected', '2023-03-22 18:30:50', 1, NULL, 0, 0),
(15, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 4, 'THis is test apply leave calculate and check', '/leave_application/1679490171029png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png', 'approved', '2023-03-22 18:32:51', 4, NULL, 0, 0),
(16, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '', 'approved', '2023-04-03 17:50:30', 1, NULL, 0, 0),
(17, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1680524792212download.jpg', 'rejected', '2023-04-03 17:56:32', 1, NULL, 0, 0),
(18, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1680524836326download.jpg', 'rejected', '2023-04-03 17:57:16', 1, NULL, 0, 0),
(19, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1680525233858download.jpg', 'approved', '2023-04-03 18:03:53', 1, NULL, 0, 0),
(20, 3, '2023-03-10', '2023-03-14', '32.00', '4.00', 1, 'THis is test apply leave calculate and check', '/leave_application/1680525524716download.jpg', 'approved', '2023-04-03 18:08:44', 1, NULL, 0, 0),
(21, 8, '2023-04-06', '2023-04-20', '112.00', '14.00', 115, 'asdsad', '/leave_application/1680526907301Screenshot (125).png', 'rejected', '2023-04-03 18:31:47', 1, NULL, 0, 0),
(22, 19, '2023-04-13', '2023-04-14', '8.00', '1.00', 117, 'asddf', '/leave_application/1680527455863Screenshot (126).png', 'approved', '2023-04-03 18:40:55', 1, NULL, 0, 0),
(23, 7, '2023-04-04', '2023-04-14', '80.00', '10.00', 115, 'dsad', '/leave_application/1680527490071Screenshot (116).png', 'approved', '2023-04-03 18:41:30', 1, NULL, 0, 0),
(24, 19, '2023-04-05', '2023-04-11', '48.00', '6.00', 80, 'qssd', '/leave_application/1680527558077Screenshot (124).png', 'approved', '2023-04-03 18:42:38', 1, NULL, 0, 0),
(25, 4, '2023-04-04', '2023-04-05', '8.00', '1.00', 120, 'asdxasd', '/leave_application/1680583970063download.png', 'approved', '2023-04-04 10:22:50', 1, NULL, 0, 0),
(26, 20, '2023-04-06', '2023-04-28', '176.00', '22.00', 121, 'dd', '/leave_application/1680590005398Screenshot (124).png', 'approved', '2023-04-04 12:03:25', 1, NULL, 0, 0),
(27, 6, '2023-04-12', '2023-04-13', '8.00', '1.00', 118, 'REASON', '/leave_application/16812953141411.png', 'approved', '2023-04-12 15:58:34', 1, NULL, 0, 0),
(28, 8, '2023-04-20', '2023-04-20', '0.00', '0.00', 125, 'temp', '/leave_application/1681993320279lst.py', 'approved', '2023-04-20 17:52:00', 1, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL,
  `leave_type` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `leave_type`, `description`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'ALWP', 'alwp', 1, 1, '2023-03-06 17:19:04', '2023-05-11 11:11:18'),
(2, 'Earned Leave ', 'earned leave', 1, 1, '2023-03-06 17:37:50', '2023-03-28 10:16:55'),
(3, 'Half Day', 'half day', 1, 1, '2023-03-06 17:37:59', '2023-03-28 10:16:17'),
(4, 'NCNS', 'ncns', 1, 1, '2023-03-06 17:38:07', '2023-03-28 10:16:11'),
(5, 'Office Off', 'office off', 1, 1, '2023-03-06 17:38:15', '2023-03-28 10:16:04'),
(6, 'Sick Leave', 'sick leave', 1, 1, '2023-03-06 17:38:23', '2023-03-28 10:16:49'),
(7, 'ULWP', 'ulwp', 1, 1, '2023-03-06 17:38:31', '2023-03-28 10:16:46'),
(8, 'Week Off', 'week off\n', 1, 1, '2023-03-06 17:38:38', '2023-03-28 10:16:42'),
(19, 'Absent', 'absent', 1, 1, '2023-04-01 15:50:07', NULL),
(20, 'Week Off 3', 'rahuL', 1, 1, '2023-04-03 13:49:55', '2023-05-09 14:55:17');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `loan_id` bigint(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `loan_amount` double NOT NULL,
  `loan_type` varchar(255) NOT NULL,
  `interest_rate` varchar(11) DEFAULT NULL,
  `loan_term` varchar(11) NOT NULL,
  `repayment_date` date DEFAULT NULL,
  `repayment_amount` double DEFAULT NULL,
  `payment_type` enum('one time','emi') DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `remarks` longtext DEFAULT NULL,
  `loan_status_changed_date` datetime DEFAULT NULL,
  `loan_status_changed_by` int(11) DEFAULT NULL,
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `loan_id`, `user_id`, `loan_amount`, `loan_type`, `interest_rate`, `loan_term`, `repayment_date`, `repayment_amount`, `payment_type`, `status`, `remarks`, `loan_status_changed_date`, `loan_status_changed_by`, `is_deleted`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 9147560885, 3, 100000, 'Marriage Loan', NULL, '1 year', '2024-04-20', NULL, 'one time', 'closed', 'due to some personal reason', '2023-04-26 16:01:26', 1, '0', 1, '2023-04-19 16:42:51', '2023-04-26 16:22:26'),
(2, 9209639485, 10, 500000, 'Marriage Loan', NULL, '1 year', NULL, 5000, 'emi', 'active', 'due to some personal reason', '2023-04-20 11:25:02', 1, '0', 1, '2023-04-19 16:43:19', '2023-04-26 16:21:50'),
(3, 9209639585, 2, 500000, 'Marriage Loan', NULL, '1 year', NULL, 3000, 'emi', 'closed', 'due to some personal reason', '2023-04-26 17:05:35', 1, '0', 1, '2023-04-19 16:43:19', '2023-04-26 17:05:35'),
(4, 446268259, 1, 100000, 'Marriage Loan', NULL, '1 year', NULL, NULL, NULL, 'pending', 'due to some personal reason.', NULL, NULL, '0', 1, '2023-04-26 13:51:23', '2023-04-26 17:49:17'),
(5, 6788919467, 7, 5500, 'emi', NULL, '1 year', NULL, NULL, NULL, 'reject', 'testing... 123', '2023-04-26 17:03:08', 1, '0', 1, '2023-04-26 15:04:13', '2023-04-26 17:03:08'),
(6, 6186074288, 20, 4800, 'emi', NULL, '6 month', NULL, NULL, NULL, 'reject', 'testing...', '2023-04-26 15:57:53', 1, '0', 1, '2023-04-26 15:10:00', '2023-04-26 16:22:09'),
(7, 6848672772, 1, 100000, 'Marriage Loan', NULL, '1 year', NULL, NULL, NULL, 'pending', 'due to some personal reason', NULL, NULL, '0', 1, '2023-04-26 17:06:22', NULL),
(8, 9705004912, 1, 100000, 'Marriage Loan', NULL, '1 year', NULL, NULL, NULL, 'closed', 'due to some personal reason', '2023-04-26 17:12:45', 1, '0', 1, '2023-04-26 17:06:24', '2023-04-26 17:12:45'),
(9, 7045470330, 1, 100000, 'Marriage Loan', NULL, '1 year', NULL, NULL, NULL, 'active', 'due to some personal reason', '2023-04-26 17:12:53', 1, '0', 1, '2023-04-26 17:06:26', '2023-04-26 17:12:54'),
(10, 1287692573, 1, 100000, 'Marriage Loan', NULL, '1 year', NULL, NULL, NULL, 'closed', 'due to some personal reason', '2023-04-26 17:07:27', 1, '0', 1, '2023-04-26 17:06:28', '2023-04-26 17:07:27'),
(11, 4030184869, 1, 100000, 'Marriage Loan', NULL, '1 year', NULL, NULL, NULL, 'pending', 'due to some personal reason', NULL, NULL, '0', 1, '2023-04-26 17:06:29', NULL),
(12, 3361762781, 4, 5500, 'emi', NULL, '1 year', NULL, NULL, NULL, 'pending', 'test', NULL, NULL, '0', 1, '2023-04-26 17:27:46', NULL),
(13, 8765644565, 8, 5500, 'emi', NULL, '6 month', NULL, NULL, NULL, 'pending', 'test', NULL, NULL, '0', 1, '2023-04-26 17:28:20', '2023-04-26 17:28:57'),
(14, 2228167046, 3, 5500, 'emi', NULL, '2 year', NULL, NULL, NULL, 'pending', 'test', NULL, NULL, '0', 1, '2023-04-26 17:28:35', NULL),
(15, 268963491, 3, 12000, 'personal', NULL, '1 year', NULL, NULL, NULL, 'pending', 'This is test generated loan', NULL, NULL, '0', 1, '2023-05-11 11:14:24', '2023-05-11 11:15:36');

-- --------------------------------------------------------

--
-- Table structure for table `loan_emis`
--

CREATE TABLE `loan_emis` (
  `id` int(11) NOT NULL,
  `loan_id` bigint(11) NOT NULL,
  `amount` double NOT NULL,
  `emi_date` date NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `message_content` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `is_read` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 = unread, 1 = read',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0 = not deleted, 1 = deleted',
  `timestamp` bigint(20) NOT NULL,
  `read_at` bigint(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `sender_id`, `recipient_id`, `message_content`, `attachment`, `is_read`, `is_deleted`, `timestamp`, `read_at`) VALUES
(1, 1, 10, 'This is test message', '/plan_images/16803338580134k-2.jfif', '0', '0', 1681718109486, NULL),
(2, 10, 1, 'This is test message reply by 10', '/plan_images/16803338580134k-2.jfif', '1', '0', 1681718139901, 1683785870198),
(3, 1, 10, 'This is test message reply by 1', NULL, '0', '0', 1681719088653, NULL),
(4, 10, 1, 'This is test message again reply by 10', NULL, '1', '0', 1681719107366, 1683785870198),
(5, 11, 1, 'This is test message from 11', NULL, '1', '0', 1681719499901, 1683887091364),
(6, 1, 11, 'This is test message reply from 1', NULL, '0', '0', 1681719585069, NULL),
(7, 11, 1, 'This is test message reply from 11', NULL, '1', '0', 1681722583119, 1683887091364),
(8, 11, 1, 'This is test message reply from 11', NULL, '1', '0', 1681723572339, 1683887091364),
(9, 10, 1, 'This is test message reply from 10', NULL, '1', '0', 1681723605927, 1683785870198),
(10, 10, 1, 'This is test message reply from 10', '/plan_images/16803338580134k-2.jfif', '1', '0', 1682598395539, 1683785870198),
(11, 10, 1, 'hey Altaf', NULL, '1', '0', 1682662611136, 1683785870198),
(12, 10, 1, 'hey Altaf,', '/message_attachments/1682662947833wall.jpg', '1', '0', 1682662947833, 1683785870198),
(13, 10, 1, 'This is test message reply from 10', NULL, '1', '0', 1683031745101, 1683785870198),
(14, 10, 1, 'This is test message reply from 10', NULL, '1', '0', 1683031822929, 1683785870198),
(15, 10, 1, 'This is test message reply from 10', NULL, '1', '0', 1683033930419, 1683785870198),
(16, 1, 10, 'Through postman socket', NULL, '0', '0', 1683703042458, NULL),
(17, 1, 10, 'Through postman socket', NULL, '0', '0', 1683703082575, NULL),
(18, 1, 10, 'Through postman socket', NULL, '0', '0', 1683703116221, NULL),
(19, 1, 10, 'Through postman socket', NULL, '0', '0', 1683703136742, NULL),
(20, 1, 10, 'Through postman socket', NULL, '0', '0', 1683703182894, NULL),
(113, 1, 10, 'hello today', NULL, '0', '0', 1683785870157, NULL),
(114, 1, 11, 'hello', NULL, '0', '0', 1683887091337, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `order_number` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `title`, `path`, `icon`, `order_number`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'Dashboard', '/dashboard', 'BsSpeedometer', 1, 1, '2023-02-10 09:28:33', 1, '2023-04-19 10:03:08', NULL),
(2, 'Analytics', '/Analytics', 'BsBarChart', 1, 1, '2023-02-10 09:29:21', 1, '2023-05-10 10:11:21', NULL),
(3, 'Master Data', 'MasterData', 'BsGlobe', 4, 1, '2023-02-10 09:29:21', 1, '2023-04-19 09:57:12', NULL),
(4, 'User Management', 'RolesPermissions', NULL, 20, 0, '2023-02-10 09:31:12', 1, '2023-04-07 07:11:30', NULL),
(5, 'Enable & Disable Features', '/EnableDisableFeatures', 'BsToggles2', 5, 1, '2023-02-10 09:31:12', 1, '2023-05-10 10:12:18', NULL),
(6, 'Software Activation', '/SoftwareActivation', 'BsHandIndexThumbFill', 6, 1, '2023-02-10 09:31:12', 1, '2023-05-10 10:12:23', NULL),
(7, 'Feedbacks & Suggestions', '/SuggestionsFeedbacks', 'BsEmojiSmileFill', 7, 1, '2023-02-10 09:31:12', 1, '2023-05-10 10:12:28', NULL),
(8, 'Contacts', '#', 'BsHeadphones', 8, 1, '2023-02-10 09:31:12', 1, '2023-04-19 09:58:21', NULL),
(9, 'Tutorials', '/Tutorials', 'BsFillCollectionPlayFill', 16, 1, '2023-02-10 09:32:22', 1, '2023-05-10 10:12:32', NULL),
(10, 'Plan & Pricing', '/PlanPricing', 'BsListCheck', 17, 1, '2023-02-10 09:32:22', 1, '2023-05-10 10:12:36', NULL),
(11, 'Billings', '/Billings', 'BsReceipt', 18, 1, '2023-02-10 09:32:22', 1, '2023-05-10 10:12:40', NULL),
(12, 'Notifications', '/AllNotifications', 'BsBellFill', 14, 1, '2023-02-10 09:32:22', 1, '2023-05-10 10:12:43', NULL),
(13, 'Companies', '#', 'BsBuilding', 3, 1, '2023-04-07 06:25:57', 1, '2023-04-19 09:56:36', NULL),
(14, 'Task Manager', '#', 'BsListTask', 9, 1, '2023-04-07 06:25:57', 1, '2023-04-19 09:58:43', NULL),
(15, 'Survey', '#', 'BsCardChecklist', 10, 1, '2023-04-07 06:25:57', 1, '2023-04-19 09:58:56', NULL),
(16, 'All Roles', '/AllRoles', 'BsGenderTrans', 11, 1, '2023-04-07 06:25:57', 1, '2023-05-10 10:12:47', NULL),
(17, 'Term & Conditions', '/TermConditions', 'BsFillCollectionPlayFill', 12, 1, '2023-04-07 06:25:57', 1, '2023-05-10 10:12:50', NULL),
(18, 'HR Management', '#', 'BsPersonLinesFill', 13, 1, '2023-04-07 06:27:37', 1, '2023-04-19 09:59:28', NULL),
(19, 'Messages', '/AllMessages', 'BsBellFill', 15, 1, '2023-04-07 06:28:11', 1, '2023-05-10 10:13:11', NULL),
(20, 'Documents', '#', 'BsFiles', 19, 1, '2023-04-07 06:28:11', 1, '2023-04-19 10:04:42', NULL),
(21, 'All Complaints', '/AllComplaintsMasterdata', 'BsPeopleFill', 4, 1, '2023-04-19 10:08:21', 1, '2023-04-19 10:10:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `module_of_sub_modules`
--

CREATE TABLE `module_of_sub_modules` (
  `id` int(11) NOT NULL,
  `sub_module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `module_of_sub_modules`
--

INSERT INTO `module_of_sub_modules` (`id`, `sub_module_id`, `title`, `path`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 4, 'Energy', '/EnergyMasterdata', '1', '2023-04-07 11:19:37', 1, '2023-04-07 11:19:47', NULL),
(2, 4, 'Zone', '/ZoneMasterdata', '1', '2023-04-07 11:19:37', 1, NULL, NULL),
(3, 4, 'Regional', '/RegionalMasterData', '1', '2023-04-07 12:23:41', 1, NULL, NULL),
(4, 4, 'Sales Area', '/SalesAreaMasterdata', '1', '2023-04-07 12:23:41', 1, NULL, NULL),
(5, 4, 'District', '/DistrictMasterdata', '1', '2023-04-07 12:23:41', 1, NULL, NULL),
(6, 4, 'Outlets', '/OutletsMasterdata', '1', '2023-04-07 12:23:41', 1, NULL, NULL),
(7, 8, 'Complaint Types', '/ComplaintTypesMasterdata', '1', '2023-04-07 12:26:13', 1, NULL, NULL),
(8, 8, 'All Complaints', '/AllComplaintsMasterdata', '0', '2023-04-07 12:26:13', 1, '2023-04-19 15:37:47', NULL),
(9, 27, 'Payroll', '/Payroll', '1', '2023-04-07 12:31:48', 1, '2023-05-08 11:51:44', NULL),
(10, 27, 'Payroll Master', '/PayrollMaster', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(11, 27, 'Time-Sheet', '/TimeSheet', '0', '2023-04-07 12:31:48', 1, '2023-05-09 14:57:12', NULL),
(12, 27, 'Group Insurance', '/GroupInsurance', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(13, 27, 'Salary Disbursal', '/SalaryDisbursal', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(14, 27, 'Loan', '/Loan', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(15, 27, 'PaySlip', '/PaySlip', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(16, 27, 'Employee Promotion Demotion', '/EmployeePromotionDemotion', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(17, 27, 'Employee Resignation', '/EmployeeResignation', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(18, 27, 'Employee Retirement', '/EmployeeRetirement', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(19, 27, 'Employee Tracking', '/EmployeeTracking', '1', '2023-04-07 12:31:48', 1, NULL, NULL),
(20, 27, 'Employee Logs', '/EmployeeLogs', '1', '2023-04-07 12:31:48', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `new_permissions`
--

CREATE TABLE `new_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`permission`)),
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `new_permissions`
--

INSERT INTO `new_permissions` (`id`, `role_id`, `user_id`, `permission`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 0, 18, '[{\"id\":1,\"title\":\"Dashboard\",\"path\":\"/dashboard\",\"icon\":\"BsSpeedometer\",\"checked\":true,\"submodules\":[]},{\"id\":2,\"title\":\"Analytics\",\"path\":\"/Analytics\",\"icon\":\"BsBarChart\",\"checked\":true,\"submodules\":[]},{\"id\":13,\"title\":\"Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":true,\"submodules\":[{\"id\":1,\"title\":\"My Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":true,\"modulesOfSubModule\":[]},{\"id\":2,\"title\":\"Sale Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":3,\"title\":\"Purchase Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":31,\"title\":\"All Company\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":3,\"title\":\"Master Data\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"submodules\":[{\"id\":4,\"title\":\"Energy Company\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":1,\"title\":\"Energy\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":2,\"title\":\"Zone\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":3,\"title\":\"Regional\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":4,\"title\":\"Sales Area\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":5,\"title\":\"District\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":6,\"title\":\"Outlets\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false}]},{\"id\":5,\"title\":\"Energy Team\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":6,\"title\":\"Dealers\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":7,\"title\":\"Contractors\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":8,\"title\":\"Complaints\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":7,\"title\":\"Complaint Types\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false}]}]},{\"id\":21,\"title\":\"All Complaints\",\"path\":\"/AllComplaintsMasterdata\",\"icon\":\"BsPeopleFill\",\"checked\":false,\"submodules\":[]},{\"id\":5,\"title\":\"Enable & Disable Features\",\"path\":\"/EnableDisableFeatures\",\"icon\":\"BsToggles2\",\"checked\":false,\"submodules\":[]},{\"id\":6,\"title\":\"Software Activation\",\"path\":\"/SoftwareActivation\",\"icon\":\"BsHandIndexThumbFill\",\"checked\":false,\"submodules\":[]},{\"id\":7,\"title\":\"Feedbacks & Suggestions\",\"path\":\"/SuggestionsFeedbacks\",\"icon\":\"BsEmojiSmileFill\",\"checked\":false,\"submodules\":[]},{\"id\":8,\"title\":\"Contacts\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"submodules\":[{\"id\":9,\"title\":\"Contractors\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":10,\"title\":\"Energy Companies\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":11,\"title\":\"Dealers\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":12,\"title\":\"Super Admin\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":14,\"title\":\"Task Manager\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"submodules\":[{\"id\":13,\"title\":\"Task Dashboard\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":14,\"title\":\"Task Category\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":15,\"title\":\"All Task\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":15,\"title\":\"Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"submodules\":[{\"id\":16,\"title\":\"All Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":17,\"title\":\"Item Master\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":18,\"title\":\"Purpose Master\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":19,\"title\":\"Assigned Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":20,\"title\":\"Request Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":21,\"title\":\"Response Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":16,\"title\":\"All Roles\",\"path\":\"/AllRoles\",\"icon\":\"BsGenderTrans\",\"checked\":false,\"submodules\":[]},{\"id\":17,\"title\":\"Term & Conditions\",\"path\":\"/TermConditions\",\"icon\":\"BsFillCollectionPlayFill\",\"checked\":false,\"submodules\":[]},{\"id\":18,\"title\":\"HR Management\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"submodules\":[{\"id\":22,\"title\":\"Teams\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":23,\"title\":\"Employees\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":24,\"title\":\"Attendance\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":25,\"title\":\"Leaves Type\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":26,\"title\":\"Leaves\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":27,\"title\":\"Payroll\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":9,\"title\":\"Payroll\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":10,\"title\":\"Payroll Master\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":12,\"title\":\"Group Insurance\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":13,\"title\":\"Salary Disbursal\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":14,\"title\":\"Loan\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":15,\"title\":\"PaySlip\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":16,\"title\":\"Employee Promotion Demotion\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":17,\"title\":\"Employee Resignation\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":18,\"title\":\"Employee Retirement\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":19,\"title\":\"Employee Tracking\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":20,\"title\":\"Employee Logs\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false}]}]},{\"id\":12,\"title\":\"Notifications\",\"path\":\"/AllNotifications\",\"icon\":\"BsBellFill\",\"checked\":false,\"submodules\":[]},{\"id\":19,\"title\":\"Messages\",\"path\":\"/AllMessages\",\"icon\":\"BsBellFill\",\"checked\":false,\"submodules\":[]},{\"id\":9,\"title\":\"Tutorials\",\"path\":\"/Tutorials\",\"icon\":\"BsFillCollectionPlayFill\",\"checked\":false,\"submodules\":[]},{\"id\":10,\"title\":\"Plan & Pricing\",\"path\":\"/PlanPricing\",\"icon\":\"BsListCheck\",\"checked\":false,\"submodules\":[]},{\"id\":11,\"title\":\"Billings\",\"path\":\"/Billings\",\"icon\":\"BsReceipt\",\"checked\":false,\"submodules\":[]},{\"id\":20,\"title\":\"Documents\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"submodules\":[{\"id\":28,\"title\":\"Document Category\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":29,\"title\":\"Add Document\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":30,\"title\":\"Documents List\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]}]}]', 1, '2023-05-10 15:56:18', NULL),
(2, 0, 18, '[{\"id\":1,\"title\":\"Dashboard\",\"path\":\"/dashboard\",\"icon\":\"BsSpeedometer\",\"checked\":true,\"submodules\":[]},{\"id\":2,\"title\":\"Analytics\",\"path\":\"/Analytics\",\"icon\":\"BsBarChart\",\"checked\":true,\"submodules\":[]},{\"id\":13,\"title\":\"Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":true,\"submodules\":[{\"id\":1,\"title\":\"My Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":2,\"title\":\"Sale Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":3,\"title\":\"Purchase Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":31,\"title\":\"All Company\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":3,\"title\":\"Master Data\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":true,\"submodules\":[{\"id\":4,\"title\":\"Energy Company\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":1,\"title\":\"Energy\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":2,\"title\":\"Zone\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":3,\"title\":\"Regional\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":4,\"title\":\"Sales Area\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":5,\"title\":\"District\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":6,\"title\":\"Outlets\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false}]},{\"id\":5,\"title\":\"Energy Team\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":6,\"title\":\"Dealers\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":7,\"title\":\"Contractors\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":8,\"title\":\"Complaints\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":7,\"title\":\"Complaint Types\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false}]}]},{\"id\":21,\"title\":\"All Complaints\",\"path\":\"/AllComplaintsMasterdata\",\"icon\":\"BsPeopleFill\",\"checked\":false,\"submodules\":[]},{\"id\":5,\"title\":\"Enable & Disable Features\",\"path\":\"/EnableDisableFeatures\",\"icon\":\"BsToggles2\",\"checked\":false,\"submodules\":[]},{\"id\":6,\"title\":\"Software Activation\",\"path\":\"/SoftwareActivation\",\"icon\":\"BsHandIndexThumbFill\",\"checked\":true,\"submodules\":[]},{\"id\":7,\"title\":\"Feedbacks & Suggestions\",\"path\":\"/SuggestionsFeedbacks\",\"icon\":\"BsEmojiSmileFill\",\"checked\":false,\"submodules\":[]},{\"id\":8,\"title\":\"Contacts\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"submodules\":[{\"id\":9,\"title\":\"Contractors\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":10,\"title\":\"Energy Companies\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":11,\"title\":\"Dealers\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":12,\"title\":\"Super Admin\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":14,\"title\":\"Task Manager\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"submodules\":[{\"id\":13,\"title\":\"Task Dashboard\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":14,\"title\":\"Task Category\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":15,\"title\":\"All Task\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":15,\"title\":\"Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"submodules\":[{\"id\":16,\"title\":\"All Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":17,\"title\":\"Item Master\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":18,\"title\":\"Purpose Master\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":19,\"title\":\"Assigned Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":20,\"title\":\"Request Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":21,\"title\":\"Response Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":16,\"title\":\"All Roles\",\"path\":\"/AllRoles\",\"icon\":\"BsGenderTrans\",\"checked\":false,\"submodules\":[]},{\"id\":17,\"title\":\"Term & Conditions\",\"path\":\"/TermConditions\",\"icon\":\"BsFillCollectionPlayFill\",\"checked\":false,\"submodules\":[]},{\"id\":18,\"title\":\"HR Management\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"submodules\":[{\"id\":22,\"title\":\"Teams\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":23,\"title\":\"Employees\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":24,\"title\":\"Attendance\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":25,\"title\":\"Leaves Type\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":26,\"title\":\"Leaves\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":27,\"title\":\"Payroll\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":9,\"title\":\"Payroll\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":10,\"title\":\"Payroll Master\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":12,\"title\":\"Group Insurance\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":13,\"title\":\"Salary Disbursal\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":14,\"title\":\"Loan\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":15,\"title\":\"PaySlip\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":16,\"title\":\"Employee Promotion Demotion\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":17,\"title\":\"Employee Resignation\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":18,\"title\":\"Employee Retirement\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":19,\"title\":\"Employee Tracking\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":20,\"title\":\"Employee Logs\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false}]}]},{\"id\":12,\"title\":\"Notifications\",\"path\":\"/AllNotifications\",\"icon\":\"BsBellFill\",\"checked\":false,\"submodules\":[]},{\"id\":19,\"title\":\"Messages\",\"path\":\"/AllMessages\",\"icon\":\"BsBellFill\",\"checked\":false,\"submodules\":[]},{\"id\":9,\"title\":\"Tutorials\",\"path\":\"/Tutorials\",\"icon\":\"BsFillCollectionPlayFill\",\"checked\":false,\"submodules\":[]},{\"id\":10,\"title\":\"Plan & Pricing\",\"path\":\"/PlanPricing\",\"icon\":\"BsListCheck\",\"checked\":false,\"submodules\":[]},{\"id\":11,\"title\":\"Billings\",\"path\":\"/Billings\",\"icon\":\"BsReceipt\",\"checked\":false,\"submodules\":[]},{\"id\":20,\"title\":\"Documents\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"submodules\":[{\"id\":28,\"title\":\"Document Category\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":29,\"title\":\"Add Document\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":30,\"title\":\"Documents List\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]}]}]', 1, '2023-05-10 17:06:37', NULL),
(3, 0, 18, '[{\"id\":1,\"title\":\"Dashboard\",\"path\":\"/dashboard\",\"icon\":\"BsSpeedometer\",\"checked\":true,\"submodules\":[]},{\"id\":2,\"title\":\"Analytics\",\"path\":\"/Analytics\",\"icon\":\"BsBarChart\",\"checked\":true,\"submodules\":[]},{\"id\":13,\"title\":\"Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"submodules\":[{\"id\":1,\"title\":\"My Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":2,\"title\":\"Sale Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":3,\"title\":\"Purchase Companies\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":31,\"title\":\"All Company\",\"path\":\"#\",\"icon\":\"BsBuilding\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":3,\"title\":\"Master Data\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"submodules\":[{\"id\":4,\"title\":\"Energy Company\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":1,\"title\":\"Energy\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":2,\"title\":\"Zone\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":3,\"title\":\"Regional\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":4,\"title\":\"Sales Area\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":5,\"title\":\"District\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false},{\"id\":6,\"title\":\"Outlets\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false}]},{\"id\":5,\"title\":\"Energy Team\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":6,\"title\":\"Dealers\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":7,\"title\":\"Contractors\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":8,\"title\":\"Complaints\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":7,\"title\":\"Complaint Types\",\"path\":\"MasterData\",\"icon\":\"BsGlobe\",\"checked\":false}]}]},{\"id\":21,\"title\":\"All Complaints\",\"path\":\"/AllComplaintsMasterdata\",\"icon\":\"BsPeopleFill\",\"checked\":false,\"submodules\":[]},{\"id\":5,\"title\":\"Enable & Disable Features\",\"path\":\"/EnableDisableFeatures\",\"icon\":\"BsToggles2\",\"checked\":false,\"submodules\":[]},{\"id\":6,\"title\":\"Software Activation\",\"path\":\"/SoftwareActivation\",\"icon\":\"BsHandIndexThumbFill\",\"checked\":false,\"submodules\":[]},{\"id\":7,\"title\":\"Feedbacks & Suggestions\",\"path\":\"/SuggestionsFeedbacks\",\"icon\":\"BsEmojiSmileFill\",\"checked\":false,\"submodules\":[]},{\"id\":8,\"title\":\"Contacts\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"submodules\":[{\"id\":9,\"title\":\"Contractors\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":10,\"title\":\"Energy Companies\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":11,\"title\":\"Dealers\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":12,\"title\":\"Super Admin\",\"path\":\"#\",\"icon\":\"BsHeadphones\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":14,\"title\":\"Task Manager\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"submodules\":[{\"id\":13,\"title\":\"Task Dashboard\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":14,\"title\":\"Task Category\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":15,\"title\":\"All Task\",\"path\":\"#\",\"icon\":\"BsListTask\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":15,\"title\":\"Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"submodules\":[{\"id\":16,\"title\":\"All Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":17,\"title\":\"Item Master\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":18,\"title\":\"Purpose Master\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":19,\"title\":\"Assigned Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":20,\"title\":\"Request Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":21,\"title\":\"Response Survey\",\"path\":\"#\",\"icon\":\"BsCardChecklist\",\"checked\":false,\"modulesOfSubModule\":[]}]},{\"id\":16,\"title\":\"All Roles\",\"path\":\"/AllRoles\",\"icon\":\"BsGenderTrans\",\"checked\":false,\"submodules\":[]},{\"id\":17,\"title\":\"Term & Conditions\",\"path\":\"/TermConditions\",\"icon\":\"BsFillCollectionPlayFill\",\"checked\":false,\"submodules\":[]},{\"id\":18,\"title\":\"HR Management\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"submodules\":[{\"id\":22,\"title\":\"Teams\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":23,\"title\":\"Employees\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":24,\"title\":\"Attendance\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":25,\"title\":\"Leaves Type\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":26,\"title\":\"Leaves\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":27,\"title\":\"Payroll\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false,\"modulesOfSubModule\":[{\"id\":9,\"title\":\"Payroll\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":10,\"title\":\"Payroll Master\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":12,\"title\":\"Group Insurance\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":13,\"title\":\"Salary Disbursal\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":14,\"title\":\"Loan\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":15,\"title\":\"PaySlip\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":16,\"title\":\"Employee Promotion Demotion\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":17,\"title\":\"Employee Resignation\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":18,\"title\":\"Employee Retirement\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":19,\"title\":\"Employee Tracking\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false},{\"id\":20,\"title\":\"Employee Logs\",\"path\":\"#\",\"icon\":\"BsPersonLinesFill\",\"checked\":false}]}]},{\"id\":12,\"title\":\"Notifications\",\"path\":\"/AllNotifications\",\"icon\":\"BsBellFill\",\"checked\":false,\"submodules\":[]},{\"id\":19,\"title\":\"Messages\",\"path\":\"/AllMessages\",\"icon\":\"BsBellFill\",\"checked\":false,\"submodules\":[]},{\"id\":9,\"title\":\"Tutorials\",\"path\":\"/Tutorials\",\"icon\":\"BsFillCollectionPlayFill\",\"checked\":false,\"submodules\":[]},{\"id\":10,\"title\":\"Plan & Pricing\",\"path\":\"/PlanPricing\",\"icon\":\"BsListCheck\",\"checked\":false,\"submodules\":[]},{\"id\":11,\"title\":\"Billings\",\"path\":\"/Billings\",\"icon\":\"BsReceipt\",\"checked\":false,\"submodules\":[]},{\"id\":20,\"title\":\"Documents\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"submodules\":[{\"id\":28,\"title\":\"Document Category\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":29,\"title\":\"Add Document\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]},{\"id\":30,\"title\":\"Documents List\",\"path\":\"#\",\"icon\":\"BsFiles\",\"checked\":false,\"modulesOfSubModule\":[]}]}]', 1, '2023-05-10 17:27:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notification_type` varchar(255) DEFAULT NULL,
  `user_type` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_for` int(11) NOT NULL,
  `is_user_read` int(11) NOT NULL DEFAULT 0,
  `is_admin_read` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `notification_type`, `user_type`, `created_by`, `created_for`, `is_user_read`, `is_admin_read`, `created_at`) VALUES
(1, 'Test Notifications', 'this is for notifications message testing', NULL, 1, 10, 1, 1, 1, '2023-02-23 15:14:19'),
(2, 'Test Notifications 2', 'this is for notifications message testing 2', NULL, 3, 3, 1, 1, 1, '2023-02-23 15:21:01'),
(3, 'Test Notifications 2', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-13 12:51:38'),
(4, 'Test Notifications 5', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 14:52:32'),
(5, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 14:56:47'),
(6, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 16:34:44'),
(7, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 16:35:51'),
(8, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 16:39:53'),
(9, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 16:44:39'),
(10, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 16:50:34'),
(11, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 17:03:15'),
(12, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 3, 1, 12, 0, 1, '2023-03-28 17:36:58'),
(13, 'Test Notifications...', 'this is for notifications message testing 2', NULL, 2, 1, 12, 0, 1, '2023-03-28 17:40:13'),
(14, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:21:27'),
(15, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:21:41'),
(16, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:22:06'),
(17, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:24:53'),
(18, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:25:09'),
(19, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:25:50'),
(20, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:26:15'),
(21, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:26:32'),
(22, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:45:24'),
(23, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:45:49'),
(24, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:50:30'),
(25, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 17:57:16'),
(26, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 18:03:53'),
(27, 'Leave Application of Rahul', 'THis is test apply leave calculate and check', NULL, 1, 1, 1, 0, 1, '2023-04-03 18:08:44'),
(28, 'Leave Application of Rahul', 'asdsad', NULL, 1, 1, 1, 0, 1, '2023-04-03 18:31:47'),
(29, 'Leave Application of Rahul', 'asddf', NULL, 1, 1, 1, 0, 1, '2023-04-03 18:40:55'),
(30, 'Leave Application of Rahul', 'dsad', NULL, 1, 1, 1, 0, 1, '2023-04-03 18:41:30'),
(31, 'Leave Application of Rahul', 'qssd', NULL, 1, 1, 1, 0, 1, '2023-04-03 18:42:38'),
(32, 'Leave Application', 'asdxasd', NULL, 1, 1, 1, 0, 1, '2023-04-04 10:22:50'),
(33, 'Leave Application', 'dd', NULL, 1, 1, 1, 0, 1, '2023-04-04 12:03:25'),
(34, 'Leave Application', 'REASON', NULL, 1, 1, 1, 0, 1, '2023-04-12 15:58:34'),
(35, 'Leave Application', 'temp', NULL, 1, 1, 1, 0, 1, '2023-04-20 17:52:00');

-- --------------------------------------------------------

--
-- Table structure for table `outlets`
--

CREATE TABLE `outlets` (
  `id` int(11) NOT NULL,
  `energy_company_id` smallint(11) NOT NULL,
  `zone_id` smallint(11) NOT NULL,
  `regional_office_id` smallint(11) NOT NULL,
  `sales_area_id` smallint(11) NOT NULL,
  `district_id` smallint(11) NOT NULL,
  `outlet_unique_id` varchar(120) NOT NULL,
  `outlet_name` varchar(255) NOT NULL,
  `outlet_contact_person_name` varchar(255) NOT NULL,
  `outlet_contact_number` varchar(15) NOT NULL,
  `primary_number` varchar(15) DEFAULT NULL,
  `secondary_number` varchar(15) DEFAULT NULL,
  `primary_email` varchar(255) DEFAULT NULL,
  `secondary_email` varchar(255) DEFAULT NULL,
  `customer_code` varchar(244) NOT NULL,
  `outlet_category` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `outlet_ccnoms` varchar(255) NOT NULL,
  `outlet_ccnohsd` varchar(255) NOT NULL,
  `outlet_resv` varchar(255) DEFAULT NULL,
  `outlet_longitude` varchar(255) DEFAULT NULL,
  `outlet_lattitude` varchar(255) DEFAULT NULL,
  `outlet_image` varchar(255) DEFAULT NULL,
  `created_by` smallint(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `outlets`
--

INSERT INTO `outlets` (`id`, `energy_company_id`, `zone_id`, `regional_office_id`, `sales_area_id`, `district_id`, `outlet_unique_id`, `outlet_name`, `outlet_contact_person_name`, `outlet_contact_number`, `primary_number`, `secondary_number`, `primary_email`, `secondary_email`, `customer_code`, `outlet_category`, `location`, `address`, `outlet_ccnoms`, `outlet_ccnohsd`, `outlet_resv`, `outlet_longitude`, `outlet_lattitude`, `outlet_image`, `created_by`, `created_at`, `updated_at`) VALUES
(5, 10, 3, 5, 9, 8, 'RAHUL001', 'OUTLET2', 'Ahmad 74', '6585599655', '6644141496', '7484984949', 'ahmad@gmail.com', 'dhkm@hd.com', 'kgkg525', 'dvdv', 'delhi', 'H-16/514SANGAM-VIHAR', 'DUMMY', 'DUMMY', 'DUMMY', 'DUMMY', 'DUMMY', '/outlet_images/1679467050884download.png', 1, '2023-03-22 11:36:29', '2023-03-22 12:07:30'),
(6, 3, 6, 15, 10, 9, 'RAHUL002', 'OUTLET 3.', 'Altaf', '6585599655', '6644141496', '7484984949', 'ahmad@gmail.com', 'ahjjh@gmail.com', 'kgkg525', 'New2', 'delhi', 'H-16/514SANGAM-VIHAR', 'DUMMY', 'DUMMY', 'DUMMY 1', 'DUMMY', 'DUMMY', '/outlet_images/1679467083160wall.jpg', 1, '2023-03-22 11:59:05', '2023-03-22 12:08:31'),
(8, 13, 11, 18, 14, 12, 'sdfd4564g', 'rahul ec 12 outlet 1', 'sdfsef Rahul', '9999999999', '9999999999', '9999999999', 'abc@gmail.com', 'abc2@gmail.com', 'jfu756', 'development', 'moida', 'address', 'sedfwer', 'wefrew', 'scasd', 'ascasdc', 'asdasdc', '/outlet_images/1681378717253logo.png', 1, '2023-04-13 15:08:37', '2023-04-13 15:08:53'),
(9, 13, 11, 18, 14, 13, 'Outlet-3444', 'outlet-nnn', '', '7879889898', '', '', '', '', '678hhi', 'sasdf', '', '', 'sdf', 'dsgsfg', '', '', '', '', 1, '2023-04-17 14:09:05', NULL),
(10, 13, 11, 18, 14, 13, 'Outlet-77777', 'outlet-ggg', '', '7879889898', '', '', '', '', 'fddhh', 'dsgdfg', '', '', 'fdhgh', 'tyutyu', '', '', '', '/outlet_images/1683538211847logo.png', 1, '2023-04-17 15:20:58', '2023-05-08 15:00:11'),
(11, 13, 13, 23, 15, 14, 'RAHec12oUTLT', 'rAHUL OUTLET 12', 'Ahmad 74', '6585599655', '6644141496', '7484984949', 'ahmad@gmail.com', 'dhkm@hd.com', '6585599655', 'dvdv', 'delhi', 'H-16/514SANGAM-VIHAR', 'vsdfv', 'sdfgv', 'DUMMY', 'DUMMY', 'DUMMY', '/outlet_images/1683780931567download (2).jpg', 1, '2023-05-11 10:24:51', '2023-05-11 10:25:37');

-- --------------------------------------------------------

--
-- Table structure for table `payroll_master_settings`
--

CREATE TABLE `payroll_master_settings` (
  `id` int(11) NOT NULL,
  `input_type` varchar(255) NOT NULL,
  `label` text NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `active_setting` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payroll_master_settings`
--

INSERT INTO `payroll_master_settings` (`id`, `input_type`, `label`, `status`, `active_setting`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'radio', 'Hourly basis (salary is calculated according to  working hours of an employee)', '1', '0', 1, '2023-03-09 11:51:34', NULL),
(2, 'radio', 'Weekly basis (salary is calculated according to working hours of an employee)..', '1', '0', 1, '2023-03-09 11:51:34', NULL),
(3, 'radio', 'Monthly basis (salary is calculated by dividing month\'s total salary with the total days in a month and multiplying with the number of present days and half days)', '1', '1', 1, '2023-03-09 11:51:34', NULL),
(4, 'radio', 'Fixed day basis (salary is calculated by dividing a month\'s total salary with 30 and multiplying it with leaves and half days and deducting the amount from the total salary)', '1', '0', 1, '2023-03-09 11:51:34', NULL),
(5, 'radio', 'Working day basis (salary is calculated by dividing the total number of working days in a month and multiplying the amount with the number of present and half days)', '1', '0', 1, '2023-03-09 11:51:34', NULL),
(6, 'radio', 'THis is dyanimc created label', '1', '0', 0, '2023-03-09 12:44:54', NULL),
(7, 'radio', 'THis is dyanimc created label', '1', '0', 1, '2023-03-09 12:45:45', NULL),
(8, 'radio', 'testing..', '1', '0', 1, '2023-05-01 12:09:11', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `sub_module_id` int(11) NOT NULL,
  `module_of_sub_module` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created` tinyint(4) NOT NULL DEFAULT 0,
  `viewed` tinyint(4) NOT NULL DEFAULT 0,
  `updated` tinyint(4) NOT NULL DEFAULT 0,
  `deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `module_id`, `sub_module_id`, `module_of_sub_module`, `role_id`, `user_id`, `created`, `viewed`, `updated`, `deleted`, `created_at`, `updated_at`) VALUES
(1, 7, 0, 0, 7, 0, 0, 0, 0, 1, '2023-05-09 05:39:41', NULL),
(2, 5, 1, 0, 9, 0, 1, 0, 0, 0, '2023-05-09 05:40:03', NULL),
(3, 7, 0, 0, 4, 3, 0, 0, 0, 0, '2023-05-11 05:10:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `price` varchar(50) NOT NULL,
  `duration` varchar(244) NOT NULL,
  `description` text NOT NULL,
  `module` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`module`)),
  `image` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `price`, `duration`, `description`, `module`, `image`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Super admin', '585', 'month', 'test', '\"[3,4,7,8,9]\"', '/plan_images/1683623538323logo.png', 1, '2023-04-01 12:54:18', '2023-05-09 14:42:18'),
(3, 'Super admin', '585', 'month', 'sdfasf', '\"[2,1]\"', '/plan_images/16813873217874k-2.jfif', 1, '2023-04-13 17:32:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plan_checklists`
--

CREATE TABLE `plan_checklists` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `checklist_name` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_checklists`
--

INSERT INTO `plan_checklists` (`id`, `plan_id`, `checklist_name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(18, 3, 'dfwhwert', 1, 1, '2023-04-13 17:32:01', NULL),
(19, 1, 'new test', 1, 1, '2023-05-09 14:42:18', NULL),
(20, 1, 'test 2', 1, 1, '2023-05-09 14:42:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purpose_masters`
--

CREATE TABLE `purpose_masters` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purpose_masters`
--

INSERT INTO `purpose_masters` (`id`, `name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Purpose master created for tubelight', 1, 1, '2023-02-24 12:57:44', NULL),
(4, 'Purpose master for table', 1, 1, '2023-04-06 17:27:28', '2023-04-06 17:27:36'),
(7, 'Rahul testing purpose', 1, 1, '2023-05-11 10:46:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `regional_offices`
--

CREATE TABLE `regional_offices` (
  `id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `address_1` mediumtext NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regional_offices`
--

INSERT INTO `regional_offices` (`id`, `energy_company_id`, `zone_id`, `regional_office_name`, `code`, `address_1`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(5, 6, 3, 'Rahul Laxmi nagar', 'undefined', 'Laxmi nagar', 1, 1, '2023-03-06 11:01:46', '2023-03-21 16:34:15'),
(15, 3, 6, 'Noidaa', '483501', 'h-16', 1, 1, '2023-03-22 10:24:34', '2023-03-22 10:29:03'),
(16, 10, 3, 'Noidaa', '483501', 'noida-51', 1, 1, '2023-03-22 10:29:34', '2023-03-22 10:29:42'),
(17, 11, 10, 'rahul ec 1 ro 1', 'rahec1', 'cvsdfvsdf', 1, 1, '2023-04-12 11:09:28', NULL),
(18, 13, 11, 'rahul ec 12 ro 1', 'rahec1', 'cxAZSca sdfe ergrt', 1, 1, '2023-04-13 15:05:33', '2023-04-13 15:05:49'),
(19, 2, 1, 'EZ RO 1', 'WZRO2', 'sdffg', 1, 1, '2023-04-17 13:16:45', NULL),
(20, 2, 1, 'EZ RO 2', 'SZRO1', 'dsdd', 1, 1, '2023-04-17 13:17:05', NULL),
(21, 2, 9, 'ZOne 25-1', 'SZRO2', 'asxas', 1, 1, '2023-04-17 13:17:22', NULL),
(22, 2, 9, 'ZONE 25-2', 'NZRO1', 'asxas', 1, 1, '2023-04-17 13:17:35', '2023-05-11 10:21:19'),
(23, 13, 13, 'Rahul RO 12', 'rahRo12', 'Noida Sector 6', 1, 1, '2023-05-11 10:22:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `regional_office_assigns`
--

CREATE TABLE `regional_office_assigns` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regional_office_assigns`
--

INSERT INTO `regional_office_assigns` (`id`, `zone_id`, `regional_office_id`, `energy_company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 68, 0, '2023-03-15 17:40:01', '2023-04-01 14:14:00'),
(5, 3, 4, 84, 0, '2023-03-16 13:31:12', '2023-03-17 10:05:56'),
(6, 3, 3, 82, 0, '2023-03-16 18:00:17', '2023-03-17 10:20:30'),
(7, 0, 15, 88, 0, '2023-03-17 10:21:12', '2023-04-12 10:53:43'),
(8, 0, 17, 89, 0, '2023-04-12 10:59:21', '2023-04-12 11:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `status`, `created_at`) VALUES
(1, 'Super Admin', 1, '2023-02-06 12:36:01'),
(2, 'Energy Company', 1, '2023-02-06 12:36:01'),
(3, 'Contractor', 1, '2023-02-06 17:04:58'),
(4, 'Dealer', 1, '2023-02-09 15:54:32'),
(5, 'Admin', 1, '2023-02-09 15:55:16'),
(6, 'User', 1, '2023-02-09 15:55:20'),
(7, 'Sub user', 1, '2023-02-09 15:55:27'),
(8, 'Vendor', 1, '2023-02-10 10:34:21'),
(11, 'Manager', 1, '2023-03-27 12:52:07');

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `date_of_hire` date NOT NULL,
  `salary` double NOT NULL DEFAULT 0,
  `salary_term` varchar(255) DEFAULT NULL,
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `user_id`, `user_type`, `date_of_hire`, `salary`, `salary_term`, `is_deleted`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 10, 7, '2023-04-19', 20000, 'Monthly', '0', 1, '2023-04-19 11:45:22', '2023-04-19 12:41:50'),
(2, 3, 6, '2023-04-19', 20000, 'Monthly', '0', 1, '2023-04-19 11:59:23', NULL),
(3, 1, 6, '2023-04-19', 30000, 'Monthly', '0', 1, '2023-04-19 13:07:30', NULL),
(4, 2, 6, '2023-04-19', 35000, 'Monthly', '0', 1, '2023-04-19 13:07:38', NULL),
(5, 6, 6, '2023-04-19', 15000, 'Monthly', '0', 1, '2023-04-19 13:07:49', NULL),
(6, 16, 6, '2023-04-19', 16000, 'Monthly', '0', 1, '2023-04-19 13:08:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `salary_disburses`
--

CREATE TABLE `salary_disburses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gross_salary` double NOT NULL,
  `month` date NOT NULL,
  `slip_number` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary_disburses`
--

INSERT INTO `salary_disburses` (`id`, `user_id`, `gross_salary`, `month`, `slip_number`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 10, -5000, '2023-04-20', '#001', 1, '2023-04-20 17:17:22', '2023-04-28 12:42:16'),
(8, 16, 0, '2023-04-26', '#002', 1, '2023-04-26 13:24:11', '2023-04-28 12:42:23'),
(9, 6, 0, '2023-04-26', '#003', 1, '2023-04-26 13:26:31', '2023-04-28 12:42:25'),
(10, 3, -39333.33, '2023-04-26', '#004', 1, '2023-04-26 13:28:18', '2023-04-28 12:42:32'),
(11, 6, 0, '2023-03-26', '#005', 1, '2023-04-26 13:29:07', '2023-04-28 12:42:35'),
(12, 2, 1475, '2023-04-26', '#006', 1, '2023-04-26 13:29:10', '2023-04-28 12:42:38'),
(13, 12, -4744.67, '2023-04-26', '#007', 1, '2023-04-26 13:39:23', '2023-04-28 12:42:42'),
(17, 10, -6900, '2023-03-29', '#008', 1, '2023-04-29 14:01:03', NULL),
(18, 10, -7000, '2023-05-08', '#0081', 1, '2023-05-08 14:54:38', NULL),
(19, 6, 0, '2023-05-11', '#0083', 1, '2023-05-11 11:13:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales_area`
--

CREATE TABLE `sales_area` (
  `id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `sales_area_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_area`
--

INSERT INTO `sales_area` (`id`, `energy_company_id`, `zone_id`, `regional_office_id`, `sales_area_name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 10, 4, 1, 'RO1 Sale area 1', 1, 1, '2023-03-06 11:02:46', NULL),
(2, 1, 4, 1, 'RO1 SALE AREA 2', 1, 1, '2023-03-06 11:03:01', '2023-03-06 05:33:06'),
(3, 9, 3, 3, 'RO1 SALE AREA 1', 1, 1, '2023-03-06 11:03:32', NULL),
(4, 3, 3, 4, 'RO1 SALE AREA 2', 1, 1, '2023-03-06 11:03:43', NULL),
(6, 10, 2, 6, 'RO1 SALE AREA 2', 1, 1, '2023-03-06 11:04:07', NULL),
(9, 10, 3, 5, 'sales area 1', 1, 1, '2023-03-22 11:01:01', '2023-03-22 05:33:14'),
(10, 3, 6, 15, 'ro1 sales area 2', 1, 1, '2023-03-22 11:02:37', '2023-03-22 05:33:21'),
(11, 3, 6, 15, 'ro2 sales area 1', 1, 1, '2023-03-22 11:03:02', NULL),
(12, 10, 3, 5, 'sales area 1', 1, 1, '2023-03-22 11:03:50', '2023-03-22 05:34:06'),
(13, 11, 10, 17, 'rahul ec1 sale area 1', 1, 1, '2023-04-12 11:16:57', NULL),
(14, 13, 11, 18, 'rahul ec12 sale area 1', 1, 1, '2023-04-13 15:06:10', '2023-05-11 04:51:31'),
(15, 13, 13, 23, 'Rahul Salae area 12', 1, 1, '2023-05-11 10:22:56', NULL);

-- --------------------------------------------------------

--Table structure for table 'item used'
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2023 at 09:12 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `items_used`
--

CREATE TABLE `items_used` (
  `item_id` int(100) NOT NULL,
  `complaint_id` varchar(100) NOT NULL,
  `quantity` int(100) NOT NULL,
  `item_price` int(100) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `total_price` int(100) NOT NULL,
  `outlet_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`outlet_id`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items_used`
--

INSERT INTO `items_used` (`item_id`, `complaint_id`, `quantity`, `item_price`, `created_by`, `created_at`, `updated_by`, `updated_at`, `total_price`, `outlet_id`) VALUES
(1, 'cms30007', 2, 20, '125', '2023-07-10 13:04:17', NULL, '0000-00-00 00:00:00', 40, '[3,4,5,6]'),
(3, 'cms30002', 4, 30, '125', '2023-07-10 13:13:56', 125, '2023-07-10 17:48:17', 120, '[1]'),
(4, 'cms30007', 2, 20, '125', '2023-07-10 13:15:54', NULL, NULL, 40, '[3,4,5,6]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items_used`
--
ALTER TABLE `items_used`
  ADD PRIMARY KEY (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `items_used`
--
ALTER TABLE `items_used`
  MODIFY `item_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




--
-- Table structure for table `sale_area_assigns`
--

CREATE TABLE `sale_area_assigns` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `regional_office_id` int(11) NOT NULL,
  `sale_area_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_area_assigns`
--

INSERT INTO `sale_area_assigns` (`id`, `zone_id`, `regional_office_id`, `sale_area_id`, `energy_company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 3, 68, 0, '2023-03-15 17:40:01', '2023-04-01 14:14:00'),
(5, 3, 4, 4, 84, 0, '2023-03-16 13:31:12', '2023-03-17 10:05:56'),
(6, 3, 3, 3, 82, 0, '2023-03-16 18:00:17', '2023-03-17 10:20:30'),
(7, 0, 0, 10, 88, 0, '2023-03-17 10:21:12', '2023-04-12 10:53:43'),
(8, 0, 0, 13, 89, 0, '2023-04-12 10:59:21', '2023-04-12 11:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `sale_companies`
--

CREATE TABLE `sale_companies` (
  `sale_company_id` int(11) NOT NULL,
  `sale_company_unique_id` varchar(50) NOT NULL,
  `name` varchar(244) NOT NULL,
  `email` varchar(244) DEFAULT NULL,
  `contact` varchar(120) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `primary_contact_person` varchar(244) NOT NULL,
  `primary_contact_mobile` varchar(15) NOT NULL,
  `primary_contact_email` varchar(120) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `company_website` varchar(100) DEFAULT NULL,
  `gst_treatment_type` varchar(120) NOT NULL,
  `business_legal_name` varchar(220) NOT NULL,
  `business_trade_name` varchar(244) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `place_of_supply` varchar(244) DEFAULT NULL,
  `billing_address` text NOT NULL,
  `shipping_address` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_companies`
--

INSERT INTO `sale_companies` (`sale_company_id`, `sale_company_unique_id`, `name`, `email`, `contact`, `mobile`, `address`, `primary_contact_person`, `primary_contact_mobile`, `primary_contact_email`, `designation`, `department`, `company_website`, `gst_treatment_type`, `business_legal_name`, `business_trade_name`, `pan_number`, `gst_number`, `place_of_supply`, `billing_address`, `shipping_address`, `created_by`, `created_at`, `updated_at`) VALUES
(1, '', 'Sartia Global', 'sartia@sartiaglobal.com', 'Sartia', '9313301020', 'C-14 Noida, Sector-6', 'Nikhil', '8546522854', 'nilhil@sartiaglobal.com', 'HR Head', 'IT', 'www.sartiaglobal.com', 'regular', 'Sartia Global', 'Thewingshield', 'TG754Dq2', 'sdfr5578erf', 'Noida', 'C-14, Noida, Sector-6', 'Laxmi Nagar', 1, '2023-02-08 18:27:53', NULL),
(2, '', 'Sartia Global Second', 'sartia@sartiaglobal.com', 'Sartia', '9313301020', 'C-14 Noida, Sector-6', 'Nikhil', '8546522854', 'nilhil@sartiaglobal.com', 'HR Head', 'IT', 'www.sartiaglobal.com', 'regular', 'Sartia Global', 'Thewingshield', 'TG754Dq2', 'sdfr5578erf', 'Noida', 'C-14, Noida, Sector-6', 'Laxmi Nagar', 1, '2023-02-08 18:28:37', '2023-02-09 11:30:42'),
(3, '', 'Sartia Global', 'sartia@sartiaglobal.com', 'Sartia', '9313301020', 'C-14 Noida, Sector-6', 'Nikhil', '8546522854', 'nilhil@sartiaglobal.com', 'HR Head', 'IT', 'www.sartiaglobal.com', 'regular', 'Sartia Global', 'Thewingshield', 'TG754Dq2', 'sdfr5578erf', 'Noida', 'C-14, Noida, Sector-6', 'Laxmi Nagar', 1, '2023-02-08 18:28:50', NULL);

-- --------------------------------------------------------

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2023 at 09:14 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` int(11) NOT NULL,
  `company_from` varchar(100) NOT NULL,
  `company_from_state` varchar(100) NOT NULL,
  `company_to` varchar(100) NOT NULL,
  `company_to_regional_office` varchar(100) NOT NULL,
  `quotations_date` date NOT NULL,
  `quotations_Number` varchar(100) NOT NULL,
  `regional_office_id` varchar(100) NOT NULL,
  `sales_area_id` varchar(100) NOT NULL,
  `outlet` varchar(100) NOT NULL,
  `po_number` varchar(100) NOT NULL,
  `complaint_type` varchar(100) NOT NULL,
  `remark` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotations`
--

INSERT INTO `quotations` (`id`, `company_from`, `company_from_state`, `company_to`, `company_to_regional_office`, `quotations_date`, `quotations_Number`, `regional_office_id`, `sales_area_id`, `outlet`, `po_number`, `complaint_type`, `remark`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '1', '11', '6', '77', '2023-09-23', '', '1', '1', '56', 'update dummy', 'update dummy', 'update dummy', 125, 125, '2023-07-18 14:19:24', '2023-07-18 17:01:41'),
(2, '2', '22', '9', '99', '2024-09-20', '2023/CMS/0001', '76', '5', '65', 'update dummy new', 'update dummy new', 'update dummy new', 125, 0, '2023-07-18 15:19:14', NULL),
(3, '3', '33', '10', '100', '2023-09-20', '2023/CMS/0002', '98', '7', '77', 'update dummy new 1', 'update dummy new 1', 'update dummy new 1', 125, 0, '2023-07-18 15:21:27', NULL),
(4, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0003', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:37:17', NULL),
(5, '5', '55', '23', '233', '2025-09-20', '20232024/CMS/0001', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:46:59', NULL),
(6, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0004', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:50:47', NULL),
(7, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0005', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:52:53', NULL),
(8, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0006', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:52:55', NULL),
(9, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0007', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:52:57', NULL),
(10, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0008', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:52:59', NULL),
(11, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0009', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:53:01', NULL),
(12, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0010', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:53:02', NULL),
(13, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0011', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:53:04', NULL),
(14, '5', '55', '23', '233', '2025-09-20', '2324/CMS/0012', '87', '76', '66', 'update dummy new 2', 'update dummy new 2', 'update dummy new 2', 125, 0, '2023-07-18 15:53:06', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `quotations`
--
ALTER TABLE `quotations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

---------------------------------------------------------------------------------------------------------------------------------
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2023 at 09:15 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `supplier_Name` text NOT NULL,
  `vender_Code` varchar(100) NOT NULL,
  `mobile_Number` int(100) NOT NULL,
  `second_Mobile_Number` int(100) NOT NULL,
  `contact_Person` varchar(100) NOT NULL,
  `bank_Name` varchar(100) NOT NULL,
  `account_Number` varchar(100) NOT NULL,
  `gst_Number` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `regional_Office` int(100) NOT NULL,
  `vender_Name` text NOT NULL,
  `third_Mobile_Number` int(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `marital_Status` varchar(100) NOT NULL,
  `bank_Branch` varchar(100) NOT NULL,
  `ifsc_Code` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--
-- Table structure for table `software_activation_requests`
--

CREATE TABLE `software_activation_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `status` enum('0','1','2') DEFAULT '0' COMMENT '0=Pending, 1=Approved, 2=Rejected',
  `requested_date` datetime NOT NULL DEFAULT current_timestamp(),
  `approved_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `software_activation_requests`
--

INSERT INTO `software_activation_requests` (`id`, `user_id`, `company_id`, `module_id`, `status`, `requested_date`, `approved_by`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 2, '1', '2023-02-14 12:04:54', 1, '2023-02-14 12:04:54', NULL),
(2, 2, 2, 8, '1', '2023-02-14 12:05:01', 1, '2023-02-14 12:05:01', NULL),
(3, 3, 3, 7, '0', '2023-03-28 12:27:51', 1, '2023-03-28 12:27:51', NULL),
(4, 5, 8, 3, '2', '2023-03-28 12:27:51', 1, '2023-03-28 12:27:51', NULL),
(7, 3, 3, 7, '0', '2023-03-28 12:27:51', 1, '2023-03-28 12:27:51', NULL);

-- --------------------------------------------------------
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2023 at 12:51 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `financial_year`
--

CREATE TABLE `financial_year` (
  `id` int(12) NOT NULL,
  `start_date` date NOT NULL,
  `year_name` varchar(12) NOT NULL,
  `end_date` date NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `financial_year`
--
ALTER TABLE `financial_year`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `financial_year`
--
ALTER TABLE `financial_year`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


---------------------------------------------------------------------------------
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 20, 2023 at 09:11 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(12) NOT NULL,
  `name` varchar(100) NOT NULL,
  `short_name` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(12) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--
-- Table structure for table `sub_modules`
--

CREATE TABLE `sub_modules` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `module_id` int(11) NOT NULL,
  `path` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_modules`
--

INSERT INTO `sub_modules` (`id`, `title`, `module_id`, `path`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'My Companies', 13, '/MyCompanies', 1, '2023-04-07 06:30:33', 1, NULL, NULL),
(2, 'Sale Companies', 13, '/SaleCompanies', 1, '2023-04-07 06:30:33', 1, NULL, NULL),
(3, 'Purchase Companies', 13, '/PurchaseCompanies', 1, '2023-04-07 06:32:20', 1, NULL, NULL),
(4, 'Energy Company', 3, '#', 1, '2023-04-07 06:33:54', 1, NULL, NULL),
(5, 'Energy Team', 3, '/EnergyTeamMasterdata', 1, '2023-04-07 06:33:54', 1, NULL, NULL),
(6, 'Dealers', 3, '/DealersMasterdata', 1, '2023-04-07 06:34:47', 1, NULL, NULL),
(7, 'Contractors', 3, '/ContractorsMasterdata', 1, '2023-04-07 06:35:25', 1, NULL, NULL),
(8, 'Complaints', 3, '#', 1, '2023-04-07 06:36:13', 1, NULL, NULL),
(9, 'Contractors', 8, '/contractors-contacts', 1, '2023-04-07 06:37:56', 1, NULL, NULL),
(10, 'Energy Companies', 8, '/energy-companies-contacts', 1, '2023-04-07 06:37:56', 1, NULL, NULL),
(11, 'Dealers', 8, '/dealers-contacts', 1, '2023-04-07 06:37:56', 1, NULL, NULL),
(12, 'Super Admin', 8, '/super-admin-contacts', 1, '2023-04-07 06:37:56', 1, NULL, NULL),
(13, 'Task Dashboard', 14, '/TaskDashboard', 1, '2023-04-07 06:40:50', 1, NULL, NULL),
(14, 'Task Category', 14, '/TaskCategory', 1, '2023-04-07 06:40:50', 1, NULL, NULL),
(15, 'All Task', 14, '/AllTask', 1, '2023-04-07 06:40:50', 1, NULL, NULL),
(16, 'All Survey', 15, '/AllSurvey', 1, '2023-04-07 06:42:47', 1, NULL, NULL),
(17, 'Item Master', 15, '/ItemMaster', 1, '2023-04-07 06:42:47', 1, NULL, NULL),
(18, 'Purpose Master', 15, '/PurposeMaster', 1, '2023-04-07 06:42:47', 1, NULL, NULL),
(19, 'Assigned Survey', 15, '/AssignedSurvey', 1, '2023-04-07 06:42:47', 1, NULL, NULL),
(20, 'Request Survey', 15, '/RequestSurvey', 1, '2023-04-07 06:42:47', 1, NULL, NULL),
(21, 'Response Survey', 15, '/ResponseSurvey', 1, '2023-04-07 06:42:47', 1, NULL, NULL),
(22, 'Teams', 18, '/Teams', 1, '2023-04-07 06:46:12', 1, NULL, NULL),
(23, 'Employees', 18, '/Employees', 1, '2023-04-07 06:46:12', 1, NULL, NULL),
(24, 'Attendance', 18, '/Attendance', 1, '2023-04-07 06:46:12', 1, NULL, NULL),
(25, 'Leaves Type', 18, '/LeavesType', 1, '2023-04-07 06:46:12', 1, NULL, NULL),
(26, 'Leaves', 18, '/Leaves', 1, '2023-04-07 06:46:12', 1, NULL, NULL),
(27, 'Payroll', 18, '#', 1, '2023-04-07 06:46:12', 1, NULL, NULL),
(28, 'Document Category', 20, '/DocumentCategory', 1, '2023-04-07 06:51:04', 1, NULL, NULL),
(29, 'Add Document', 20, '/AddDocument', 1, '2023-04-07 06:51:04', 1, NULL, NULL),
(30, 'Documents List', 20, '/DocumentsLists', 1, '2023-04-07 06:51:04', 1, NULL, NULL),
(31, 'All Company', 13, '/AllCompanies', 1, '2023-04-19 10:05:27', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `survey`
--

CREATE TABLE `survey` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `format` varchar(255) NOT NULL,
  `assign_to` int(11) DEFAULT NULL,
  `assign_to_sub_user` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `survey`
--

INSERT INTO `survey` (`id`, `title`, `description`, `format`, `assign_to`, `assign_to_sub_user`, `status`, `created_by`, `created_at`, `updated_at`, `approved_by`) VALUES
(1, 'asdfasdfasdf', 'asdfasdfasdf', 'Add General Field', NULL, NULL, 1, 1, '2023-05-11 19:38:54', NULL, NULL),
(2, 'Rahul Item table', 'Created for testing purpose', 'Add Item Table', NULL, NULL, 1, 1, '2023-05-12 16:16:53', '2023-05-12 17:00:11', NULL),
(8, 'SURVEY', 'description', 'Add Item Table', NULL, NULL, 1, 1, '2023-05-12 17:14:09', NULL, NULL),
(9, 'adad ', 'a', 'Add General Field', NULL, NULL, 1, 1, '2023-05-12 17:18:26', NULL, NULL),
(10, 'CreateSurvey', 'description', 'Add General Field', NULL, NULL, 1, 1, '2023-05-12 17:22:54', NULL, NULL);

-------------------------------------------------------------------------------------
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 21, 2023 at 09:44 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_electrical`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `financial_year` varchar(12) NOT NULL,
  `regional_office` int(11) NOT NULL,
  `po_number` int(11) NOT NULL,
  `callup_number` int(11) NOT NULL,
  `estimate_list` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



-- --------------------------------------------------------

--
-- Table structure for table `survey_questions`
--

CREATE TABLE `survey_questions` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`question`)),
  `created_by` int(11) NOT NULL,
  `assign_to` int(11) DEFAULT NULL,
  `assign_to_sub_user` int(11) DEFAULT NULL,
  `survey_response` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `survey_questions`
--

INSERT INTO `survey_questions` (`id`, `survey_id`, `question`, `created_by`, `assign_to`, `assign_to_sub_user`, `survey_response`, `created_at`, `updated_at`) VALUES
(1, 1, '{\"question\":{\"title\":\"asdf asdf\",\"type\":\"\",\"answers\":[\"\"]}}', 1, NULL, NULL, NULL, '2023-05-11 19:38:54', NULL),
(8, 7, '{\"item\":{\"label\":\"Dealers\",\"value\":5},\"purpose\":{\"label\":\"Purpose master for table\",\"value\":4},\"minqty\":101,\"userinput\":\"nothing just testing part\"}', 1, NULL, NULL, NULL, '2023-05-12 16:48:23', NULL),
(9, 7, '{\"item\":{\"label\":\"Rahul Testing items\",\"value\":9},\"purpose\":{\"label\":\"Purpose master for table\",\"value\":4},\"minqty\":102,\"userinput\":\"Nothimg just testing part 2\"}', 1, NULL, NULL, NULL, '2023-05-12 16:48:23', NULL),
(10, 7, '{\"item\":{\"label\":\"fan\",\"value\":6},\"purpose\":{\"label\":\"Rahul testing purpose\",\"value\":7},\"minqty\":103,\"userinput\":\"NOTHIMG JUST TESTING PART 3\"}', 1, NULL, NULL, NULL, '2023-05-12 16:48:23', NULL),
(11, 2, '{\"item\":{\"label\":\"Super admin\",\"value\":8},\"purpose\":{\"label\":\"Rahul testing purpose\",\"value\":7},\"minqty\":5,\"userinput\":\"edsdsdc\"}', 1, NULL, NULL, NULL, '2023-05-12 17:00:11', NULL),
(12, 8, '{\"item\":{\"label\":\"Rahul Testing items\",\"value\":9},\"purpose\":{\"label\":\"Purpose master for table\",\"value\":4},\"minqty\":1,\"userinput\":\"test\"}', 1, NULL, NULL, NULL, '2023-05-12 17:14:09', NULL),
(13, 9, '{\"question\":{\"title\":\"\",\"type\":\"\",\"answers\":[\"\"]}}', 1, NULL, NULL, NULL, '2023-05-12 17:18:26', NULL),
(14, 10, '{\"question\":{\"title\":\"QUESTION \",\"type\":{\"value\":\"shorttext\",\"label\":\"Short Text Area\"},\"answers\":[\"\"]}}', 1, NULL, NULL, NULL, '2023-05-12 17:22:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `survey_question_responses`
--

CREATE TABLE `survey_question_responses` (
  `id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`response`)),
  `response_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `survey_question_responses`
--

INSERT INTO `survey_question_responses` (`id`, `survey_id`, `question_id`, `response`, `response_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '{\"response\":\"rahul is testing survey question response\"}', 1, '2023-05-09 12:16:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `assign_to` int(11) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `previous_status` varchar(255) DEFAULT NULL,
  `status_changed_at` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `start_date`, `end_date`, `assign_to`, `project_name`, `category_id`, `status`, `previous_status`, `status_changed_at`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 'Task second', '2023-02-20', '2023-02-24', 5, 'Task Project', 3, 'completed', 'completed', NULL, 1, 1, '2023-02-28 12:28:31', '2023-04-12 16:44:28'),
(3, 'Task third', '2023-02-02', '2023-04-28', 5, 'Task Project', 3, 'assign', NULL, NULL, 1, NULL, '2023-02-28 12:29:59', NULL),
(6, 'done123', '2023-03-29', '2023-03-31', 1, 'dankez', 9, 'assign', NULL, NULL, 1, NULL, '2023-03-29 15:08:14', NULL),
(7, 'new task', '2023-03-29', '2023-03-31', 1, 'dankez2', 9, 'completed', NULL, NULL, 1, 1, '2023-03-29 15:08:38', '2023-03-29 17:55:03'),
(9, 'new task', '2023-03-29', '2023-03-31', 118, 'dankez2', 9, 'in progress', 'completed', '2023-05-09 13:28:46', 1, 1, '2023-03-29 15:08:38', '2023-05-09 13:28:46'),
(10, 'hrllo', '2023-04-20', '2023-04-22', 123, 'sdf', 1, 'assign', NULL, NULL, 1, NULL, '2023-04-19 16:32:02', NULL),
(12, 'do the changes', '2023-05-11', '2023-05-18', 118, 'CMS', 9, 'assign', NULL, NULL, 1, 1, '2023-05-09 13:06:53', '2023-05-09 13:14:54'),
(13, 'Checking..', '2023-05-09', '2023-05-11', 122, 'CMS', 14, 'assign', NULL, NULL, 1, NULL, '2023-05-09 13:15:55', NULL),
(14, 'Rahul testing task', '2023-05-11', '2023-05-14', 122, 'CMS', 14, 'assign', NULL, NULL, 1, 1, '2023-05-11 10:45:09', '2023-05-12 14:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `task_categories`
--

CREATE TABLE `task_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` smallint(11) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_categories`
--

INSERT INTO `task_categories` (`id`, `name`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'Task Category Second', 1, 1, '2023-03-01 12:30:37', '2023-03-01 13:05:01'),
(3, 'Task Category Thirdg', 1, 1, '2023-03-01 12:30:43', '2023-03-30 14:43:52'),
(9, 'Super admin tasks', 1, 1, '2023-03-29 12:49:47', '2023-04-13 15:32:27'),
(14, 'Rahul Kumar Task created', 1, 1, '2023-05-09 12:55:11', '2023-05-11 10:44:09');

-- --------------------------------------------------------

--
-- Table structure for table `task_comments`
--

CREATE TABLE `task_comments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `remark` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `status` varchar(120) NOT NULL,
  `previous_status` varchar(255) DEFAULT NULL,
  `status_changed_at` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_comments`
--

INSERT INTO `task_comments` (`id`, `task_id`, `user_id`, `remark`, `attachment`, `status`, `previous_status`, `status_changed_at`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 12, 'This is updated task to check status', NULL, 'Done', 'Done', '2023-03-30 10:36:55', 1, '2023-03-01 14:00:48', '2023-03-30 10:36:55'),
(2, 1, 12, 'This is test for task 2', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'to do', 'to do', '2023-03-30 13:22:09', 1, '2023-03-01 15:48:35', '2023-03-30 13:22:09'),
(3, 1, 12, 'This is test for task 2', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'to do done', 'to do done', '2023-03-30 13:22:12', 1, '2023-03-29 15:48:49', '2023-03-30 13:22:12'),
(4, 1, 12, 'DONE...!', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'in progress', 'undefined', '2023-03-30 13:22:23', 1, '2023-03-29 16:13:36', '2023-03-30 13:22:23'),
(5, 1, 12, 'COMPLETEd work...!', NULL, '', NULL, NULL, 1, '2023-03-29 16:14:13', NULL),
(6, 1, 12, 'DONE...! 2', NULL, '', NULL, NULL, 1, '2023-03-29 16:14:56', NULL),
(7, 1, 12, 'done', NULL, '', NULL, NULL, 1, '2023-03-29 16:27:22', NULL),
(8, 0, 0, 'undefined', NULL, 'undefined', NULL, NULL, 1, '2023-03-29 16:31:46', NULL),
(9, 1, 12, 'nyaa task comment hai', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'assign', 'undefined', '2023-03-30 13:21:59', 1, '2023-03-29 16:44:44', '2023-03-30 13:21:59'),
(10, 1, 12, 'nyaa task comment hai', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'in progress', 'in progress', '2023-03-30 13:21:45', 1, '2023-03-30 10:45:14', '2023-03-30 13:21:45'),
(11, 1, 12, 'nyaa task comment hai', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'assign', 'assign', '2023-03-30 13:21:52', 1, '2023-03-30 10:45:39', '2023-03-30 13:21:52'),
(12, 1, 12, 'adada', NULL, 'completed', NULL, NULL, 1, '2023-03-30 11:11:32', NULL),
(13, 1, 12, 'test', NULL, 'completed', NULL, NULL, 1, '2023-03-30 11:11:47', NULL),
(14, 1, 12, 'This is updated task to check status 1', NULL, 'in progress', NULL, NULL, 1, '2023-03-30 11:15:38', NULL),
(15, 1, 12, 'This is updated task to check status s', NULL, 'assign', NULL, NULL, 1, '2023-03-30 11:15:50', NULL),
(16, 1, 12, 'This is updated task to check status sj', NULL, 'Done', NULL, NULL, 1, '2023-03-30 11:17:56', NULL),
(17, 1, 12, 'This is updated task to check status', NULL, 'in progress', NULL, NULL, 1, '2023-03-30 11:18:23', NULL),
(18, 1, 12, 'aad', NULL, 'in progress', NULL, NULL, 1, '2023-03-30 11:24:01', NULL),
(19, 1, 12, 'new comment', NULL, 'assign', NULL, NULL, 1, '2023-03-30 11:24:18', NULL),
(20, 1, 12, 'test', NULL, 'assign', NULL, NULL, 1, '2023-03-30 12:20:06', NULL),
(21, 1, 12, 'new', NULL, 'undefined', NULL, NULL, 1, '2023-03-30 12:27:31', NULL),
(22, 1, 12, 'This is updated task to check status s', NULL, 'Done', NULL, NULL, 1, '2023-03-30 12:28:20', NULL),
(23, 1, 12, 'hy', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'undefined', 'undefined', '2023-03-30 13:20:32', 1, '2023-03-30 12:28:38', '2023-03-30 13:20:32'),
(24, 7, 1, 'This is not going on time', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'To do', 'To do', '2023-03-30 14:45:05', 1, '2023-03-30 12:35:29', '2023-03-30 14:45:05'),
(25, 0, 12, 'This is updated task to check statuss', '', 'Done', NULL, NULL, 1, '2023-03-30 12:37:01', NULL),
(26, 0, 12, 'hyggg', '', 'in progress', NULL, NULL, 1, '2023-03-30 12:37:16', NULL),
(27, 0, 12, 'hy fffff', '', 'assign', NULL, NULL, 1, '2023-03-30 12:37:55', NULL),
(28, 23, 12, 'hysss', '', 'assign', NULL, NULL, 1, '2023-03-30 12:39:47', NULL),
(29, 23, 12, 'hyss', '', 'assign', NULL, NULL, 1, '2023-03-30 12:41:20', NULL),
(30, 0, 0, 'qsqs', '', 'in progress', NULL, NULL, 1, '2023-03-30 12:41:37', NULL),
(31, 0, 0, 'asas', '', 'in progress', NULL, NULL, 1, '2023-03-30 12:42:00', NULL),
(32, 1, 1, 'tests', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'in progress', 'assign', '2023-03-30 13:20:51', 1, '2023-03-30 12:52:50', '2023-03-30 13:20:51'),
(33, 1, 1, 'all test', '', 'completed', NULL, NULL, 1, '2023-03-30 12:53:13', NULL),
(34, 1, 1, 't', '', 'assign', NULL, NULL, 1, '2023-03-30 12:54:15', NULL),
(35, 1, 1, 'h', '', 'assign', NULL, NULL, 1, '2023-03-30 12:55:48', NULL),
(36, 1, 1, 'This is updated task to check status', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'Done', 'assign', '2023-03-30 13:03:31', 1, '2023-03-30 12:57:19', '2023-03-30 13:03:31'),
(37, 1, 1, 'hy', '', 'undefined', NULL, NULL, 1, '2023-03-30 13:02:55', NULL),
(38, 1, 1, 'sss', '', 'undefined', NULL, NULL, 1, '2023-03-30 13:03:03', NULL),
(39, 1, 1, 'all testss', '', 'completed', NULL, NULL, 1, '2023-03-30 13:03:14', NULL),
(40, 1, 1, 's', '', 'undefined', NULL, NULL, 1, '2023-03-30 13:04:29', NULL),
(41, 1, 1, 'hs', '', 'assign', NULL, NULL, 1, '2023-03-30 13:04:33', NULL),
(42, 1, 1, 'hss', '', 'assign', NULL, NULL, 1, '2023-03-30 13:05:34', NULL),
(43, 1, 1, 'tassas', '', 'assign', NULL, NULL, 1, '2023-03-30 13:08:15', NULL),
(44, 1, 1, 'qaq', '', 'undefined', NULL, NULL, 1, '2023-03-30 13:08:21', NULL),
(45, 1, 1, 'test altaf', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'completed', 'completed', '2023-03-30 13:09:40', 1, '2023-03-30 13:08:26', '2023-03-30 13:09:40'),
(46, 1, 1, 'update', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'in progress', 'undefined', '2023-03-30 13:16:40', 1, '2023-03-30 13:13:29', '2023-03-30 13:16:40'),
(47, 1, 1, 's', '', 'in progress', NULL, NULL, 1, '2023-03-30 13:20:41', NULL),
(48, 1, 1, 'done', '', 'in progress', NULL, NULL, 1, '2023-03-30 13:21:30', NULL),
(49, 6, 1, 'first comment', '', 'in progress', NULL, NULL, 1, '2023-03-30 13:23:10', NULL),
(50, 6, 1, 'ss', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'in progress', 'in progress', '2023-03-30 13:26:35', 1, '2023-03-30 13:24:38', '2023-03-30 13:26:35'),
(51, 6, 1, 'test', '', 'completed', NULL, NULL, 1, '2023-03-30 13:26:21', NULL),
(52, 6, 1, 'for test1', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'completed', 'completed', '2023-03-30 13:29:02', 1, '2023-03-30 13:28:46', '2023-03-30 13:29:02'),
(53, 1, 1, 'hy', '/task_comment_images/1680167705813istockphoto-1163423519-612x612.jpg', 'in progress', 'in progress', '2023-03-30 14:05:36', 1, '2023-03-30 13:58:49', '2023-03-30 14:05:36'),
(54, 1, 1, 'Rahul update with attachment', '', 'To do', 'To do', '2023-03-30 14:42:12', 1, '2023-03-30 14:07:00', '2023-03-30 14:42:12'),
(56, 9, 1, 'testing..asdad', '/task_comment_images/16813801993271635238757976.jpg', 'in progress', 'in progress', '2023-04-12 16:10:37', 1, '2023-04-12 13:35:54', '2023-04-13 15:33:19'),
(57, 1, 1, 'testing 2....updated', '/task_comment_images/1681288657840logo.png', 'in progress', 'in progress', '2023-04-12 14:07:37', 1, '2023-04-12 14:06:45', '2023-04-12 14:07:37'),
(58, 9, 1, 'ewertre', '/task_comment_images/16836186035834k-2.jfif', 'in progress', NULL, NULL, 1, '2023-04-12 17:44:51', '2023-05-09 13:20:03'),
(59, 9, 1, 'sasdfsd', '', '', NULL, NULL, 1, '2023-04-12 17:47:32', NULL),
(60, 12, 1, 'check for more error', '/task_comment_images/1683618447686Rashmi_yadav_1683371364.pdf', '', NULL, NULL, 1, '2023-05-09 13:17:27', NULL),
(61, 12, 1, 'checking again...', '/task_comment_images/1683618644780logo.png', '', NULL, NULL, 1, '2023-05-09 13:20:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `team_name` varchar(255) NOT NULL,
  `team_short_description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `child_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `user_id`, `team_name`, `team_short_description`, `parent_id`, `child_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 105, 'Super admin team 1', 'Super admin first team to see how it`s works', 1, 105, 1, '2023-03-16 11:06:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `term_conditions`
--

CREATE TABLE `term_conditions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `status` int(4) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `term_conditions`
--

INSERT INTO `term_conditions` (`id`, `title`, `content`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'Terms And Conditons ', '<p>adad <strong>sas </strong><strong style=\"color: rgb(0, 138, 0);\"><em>scvafv </em></strong><strong><em>ghjfgjsdgksdgn</em></strong></p><p><strong><em>sdgmnsdkg</em></strong></p><p><a href=\"http://192.168.1.17:3000/CodeTesting\" rel=\"noopener noreferrer\" target=\"_blank\">cms</a></p><p>test - lorem ipsum<u>.</u><u style=\"color: rgb(230, 0, 0);\">.</u><u>.</u></p><p><u>Rahul</u></p>', 0, 1, 1, '2023-03-28 11:34:27', '2023-04-13 15:35:14'),
(2, 'Terms And Conditons ', '<p><span class=\"ql-font-lucida ql-size-large\" style=\"color: rgb(230, 0, 0);\">Terms of Service</span></p><p><strong>Introduction</strong></p><p>CMS Electricals, a product of CMS Electricals, provides online services to its users and customers (hereinafter referred to as “You” or “Your”) subject to the following terms and conditions (the “Terms of Service”). By using our website and services, you agree to be bound by these Terms of Service, our Privacy Policy, and any other policies and guidelines we may publish from time to time. If you do not agree to these Terms of Service, you should not use our services.</p><p><br></p><p>Use of Services</p><p>CMS Electricals grants you a limited, non-exclusive, non-transferable, and revocable license to use our services, subject to the terms and conditions of these Terms of Service. You may not use our services for any illegal or unauthorized purpose, or in a manner that could harm CMS Electricals or its users. You are responsible for all of your activity in connection with our services.</p><p><br></p><p><strong style=\"color: rgb(68, 68, 68);\"><em>User Content</em></strong></p><p>You retain all rights to your user content. By submitting user content to CMS Electricals, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, copy, modify, create derivative works based on, distribute, publicly display, and otherwise exploit your user content in connection with our services.</p><p><br></p><p>Proprietary Rights</p><p>CMS Electricals and its licensors retain all right, title, and interest in and to our services, including all intellectual property rights. Our services and the content contained therein are protected by copyright, trademark, and other proprietary rights. You may not use our services or the content contained therein in any manner that infringes our rights or the rights of our licensors.</p><p><br></p><p><strong><em>Disclaimer of Warranties</em></strong></p><p>Our services are provided “as is” and “as available” without warranty of any kind, either express or implied, including without limitation any warranty for information, services, uninterrupted access, or products provided through or in connection with our services, including without limitation the software licensed to you and the results obtained through our services. Specifically, we disclaim any and all warranties, including without limitation: 1) any warranties concerning the availability, accuracy, usefulness, or content of information, and 2) any warranties of title, warranty of non-infringement, warranties of merchantability or fitness for a particular purpose.</p><p><br></p><p><strong><em>Limitation of Liability</em></strong></p><p>Under no circumstances, including, but not limited to, negligence, shall CMS Electricals be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of or inability to use our services, including without limitation use of or reliance on information available on our services, or that results from mistakes, omissions, interruptions, deletion of files, errors, defects, viruses, delays in operation or transmission, or any failure of performance.</p><p><br></p><p><strong><em>Indemnification</em></strong></p><p>You agree to indemnify, defend, and hold harmless CMS Electricals, its officers, directors, employees, agents, licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys’ fees, resulting from any violation of these Terms of Service or any activity related to your use of our services (including negligent or wrongful conduct).</p><p><br></p><p><strong><em>Changes to Terms of Service</em></strong></p><p>CMS Electricals may revise these Terms of Service from time to time. The most current version of the Terms of Service will be posted on our website and will supersede all previous versions. Your continued use of our services after any changes have been made will constitute your acceptance of the updated Terms of Service.</p><p><br></p><p><strong><em>Governing Laws</em></strong></p><p>The Terms of Service and your use of the CMS Electricals services shall be governed and interpreted in accordance with the laws of India. Any dispute arising out of or in connection with these Terms of Service, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Mumbai, India. The arbitration shall be conducted in the English language. The award of the arbitration shall be final and binding on the parties.</p><p><br></p><p><strong><em>Entire Agreement</em></strong></p><p>These Terms of Service constitute the entire agreement between you and CMS Electricals, superseding all prior or contemporaneous communications and proposals, whether electronic, oral, or written, between you and CMS Electricals with respect to the CMS Electricals services. A printed version of these Terms of Service and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to these Terms of Service to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form.</p><p><br></p><p><strong><em>Waiver of Rights</em></strong></p><p>The failure of CMS Electricals to enforce any right or provision in these Terms of Service shall not constitute a waiver of such right or provision unless acknowledged and agreed to by us in writing.</p><p><br></p><p><strong><em>Severability</em></strong></p><p>If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p><p><br></p><p><strong><em>Assignment</em></strong></p><p>These Terms of Service, and any rights and licenses granted hereunder, may not be transferred or assigned by you without the prior written consent of CMS Electricals, but may be assigned by CMS Electricals without restriction.</p><p><br></p><p><strong><em><u>Contact Us</u></em></strong></p><p>If you have any <span style=\"color: rgb(250, 204, 204);\">questions </span>or concerns regarding these Terms of Service, please contact us at +91 1234567890</p>', 0, 1, 1, '2023-04-01 15:26:11', '2023-04-12 16:06:54'),
(9, 'test quill', 'hello guyzwdv grv\n', 0, 1, NULL, '2023-04-07 11:18:27', NULL),
(10, 'add new', '<p>test...</p>', 0, 1, 1, '2023-04-07 12:35:03', '2023-04-07 13:48:33'),
(13, 'Rahul Checking for testing', '<p><strong class=\"ql-size-large\">Hello Users</strong></p><p>this is to inform you that we have changed in our policy, please read new terms and conditions. I hope you guys are aware of that now.</p><p><br></p><p>thanks</p><p>HR team</p><p>Cms electricals</p>', 0, 1, 1, '2023-05-09 13:26:37', '2023-05-09 13:27:21'),
(14, 'Rahul testing 12 ', '<p><strong>Write something awesome</strong></p>', 0, 1, 1, '2023-05-11 10:48:04', '2023-05-11 10:48:19');

-- --------------------------------------------------------

--
-- Table structure for table `trackings`
--

CREATE TABLE `trackings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `remarks` text NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `color_code` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trackings`
--

INSERT INTO `trackings` (`id`, `user_id`, `remarks`, `latitude`, `longitude`, `timestamp`, `color_code`, `created_at`) VALUES
(1, 2, 'LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING AND TYPESETTING INDUSTRY', '28.591150', '77.318970', 1682410497, '#7F3030', '2023-04-25 13:43:37'),
(2, 12, 'LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING AND TYPESETTING INDUSTRY.', '28.591150', '77.318970', 1682410497, '#707CC4', '2023-04-25 13:45:11'),
(3, 10, 'LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING AND TYPESETTING INDUSTRY.', '28.591150', '77.318970', 1682410497, '#55B678', '2023-04-25 13:45:11'),
(4, 5, 'LOREM IPSUM IS SIMPLY DUMMY TEXT OF THE PRINTING AND TYPESETTING INDUSTRY.', '28.591150', '77.318970', 1682410497, '#010B13', '2023-04-25 13:45:11');

-- --------------------------------------------------------

--
-- Table structure for table `tutorials`
--

CREATE TABLE `tutorials` (
  `id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `application_type` varchar(56) NOT NULL,
  `module_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tutorial_format` varchar(50) NOT NULL,
  `attachment` text NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tutorials`
--

INSERT INTO `tutorials` (`id`, `user_type`, `application_type`, `module_type`, `tutorial_format`, `attachment`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 1, 'Web', 'Dashboard', 'docs', '/tutorials/1677057699222HRMS Scope (New).docx', 'This is for test tutorial upload', 1, '2023-02-22 14:51:39', NULL),
(5, 1, 'Web', 'Dashboard', 'docs', '/tutorials/1679645643951CMS Electricals Private Limited.pdf', 'This is for test tutorial upload', 1, '2023-03-24 13:44:03', NULL),
(6, 3, 'mobile', 'billings', 'docs', '/tutorials/1679646064006CMS Electricals Private Limited.pdf', 'THIS IS FOR TEST TUTORIAL UPLOAD', 1, '2023-03-24 13:51:04', NULL),
(11, 4, 'web', 'dashboard', 'video', '/tutorials/1679647936727Daily Games.mp4', 'THIS IS FOR TEST TUTORIAL UPLOAD ../', 1, '2023-03-24 14:22:16', NULL),
(12, 6, 'mobile', 'Tutorials', 'video', '/tutorials/1683879385013pexels-teona-swift-6911316-2160x3840-24fps.mp4', 'upload...addasssada ', 1, '2023-03-27 13:23:55', '2023-05-12 13:46:25'),
(15, 7, 'mobile', 'Contacts', 'pdf', '/tutorials/1679914428129CMS Electricals Private Limited.pdf', 'done with id..', 1, '2023-03-27 16:23:48', '2023-05-09 17:24:17'),
(19, 7, 'web', 'Companies', 'text', '/tutorials/1683635093205agreement_template.txt', 'text testing', 1, '2023-05-09 17:54:53', '2023-05-09 18:16:15'),
(20, 8, 'mobile', 'Companies', 'audio', '/tutorials/1683636425452Nazar Lag Jayegi Bholaa 320 Kbps.mp3', 'Audio upload test', 1, '2023-05-09 18:17:05', NULL),
(21, 8, 'mobile', 'Master Data', 'audio', '/tutorials/1683636457715Nazar Lag Jayegi Bholaa 320 Kbps.mp3', 'agian audio upload check', 1, '2023-05-09 18:17:37', NULL),
(22, 8, 'web', 'Companies', 'pdf', '/tutorials/1683786141003Rashmi_yadav_1683371364.pdf', 'THis is test generated document upload', 1, '2023-05-11 11:52:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `base_64_password` varchar(255) DEFAULT NULL,
  `mobile` varchar(16) NOT NULL,
  `joining_date` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `graduation` varchar(255) DEFAULT NULL,
  `post_graduation` varchar(255) DEFAULT NULL,
  `doctorate` varchar(255) NOT NULL,
  `skills` text NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `employment_status` varchar(255) DEFAULT NULL,
  `pan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `pan_card_image` varchar(255) DEFAULT NULL,
  `aadhar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `aadhar_card_front_image` varchar(255) DEFAULT NULL,
  `aadhar_card_back_image` varchar(255) DEFAULT NULL,
  `epf_no` varchar(255) DEFAULT NULL,
  `esi_no` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `bank_documents` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `family_info` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` int(3) NOT NULL DEFAULT 0,
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0',
  `user_type` varchar(50) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `regional_id` int(11) DEFAULT NULL,
  `zone_id` int(11) DEFAULT NULL,
  `sale_area_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `base_64_password`, `mobile`, `joining_date`, `image`, `address`, `graduation`, `post_graduation`, `doctorate`, `skills`, `team_id`, `employment_status`, `pan`, `pan_card_image`, `aadhar`, `aadhar_card_front_image`, `aadhar_card_back_image`, `epf_no`, `esi_no`, `bank_name`, `ifsc_code`, `account_number`, `bank_documents`, `department`, `family_info`, `status`, `is_deleted`, `user_type`, `role_id`, `admin_id`, `user_id`, `regional_id`, `zone_id`, `sale_area_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Dealer 3 user', 'Dealer 3 user', 'dealer3user@gmail.com', '$2b$10$s9uMEyXup3VwA/fqgWd62OLgeRp8cVhRPLEH8AHQusOTKiHEDz/Lu', 'MTIzNDU2Nzg=', '9313301020', '2010-05-21', '/user_images/16788611546404k-2.jfif', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-06 14:43:22', '2023-03-15 11:49:24'),
(2, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$zGs.wSaIYNwQ27dvboSwluizgd0Rjh6.dF9PD6onfe3wTm2ZkmNeG', NULL, 'undefined', 'undefined', '/user_images/1678362324518download.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 14:37:02', NULL),
(3, 'Dealer 3 users', 'Altaf', 'dealer3user@gmail.com', '$2b$10$wtYNXt5cP6Jek.61ffhBQ.jdO/P7c/4lkJmBkoc9rHnXVG/RbIrFG', NULL, '', '', '/user_images/1678362324518download.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 14:54:13', '2023-03-10 14:25:22'),
(4, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$R6i24LqUDCfP5BKdXPeF9eMYnbmZawgvuUT7hZEgew53JW.dSzHSW', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:02:55', NULL),
(5, 'Altaf Ahmad', 'Altaf Ahmad', 'superadmin1@gmail.com', '$2b$10$sBZQglaxLY9/xuoUZPmGt.LGumc1752n6DJw/bP7KiZgOtSqB3nIu', NULL, 'undefined', '2022-04-12', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:05:38', NULL),
(6, 'Dealer 5', 'Dealer 5', 'dealer5@gmail.com', '$2b$10$Qc4vVc0ymphN4v/EJSQZ5eQ6Liw96nRwwts2yHRpx0Pp6ULOL9XjS', NULL, 'undefined', '2022-04-12', '/user_images/1678362324518download.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 27, NULL, NULL, NULL, NULL, 1, '2023-03-07 16:08:47', NULL),
(7, 'Super admin', 'Super admin', 'superadmin@gmail.com', '$2b$10$xpAPowaRqFrQIsVWMyvNK.chYlrf8NI0PfX0iY43fY7qqNTH5154S', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:13:46', NULL),
(8, 'Altaf Manager 1', 'Altaf Manager 1', 'altafmanager1@gmail.com', '$2b$10$9UpSp9YQNTp7KrS7OEhWcujBHlXfu0PqDvuvmJk2YL8/dD.NlGA.a', NULL, '985265441', '2023-01-23', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '7', NULL, 28, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:15:19', NULL),
(9, 'Altaf Managar 2', 'Altaf Managar 2', 'altafmanagr2@gmail.com', '$2b$10$FUNr6SpmUBXoVeJ8YTmnUusH66vFY74PZgf/bxro2YHkZaNIh7N4G', NULL, '5245632110', '2022-05-14', '/user_images/16788611546404k-2.jfif', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '7', NULL, 28, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:26:34', NULL),
(10, 'Super admin User', 'Super admin', 'superadmin1@gmail.com', '$2b$10$FHKjBIzh1zAN0GwpmxXR4e.0d4BseaH4zwmKIDJb7iFdfPSKYmJzO', NULL, '9313301020', '2023-02-14', '/user_images/16788611546404k-2.jfif', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '7', NULL, 29, NULL, NULL, NULL, NULL, 1, '2023-03-09 10:27:21', NULL),
(11, 'Manager 3', 'Manager 3', 'manager3@gmail.com', '$2b$10$2v1Ve9ivPpFX8ZHegQq4duA0C5RXZN8DvkgEdwwLGCIq/MaUnalmy', NULL, '7854523210', '2023-02-25', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '11', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:04:02', NULL),
(12, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$qOPhU/XQI7DE7L/0TWd81.xb9.JjCcEX4Ip7eKafxwJHiwBFbRN3K', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:05:37', NULL),
(13, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$5WWMw0gkGZexFgcrnoccIeSexZgvkexGQ6JppUj6.XihNaBUmCQnu', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:09:53', NULL),
(14, 'Altaf', 'Altaf', 'superadmin@gmail.com', '$2b$10$CJIJuC1uU3Z5kkeLqcfs9eNOtMXpkKzW6vc6GOJfnii1hfMuCvBVm', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:11:43', NULL),
(15, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$IKs/Emnt3tj2dgkjq20sn.lmYBVS8gmlCJlapUAl6bOS8aJtqdqYC', NULL, 'undefined', '2023-03-24', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 12:14:14', NULL),
(16, 'imran', 'imran', 'superadmin1@gmail.com', '$2b$10$uxFQd8v0HtWKQ8eL4qEoa.VMYCq60KE0uQV6ZoICCqSTD4P8wtzwC', NULL, 'undefined', '2023-03-14', '/user_images/1678362324518download.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:56:54', NULL),
(17, 'imran', 'imran', 'imranadmin1@gmail.com', '$2b$10$smNy2y3GxY.VsuClY63lx.yRC2hHZgedqFhEe9TNt.bibyV0WPJje', NULL, 'undefined', '2023-03-15', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 13:59:03', NULL),
(18, 'Dealer 3 user imran', 'Dealer 3 user imran', 'dealeruser3@gmail.co', '$2b$10$cy6/7C2piAmxJezNXWXyluf.GdVUtiOKRD030Z5v2XoorSZsP/Bvq', NULL, '9313301020', '21-02-2023', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:05:10', NULL),
(19, 'imran ahmad', 'imran ahmad', 'superadmin1@gmail.com', '$2b$10$5GFSIv.vZMtbbnTD7VPFReGVSce0E85KV0fI4YAN28cMP35ftg71e', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:06:52', NULL),
(20, 'imran ahmad', 'imran ahmad', 'superadmin@gmail.com', '$2b$10$r5Ltw01wK2cKtj.9KSkMQOspS9prRIp1KbNKoTcYjX7Ujynn/qV5K', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:08:28', NULL),
(21, 'imran ahmad', 'imran ahmad', 'superadmin1@gmail.com', '$2b$10$tXgWHIbZVe20aFjV1MrKmeOqwbqCRocpZ4kW8yka0UObZhQtVi3F2', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:09:38', NULL),
(22, 'imran ahmad user1', 'imran ahmad user1', 'superadmin1@gmail.com', '$2b$10$xslEZ7353TBPmVsnrpdWC.15UqMuQWKQ0T/rqO6WWB.HzTdNBJn2q', NULL, '1234567895', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:23:26', NULL),
(23, 'Altaf admin', 'Altaf admin', 'superadmin@gmail.com', '$2b$10$p.J8iFN9n/UkEt7qTjsYhOWzy3EdxSuEoF2qlTUi3oRfIPcGkfPpC', NULL, '123658', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:30:13', NULL),
(24, 'Dealer 4567s', 'Rahul Kumar', 'superadmin1@gmail.com', '$2b$10$1pKWp68pKZt0RjSRyLM4YOl9tqirSpTv/5i4R7Eq.QFXNYo6npaN.', NULL, '989898989', '2023-03-13', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, '0', '6', NULL, 14, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:40:13', '2023-03-15 10:45:31'),
(25, 'Dealer 4567', 's', 'dealer4@gmail.com', '$2b$10$q3mvrkd.Eqa29I6Sc9YfTeONDY8KCYj9xv9mzcd/PYoZLB0GKU10m', NULL, '9313301020', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 14, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:43:54', '2023-03-10 11:16:12'),
(26, 'abcdf', 'abcd', 'delear1@gmail.com', '$2b$10$8pGF5d3noeOiIKIF8PHE2edErj6BDYfk5IUlq5ZMNimb8qMFipkwy', NULL, '9313301020', '2023-03-09', '/user_images/1678362324518download.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-09 14:46:00', '2023-03-09 17:15:24'),
(27, 'Altaf456', 'Altaf456', 'superadmin1@gmail.com', '$2b$10$tvFUl9eBvMqWtUnZOurWdeJfD1b.EHl8Zo16Esdzj9WAPa.8DM6V6', NULL, '', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:16:31', NULL),
(28, 'ravi', 'ravi', 'superadmin@gmail.com', '$2b$10$t5rv3b9DldU6ZXG.jkvJOeKtaOiscDAqs/dHUR2S9ReScPVPLN8fW', NULL, '', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:17:57', NULL),
(29, 'ravi', 'ravi', 'superadmin1@gmail.com', '$2b$10$ZEkYp.0xAGuqRESV582/tec.UcoH02mtxqBsobNqYl85fz2SERXUa', NULL, '', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:21:13', NULL),
(30, 'ravi', 'ravi', 'superadmin@gmail.com', '$2b$10$aBlb40/MsZwKy/8RvBm34evu.9z5U0f3VuGP4K0tg2jh4Xxj9qCeq', NULL, '', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 34, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:22:35', NULL),
(31, 'salu', 'salu', 'superadmin1@gmail.com', '$2b$10$r99IwOE4/QpUBYDjxvehNeh0E5Zb6204lhbaIbzq4qRDEVhCSsvm.', NULL, '', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 36, NULL, NULL, NULL, NULL, 1, '2023-03-09 15:23:26', NULL),
(32, 'crm', 'crm', 'crm@gmail.com', '$2b$10$gQGQsACBdM5gFidKuXNMiepn75OjXTFOdyAIowB7Mf3kagsaBhnIi', NULL, '7617065200', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 34, NULL, NULL, NULL, NULL, 1, '2023-03-09 16:12:32', NULL),
(33, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$eFhkHBFKMniyV4Q1pRYsWO1Tp5du4IGvZrTZyBlDjurNk0sR7MqNe', NULL, '123654789', '2023-03-15', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 11:58:52', NULL),
(34, 'Super admin', 'Super admin', 'superadmin1@gmail.com', '$2b$10$papQpnc4.kr9YNE0M7.ehukkScKBIApP98gRWm/nHs6aS/Mavr5F6', NULL, '521456955', '2023-03-08', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:00:55', NULL),
(35, 'Dealer 3 user imran1', 'Dealer 3 user imran', 'dealeruser3@gmail.co', '$2b$10$vhIS6tKFd9zdFFjo/Bo7tOrQTwPrrCj2srV71zfnBhaIu/Dg8QRLu', NULL, '9313301020', 'Invalid date', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-10 12:04:47', '2023-03-14 13:05:57'),
(36, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$vzYc5BU2d4sB0gm2/PlID.cueJF1w/rUssrYzqGMWT6SGC13LC0DG', NULL, '1236547889', '2023-03-24', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:22:52', NULL),
(37, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$kS9H55vc2O3iQ7LTtns4j.wq6NK/Z4da1ZEPUyi/oz3UUmF.m.EIC', NULL, '1236547889', '2023-03-24', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:24:59', NULL),
(38, 'ankurs', 'ankurs', 'superadmin1@gmail.com', '$2b$10$ovzoiSVdWGt779lkQI65ves.5Ul6l4Nle6hhp9/rP4F/JTwoNHZ/S', NULL, '123654785', '2023-03-23', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:25:20', NULL),
(39, 'Altaf s', 'Altaf', 'superadmin1@gmail.com', '$2b$10$RYmZ2lABidXNHwVZ4t0uUO/rdFCibnL5wxb6sDhL4AEEyy1tu1mAW', NULL, '78568568568', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:27:10', '2023-03-13 16:20:18'),
(40, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$KbV8/YyfraAMD0oR6W6xN.UiOr2Ew2zm6SrDzFWpWxnAfEd53Xzlm', NULL, '123654547', '2023-03-15', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-10 18:28:14', NULL),
(41, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$cfQq7tCjo7z.qE.mfisArex4L5CaEaYlcR.4wzBWW9dMZlaepgcbO', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 10:51:18', NULL),
(42, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$O5No.4v.vZ.S/eOxQ7YEZeXzcqIKq7HDv2AsAB.sawctbP4DG2fKu', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 10:58:27', NULL),
(43, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$IcA3pVw0nSnB/p3SuecIXug5C/CjkMBcNTS04Ysb/ozvaUqhMzy0W', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 11:00:00', NULL),
(44, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$3rSJqVWV8hN4tRvWjxonw.8EUjtWqxoMTDZpzSrc4txfWvwye0UWO', NULL, '415', '2023-03-08', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:21:27', NULL),
(45, 'Sartiaaaaa', 'Sartiaaaaa', 'superadmin1@gmail.com', '$2b$10$ZDnamTscs4jPKGne4QtiyORgzc/hSKypBcHeEhiKrwa9PPiLDydJe', NULL, '7970797897', '2023-03-02', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:32:12', NULL),
(46, 'chandan kumar', 'undefined', 'superadmin1@gmail.com', '$2b$10$wr6fC63Eh81ZQp9X8EmMl.fO2ZGOeGs2Zdh5e8Ck8.H5DWpNG3V.a', NULL, '446516513', '2023-03-23', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:37:05', '2023-03-13 16:50:51'),
(47, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$5mpkmJExJCZpjwDWY26/5O9bHs4CcUgibtJt.m.fAtEWh8LMOjE7a', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:38:22', NULL),
(48, 'undefined', 'undefined', 'ahmad@gmail.com', '$2b$10$bCjobPzyaaQptCUEs3fqF.eON28gZBR7en/BShAgRnAUtIb0.JVsC', NULL, 'undefined', 'undefined', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:39:25', NULL),
(49, 'altaf', 'undefined', 'ahmad@gmail.com', '$2b$10$Pr2VyUskl3r2Hyjqup4IVuwFuDbdSOnLpVYwtI8Nlfz8jTegb8OL2', NULL, '516515151', '2023-03-17', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:39:44', '2023-03-14 13:31:59'),
(50, 'dpt123', 'dpt123', 'superadmin1@gmail.com', '$2b$10$4jR3T4UJWIVW.DYj3ZZH7OuwfBiA7fS6WUeBU.wKVGAvfsl9qLpCK', NULL, '8860214536', '2023-03-17', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 13:41:53', NULL),
(51, 'SARTIA GLOBAL', 'SARTIA GLOBAL', 'superadmin1@gmail.com', '$2b$10$OGMoU362H/YRXbk/QaHX1e/JuLyVZfLr/77dQi7T8jOEmQlzgK3gS', NULL, '989689889787', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:15:15', NULL),
(52, 'XXXXXXXXX', 'XXXXXXXXX', 'superadmin1@gmail.com', '$2b$10$ev/3nrG0kNT5oM1NnSouZOXFt7kW7EOfMnqllgYHZiA6xt.1kNU2W', NULL, '5674745742', '2023-03-02', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:17:26', NULL),
(53, 'mahesh', 'aarif', 'dealer2@gmail.com', '$2b$10$4MrnRL8yIMRnqGGdhFT8HetCf1KgE5XpZ8ExzLH9sRyQw2ixckIq.', NULL, '', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:21:16', '2023-03-13 16:01:27'),
(54, 'Ankur', 'Ankur', 'superadmin1@gmail.com', '$2b$10$qtlaXWdpORfn.wDYVJpsnOB2pSXWLiPua0bLyH4AnxeC/0hQ9UfNm', NULL, '9003477343', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:50:11', NULL),
(55, 's', 's', 'superadmin1@gmail.com', '$2b$10$j.q2zBJ0X87gAx3N1lcHae5QtcnBy0eiW3.IGcxp/UJq0eecnIBUa', NULL, '57858568', '2023-03-28', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:54:28', NULL),
(56, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$9ygkTcuuEMU4npk0LdiWqOUfOGxsh8vmoXvi6h5gRfWXez6FlhMuK', NULL, '6785685865', '2023-03-28', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:55:26', NULL),
(57, 'rheryjnyj', 'rheryjnyj', 'superadmin1@gmail.com', '$2b$10$szGEb6XyKZ/L7u4FszBLFOZd.TZs4e6tAozz2zZ7K84EyKUoVloc.', NULL, '689695695679', '2023-03-16', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:56:57', NULL),
(58, 'bndfgn', 'bndfgn', 'superadmin1@gmail.com', '$2b$10$mzSWrr5jjRyGNu3GBNEEHOoomF/5VBkXW8.hYMNNWb/E8n1jBr28O', NULL, '686868745', '2023-03-29', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:57:50', NULL),
(59, 'Super admin', 'Super admin', 'superadmin1@gmail.com', '$2b$10$YZXBREWtF1wwMNAPZ/k1U.fRPgp0TjKQHrH5X4MjYm1qLP7wRvNyG', NULL, '69659569', '2023-04-05', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 14:58:51', NULL),
(60, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$pOHwHDIuKY5HWe9yCLW4nuh7B9tbzZgqsKTpfDyDMJ5ENEipFUdnW', NULL, '78568568568', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 39, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:04:12', NULL),
(61, 'Altaf123', 'Altaf123', 'superadmin1@gmail.com', '$2b$10$.AFueoZuyShiDJJd88gP3OJ9xh.oG8zA1AhPcuKMam.iG52O3KapG', NULL, '651612612612', '2023-03-10', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:06:48', NULL),
(62, 'Dealer 2', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$X4OEhWj7EPxpORXBRDnHD.vLnAf83DSbde15zzfFhFuhEpcrEI0zC', NULL, '989898989', '2023-03-13', '/user_images/1678859872561download.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:32:36', '2023-03-15 11:27:57'),
(63, 'Dealer 4567', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$M55oYMZ3ossrLOmPDJozae/AA0eZfXXZrlHsoB.JmRnM15zxm1S6S', NULL, '989898898989', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 15:38:47', NULL),
(64, 'sunjay', 'sunjay', 'superadmin1@gmail.com', '$2b$10$C6X350cUAcp3zk7yg8Fg4e.Y7uHi5eap5fZPJTGwsjp9.7Yz90/Xy', NULL, '886522414', '2023-03-15', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:05:58', NULL),
(65, 'Sartiaaaaa', 'Sartiaaaaa', 'superadmin1@gmail.com', '$2b$10$a0aOPl8iCBeMXMoGdo6PwepxXrXen1pXnrzLNVqyB33OS2fLApW.u', NULL, '4574545', '2023-03-17', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:06:54', NULL),
(66, 'asas', 'asas', 'superadmin1@gmail.com', '$2b$10$wimjq12W4UEsyk.POlGp9eoaGlE.zeUCRh8s0iT/4Q75XgFd3Awvy', NULL, '', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:07:32', NULL),
(67, 'asa', 'asa', 'superadmin1@gmail.com', '$2b$10$Qw10tyuOB5bg9MiOYdg1YOqUUVIUqwYROFgnzawhQLjlXHDs9pcfS', NULL, '', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:07:48', NULL),
(68, 'Altaf ahmad', 'Altaf ahmad', 'superadmin1@gmail.com', '$2b$10$G1zSmH7iRFB0HAuQRjAhLuhNQ8fNZuwX2DyXe3rHn4.rYF2Mwu0Zy', NULL, '515156151', '2023-03-16', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:08:19', NULL),
(69, 'chandan kumar', 'chandan', 'superadmin1@gmail.com', '$2b$10$3Vu6Yv61l6gGJvVXmweLqeyKBk.ml5cuX6ERLJAz5CsuFu8BSC4aq', NULL, '446516513', '2023-03-23', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:09:27', '2023-03-13 17:23:12'),
(70, 'deepenshu', 'deepenshu', 'superadmin1@gmail.com', '$2b$10$9BRYU3U3so9uV7sIZxI91OuHrG65QSNbFUXM1zw7gp44iT9KE7CYq', NULL, '65165165', '2023-03-16', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:15:18', NULL),
(71, 'deepen', 'deepen', 'superadmin1@gmail.com', '$2b$10$fBdyZjeSUx/tnVuW.j2QCOVFuBjhqVpbNUZE./RqCaJqNs30jVa5C', NULL, '', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 16:16:16', NULL),
(72, 'lataf', 'ops', 'superadmin1@gmail.com', '$2b$10$l1o.sdIp4eqCdMwn8KUqlenXKP7wAWitFO3hLBGkY78MYrchp1OES', NULL, '626262655', '2023-03-10', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:07:32', '2023-03-13 17:32:15'),
(73, 'Altaf alss123', 'Altaf ali', 'superadmin1@gmail.com', '$2b$10$nB/py0spxNBDvt/3skPD6eQ5yCMhPoGd/8GzLqAvrjIWPL21.GjFq', NULL, '5655613', '2023-03-17', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 46, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:19:00', '2023-03-13 17:31:18'),
(74, 'ankurs', 'ankurs', 'superadmin1@gmail.com', '$2b$10$0KAZXWGnpVvLROQ78D8iAe3dIHGLa2l9h3pJIsqPEBmdQiUfAzjjq', NULL, '132165148', '2023-03-24', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:32:50', NULL),
(75, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$nfS3x.Svg4bLB7Fd2RLspuuqqH04Vib3KCSnTAWtzW8o2glfezq4i', NULL, '46515165161', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:35:31', NULL),
(76, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$Y71SLAGGct.wiAw9VE4qteAZ/rCHRbq.xmSfdvcPX1YceNWAXgMRC', NULL, '4514514', '2023-03-10', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:36:21', NULL),
(77, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$nzj52l66G2DGKRCfJZ26W.tKcTSvLv3qE3AjTznBj4J5OOa.5hQbW', NULL, '651516157', '2023-03-03', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:36:53', NULL),
(78, 'asasas', 'asasas', 'superadmin1@gmail.com', '$2b$10$Cz0sRkWcCYyPhltMYR/3SuqIrH4/gOCLFHKIkAOL9fbXY5qF8dXmS', NULL, '', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:38:01', NULL),
(79, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$0UHuhmW2djbvbtsfad5b2u4c47Wt0ACXqLUQ9DKw9hrt05F.TPZ3m', NULL, '51651651', '2023-03-10', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:38:57', NULL),
(80, 'punkaj', 'punkaj', 'superadmin1@gmail.com', '$2b$10$LXVHOLiKmDPD1EqcJ1wXKuVUM.ELvAPWUxfrry7xTbJEsBDaeioHi', NULL, '5165163', '2023-03-10', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 0, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:39:16', NULL),
(81, 'kuldeep kumar', 'kuldeep', 'superadmin1@gmail.com', '$2b$10$0fd5HrfwKQa0KB3zxpRtU.CyM87/dJ0Lii5uKqQ/pKTEdA1zm3LMi', NULL, '9313301020', '2023-03-17', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-13 17:41:28', '2023-03-14 13:17:27'),
(82, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$0KhHycHOuGDaiGMK1yrkHuFbykk7.3kL3GxkHcsUNfWStRfN1Q0su', NULL, '54192', '2023-03-17', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 47, NULL, NULL, NULL, NULL, 1, '2023-03-14 10:16:28', NULL),
(83, 'sumit', 'sumit', 'superadmin1@gmail.com', '$2b$10$zEMlHV3Rdk.Fd6HV5P8AqugZoX2NTj/1wiim3y2bNrh6ksbwsdB4C', NULL, '4541515156', '2023-03-10', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-14 11:27:22', '2023-03-14 11:27:38'),
(84, 'uday', 'uday', 'superadmin1@gmail.com', '$2b$10$82PGqTLoE0KNT8n44io2Uu/1w7QH3miGuCDSU3NNPctLTcGPeEEDu', NULL, '12', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 48, NULL, NULL, NULL, NULL, 1, '2023-03-14 11:31:08', '2023-03-14 13:16:29'),
(85, 'Dealer 4567', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$u7HltOEmDX04zQHeCnskweDlVyGcEqZwVJTRzT.TTG5oV.b3th6Ci', NULL, '5216526562', '2023-03-16', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 48, NULL, NULL, NULL, NULL, 1, '2023-03-14 11:52:14', NULL),
(86, 'Altaf hm', 'Altaf hm', 'superadmin1@gmail.com', '$2b$10$uWgU02v7iACwOmiklJD0a.5lPWQsWRK5nScfhCTuXQmvOjB.6Hic6', NULL, '8855666651', '2023-03-14', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-14 12:35:04', '2023-03-14 13:01:42'),
(87, 'Dealer 4567', 'Dealer 4567', 'superadmin1@gmail.com', '$2b$10$bnwAul/C4QCXo2MZG.f5ZugTqQ.FiAq7iHg8R1yR0BBDU1.m498rW', NULL, '9595959959', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 24, NULL, NULL, NULL, NULL, 1, '2023-03-14 12:39:54', '2023-03-14 13:17:44'),
(88, 'Contractor 1 user', 'Contractor 1 user', 'contractoruser1@gmail.com', '$2b$10$iFmb2AS4fF4XU.5e4YWxmepq7VP6MVumKPRH1vEYlNgDhCavUJyYi', NULL, '9313301020', '2023-03-14', '/user_images/1678799806236download.png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 13:37:24', '2023-03-14 18:46:46'),
(89, 'Contractor 1 user', 'Contractor 1 user', 'contractoruser1@gmail.com', '$2b$10$I5qUjbUXtPwLOw.cy5YGt.SvrO6EqhfFyQKtDQIV2KgwiqXxy1d4.', NULL, '9313301020', '21-02-2023', '/user_images/1678787442428image.png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:20:42', NULL),
(90, 'pintu', 'pintu', 'PINTUadmin1@gmail.com', '$2b$10$oeu/oEQEXWzdN4FTfoVFOul8eV9D7oIpvM9GkSotBKS7hxP9iiSrS', NULL, '6515165165', '2023-03-31', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 37, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:22:38', NULL),
(91, 'ankurs', 'ankurs', 'superadmin1@gmail.com', '$2b$10$BspP5ez07QwB1Blb.1W5q.T56Q8EyTJ1m1FQSWZ8hqs/aX1eYM9i2', NULL, '8855666651', '2023-03-02', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-14 15:38:39', NULL),
(92, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$pEBExbzz.MDodAyfE54wAuX5/quK18ZNE4HqSCCXydD8j/hO3m2aG', NULL, '', '', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 3, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:03:55', NULL),
(93, 'Rahul Kumar', 'Rahul Kumar', 'rahul@gmail.com', '$2b$10$aT4HYlBIer5cPA2.lmkk/eB0Q1a8WeRxb2dkzHlyUQN0SdTX.hT8W', NULL, '9313301020', '2023-03-14', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:18:02', NULL),
(94, 'Super Altaf', 'Super Altaf', 'superadmin1@gmail.com', '$2b$10$0yMlK.a7/fNyvbXha0g31e1lAwC.2jfe3C3zBNhDHBpnxl3TwOT3O', NULL, '9313301020', '2023-03-29', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:18:49', '2023-03-14 16:19:09'),
(95, 'Rahul Kumar', 'Rahul Kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$qsnOX3rbyJHOeRFRCBpa3eeu3.AcXPbGw94dSl/BisQs9dG1rFppK', NULL, '9313301020', '2023-03-14', '/user_images/1678799278847free-diploma-of-graduation.webp', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 18, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:34:29', '2023-03-14 18:37:58'),
(96, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$RI6exSkp3o62olSbtrY8q.12gHNfgR6FdwUskqn4xjvga07ezfqLi', NULL, '8855666651', '2023-03-09', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 16:53:14', '2023-03-14 17:35:46'),
(97, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$NgNMDDvP5NkL4tRhVn5kQOM/uJ2JIrGbpHz7Td9Z4KetlIp/jaRZC', NULL, '8855666651', '2023-03-15', '', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:08:12', NULL),
(98, 'gdfgdfg', 'gdfgdfg', 'superadmin1@gmail.com', '$2b$10$fIBLgvJBTJM8bbJOdI91lOm6wXzv/rWl0SBN1efx2eL/a9TJbjVMO', NULL, '8855666651', '', '/user_images/16787977940354k-2.jfif', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:13:14', '2023-03-15 11:13:35'),
(99, 'test', 'test', 'superadmin1@gmail.com', '$2b$10$A6hSKvtpwtdx/lT7bn8qVuFhsCsCgWKIxNkCd1Cd4DIaINmMmHPna', NULL, '3453453453', '2023-03-14', '/user_images/16787978954284k-2.jfif', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:14:55', NULL),
(100, 'ertert', 'ertert', 'superadmin1@gmail.com', '$2b$10$SyGdFNrDzDjM.IxVRM7oUe9O8G4bAGYmHGwiALseASu0ShTfCPfaO', NULL, '8855666651', '', '/user_images/1678797908955404-error.png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:15:08', NULL),
(101, 'Altaf', 'Altaf', 'superadmin1@gmail.com', '$2b$10$Y/OKRzbqv/KqxeptbYl7c.422zeoo/vrrInV4eFioUWCJaD5KahRO', NULL, '8855666651', '2023-03-16', '/user_images/1678799762404404-error.png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '0', '6', NULL, 61, NULL, NULL, NULL, NULL, 1, '2023-03-14 18:36:25', '2023-03-14 18:46:02'),
(102, 'CONTRACTORS user 1', 'CONTRACTORS user 1', 'superadmin1@gmail.com', '$2b$10$rJ2lHM5iwo84soGsi83aK.cdcFw00.kDfL6fAYMUiJ9YtmRtlSbt6', NULL, '5415848484', '2023-03-15', '/user_images/16788558031114k-2.jfif', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 60, NULL, NULL, NULL, NULL, 1, '2023-03-15 10:20:03', '2023-03-15 10:33:18'),
(103, 'CONTRACTORS user 1', 'CONTRACTORS user 1', 'superadmin1@gmail.com', '$2b$10$0hjch2TPgvwrvbjgsVsiIOTzzOXlTcuo5NIg/YFh/.MkpWsQXNCJ2', NULL, '1236547899', '2023-03-15', '/user_images/1678855908911404-error.png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 57, NULL, NULL, NULL, NULL, 1, '2023-03-15 10:21:48', NULL),
(104, 'CONTRACTORS user 2', 'CONTRACTORS user 2', 'superadmin1@gmail.com', '$2b$10$KnJBtk54Zd4bZIukrUn3GuCAU1yP9aCBObMqj0D2pN17GmDjW7cAq', NULL, '8855666651', '2023-03-16', '/user_images/1678855995633logo.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '1', '6', NULL, 57, NULL, NULL, NULL, NULL, 1, '2023-03-15 10:23:01', '2023-03-15 10:23:15'),
(105, 'team member 1', 'teammemeber1@gmail.com', 'teammemeber1@gmail.com', '$2b$10$OlBXTMwyqQ1MLrxNpDEksuHvKxDWNK/wt1V3LzXjytp7/xsEOwu7y', NULL, '', '2023-03-16', '/user_images/1678944993962download.png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '7', NULL, 1, 1, NULL, NULL, NULL, 1, '2023-03-16 11:06:33', NULL),
(108, 'user 44', 'user 44', 'user44@gmail.com', '$2b$10$FPLdYhwaeD642JQuce2Pqu/h.DomT2atzhezYF6h0tl42LAXYHgcy', NULL, '9313301020', '2023-03-28', '/user_images/1679990368994download.png', 'Noida', '/user_images/1679990368994download.png', '/user_images/1679990368994download.jpg', '/user_images/1679990368994download.png', 'php, laravel,Codeiigniter', NULL, 'Permmanet', 'GFDR897DF', NULL, '895632125241', NULL, NULL, 'hvfds54', 'kj578dsc', 'State bank of india', 'yunbd744', '456857455522', NULL, 'IT', '[\"family_info\":\n{\"name\": \"Rohan Singh\", \"relation\": \"Father\", \"addhar_card_front_image\": \"image 1\", \"addhar_card_back_image\": \"Image 2\", \"pan_card\": \"image\"},\n{\"name\": \"Sonali Sharma\", \"relation\": \"Mother\", \"addhar_card_front_image\": \"image 1\", \"addhar_card_back_image\": \"Image 2\", \"pan_card\": \"image\"}\n]', 1, '1', '5', 5, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-28 13:29:29', NULL),
(109, 'user 44', 'user 44', 'user44@gmail.com', '$2b$10$ujccTofKVRzvj9TSS3x7SejYkPTGjG6kOrJ44pBNJHbBHkZlPtqQy', NULL, '9313301020', '2023-03-28', '', 'Noida', '', '', '', 'php, laravel,Codeiigniter', NULL, 'Permmanet', 'GFDR897DF', NULL, '895632125241', NULL, NULL, 'hvfds54', 'kj578dsc', 'State bank of india', 'yunbd744', '456857455522', NULL, 'IT', '[\"family_info\":\n{\"name\": \"Rohan Singh\", \"relation\": \"Father\", \"addhar_card_front_image\": \"image 1\", \"addhar_card_back_image\": \"Image 2\", \"pan_card\": \"image\"},\n{\"name\": \"Sonali Sharma\", \"relation\": \"Mother\", \"addhar_card_front_image\": \"image 1\", \"addhar_card_back_image\": \"Image 2\", \"pan_card\": \"image\"}\n]', 1, '1', '5', 5, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-28 13:41:11', NULL),
(110, 'user 44', 'user 44', 'user44@gmail.com', '$2b$10$5Vw4poL1HoA4OBhbNSTSTeV.wlxxXO.jGdQED1pkjipNdowejhWei', NULL, '9313301020', '2023-03-28', NULL, 'Noida', NULL, NULL, '', 'php, laravel,Codeiigniter', 1, 'Permmanet', 'GFDR897DF', NULL, '895632125241', NULL, NULL, 'hvfds54', 'kj578dsc', 'State bank of india', 'yunbd744', '456857455522', NULL, 'IT', '[\"family_info\":\n{\"name\": \"Rohan Singh\", \"relation\": \"Father\", \"addhar_card_front_image\": \"image 1\", \"addhar_card_back_image\": \"Image 2\", \"pan_card\": \"image\"},\n{\"name\": \"Sonali Sharma\", \"relation\": \"Mother\", \"addhar_card_front_image\": \"image 1\", \"addhar_card_back_image\": \"Image 2\", \"pan_card\": \"image\"}\n]', 1, '1', '5', 5, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-28 13:50:41', '2023-04-03 13:49:41'),
(114, 'werewr', 'werewr', 'superadmin1@gmail.com', '$2b$10$eUU.E8QLk1OEl1/5ElL/4.hTrWPD1Vs2cLGoMMDLg3HUjIU7./nfm', NULL, '7777777777', '2023-03-14', '', 'werwerwer', '', '', '', 'erty,rtyrty,wqqwe', 10, 'undefined', '', NULL, '', NULL, NULL, '', '', '', '', '', NULL, NULL, NULL, 1, '1', '3', 3, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-28 17:10:25', NULL),
(115, 'Smriti', 'Smriti', 'smriti@gmail.com', '$2b$10$jHPuT7j/Ob9ygb5AwH/w0OCiK3m50utMhmnlz611gZfSwkvRY.fB2', NULL, '7979798988', '2023-03-11', '', '#434, Noida', '', '', '', 'fkgfkh,gfhrwre,eryt,tuyu', 2, 'undefined', '879789789790', NULL, '768678768768', NULL, NULL, '6547657567', '656757 876 8', 'State Bank of India', '8745AADD4', '6777777777', NULL, NULL, '\"[{\\\"name\\\":\\\"\\\",\\\"relation\\\":\\\"\\\",\\\"addhar_card_front_image\\\":null,\\\"addhar_card_back_image\\\":null,\\\"pan_card\\\":null}]\"', 1, '1', '4', 4, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-28 17:25:39', '2023-03-29 17:59:40'),
(116, 'wdeq', 'wdeq', 'superadmin1@gmail.com', '$2b$10$L4uxGAWiLknD9VNuoM31Mec7u2m3efsBERQLVKMZGJu24N0wAmm3m', NULL, '7777777777', '2023-03-10', '', 'werwer', '', '', '', 'retert,trytry', 0, 'undefined', '', NULL, '', NULL, NULL, '', '', '', '', '', NULL, NULL, '[{\"name\":\"Family name\",\"relation\":\"Father\",\"addhar_card_front_image\":{},\"addhar_card_back_image\":{},\"pan_card\":{}}]', 1, '1', '6', 6, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-28 17:30:29', NULL),
(117, 'user 44', 'user 44', 'user44@gmail.com', '$2b$10$NU0DRPlr8faJPFUpB.Q8z.Q1/HxCE7JcyTINDyKh1kJPEwRh2NpGW', NULL, '9313301020', '2023-03-28', '', 'Noida', '', '', '', 'gfhfj,hjghj', 1, 'Permanent', 'GFDR897DF', NULL, '895632125241', NULL, NULL, 'hvfds54', 'kj578dsc', 'State bank of india', 'yunbd744', '456857455522', NULL, NULL, '\"[{\\\"name\\\":\\\"\\\",\\\"relation\\\":\\\"\\\",\\\"addhar_card_front_image\\\":null,\\\"addhar_card_back_image\\\":null,\\\"pan_card\\\":null}]\"', 1, '0', '5', 5, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-29 17:06:26', '2023-03-29 18:05:05'),
(118, 'new one11', 'new one11', 'sdfsdf@gmail.com', '$2b$10$Hospb7DUR6FD8jZxgw.u2.2TKCQ1F.xaOLVSac36924l5KBZfGhJm', 'MTIzNDU2Nzg=', '7878788888', '2023-03-14', '/user_images/1680336776754Screenshot (126).png', 'dfsdf', '/user_images/1680336776754Screenshot (113).png', '/user_images/1680336776754Screenshot (123).png', '/user_images/1680336776754Screenshot (117).png', 'dsfsdf,sdfsg,fdgter', 10, 'Part-Time', '4546456', '/user_images/1680336776754Screenshot (113).png', '768678768768', '/user_images/1680336776754Screenshot (124).png', '/user_images/1680336776754Screenshot (126).png', '657567567', '656757 876 8', 'State Bank of India', 'yuiuyiyui', '6777777777777', '/user_images/1680336776754Screenshot (120).png', NULL, '\"[{\\\"name\\\":\\\"\\\",\\\"relation\\\":\\\"\\\",\\\"addhar_card_front_image\\\":null,\\\"addhar_card_back_image\\\":null,\\\"pan_card\\\":null}]\"', 0, '0', '3', 3, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-31 11:18:29', '2023-04-01 13:42:56'),
(119, 'Rahul Kumar', 'Rahul Kumar', 'rahulkumar@sartiaglobal.com', '$2b$10$Ny6Gq60lX4PykhhQW8L2r.635ZDp263LEztL7/BxL8o1kx4lnNeb6', NULL, '9313301020', '2023-03-31', '/user_images/1680258686009download.jpg', 'noida', '/user_images/1680258686009download.png', '/user_images/1680258686009download.png', '/user_images/1680258686009download.jpg', 'rahu,ram,shayam', 10, 'Permanent', 'sadsdcc', NULL, 'sdfedgrg', NULL, NULL, 'dscfszd', 'sdcsdc', 'dzscszdfc', '', 'dsfcsd', NULL, NULL, '[{\"name\":\"asdsdf\",\"relation\":\"Mother\",\"addhar_card_front_image\":{},\"addhar_card_back_image\":{},\"pan_card\":{}},{\"name\":\"DFgg\",\"relation\":\"Father\",\"addhar_card_front_image\":{},\"addhar_card_back_image\":{},\"pan_card\":{}}]', 1, '1', '6', 6, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-31 16:01:26', NULL),
(120, 'Two new', 'Two new', 'twonew@gmaail.com', '$2b$10$owB5OVx0sq9gE2qjijmwIOrDMKthNGkL8Vnuvs3d8FDWjZQr8WWz2', NULL, '9313301020', '2023-03-31', '', 'NOida', '', '', '', 'rau,kdhf,dshjdfn,hfdjk', 2, 'Permanent', '4546456', '', 'BRH654h744', '', '', 'dscfszd', 'sdcsdc', 'dzscszdfc', 'zdsdsfc', 'dsfcsd', '', NULL, NULL, 1, '1', '6', 6, NULL, NULL, NULL, NULL, NULL, 1, '2023-03-31 16:21:46', '2023-04-01 13:37:37'),
(121, 'user444', 'user444', 'tytryty6@gmail.com', '$2b$10$K2rsfqLXSVKutrqu4hMX5uvUibD0OepCQIn2vGCw2EIM7cgZsBMzC', NULL, '8797897893', '2023-03-28', '/user_images/1683875316074logo.png', 'Noida', '', '', '', ' laravel,Codeiigniter,sdsf,sdfsdf,rrewtrt', 33, 'Part-Time', '6456', '', '895632125241', '', '', '45645645', '6456456', 'State bank of india', 'yunbd744', '456857455522', '', NULL, '[object Object]', 1, '0', '4', 4, NULL, NULL, NULL, NULL, NULL, 1, '2023-04-01 12:29:26', '2023-05-12 12:38:36'),
(122, 'Dealer 12 User', 'Dealer 12 User', 'dealer12user@gmail.com', '$2b$10$i9ItrWdK31CygT8f3Ez7weEGAEwgF8PZ7l4lpB.AgCeugI5kxmtAK', 'MTIzNDU2Nzg=', '9313301020', '2023-04-13', '/user_images/1681379142679download (1).png', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '0', '6', NULL, 96, NULL, NULL, NULL, NULL, 1, '2023-04-13 15:15:42', '2023-04-13 15:15:57'),
(123, 'sdfsg', 'sdfsg', 'superadmin1@gmail.com', '$2b$10$KspYpONrwZp4M41bLQ1Bm.L3EWqeca07udVqnuyc.HUl9GJG27q3W', NULL, '7777777777', '2023-04-12', '/user_images/1681796366464images.jpg', 'reytytry', '/user_images/1681796366464images.jpg', '/user_images/1681796366464hotel2.jpg', '/user_images/1681796366464room3.jpg', 'etret,erteytry,647657', 23, 'Permanent', '6768678678', '/user_images/1681796366464room5.webp', '56456456456', '/user_images/1681796366464hotel2.jpg', '/user_images/1681796366464room1.webp', '46546456', '54645647', 'sadsad', '8745AADD444', '90890890', '/user_images/1681796366464room4.jpg', NULL, NULL, 1, '0', '2', 2, NULL, NULL, NULL, NULL, NULL, 1, '2023-04-18 11:09:26', NULL),
(124, 'kaif', 'kaif', 'mohdkaif@sartiaglobal.com', '$2b$10$0svrJlh2CUwIaEkYK93.PujcNZ4nkEEujuqMdfeqJ0Gi7eZkKIIyy', 'YWxva0A5MDA0', '8895389349', '2023-04-19', '/user_images/1681902469953images.jpg', NULL, NULL, NULL, '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', '6', NULL, 98, NULL, NULL, NULL, NULL, 1, '2023-04-19 16:37:49', NULL),
(125, 'test', 'test', 'test@gmail.com', '$2b$10$DCCY5/mePkqAkfVV1rQMROjFCv2OtYbA3DU3Oihe9Y0DzrUlR9lXi', NULL, '8265811812', '2023-04-20', '/user_images/1681969825286download.jpeg', 'pilkhuwa', '/user_images/1681969825286download.jpeg', '/user_images/1681969825286logic1.webp', '/user_images/1681969825286logic1.webp', 'false', 25, 'Permanent', 'pan00012', '/user_images/1681969825286logic1.webp', '1224563789', '/user_images/1681969825286logic1.webp', '/user_images/1681969825286logic1.webp', '225', '52180', 'BOB', '001', '521789540', '/user_images/1681969825286download.jpeg', NULL, NULL, 1, '0', '5', 5, NULL, NULL, NULL, NULL, NULL, 1, '2023-04-20 11:20:25', NULL),
(126, 'Rahul Kumar 12', 'Rahul Kumar 12', 'rahulkumaremp12@sartiaglobal.com', '$2b$10$N3O.3fiNQh0jAYdl8j45guXWr36r6Ci7POi7xXV7U9My33Iw.q26.', NULL, '6256525852', '2023-05-08', '/user_images/1683871033114Frame 12 (1).png', 'noida', '/user_images/1683871033114Frame 12 (1).png', '/user_images/1683871033114Group 4.png', '/user_images/1683871033114giphy.gif', 'php,html', 27, 'Permanent', 'sadsdcc', '/user_images/1683871033114404.png', '78965412658745', '/user_images/16838710331144k-2.jfif', '/user_images/1683871033114404-error.png', '125544', '11855', 'dzscszdfc', 'zdsdsfc', '5447745787', '/user_images/1683871033114accepted.png', NULL, '[object Object]', 1, '0', '7', 7, NULL, NULL, NULL, NULL, NULL, 1, '2023-05-11 11:04:54', '2023-05-12 11:38:03');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity_logs`
--

CREATE TABLE `user_activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `action` text DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL COMMENT 'for track user browser',
  `result` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activity_logs`
--

INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(1, 4, 2, 1679480702, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 15:55:02'),
(2, 4, 2, 1679480725, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 15:55:25'),
(3, 4, 2, 1679480749, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 15:55:49'),
(4, 4, 2, 1679481613, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 16:10:13'),
(5, 4, 2, 1679481682, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 16:11:22'),
(6, 4, 2, 1679481795, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 16:13:15'),
(7, 1, 1, 1679481909, 'changePassword method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Old password is incorrect', '2023-03-22 16:15:10'),
(8, 1, 1, 1679482068, 'changePassword method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Old password is incorrect', '2023-03-22 16:17:48'),
(9, 0, 0, 1679482441, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Email not found', '2023-03-22 16:24:01'),
(10, 0, 0, 1679482499, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Email not found manager1sdf@sartiaglobal.com', '2023-03-22 16:24:59'),
(11, 0, 0, 1679482531, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Email and password is invalid', '2023-03-22 16:25:31'),
(12, 0, 0, 1679482628, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Trying to login access wuth email:- manager1@sartiaglobal.com And password:- 123456783', '2023-03-22 16:27:08'),
(13, 0, 0, 1679482659, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'logged in successfully', '2023-03-22 16:27:39'),
(14, 0, 2, 1679482791, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'logged in successfully', '2023-03-22 16:29:51'),
(15, 0, 2, 1679482846, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'logged in successfully', '2023-03-22 16:30:46'),
(16, 4, 2, 1679482878, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'logged in successfully', '2023-03-22 16:31:18'),
(17, 0, 0, 1679482893, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Trying to login with this manager1@sartiaglobal.comas', '2023-03-22 16:31:33'),
(18, 4, 2, 1679482912, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Trying to login access with email:- manager1@sartiaglobal.com And password:- 12345678sd', '2023-03-22 16:31:52'),
(19, 4, 2, 1679482926, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'logged in successfully', '2023-03-22 16:32:06'),
(20, 4, 2, 1679484454, 'getProfileDetails method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Profile data fetched successfully', '2023-03-22 16:57:34'),
(21, 10, 5, 1679485218, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-22 17:10:18'),
(22, 1, 2, 1679490050, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Leave apply successfully', '2023-03-22 18:30:50'),
(23, 4, 2, 1679490160, 'loginUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'logged in successfully', '2023-03-22 18:32:40'),
(24, 4, 2, 1679490171, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Leave apply successfully', '2023-03-22 18:32:51'),
(25, 0, 0, 1679989514, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:15:14'),
(26, 0, 0, 1679989571, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:16:11'),
(27, 0, 0, 1679989614, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:16:54'),
(28, 0, 0, 1679989649, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:17:29'),
(29, 0, 0, 1679989669, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:17:49'),
(30, 0, 0, 1679989712, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:18:32'),
(31, 0, 0, 1679989725, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:18:45'),
(32, 0, 0, 1679989749, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:19:09'),
(33, 0, 0, 1679989810, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:20:10'),
(34, 0, 0, 1679989872, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:21:12'),
(35, 0, 0, 1679989947, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:22:27'),
(36, 0, 0, 1679989977, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:22:57'),
(37, 0, 0, 1679990123, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:25:23'),
(38, 0, 0, 1679990138, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:25:38'),
(39, 0, 0, 1679990159, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:25:59'),
(40, 0, 0, 1679990244, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'name\')', '2023-03-28 13:27:24'),
(41, 0, 5, 1679990292, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'ER_BAD_NULL_ERROR: Column \'created_by\' cannot be null', '2023-03-28 13:28:12'),
(42, 107, 5, 1679990310, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-28 13:28:30'),
(43, 108, 5, 1679990369, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-28 13:29:29'),
(44, 109, 5, 1679991071, 'createUsers method of userController ', '::ffff:192.168.1.28', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-28 13:41:11'),
(45, 110, 5, 1679991641, 'createUsers method of userController ', '::ffff:192.168.1.28', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-28 13:50:41'),
(46, 0, 5, 1679991743, 'updateUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Something went wrong, please try again later', '2023-03-28 13:52:23'),
(47, 0, 5, 1679991838, 'updateUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Something went wrong, please try again later', '2023-03-28 13:53:58'),
(48, 0, 5, 1679992324, 'updateUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot access \'hashPassword\' before initialization', '2023-03-28 14:02:04'),
(49, 0, 5, 1679992336, 'updateUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot access \'hashPassword\' before initialization', '2023-03-28 14:02:16'),
(50, 110, 5, 1679992652, 'updateUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-28 14:07:32'),
(51, 110, 5, 1679992710, 'updateUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'User updated successfully', '2023-03-28 14:08:30'),
(52, 111, 6, 1680002721, 'createUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-28 16:55:21'),
(53, 112, 6, 1680003103, 'createUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-28 17:01:43'),
(54, 113, 5, 1680003313, 'createUsers method of userController ', '::1', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-28 17:05:13'),
(55, 114, 3, 1680003625, 'createUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-28 17:10:25'),
(56, 115, 4, 1680004539, 'createUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-28 17:25:39'),
(57, 116, 6, 1680004829, 'createUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-28 17:30:29'),
(58, 117, 5, 1680089786, 'createUsers method of userController ', '::ffff:192.168.1.28', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-03-29 17:06:26'),
(59, 117, 5, 1680092676, 'updateUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-03-29 17:54:36'),
(60, 117, 5, 1680092709, 'updateUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-03-29 17:55:09'),
(61, 115, 4, 1680092980, 'updateUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-03-29 17:59:40'),
(62, 117, 5, 1680092999, 'updateUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-03-29 17:59:59'),
(63, 117, 5, 1680093190, 'updateUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-03-29 18:03:10'),
(64, 117, 5, 1680093305, 'updateUsers method of userController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-03-29 18:05:05'),
(65, NULL, NULL, 1680162318, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-30 13:15:18'),
(66, NULL, NULL, 1680163139, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 13:28:59'),
(67, NULL, NULL, 1680163430, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 13:33:50'),
(68, NULL, NULL, 1680163499, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 13:34:59'),
(69, NULL, NULL, 1680163613, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 13:36:53'),
(70, NULL, NULL, 1680164871, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 13:57:51'),
(71, NULL, NULL, 1680165233, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 14:03:53'),
(72, NULL, NULL, 1680167301, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \' `user_type` = 1, `iat` = 1679573543, `exp` = 1682165543 AND DATE_FORMAT(atte...\' at line 1', '2023-03-30 14:38:21'),
(73, NULL, NULL, 1680168107, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'getDayNameOnDate is not a function', '2023-03-30 14:51:47'),
(74, NULL, NULL, 1680168171, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot access \'logData\' before initialization', '2023-03-30 14:52:51'),
(75, NULL, NULL, 1680169620, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'getDayNameOnDate is not a function', '2023-03-30 15:17:00'),
(76, NULL, NULL, 1680169646, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-30 15:17:26'),
(77, NULL, NULL, 1680169711, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'getDayNameOnDate is not a function', '2023-03-30 15:18:31'),
(78, NULL, NULL, 1680169775, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'getDifferenceBetweenTime is not a function', '2023-03-30 15:19:35'),
(79, NULL, NULL, 1680169803, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-30 15:20:03'),
(80, NULL, NULL, 1680169851, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-30 15:20:51'),
(81, NULL, NULL, 1680169856, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-30 15:20:56'),
(82, NULL, NULL, 1680169859, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-30 15:20:59'),
(83, NULL, NULL, 1680239483, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 10:41:23'),
(84, NULL, NULL, 1680239522, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-31 10:42:02'),
(85, NULL, NULL, 1680239529, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 10:42:09'),
(86, 118, 3, 1680241709, 'createUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-31 11:18:29'),
(87, NULL, NULL, 1680243599, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 11:49:59'),
(88, NULL, NULL, 1680243717, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:51:57'),
(89, NULL, NULL, 1680243717, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:51:57'),
(90, NULL, NULL, 1680243735, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:15'),
(91, NULL, NULL, 1680243741, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:21'),
(92, NULL, NULL, 1680243748, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:28'),
(93, NULL, NULL, 1680243748, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:28'),
(94, NULL, NULL, 1680243751, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:31'),
(95, NULL, NULL, 1680243751, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:31'),
(96, NULL, NULL, 1680243760, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:40'),
(97, NULL, NULL, 1680243766, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:46'),
(98, NULL, NULL, 1680243771, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:51'),
(99, NULL, NULL, 1680243771, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:52:51'),
(100, NULL, NULL, 1680243796, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:53:16'),
(101, NULL, NULL, 1680243796, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:53:16'),
(102, NULL, NULL, 1680243820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:53:40'),
(103, NULL, NULL, 1680243820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:53:40'),
(104, NULL, NULL, 1680243828, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:53:48'),
(105, NULL, NULL, 1680243829, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:53:49'),
(106, NULL, NULL, 1680243851, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:54:11'),
(107, NULL, NULL, 1680243853, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:54:13'),
(108, NULL, NULL, 1680243853, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:54:13'),
(109, NULL, NULL, 1680243919, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:55:19'),
(110, NULL, NULL, 1680243919, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:55:19'),
(111, NULL, NULL, 1680243933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-31 11:55:33'),
(112, NULL, NULL, 1680243938, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 11:55:38'),
(113, NULL, NULL, 1680243942, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-31 11:55:42'),
(114, NULL, NULL, 1680243946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 11:55:46'),
(115, NULL, NULL, 1680243951, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-31 11:55:51'),
(116, NULL, NULL, 1680243956, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 11:55:56'),
(117, NULL, NULL, 1680243969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 11:56:09'),
(118, NULL, NULL, 1680243975, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 11:56:15'),
(119, NULL, NULL, 1680243975, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 11:56:15'),
(120, NULL, NULL, 1680243988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:56:28'),
(121, NULL, NULL, 1680243988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:56:28'),
(122, NULL, NULL, 1680244007, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:56:47'),
(123, NULL, NULL, 1680244007, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:56:47'),
(124, NULL, NULL, 1680244048, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:57:28'),
(125, NULL, NULL, 1680244048, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:57:28'),
(126, NULL, NULL, 1680244074, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:57:54'),
(127, NULL, NULL, 1680244074, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:57:54'),
(128, NULL, NULL, 1680244091, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:58:11'),
(129, NULL, NULL, 1680244091, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 11:58:11'),
(130, NULL, NULL, 1680244170, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 11:59:30'),
(131, NULL, NULL, 1680244176, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Records not found', '2023-03-31 11:59:36'),
(132, NULL, NULL, 1680244266, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 12:01:06'),
(133, NULL, NULL, 1680244306, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:01:46'),
(134, NULL, NULL, 1680244306, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:01:46'),
(135, NULL, NULL, 1680244323, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:02:03'),
(136, NULL, NULL, 1680244323, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:02:03'),
(137, NULL, NULL, 1680244398, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:03:18'),
(138, NULL, NULL, 1680244398, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:03:18'),
(139, NULL, NULL, 1680244776, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:09:36'),
(140, NULL, NULL, 1680244776, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:09:36'),
(141, NULL, NULL, 1680244820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:20'),
(142, NULL, NULL, 1680244820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:20'),
(143, NULL, NULL, 1680244830, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:30'),
(144, NULL, NULL, 1680244830, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:30'),
(145, NULL, NULL, 1680244837, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:37'),
(146, NULL, NULL, 1680244837, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:37'),
(147, NULL, NULL, 1680244849, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:49'),
(148, NULL, NULL, 1680244849, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:10:49'),
(149, NULL, NULL, 1680244880, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:11:20'),
(150, NULL, NULL, 1680244880, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:11:20'),
(151, NULL, NULL, 1680245020, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:13:40'),
(152, NULL, NULL, 1680245020, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:13:40'),
(153, NULL, NULL, 1680245027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:13:47'),
(154, NULL, NULL, 1680245027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:13:47'),
(155, NULL, NULL, 1680245108, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:08'),
(156, NULL, NULL, 1680245108, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:08'),
(157, NULL, NULL, 1680245114, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:14'),
(158, NULL, NULL, 1680245114, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:14'),
(159, NULL, NULL, 1680245120, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:20'),
(160, NULL, NULL, 1680245120, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:20'),
(161, NULL, NULL, 1680245155, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:55'),
(162, NULL, NULL, 1680245155, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:15:55'),
(163, NULL, NULL, 1680245162, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:16:02'),
(164, NULL, NULL, 1680245162, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:16:02'),
(165, NULL, NULL, 1680245322, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:18:42'),
(166, NULL, NULL, 1680245322, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:18:42'),
(167, NULL, NULL, 1680245332, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:18:52'),
(168, NULL, NULL, 1680245332, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:18:52'),
(169, NULL, NULL, 1680245346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:06'),
(170, NULL, NULL, 1680245350, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:10'),
(171, NULL, NULL, 1680245350, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:10'),
(172, NULL, NULL, 1680245387, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:47'),
(173, NULL, NULL, 1680245392, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:52'),
(174, NULL, NULL, 1680245395, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:55'),
(175, NULL, NULL, 1680245395, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:19:55'),
(176, NULL, NULL, 1680245406, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:06'),
(177, NULL, NULL, 1680245410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:10'),
(178, NULL, NULL, 1680245410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:10'),
(179, NULL, NULL, 1680245424, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:24'),
(180, NULL, NULL, 1680245424, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:24'),
(181, NULL, NULL, 1680245439, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:39'),
(182, NULL, NULL, 1680245439, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:39'),
(183, NULL, NULL, 1680245448, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:48'),
(184, NULL, NULL, 1680245451, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:51'),
(185, NULL, NULL, 1680245451, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:51'),
(186, NULL, NULL, 1680245456, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:56'),
(187, NULL, NULL, 1680245459, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:59'),
(188, NULL, NULL, 1680245459, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:20:59'),
(189, NULL, NULL, 1680245467, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:21:07'),
(190, NULL, NULL, 1680245470, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:21:10'),
(191, NULL, NULL, 1680245470, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:21:10'),
(192, NULL, NULL, 1680245557, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:22:37'),
(193, NULL, NULL, 1680245557, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:22:37'),
(194, NULL, NULL, 1680245560, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:22:40'),
(195, NULL, NULL, 1680245560, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:22:40'),
(196, NULL, NULL, 1680245593, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:23:13'),
(197, NULL, NULL, 1680245593, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:23:13'),
(198, NULL, NULL, 1680245607, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:23:27'),
(199, NULL, NULL, 1680245607, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:23:27'),
(200, NULL, NULL, 1680245651, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:24:11'),
(201, NULL, NULL, 1680245676, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:24:36'),
(202, NULL, NULL, 1680245689, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:24:49'),
(203, NULL, NULL, 1680245690, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:24:50'),
(204, NULL, NULL, 1680245695, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:24:55'),
(205, NULL, NULL, 1680245732, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:25:32'),
(206, NULL, NULL, 1680245732, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:25:32'),
(207, NULL, NULL, 1680245742, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:25:42'),
(208, NULL, NULL, 1680245742, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:25:42'),
(209, NULL, NULL, 1680245780, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:26:20'),
(210, NULL, NULL, 1680245788, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:26:28'),
(211, NULL, NULL, 1680245796, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:26:36'),
(212, NULL, NULL, 1680245801, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:26:41'),
(213, NULL, NULL, 1680245807, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:26:47'),
(214, NULL, NULL, 1680245817, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:26:57'),
(215, NULL, NULL, 1680245820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:00'),
(216, NULL, NULL, 1680245827, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:07'),
(217, NULL, NULL, 1680245827, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:07'),
(218, NULL, NULL, 1680245862, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:42'),
(219, NULL, NULL, 1680245868, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:48');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(220, NULL, NULL, 1680245868, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:48'),
(221, NULL, NULL, 1680245870, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:50'),
(222, NULL, NULL, 1680245870, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:27:50'),
(223, NULL, NULL, 1680245886, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:28:06'),
(224, NULL, NULL, 1680245886, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:28:06'),
(225, NULL, NULL, 1680245910, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:28:30'),
(226, NULL, NULL, 1680245911, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:28:31'),
(227, NULL, NULL, 1680246031, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:30:31'),
(228, NULL, NULL, 1680246031, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 12:30:31'),
(229, NULL, NULL, 1680246454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:37:34'),
(230, NULL, NULL, 1680246454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:37:34'),
(231, NULL, NULL, 1680246479, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 12:37:59'),
(232, NULL, NULL, 1680246520, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:38:40'),
(233, NULL, NULL, 1680246520, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:38:40'),
(234, NULL, NULL, 1680246538, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:38:58'),
(235, NULL, NULL, 1680246538, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:38:58'),
(236, NULL, NULL, 1680246546, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:39:06'),
(237, NULL, NULL, 1680246548, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:39:08'),
(238, NULL, NULL, 1680246548, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:39:08'),
(239, NULL, NULL, 1680246567, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:39:27'),
(240, NULL, NULL, 1680246576, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:39:36'),
(241, NULL, NULL, 1680246619, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:40:19'),
(242, NULL, NULL, 1680246619, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:40:19'),
(243, NULL, NULL, 1680246630, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:40:30'),
(244, NULL, NULL, 1680246630, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:40:30'),
(245, NULL, NULL, 1680246646, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:40:46'),
(246, NULL, NULL, 1680246646, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:40:46'),
(247, NULL, NULL, 1680246665, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:41:05'),
(248, NULL, NULL, 1680246665, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:41:05'),
(249, NULL, NULL, 1680247047, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:47:27'),
(250, NULL, NULL, 1680247201, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:01'),
(251, NULL, NULL, 1680247201, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:01'),
(252, NULL, NULL, 1680247219, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:19'),
(253, NULL, NULL, 1680247219, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:19'),
(254, NULL, NULL, 1680247231, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:31'),
(255, NULL, NULL, 1680247231, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:31'),
(256, NULL, NULL, 1680247243, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:43'),
(257, NULL, NULL, 1680247243, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:50:43'),
(258, NULL, NULL, 1680247266, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:06'),
(259, NULL, NULL, 1680247278, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:18'),
(260, NULL, NULL, 1680247281, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:21'),
(261, NULL, NULL, 1680247295, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:35'),
(262, NULL, NULL, 1680247295, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:35'),
(263, NULL, NULL, 1680247304, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:44'),
(264, NULL, NULL, 1680247304, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:51:44'),
(265, NULL, NULL, 1680247353, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:52:33'),
(266, NULL, NULL, 1680247353, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:52:33'),
(267, NULL, NULL, 1680247366, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:52:46'),
(268, NULL, NULL, 1680247366, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:52:46'),
(269, NULL, NULL, 1680247402, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:22'),
(270, NULL, NULL, 1680247402, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:22'),
(271, NULL, NULL, 1680247410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:30'),
(272, NULL, NULL, 1680247410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:30'),
(273, NULL, NULL, 1680247413, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:33'),
(274, NULL, NULL, 1680247413, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:33'),
(275, NULL, NULL, 1680247420, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:40'),
(276, NULL, NULL, 1680247420, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:53:40'),
(277, NULL, NULL, 1680247446, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:06'),
(278, NULL, NULL, 1680247447, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:07'),
(279, NULL, NULL, 1680247448, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:08'),
(280, NULL, NULL, 1680247448, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:08'),
(281, NULL, NULL, 1680247454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:14'),
(282, NULL, NULL, 1680247454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:14'),
(283, NULL, NULL, 1680247464, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:24'),
(284, NULL, NULL, 1680247464, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:24'),
(285, NULL, NULL, 1680247481, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:41'),
(286, NULL, NULL, 1680247498, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:54:58'),
(287, NULL, NULL, 1680247502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:02'),
(288, NULL, NULL, 1680247502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:02'),
(289, NULL, NULL, 1680247507, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:07'),
(290, NULL, NULL, 1680247507, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:07'),
(291, NULL, NULL, 1680247532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:32'),
(292, NULL, NULL, 1680247537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:37'),
(293, NULL, NULL, 1680247537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:37'),
(294, NULL, NULL, 1680247541, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:41'),
(295, NULL, NULL, 1680247541, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:41'),
(296, NULL, NULL, 1680247547, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:47'),
(297, NULL, NULL, 1680247547, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:55:47'),
(298, NULL, NULL, 1680247580, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:20'),
(299, NULL, NULL, 1680247584, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:24'),
(300, NULL, NULL, 1680247584, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:24'),
(301, NULL, NULL, 1680247590, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:30'),
(302, NULL, NULL, 1680247596, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:36'),
(303, NULL, NULL, 1680247602, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:42'),
(304, NULL, NULL, 1680247611, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:51'),
(305, NULL, NULL, 1680247619, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:56:59'),
(306, NULL, NULL, 1680247626, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:57:06'),
(307, NULL, NULL, 1680247653, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:57:33'),
(308, NULL, NULL, 1680247667, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:57:47'),
(309, NULL, NULL, 1680247677, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:57:57'),
(310, NULL, NULL, 1680247682, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:02'),
(311, NULL, NULL, 1680247684, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:04'),
(312, NULL, NULL, 1680247698, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:18'),
(313, NULL, NULL, 1680247711, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:31'),
(314, NULL, NULL, 1680247719, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:39'),
(315, NULL, NULL, 1680247725, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:45'),
(316, NULL, NULL, 1680247733, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:58:53'),
(317, NULL, NULL, 1680247743, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:59:03'),
(318, NULL, NULL, 1680247743, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:59:03'),
(319, NULL, NULL, 1680247765, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:59:25'),
(320, NULL, NULL, 1680247767, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:59:27'),
(321, NULL, NULL, 1680247777, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:59:37'),
(322, NULL, NULL, 1680247781, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 12:59:41'),
(323, NULL, NULL, 1680247895, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:35'),
(324, NULL, NULL, 1680247895, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:35'),
(325, NULL, NULL, 1680247896, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:36'),
(326, NULL, NULL, 1680247896, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:36'),
(327, NULL, NULL, 1680247899, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:39'),
(328, NULL, NULL, 1680247899, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:39'),
(329, NULL, NULL, 1680247910, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:50'),
(330, NULL, NULL, 1680247913, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:53'),
(331, NULL, NULL, 1680247913, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:53'),
(332, NULL, NULL, 1680247918, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:58'),
(333, NULL, NULL, 1680247918, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:01:58'),
(334, NULL, NULL, 1680247924, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:02:04'),
(335, NULL, NULL, 1680247924, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:02:04'),
(336, NULL, NULL, 1680247927, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:02:07'),
(337, NULL, NULL, 1680247942, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:02:22'),
(338, NULL, NULL, 1680247947, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:02:27'),
(339, NULL, NULL, 1680247960, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:02:40'),
(340, NULL, NULL, 1680247995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:15'),
(341, NULL, NULL, 1680247995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:15'),
(342, NULL, NULL, 1680247999, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:19'),
(343, NULL, NULL, 1680247999, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:19'),
(344, NULL, NULL, 1680248018, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:38'),
(345, NULL, NULL, 1680248018, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:38'),
(346, NULL, NULL, 1680248026, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:46'),
(347, NULL, NULL, 1680248026, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:46'),
(348, NULL, NULL, 1680248029, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:49'),
(349, NULL, NULL, 1680248037, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:03:57'),
(350, NULL, NULL, 1680248042, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:02'),
(351, NULL, NULL, 1680248042, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:02'),
(352, NULL, NULL, 1680248048, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:08'),
(353, NULL, NULL, 1680248048, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:08'),
(354, NULL, NULL, 1680248058, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:18'),
(355, NULL, NULL, 1680248058, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:18'),
(356, NULL, NULL, 1680248064, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:24'),
(357, NULL, NULL, 1680248064, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:24'),
(358, NULL, NULL, 1680248069, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:29'),
(359, NULL, NULL, 1680248069, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:29'),
(360, NULL, NULL, 1680248078, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:04:38'),
(361, NULL, NULL, 1680248103, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:05:03'),
(362, NULL, NULL, 1680248103, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:05:03'),
(363, NULL, NULL, 1680248112, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:05:12'),
(364, NULL, NULL, 1680248112, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:05:12'),
(365, NULL, NULL, 1680248137, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:05:37'),
(366, NULL, NULL, 1680248137, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:05:37'),
(367, NULL, NULL, 1680248160, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:00'),
(368, NULL, NULL, 1680248162, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:02'),
(369, NULL, NULL, 1680248162, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:02'),
(370, NULL, NULL, 1680248174, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:14'),
(371, NULL, NULL, 1680248174, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:14'),
(372, NULL, NULL, 1680248198, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:38'),
(373, NULL, NULL, 1680248198, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:06:38'),
(374, NULL, NULL, 1680248324, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:08:44'),
(375, NULL, NULL, 1680248327, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:08:47'),
(376, NULL, NULL, 1680248327, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:08:48'),
(377, NULL, NULL, 1680248391, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:09:51'),
(378, NULL, NULL, 1680248391, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:09:51'),
(379, NULL, NULL, 1680248536, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:12:16'),
(380, NULL, NULL, 1680248536, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:12:16'),
(381, NULL, NULL, 1680248545, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:12:25'),
(382, NULL, NULL, 1680248545, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:12:25'),
(383, NULL, NULL, 1680248563, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:12:43'),
(384, NULL, NULL, 1680248563, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:12:43'),
(385, NULL, NULL, 1680248566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:12:46'),
(386, NULL, NULL, 1680248566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:12:46'),
(387, NULL, NULL, 1680248597, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:13:17'),
(388, NULL, NULL, 1680248636, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:13:56'),
(389, NULL, NULL, 1680248636, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:13:56'),
(390, NULL, NULL, 1680248661, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:14:21'),
(391, NULL, NULL, 1680248717, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:15:17'),
(392, NULL, NULL, 1680248724, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:15:24'),
(393, NULL, NULL, 1680248808, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:16:48'),
(394, NULL, NULL, 1680248808, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:16:48'),
(395, NULL, NULL, 1680248818, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:16:58'),
(396, NULL, NULL, 1680248822, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:02'),
(397, NULL, NULL, 1680248822, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:02'),
(398, NULL, NULL, 1680248828, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:08'),
(399, NULL, NULL, 1680248833, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:13'),
(400, NULL, NULL, 1680248836, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:16'),
(401, NULL, NULL, 1680248840, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:20'),
(402, NULL, NULL, 1680248843, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:23'),
(403, NULL, NULL, 1680248849, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:29'),
(404, NULL, NULL, 1680248858, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:38'),
(405, NULL, NULL, 1680248858, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:38'),
(406, NULL, NULL, 1680248868, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:17:48'),
(407, NULL, NULL, 1680248892, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:12'),
(408, NULL, NULL, 1680248894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:14'),
(409, NULL, NULL, 1680248895, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:15'),
(410, NULL, NULL, 1680248905, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:25'),
(411, NULL, NULL, 1680248905, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:25'),
(412, NULL, NULL, 1680248930, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:50');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(413, NULL, NULL, 1680248930, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:50'),
(414, NULL, NULL, 1680248932, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:52'),
(415, NULL, NULL, 1680248932, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:18:52'),
(416, NULL, NULL, 1680248953, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:13'),
(417, NULL, NULL, 1680248953, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:13'),
(418, NULL, NULL, 1680248959, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:19'),
(419, NULL, NULL, 1680248959, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:19'),
(420, NULL, NULL, 1680248969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:29'),
(421, NULL, NULL, 1680248969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:29'),
(422, NULL, NULL, 1680248970, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:30'),
(423, NULL, NULL, 1680248970, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:19:30'),
(424, NULL, NULL, 1680249008, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:20:08'),
(425, NULL, NULL, 1680249016, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:20:16'),
(426, NULL, NULL, 1680249016, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:20:16'),
(427, NULL, NULL, 1680249032, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:20:32'),
(428, NULL, NULL, 1680249037, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:20:37'),
(429, NULL, NULL, 1680249075, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:21:15'),
(430, NULL, NULL, 1680249077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:21:17'),
(431, NULL, NULL, 1680249081, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:21:21'),
(432, NULL, NULL, 1680249081, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:21:21'),
(433, NULL, NULL, 1680249163, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:22:43'),
(434, NULL, NULL, 1680249166, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:22:46'),
(435, NULL, NULL, 1680249171, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:22:51'),
(436, NULL, NULL, 1680249175, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:22:55'),
(437, NULL, NULL, 1680249175, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:22:55'),
(438, NULL, NULL, 1680249186, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:23:06'),
(439, NULL, NULL, 1680249193, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:23:13'),
(440, NULL, NULL, 1680249193, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:23:13'),
(441, NULL, NULL, 1680249230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:23:50'),
(442, NULL, NULL, 1680249251, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:11'),
(443, NULL, NULL, 1680249254, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:14'),
(444, NULL, NULL, 1680249254, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:14'),
(445, NULL, NULL, 1680249271, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:31'),
(446, NULL, NULL, 1680249271, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:31'),
(447, NULL, NULL, 1680249284, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:44'),
(448, NULL, NULL, 1680249294, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:54'),
(449, NULL, NULL, 1680249294, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:24:54'),
(450, NULL, NULL, 1680249311, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:11'),
(451, NULL, NULL, 1680249319, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:19'),
(452, NULL, NULL, 1680249319, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:19'),
(453, NULL, NULL, 1680249326, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:26'),
(454, NULL, NULL, 1680249331, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:31'),
(455, NULL, NULL, 1680249333, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:33'),
(456, NULL, NULL, 1680249333, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:33'),
(457, NULL, NULL, 1680249343, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:43'),
(458, NULL, NULL, 1680249345, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:25:45'),
(459, NULL, NULL, 1680250409, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:29'),
(460, NULL, NULL, 1680250409, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:29'),
(461, NULL, NULL, 1680250409, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:29'),
(462, NULL, NULL, 1680250423, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:43:43'),
(463, NULL, NULL, 1680250426, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:43:46'),
(464, NULL, NULL, 1680250430, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:50'),
(465, NULL, NULL, 1680250433, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:53'),
(466, NULL, NULL, 1680250433, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:53'),
(467, NULL, NULL, 1680250438, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:43:58'),
(468, NULL, NULL, 1680250438, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:43:58'),
(469, NULL, NULL, 1680250440, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:00'),
(470, NULL, NULL, 1680250442, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:44:02'),
(471, NULL, NULL, 1680250444, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:44:04'),
(472, NULL, NULL, 1680250445, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:44:05'),
(473, NULL, NULL, 1680250447, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:44:07'),
(474, NULL, NULL, 1680250449, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:09'),
(475, NULL, NULL, 1680250449, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:09'),
(476, NULL, NULL, 1680250456, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:16'),
(477, NULL, NULL, 1680250456, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:16'),
(478, NULL, NULL, 1680250484, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:44'),
(479, NULL, NULL, 1680250486, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:46'),
(480, NULL, NULL, 1680250487, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:47'),
(481, NULL, NULL, 1680250492, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:52'),
(482, NULL, NULL, 1680250492, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:52'),
(483, NULL, NULL, 1680250499, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:59'),
(484, NULL, NULL, 1680250499, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:44:59'),
(485, NULL, NULL, 1680250502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:45:02'),
(486, NULL, NULL, 1680250511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:45:11'),
(487, NULL, NULL, 1680250522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:45:22'),
(488, NULL, NULL, 1680250527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:45:27'),
(489, NULL, NULL, 1680250532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:45:32'),
(490, NULL, NULL, 1680250561, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:46:01'),
(491, NULL, NULL, 1680250561, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:46:01'),
(492, NULL, NULL, 1680250568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:46:08'),
(493, NULL, NULL, 1680250571, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:46:11'),
(494, NULL, NULL, 1680250574, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:46:14'),
(495, NULL, NULL, 1680250575, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:46:15'),
(496, NULL, NULL, 1680250583, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:46:23'),
(497, NULL, NULL, 1680250649, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:47:29'),
(498, NULL, NULL, 1680250656, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:47:36'),
(499, NULL, NULL, 1680250656, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:47:36'),
(500, NULL, NULL, 1680250664, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:47:44'),
(501, NULL, NULL, 1680250666, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:47:46'),
(502, NULL, NULL, 1680250687, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-03-31 13:48:07'),
(503, NULL, NULL, 1680250694, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:48:14'),
(504, NULL, NULL, 1680250694, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:48:14'),
(505, NULL, NULL, 1680250731, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:48:51'),
(506, NULL, NULL, 1680250731, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:48:51'),
(507, NULL, NULL, 1680250773, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:49:33'),
(508, NULL, NULL, 1680250773, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:49:33'),
(509, NULL, NULL, 1680250778, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:49:38'),
(510, NULL, NULL, 1680250799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:49:59'),
(511, NULL, NULL, 1680250799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:49:59'),
(512, NULL, NULL, 1680250804, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:04'),
(513, NULL, NULL, 1680250805, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:05'),
(514, NULL, NULL, 1680250810, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:10'),
(515, NULL, NULL, 1680250815, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:50:15'),
(516, NULL, NULL, 1680250819, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:19'),
(517, NULL, NULL, 1680250819, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:19'),
(518, NULL, NULL, 1680250834, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:34'),
(519, NULL, NULL, 1680250834, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:34'),
(520, NULL, NULL, 1680250845, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:45'),
(521, NULL, NULL, 1680250845, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:45'),
(522, NULL, NULL, 1680250848, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:48'),
(523, NULL, NULL, 1680250851, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:51'),
(524, NULL, NULL, 1680250853, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:53'),
(525, NULL, NULL, 1680250858, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:58'),
(526, NULL, NULL, 1680250858, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:50:58'),
(527, NULL, NULL, 1680250862, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:51:02'),
(528, NULL, NULL, 1680250879, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:51:19'),
(529, NULL, NULL, 1680250879, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:51:19'),
(530, NULL, NULL, 1680250933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:13'),
(531, NULL, NULL, 1680250933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:13'),
(532, NULL, NULL, 1680250935, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:15'),
(533, NULL, NULL, 1680250935, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:15'),
(534, NULL, NULL, 1680250942, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:22'),
(535, NULL, NULL, 1680250942, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:22'),
(536, NULL, NULL, 1680250946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:26'),
(537, NULL, NULL, 1680250946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:26'),
(538, NULL, NULL, 1680250950, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:30'),
(539, NULL, NULL, 1680250950, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:30'),
(540, NULL, NULL, 1680250954, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:34'),
(541, NULL, NULL, 1680250958, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:38'),
(542, NULL, NULL, 1680250962, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:42'),
(543, NULL, NULL, 1680250965, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:45'),
(544, NULL, NULL, 1680250971, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 13:52:51'),
(545, NULL, NULL, 1680250977, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:57'),
(546, NULL, NULL, 1680250977, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:52:57'),
(547, NULL, NULL, 1680250982, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:53:02'),
(548, NULL, NULL, 1680250982, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:53:02'),
(549, NULL, NULL, 1680251092, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:54:52'),
(550, NULL, NULL, 1680251093, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:54:53'),
(551, NULL, NULL, 1680251214, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:56:54'),
(552, NULL, NULL, 1680251214, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:56:54'),
(553, NULL, NULL, 1680251216, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:56:56'),
(554, NULL, NULL, 1680251216, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:56:56'),
(555, NULL, NULL, 1680251225, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:05'),
(556, NULL, NULL, 1680251225, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:05'),
(557, NULL, NULL, 1680251228, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:08'),
(558, NULL, NULL, 1680251228, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:08'),
(559, NULL, NULL, 1680251233, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:13'),
(560, NULL, NULL, 1680251233, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:13'),
(561, NULL, NULL, 1680251237, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:17'),
(562, NULL, NULL, 1680251238, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:18'),
(563, NULL, NULL, 1680251239, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:19'),
(564, NULL, NULL, 1680251253, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:34'),
(565, NULL, NULL, 1680251254, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:34'),
(566, NULL, NULL, 1680251273, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:53'),
(567, NULL, NULL, 1680251273, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:57:53'),
(568, NULL, NULL, 1680251339, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:58:59'),
(569, NULL, NULL, 1680251345, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:59:05'),
(570, NULL, NULL, 1680251345, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:59:05'),
(571, NULL, NULL, 1680251350, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:59:10'),
(572, NULL, NULL, 1680251386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:59:46'),
(573, NULL, NULL, 1680251386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 13:59:46'),
(574, NULL, NULL, 1680251426, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:26'),
(575, NULL, NULL, 1680251426, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:26'),
(576, NULL, NULL, 1680251434, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:34'),
(577, NULL, NULL, 1680251439, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:00:39'),
(578, NULL, NULL, 1680251445, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:45'),
(579, NULL, NULL, 1680251445, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:45'),
(580, NULL, NULL, 1680251449, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:49'),
(581, NULL, NULL, 1680251453, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:00:53'),
(582, NULL, NULL, 1680251459, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:59'),
(583, NULL, NULL, 1680251459, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:00:59'),
(584, NULL, NULL, 1680251470, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:10'),
(585, NULL, NULL, 1680251472, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:12'),
(586, NULL, NULL, 1680251472, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:12'),
(587, NULL, NULL, 1680251476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:16'),
(588, NULL, NULL, 1680251476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:01:16'),
(589, NULL, NULL, 1680251480, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:20'),
(590, NULL, NULL, 1680251480, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:20'),
(591, NULL, NULL, 1680251483, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:23'),
(592, NULL, NULL, 1680251483, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:01:23'),
(593, NULL, NULL, 1680251497, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:37'),
(594, NULL, NULL, 1680251497, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:37'),
(595, NULL, NULL, 1680251499, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:39'),
(596, NULL, NULL, 1680251499, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:39'),
(597, NULL, NULL, 1680251505, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:45'),
(598, NULL, NULL, 1680251505, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:01:45'),
(599, NULL, NULL, 1680251524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:04'),
(600, NULL, NULL, 1680251524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:04'),
(601, NULL, NULL, 1680251524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:04'),
(602, NULL, NULL, 1680251524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:04'),
(603, NULL, NULL, 1680251527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:07'),
(604, NULL, NULL, 1680251527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:07'),
(605, NULL, NULL, 1680251532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:12'),
(606, NULL, NULL, 1680251532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:12');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(607, NULL, NULL, 1680251535, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:15'),
(608, NULL, NULL, 1680251535, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:15'),
(609, NULL, NULL, 1680251554, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:34'),
(610, NULL, NULL, 1680251554, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:02:34'),
(611, NULL, NULL, 1680251569, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:49'),
(612, NULL, NULL, 1680251569, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:49'),
(613, NULL, NULL, 1680251570, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:50'),
(614, NULL, NULL, 1680251570, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:50'),
(615, NULL, NULL, 1680251573, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:53'),
(616, NULL, NULL, 1680251573, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:53'),
(617, NULL, NULL, 1680251579, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:02:59'),
(618, NULL, NULL, 1680251580, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:00'),
(619, NULL, NULL, 1680251585, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:05'),
(620, NULL, NULL, 1680251585, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:03:05'),
(621, NULL, NULL, 1680251587, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:03:07'),
(622, NULL, NULL, 1680251587, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:07'),
(623, NULL, NULL, 1680251589, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:09'),
(624, NULL, NULL, 1680251589, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:03:09'),
(625, NULL, NULL, 1680251590, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:03:10'),
(626, NULL, NULL, 1680251590, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:03:10'),
(627, NULL, NULL, 1680251592, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:12'),
(628, NULL, NULL, 1680251592, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:12'),
(629, NULL, NULL, 1680251630, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:03:50'),
(630, NULL, NULL, 1680251630, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:50'),
(631, NULL, NULL, 1680251638, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:58'),
(632, NULL, NULL, 1680251638, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:03:58'),
(633, NULL, NULL, 1680251647, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:04:07'),
(634, NULL, NULL, 1680251647, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:04:07'),
(635, NULL, NULL, 1680251659, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:04:19'),
(636, NULL, NULL, 1680251659, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:04:19'),
(637, NULL, NULL, 1680252283, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:14:43'),
(638, NULL, NULL, 1680252284, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:14:44'),
(639, NULL, NULL, 1680252293, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:14:53'),
(640, NULL, NULL, 1680252322, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:15:22'),
(641, NULL, NULL, 1680252322, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:15:22'),
(642, NULL, NULL, 1680252411, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:16:51'),
(643, NULL, NULL, 1680252411, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:16:51'),
(644, NULL, NULL, 1680252485, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:05'),
(645, NULL, NULL, 1680252485, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:05'),
(646, NULL, NULL, 1680252492, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:12'),
(647, NULL, NULL, 1680252492, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:12'),
(648, NULL, NULL, 1680252504, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:24'),
(649, NULL, NULL, 1680252504, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:24'),
(650, NULL, NULL, 1680252507, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:27'),
(651, NULL, NULL, 1680252507, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:27'),
(652, NULL, NULL, 1680252520, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:40'),
(653, NULL, NULL, 1680252520, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:40'),
(654, NULL, NULL, 1680252521, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:41'),
(655, NULL, NULL, 1680252521, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:41'),
(656, NULL, NULL, 1680252527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:47'),
(657, NULL, NULL, 1680252527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:47'),
(658, NULL, NULL, 1680252527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:47'),
(659, NULL, NULL, 1680252527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:47'),
(660, NULL, NULL, 1680252537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:57'),
(661, NULL, NULL, 1680252537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:57'),
(662, NULL, NULL, 1680252537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:57'),
(663, NULL, NULL, 1680252537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:18:57'),
(664, NULL, NULL, 1680252561, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:21'),
(665, NULL, NULL, 1680252561, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:21'),
(666, NULL, NULL, 1680252561, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:21'),
(667, NULL, NULL, 1680252561, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:21'),
(668, NULL, NULL, 1680252563, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:23'),
(669, NULL, NULL, 1680252563, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:23'),
(670, NULL, NULL, 1680252570, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:30'),
(671, NULL, NULL, 1680252570, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:30'),
(672, NULL, NULL, 1680252578, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:38'),
(673, NULL, NULL, 1680252578, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:38'),
(674, NULL, NULL, 1680252594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:54'),
(675, NULL, NULL, 1680252594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:19:54'),
(676, NULL, NULL, 1680252610, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:20:10'),
(677, NULL, NULL, 1680252610, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:20:10'),
(678, NULL, NULL, 1680252669, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:09'),
(679, NULL, NULL, 1680252669, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:09'),
(680, NULL, NULL, 1680252670, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:10'),
(681, NULL, NULL, 1680252670, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:10'),
(682, NULL, NULL, 1680252670, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:10'),
(683, NULL, NULL, 1680252670, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:10'),
(684, NULL, NULL, 1680252676, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:16'),
(685, NULL, NULL, 1680252677, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:21:17'),
(686, NULL, NULL, 1680252933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:25:33'),
(687, NULL, NULL, 1680252933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:25:33'),
(688, NULL, NULL, 1680252995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:26:35'),
(689, NULL, NULL, 1680252995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:26:35'),
(690, NULL, NULL, 1680253041, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:27:21'),
(691, NULL, NULL, 1680253041, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:27:21'),
(692, NULL, NULL, 1680253075, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:27:55'),
(693, NULL, NULL, 1680253075, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:27:55'),
(694, NULL, NULL, 1680253082, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:28:02'),
(695, NULL, NULL, 1680253082, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:28:02'),
(696, NULL, NULL, 1680253087, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 14:28:07'),
(697, NULL, NULL, 1680253087, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:28:07'),
(698, NULL, NULL, 1680253095, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:28:15'),
(699, NULL, NULL, 1680253095, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:28:15'),
(700, NULL, NULL, 1680253123, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:28:43'),
(701, NULL, NULL, 1680253123, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:28:43'),
(702, NULL, NULL, 1680253145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:05'),
(703, NULL, NULL, 1680253145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:05'),
(704, NULL, NULL, 1680253145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:05'),
(705, NULL, NULL, 1680253145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:05'),
(706, NULL, NULL, 1680253145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:05'),
(707, NULL, NULL, 1680253145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:05'),
(708, NULL, NULL, 1680253154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:14'),
(709, NULL, NULL, 1680253154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:14'),
(710, NULL, NULL, 1680253154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:14'),
(711, NULL, NULL, 1680253154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:14'),
(712, NULL, NULL, 1680253154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:14'),
(713, NULL, NULL, 1680253154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:14'),
(714, NULL, NULL, 1680253180, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:40'),
(715, NULL, NULL, 1680253180, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:40'),
(716, NULL, NULL, 1680253189, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:49'),
(717, NULL, NULL, 1680253189, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:29:49'),
(718, NULL, NULL, 1680253384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:04'),
(719, NULL, NULL, 1680253384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:04'),
(720, NULL, NULL, 1680253384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:04'),
(721, NULL, NULL, 1680253384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:04'),
(722, NULL, NULL, 1680253384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:04'),
(723, NULL, NULL, 1680253384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:04'),
(724, NULL, NULL, 1680253386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:06'),
(725, NULL, NULL, 1680253386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:33:06'),
(726, NULL, NULL, 1680253529, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:29'),
(727, NULL, NULL, 1680253529, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:29'),
(728, NULL, NULL, 1680253530, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:30'),
(729, NULL, NULL, 1680253530, 'timeSheet method of attendanceController ', '::ffff:192.168.1.28', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:30'),
(730, NULL, NULL, 1680253530, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:30'),
(731, NULL, NULL, 1680253530, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:30'),
(732, NULL, NULL, 1680253530, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:30'),
(733, NULL, NULL, 1680253530, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:30'),
(734, NULL, NULL, 1680253546, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:46'),
(735, NULL, NULL, 1680253546, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 14:35:46'),
(736, NULL, NULL, 1680255587, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:09:47'),
(737, NULL, NULL, 1680255587, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:09:47'),
(738, NULL, NULL, 1680255614, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:10:14'),
(739, NULL, NULL, 1680255614, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:10:14'),
(740, NULL, NULL, 1680255636, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:10:36'),
(741, NULL, NULL, 1680255636, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:36'),
(742, NULL, NULL, 1680255638, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:38'),
(743, NULL, NULL, 1680255638, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:10:38'),
(744, NULL, NULL, 1680255640, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:10:40'),
(745, NULL, NULL, 1680255640, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:40'),
(746, NULL, NULL, 1680255641, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:41'),
(747, NULL, NULL, 1680255641, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:41'),
(748, NULL, NULL, 1680255643, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:43'),
(749, NULL, NULL, 1680255643, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:43'),
(750, NULL, NULL, 1680255644, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:44'),
(751, NULL, NULL, 1680255644, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:44'),
(752, NULL, NULL, 1680255646, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 15:10:46'),
(753, NULL, NULL, 1680255646, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:10:46'),
(754, NULL, NULL, 1680255665, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:05'),
(755, NULL, NULL, 1680255665, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:05'),
(756, NULL, NULL, 1680255682, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:22'),
(757, NULL, NULL, 1680255682, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:22'),
(758, NULL, NULL, 1680255696, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:36'),
(759, NULL, NULL, 1680255696, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:36'),
(760, NULL, NULL, 1680255697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:37'),
(761, NULL, NULL, 1680255697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:11:37'),
(762, NULL, NULL, 1680256175, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:19:35'),
(763, NULL, NULL, 1680256175, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:19:35'),
(764, NULL, NULL, 1680256277, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:21:17'),
(765, NULL, NULL, 1680256277, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:21:17'),
(766, NULL, NULL, 1680256416, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:23:36'),
(767, NULL, NULL, 1680256416, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:23:36'),
(768, NULL, NULL, 1680256416, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:23:36'),
(769, NULL, NULL, 1680256416, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:23:36'),
(770, NULL, NULL, 1680256431, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:23:51'),
(771, NULL, NULL, 1680256431, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:23:51'),
(772, NULL, NULL, 1680256511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:25:11'),
(773, NULL, NULL, 1680256511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:25:11'),
(774, NULL, NULL, 1680256558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:25:58'),
(775, NULL, NULL, 1680256558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:25:58'),
(776, NULL, NULL, 1680256574, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:26:14'),
(777, NULL, NULL, 1680256574, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:26:14'),
(778, NULL, NULL, 1680256679, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:27:59'),
(779, NULL, NULL, 1680256679, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:27:59'),
(780, NULL, NULL, 1680256689, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:28:09'),
(781, NULL, NULL, 1680256689, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:28:09'),
(782, NULL, NULL, 1680256715, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:28:35'),
(783, NULL, NULL, 1680256715, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:28:36'),
(784, NULL, NULL, 1680256731, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:28:51'),
(785, NULL, NULL, 1680256731, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:28:51'),
(786, NULL, NULL, 1680256846, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:30:46'),
(787, NULL, NULL, 1680256846, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:30:46'),
(788, NULL, NULL, 1680256871, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:31:11'),
(789, NULL, NULL, 1680256871, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:31:11'),
(790, NULL, NULL, 1680257076, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:34:36'),
(791, NULL, NULL, 1680257076, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:34:36'),
(792, NULL, NULL, 1680257083, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:34:43'),
(793, NULL, NULL, 1680257083, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:34:43'),
(794, NULL, NULL, 1680257164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:36:04'),
(795, NULL, NULL, 1680257164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:36:04'),
(796, NULL, NULL, 1680257180, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:36:20'),
(797, NULL, NULL, 1680257180, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:36:20'),
(798, NULL, NULL, 1680257199, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:36:39');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(799, NULL, NULL, 1680257199, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:36:39'),
(800, NULL, NULL, 1680257221, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:37:01'),
(801, NULL, NULL, 1680257221, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:37:01'),
(802, NULL, NULL, 1680257329, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:38:49'),
(803, NULL, NULL, 1680257329, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:38:49'),
(804, NULL, NULL, 1680257351, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:11'),
(805, NULL, NULL, 1680257351, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:11'),
(806, NULL, NULL, 1680257363, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:23'),
(807, NULL, NULL, 1680257363, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:23'),
(808, NULL, NULL, 1680257378, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:38'),
(809, NULL, NULL, 1680257378, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:38'),
(810, NULL, NULL, 1680257390, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:50'),
(811, NULL, NULL, 1680257390, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:39:50'),
(812, NULL, NULL, 1680257420, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:40:20'),
(813, NULL, NULL, 1680257420, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:40:20'),
(814, NULL, NULL, 1680257511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:41:51'),
(815, NULL, NULL, 1680257511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:41:51'),
(816, NULL, NULL, 1680257512, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:41:52'),
(817, NULL, NULL, 1680257512, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:41:52'),
(818, NULL, NULL, 1680257542, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:42:22'),
(819, NULL, NULL, 1680257542, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:42:22'),
(820, NULL, NULL, 1680257658, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:44:18'),
(821, NULL, NULL, 1680257658, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:44:18'),
(822, NULL, NULL, 1680257658, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:44:18'),
(823, NULL, NULL, 1680257658, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:44:18'),
(824, NULL, NULL, 1680257693, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:44:53'),
(825, NULL, NULL, 1680257693, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:44:53'),
(826, NULL, NULL, 1680257831, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:47:11'),
(827, NULL, NULL, 1680257831, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:47:11'),
(828, NULL, NULL, 1680257845, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:47:25'),
(829, NULL, NULL, 1680257845, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:47:25'),
(830, NULL, NULL, 1680257860, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:47:40'),
(831, NULL, NULL, 1680257860, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:47:40'),
(832, NULL, NULL, 1680257985, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:49:45'),
(833, NULL, NULL, 1680257985, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:49:45'),
(834, NULL, NULL, 1680258128, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:52:08'),
(835, NULL, NULL, 1680258128, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:52:08'),
(836, NULL, NULL, 1680258160, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:52:40'),
(837, NULL, NULL, 1680258160, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:52:40'),
(838, NULL, NULL, 1680258168, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:52:48'),
(839, NULL, NULL, 1680258168, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:52:48'),
(840, NULL, NULL, 1680258180, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:53:00'),
(841, NULL, NULL, 1680258180, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:53:00'),
(842, NULL, NULL, 1680258233, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:53:53'),
(843, NULL, NULL, 1680258233, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:53:54'),
(844, NULL, NULL, 1680258273, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:54:33'),
(845, NULL, NULL, 1680258273, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:54:33'),
(846, NULL, NULL, 1680258350, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:55:50'),
(847, NULL, NULL, 1680258350, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:55:50'),
(848, NULL, NULL, 1680258417, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:56:57'),
(849, NULL, NULL, 1680258417, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:56:57'),
(850, NULL, NULL, 1680258512, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:58:32'),
(851, NULL, NULL, 1680258512, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:58:32'),
(852, NULL, NULL, 1680258545, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:59:05'),
(853, NULL, NULL, 1680258545, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 15:59:05'),
(854, NULL, NULL, 1680258673, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:01:13'),
(855, NULL, NULL, 1680258673, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:01:13'),
(856, 119, 6, 1680258686, 'createUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-31 16:01:26'),
(857, NULL, NULL, 1680258728, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:08'),
(858, NULL, NULL, 1680258728, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:08'),
(859, NULL, NULL, 1680258758, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:38'),
(860, NULL, NULL, 1680258758, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:38'),
(861, NULL, NULL, 1680258758, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:38'),
(862, NULL, NULL, 1680258758, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:38'),
(863, NULL, NULL, 1680258771, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:51'),
(864, NULL, NULL, 1680258771, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:51'),
(865, NULL, NULL, 1680258771, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:51'),
(866, NULL, NULL, 1680258771, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:02:51'),
(867, NULL, NULL, 1680258919, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:05:19'),
(868, NULL, NULL, 1680258919, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:05:19'),
(869, NULL, NULL, 1680258946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:05:46'),
(870, NULL, NULL, 1680258946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:05:46'),
(871, NULL, NULL, 1680258960, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:00'),
(872, NULL, NULL, 1680258960, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:00'),
(873, NULL, NULL, 1680258969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:09'),
(874, NULL, NULL, 1680258969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:09'),
(875, 0, 0, 1680258988, 'createUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'panCardName.mv is not a function', '2023-03-31 16:06:28'),
(876, NULL, NULL, 1680258993, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:33'),
(877, NULL, NULL, 1680258993, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:33'),
(878, NULL, NULL, 1680259016, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:56'),
(879, NULL, NULL, 1680259016, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:06:56'),
(880, NULL, NULL, 1680259043, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:07:23'),
(881, NULL, NULL, 1680259043, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:07:23'),
(882, NULL, NULL, 1680259076, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:07:56'),
(883, NULL, NULL, 1680259076, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:07:56'),
(884, NULL, NULL, 1680259077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:07:57'),
(885, NULL, NULL, 1680259077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:07:57'),
(886, NULL, NULL, 1680259083, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:08:03'),
(887, NULL, NULL, 1680259083, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:08:03'),
(888, NULL, NULL, 1680259104, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:08:24'),
(889, NULL, NULL, 1680259104, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:08:24'),
(890, NULL, NULL, 1680259150, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:09:10'),
(891, NULL, NULL, 1680259150, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:09:10'),
(892, NULL, NULL, 1680259186, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:09:46'),
(893, NULL, NULL, 1680259186, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:09:46'),
(894, NULL, NULL, 1680259203, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:10:03'),
(895, NULL, NULL, 1680259203, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:10:03'),
(896, NULL, NULL, 1680259215, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:10:15'),
(897, NULL, NULL, 1680259215, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:10:15'),
(898, NULL, NULL, 1680259227, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:10:27'),
(899, NULL, NULL, 1680259227, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:10:27'),
(900, NULL, NULL, 1680259309, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:11:49'),
(901, NULL, NULL, 1680259310, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:11:50'),
(902, NULL, NULL, 1680259323, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:12:03'),
(903, NULL, NULL, 1680259324, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:12:04'),
(904, NULL, NULL, 1680259553, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:15:53'),
(905, NULL, NULL, 1680259553, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:15:53'),
(906, NULL, NULL, 1680259624, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:17:04'),
(907, NULL, NULL, 1680259625, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:17:05'),
(908, NULL, NULL, 1680259728, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:18:48'),
(909, NULL, NULL, 1680259728, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:18:48'),
(910, NULL, NULL, 1680259803, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:20:03'),
(911, NULL, NULL, 1680259803, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:20:03'),
(912, NULL, NULL, 1680259803, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:20:03'),
(913, NULL, NULL, 1680259803, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:20:03'),
(914, NULL, NULL, 1680259817, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:20:17'),
(915, NULL, NULL, 1680259817, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:20:17'),
(916, NULL, NULL, 1680259817, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:20:17'),
(917, NULL, NULL, 1680259817, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:20:17'),
(918, NULL, NULL, 1680259887, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:21:27'),
(919, NULL, NULL, 1680259887, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:21:27'),
(920, NULL, NULL, 1680259899, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:21:39'),
(921, NULL, NULL, 1680259899, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:21:39'),
(922, 120, 6, 1680259906, 'createUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User created successfully', '2023-03-31 16:21:46'),
(923, NULL, NULL, 1680259922, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:22:02'),
(924, NULL, NULL, 1680259922, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:22:02'),
(925, NULL, NULL, 1680259945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:22:25'),
(926, NULL, NULL, 1680259945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:22:25'),
(927, NULL, NULL, 1680259954, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:22:34'),
(928, NULL, NULL, 1680259954, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:22:34'),
(929, NULL, NULL, 1680259979, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:00'),
(930, NULL, NULL, 1680259980, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:00'),
(931, NULL, NULL, 1680260006, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:26'),
(932, NULL, NULL, 1680260006, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:26'),
(933, NULL, NULL, 1680260027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:47'),
(934, NULL, NULL, 1680260027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:23:47'),
(935, NULL, NULL, 1680260027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:47'),
(936, NULL, NULL, 1680260030, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:50'),
(937, NULL, NULL, 1680260030, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:50'),
(938, NULL, NULL, 1680260035, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:55'),
(939, NULL, NULL, 1680260036, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:23:56'),
(940, NULL, NULL, 1680260050, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:24:10'),
(941, NULL, NULL, 1680260050, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:24:10'),
(942, NULL, NULL, 1680260056, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:24:16'),
(943, NULL, NULL, 1680260057, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:24:17'),
(944, NULL, NULL, 1680260062, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:24:22'),
(945, NULL, NULL, 1680260063, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:24:23'),
(946, NULL, NULL, 1680260063, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:24:23'),
(947, NULL, NULL, 1680260098, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:24:58'),
(948, NULL, NULL, 1680260098, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:24:58'),
(949, NULL, NULL, 1680260166, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:26:06'),
(950, NULL, NULL, 1680260166, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:26:06'),
(951, NULL, NULL, 1680260225, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:27:05'),
(952, NULL, NULL, 1680260225, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:27:05'),
(953, NULL, NULL, 1680260225, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:27:05'),
(954, NULL, NULL, 1680260225, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:27:05'),
(955, NULL, NULL, 1680260230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:27:10'),
(956, NULL, NULL, 1680260230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:27:10'),
(957, NULL, NULL, 1680260231, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:27:11'),
(958, NULL, NULL, 1680260231, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:27:11'),
(959, NULL, NULL, 1680260286, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:06'),
(960, NULL, NULL, 1680260286, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:06'),
(961, NULL, NULL, 1680260303, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:23'),
(962, NULL, NULL, 1680260303, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:23'),
(963, NULL, NULL, 1680260304, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:24'),
(964, NULL, NULL, 1680260304, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:24'),
(965, NULL, NULL, 1680260329, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:49'),
(966, NULL, NULL, 1680260329, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:28:49'),
(967, NULL, NULL, 1680260407, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:30:07'),
(968, NULL, NULL, 1680260407, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:30:07'),
(969, NULL, NULL, 1680260663, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:34:23'),
(970, NULL, NULL, 1680260663, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:34:23'),
(971, NULL, NULL, 1680260764, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:04'),
(972, NULL, NULL, 1680260764, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:04'),
(973, NULL, NULL, 1680260774, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:14'),
(974, NULL, NULL, 1680260774, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:14'),
(975, NULL, NULL, 1680260782, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:22'),
(976, NULL, NULL, 1680260782, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:22'),
(977, NULL, NULL, 1680260805, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:45'),
(978, NULL, NULL, 1680260805, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:45'),
(979, NULL, NULL, 1680260816, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:56'),
(980, NULL, NULL, 1680260816, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:36:56'),
(981, NULL, NULL, 1680260882, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:38:02'),
(982, NULL, NULL, 1680260882, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:38:02'),
(983, NULL, NULL, 1680260902, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:38:22'),
(984, NULL, NULL, 1680260902, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:38:22'),
(985, NULL, NULL, 1680260907, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:38:27'),
(986, NULL, NULL, 1680260907, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:38:27'),
(987, NULL, NULL, 1680260922, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:38:42'),
(988, NULL, NULL, 1680260922, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:38:42'),
(989, NULL, NULL, 1680260938, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:38:58'),
(990, NULL, NULL, 1680260938, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:38:58'),
(991, NULL, NULL, 1680261005, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:40:05');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(992, NULL, NULL, 1680261005, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:40:05'),
(993, NULL, NULL, 1680261006, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:40:06'),
(994, NULL, NULL, 1680261006, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:40:06'),
(995, NULL, NULL, 1680261145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:42:25'),
(996, NULL, NULL, 1680261145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:42:25'),
(997, NULL, NULL, 1680261145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:25'),
(998, NULL, NULL, 1680261145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:25'),
(999, NULL, NULL, 1680261154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:34'),
(1000, NULL, NULL, 1680261154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:34'),
(1001, NULL, NULL, 1680261154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:42:34'),
(1002, NULL, NULL, 1680261154, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:42:34'),
(1003, NULL, NULL, 1680261156, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:36'),
(1004, NULL, NULL, 1680261156, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:36'),
(1005, NULL, NULL, 1680261170, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:50'),
(1006, NULL, NULL, 1680261170, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:50'),
(1007, NULL, NULL, 1680261174, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:54'),
(1008, NULL, NULL, 1680261174, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:42:54'),
(1009, NULL, NULL, 1680261193, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:43:14'),
(1010, NULL, NULL, 1680261194, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:43:14'),
(1011, NULL, NULL, 1680261230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:43:50'),
(1012, NULL, NULL, 1680261230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:43:50'),
(1013, NULL, NULL, 1680261250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:44:10'),
(1014, NULL, NULL, 1680261250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:44:10'),
(1015, NULL, NULL, 1680261318, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:45:18'),
(1016, NULL, NULL, 1680261318, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:45:18'),
(1017, NULL, NULL, 1680261344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:45:44'),
(1018, NULL, NULL, 1680261344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:45:44'),
(1019, NULL, NULL, 1680261365, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:46:05'),
(1020, NULL, NULL, 1680261365, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:46:05'),
(1021, NULL, NULL, 1680261415, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:46:55'),
(1022, NULL, NULL, 1680261415, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:46:55'),
(1023, NULL, NULL, 1680261565, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:49:25'),
(1024, NULL, NULL, 1680261565, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:49:25'),
(1025, NULL, NULL, 1680261570, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:49:30'),
(1026, NULL, NULL, 1680261570, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:49:30'),
(1027, NULL, NULL, 1680261712, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:51:52'),
(1028, NULL, NULL, 1680261712, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:51:52'),
(1029, NULL, NULL, 1680261863, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:54:23'),
(1030, NULL, NULL, 1680261863, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:54:23'),
(1031, NULL, NULL, 1680261889, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:54:49'),
(1032, NULL, NULL, 1680261889, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:54:49'),
(1033, NULL, NULL, 1680261906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:55:06'),
(1034, NULL, NULL, 1680261906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:55:06'),
(1035, NULL, NULL, 1680261937, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:55:37'),
(1036, NULL, NULL, 1680261937, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:55:37'),
(1037, NULL, NULL, 1680261940, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:55:40'),
(1038, NULL, NULL, 1680261940, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:55:40'),
(1039, NULL, NULL, 1680262059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:57:39'),
(1040, NULL, NULL, 1680262059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:57:39'),
(1041, NULL, NULL, 1680262080, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:58:00'),
(1042, NULL, NULL, 1680262080, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:58:00'),
(1043, NULL, NULL, 1680262109, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:58:29'),
(1044, NULL, NULL, 1680262109, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 16:58:29'),
(1045, NULL, NULL, 1680262153, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:13'),
(1046, NULL, NULL, 1680262153, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:13'),
(1047, NULL, NULL, 1680262173, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:33'),
(1048, NULL, NULL, 1680262173, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:33'),
(1049, NULL, NULL, 1680262175, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:35'),
(1050, NULL, NULL, 1680262175, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:35'),
(1051, NULL, NULL, 1680262182, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:42'),
(1052, NULL, NULL, 1680262182, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 16:59:42'),
(1053, NULL, NULL, 1680262312, 'timeSheet method of attendanceController ', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:01:52'),
(1054, NULL, NULL, 1680262319, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:01:59'),
(1055, NULL, NULL, 1680262319, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:01:59'),
(1056, NULL, NULL, 1680262327, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:02:07'),
(1057, NULL, NULL, 1680262327, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:02:07'),
(1058, NULL, NULL, 1680262340, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:02:20'),
(1059, NULL, NULL, 1680262340, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:02:20'),
(1060, NULL, NULL, 1680262340, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:02:20'),
(1061, NULL, NULL, 1680262340, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:02:20'),
(1062, NULL, NULL, 1680262381, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:03:01'),
(1063, NULL, NULL, 1680262381, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:03:01'),
(1064, NULL, NULL, 1680262422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:03:42'),
(1065, NULL, NULL, 1680262422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:03:42'),
(1066, NULL, NULL, 1680262422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:03:42'),
(1067, NULL, NULL, 1680262422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:03:42'),
(1068, NULL, NULL, 1680262678, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:07:58'),
(1069, NULL, NULL, 1680262678, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:07:58'),
(1070, NULL, NULL, 1680262706, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:08:26'),
(1071, NULL, NULL, 1680262706, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:08:26'),
(1072, NULL, NULL, 1680262712, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:08:32'),
(1073, NULL, NULL, 1680262712, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:08:32'),
(1074, NULL, NULL, 1680262719, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:08:39'),
(1075, NULL, NULL, 1680262719, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:08:39'),
(1076, NULL, NULL, 1680262787, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:09:47'),
(1077, NULL, NULL, 1680262787, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:09:47'),
(1078, NULL, NULL, 1680262913, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:11:53'),
(1079, NULL, NULL, 1680262913, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:11:53'),
(1080, NULL, NULL, 1680262933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:12:13'),
(1081, NULL, NULL, 1680262933, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:12:13'),
(1082, NULL, NULL, 1680262939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:12:19'),
(1083, NULL, NULL, 1680262939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:12:19'),
(1084, NULL, NULL, 1680262946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:12:26'),
(1085, NULL, NULL, 1680262946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:12:26'),
(1086, NULL, NULL, 1680262988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:13:08'),
(1087, NULL, NULL, 1680262988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:13:08'),
(1088, NULL, NULL, 1680263115, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:15:15'),
(1089, NULL, NULL, 1680263116, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:15:16'),
(1090, NULL, NULL, 1680263116, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:15:16'),
(1091, NULL, NULL, 1680263116, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:15:16'),
(1092, NULL, NULL, 1680263116, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:15:16'),
(1093, NULL, NULL, 1680263116, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:15:16'),
(1094, NULL, NULL, 1680263188, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:16:28'),
(1095, NULL, NULL, 1680263188, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:16:28'),
(1096, NULL, NULL, 1680263329, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:18:49'),
(1097, NULL, NULL, 1680263329, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-03-31 17:18:49'),
(1098, NULL, NULL, 1680263380, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:19:40'),
(1099, NULL, NULL, 1680263380, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:19:40'),
(1100, NULL, NULL, 1680263385, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:19:45'),
(1101, NULL, NULL, 1680263385, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:19:45'),
(1102, NULL, NULL, 1680263418, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:20:18'),
(1103, NULL, NULL, 1680263418, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:20:18'),
(1104, NULL, NULL, 1680263458, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:20:58'),
(1105, NULL, NULL, 1680263458, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:20:58'),
(1106, NULL, NULL, 1680263485, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:25'),
(1107, NULL, NULL, 1680263485, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:25'),
(1108, NULL, NULL, 1680263494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:34'),
(1109, NULL, NULL, 1680263494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:34'),
(1110, NULL, NULL, 1680263500, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:40'),
(1111, NULL, NULL, 1680263500, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:40'),
(1112, NULL, NULL, 1680263507, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:47'),
(1113, NULL, NULL, 1680263507, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:47'),
(1114, NULL, NULL, 1680263513, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:53'),
(1115, NULL, NULL, 1680263513, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:21:53'),
(1116, NULL, NULL, 1680263539, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:22:19'),
(1117, NULL, NULL, 1680263539, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:22:19'),
(1118, NULL, NULL, 1680263558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:22:38'),
(1119, NULL, NULL, 1680263558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:22:38'),
(1120, NULL, NULL, 1680263591, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:23:11'),
(1121, NULL, NULL, 1680263591, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:23:11'),
(1122, NULL, NULL, 1680263621, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:23:41'),
(1123, NULL, NULL, 1680263621, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:23:41'),
(1124, NULL, NULL, 1680263695, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:24:55'),
(1125, NULL, NULL, 1680263695, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:24:55'),
(1126, NULL, NULL, 1680263715, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:25:15'),
(1127, NULL, NULL, 1680263715, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:25:15'),
(1128, NULL, NULL, 1680263750, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:25:50'),
(1129, NULL, NULL, 1680263750, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:25:50'),
(1130, NULL, NULL, 1680263755, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:25:55'),
(1131, NULL, NULL, 1680263755, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:25:55'),
(1132, NULL, NULL, 1680263760, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:26:00'),
(1133, NULL, NULL, 1680263760, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:26:00'),
(1134, NULL, NULL, 1680263775, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:26:15'),
(1135, NULL, NULL, 1680263775, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:26:15'),
(1136, NULL, NULL, 1680263816, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:26:56'),
(1137, NULL, NULL, 1680263816, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:26:56'),
(1138, NULL, NULL, 1680263824, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:27:04'),
(1139, NULL, NULL, 1680263824, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:27:04'),
(1140, NULL, NULL, 1680263842, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:27:22'),
(1141, NULL, NULL, 1680263842, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:27:22'),
(1142, NULL, NULL, 1680263890, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:10'),
(1143, NULL, NULL, 1680263890, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:10'),
(1144, NULL, NULL, 1680263890, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:10'),
(1145, NULL, NULL, 1680263890, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:10'),
(1146, NULL, NULL, 1680263897, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:17'),
(1147, NULL, NULL, 1680263897, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:17'),
(1148, NULL, NULL, 1680263898, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:18'),
(1149, NULL, NULL, 1680263898, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:28:18'),
(1150, NULL, NULL, 1680263961, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:29:21'),
(1151, NULL, NULL, 1680263961, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:29:21'),
(1152, NULL, NULL, 1680263973, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:29:33'),
(1153, NULL, NULL, 1680263973, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:29:33'),
(1154, NULL, NULL, 1680263978, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:29:38'),
(1155, NULL, NULL, 1680263978, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:29:38'),
(1156, NULL, NULL, 1680264011, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:30:11'),
(1157, NULL, NULL, 1680264011, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:30:11'),
(1158, NULL, NULL, 1680264247, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:34:07'),
(1159, NULL, NULL, 1680264247, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:34:07'),
(1160, NULL, NULL, 1680264385, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:36:25'),
(1161, NULL, NULL, 1680264385, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:36:25'),
(1162, NULL, NULL, 1680264425, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:37:05'),
(1163, NULL, NULL, 1680264425, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:37:05'),
(1164, NULL, NULL, 1680264568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:28'),
(1165, NULL, NULL, 1680264568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:28'),
(1166, NULL, NULL, 1680264573, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:33'),
(1167, NULL, NULL, 1680264574, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:34'),
(1168, NULL, NULL, 1680264576, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:36'),
(1169, NULL, NULL, 1680264584, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:44'),
(1170, NULL, NULL, 1680264584, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-03-31 17:39:44'),
(1171, NULL, NULL, 1680323681, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:04:41'),
(1172, NULL, NULL, 1680323681, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:04:41'),
(1173, NULL, NULL, 1680324044, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:10:44'),
(1174, NULL, NULL, 1680324044, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:10:44'),
(1175, NULL, NULL, 1680324079, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:11:19'),
(1176, NULL, NULL, 1680324079, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:11:19'),
(1177, NULL, NULL, 1680324198, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:18'),
(1178, NULL, NULL, 1680324198, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:18'),
(1179, NULL, NULL, 1680324201, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:21'),
(1180, NULL, NULL, 1680324201, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:21'),
(1181, NULL, NULL, 1680324214, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:34'),
(1182, NULL, NULL, 1680324214, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:34'),
(1183, NULL, NULL, 1680324229, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:49'),
(1184, NULL, NULL, 1680324229, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:13:49');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(1185, NULL, NULL, 1680324357, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 10:15:57'),
(1186, NULL, NULL, 1680324359, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:15:59'),
(1187, NULL, NULL, 1680324376, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:16:16'),
(1188, NULL, NULL, 1680324376, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:16:16'),
(1189, NULL, NULL, 1680324433, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:13'),
(1190, NULL, NULL, 1680324433, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:13'),
(1191, NULL, NULL, 1680324445, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:25'),
(1192, NULL, NULL, 1680324445, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:25'),
(1193, NULL, NULL, 1680324447, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:27'),
(1194, NULL, NULL, 1680324447, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:27'),
(1195, NULL, NULL, 1680324474, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:54'),
(1196, NULL, NULL, 1680324474, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:17:54'),
(1197, NULL, NULL, 1680325130, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:28:50'),
(1198, NULL, NULL, 1680325130, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:28:50'),
(1199, NULL, NULL, 1680325420, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:33:40'),
(1200, NULL, NULL, 1680325420, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:33:40'),
(1201, NULL, NULL, 1680325518, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:35:18'),
(1202, NULL, NULL, 1680325524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:35:24'),
(1203, NULL, NULL, 1680325524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:35:24'),
(1204, NULL, NULL, 1680325534, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:35:34'),
(1205, NULL, NULL, 1680325548, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:35:48'),
(1206, NULL, NULL, 1680325548, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:35:48'),
(1207, NULL, NULL, 1680325556, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 10:35:56'),
(1208, NULL, NULL, 1680325898, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:41:38'),
(1209, NULL, NULL, 1680325898, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:41:38'),
(1210, NULL, NULL, 1680325967, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:42:47'),
(1211, NULL, NULL, 1680325967, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:42:47'),
(1212, NULL, NULL, 1680325971, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:42:51'),
(1213, NULL, NULL, 1680325971, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:42:51'),
(1214, NULL, NULL, 1680326069, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:44:29'),
(1215, NULL, NULL, 1680326069, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:44:29'),
(1216, NULL, NULL, 1680326076, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:44:36'),
(1217, NULL, NULL, 1680326076, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:44:36'),
(1218, NULL, NULL, 1680326125, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:45:25'),
(1219, NULL, NULL, 1680326125, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:45:25'),
(1220, NULL, NULL, 1680326141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:45:41'),
(1221, NULL, NULL, 1680326141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:45:41'),
(1222, NULL, NULL, 1680326232, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:12'),
(1223, NULL, NULL, 1680326232, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:12'),
(1224, NULL, NULL, 1680326244, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:24'),
(1225, NULL, NULL, 1680326244, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:24'),
(1226, NULL, NULL, 1680326255, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:35'),
(1227, NULL, NULL, 1680326255, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:35'),
(1228, NULL, NULL, 1680326257, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:37'),
(1229, NULL, NULL, 1680326257, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:37'),
(1230, NULL, NULL, 1680326267, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:47'),
(1231, NULL, NULL, 1680326267, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:47'),
(1232, NULL, NULL, 1680326269, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:49'),
(1233, NULL, NULL, 1680326269, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:47:49'),
(1234, NULL, NULL, 1680326352, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:49:12'),
(1235, NULL, NULL, 1680326352, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:49:12'),
(1236, NULL, NULL, 1680326363, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:49:23'),
(1237, NULL, NULL, 1680326363, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:49:23'),
(1238, NULL, NULL, 1680326369, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:49:29'),
(1239, NULL, NULL, 1680326369, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:49:29'),
(1240, NULL, NULL, 1680326410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:10'),
(1241, NULL, NULL, 1680326410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:10'),
(1242, NULL, NULL, 1680326417, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:17'),
(1243, NULL, NULL, 1680326417, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:17'),
(1244, NULL, NULL, 1680326422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:22'),
(1245, NULL, NULL, 1680326422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:22'),
(1246, NULL, NULL, 1680326458, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:58'),
(1247, NULL, NULL, 1680326458, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:50:58'),
(1248, NULL, NULL, 1680326532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:52:12'),
(1249, NULL, NULL, 1680326532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:52:12'),
(1250, NULL, NULL, 1680326556, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:52:36'),
(1251, NULL, NULL, 1680326556, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:52:36'),
(1252, NULL, NULL, 1680326565, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:52:45'),
(1253, NULL, NULL, 1680326565, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:52:45'),
(1254, NULL, NULL, 1680326652, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:12'),
(1255, NULL, NULL, 1680326652, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:12'),
(1256, NULL, NULL, 1680326663, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:23'),
(1257, NULL, NULL, 1680326663, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:23'),
(1258, NULL, NULL, 1680326671, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:31'),
(1259, NULL, NULL, 1680326671, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:31'),
(1260, NULL, NULL, 1680326689, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:49'),
(1261, NULL, NULL, 1680326689, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:49'),
(1262, NULL, NULL, 1680326692, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:52'),
(1263, NULL, NULL, 1680326692, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:52'),
(1264, NULL, NULL, 1680326696, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:56'),
(1265, NULL, NULL, 1680326696, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:54:56'),
(1266, NULL, NULL, 1680326700, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:55:00'),
(1267, NULL, NULL, 1680326700, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:55:00'),
(1268, NULL, NULL, 1680326792, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:56:32'),
(1269, NULL, NULL, 1680326792, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:56:32'),
(1270, NULL, NULL, 1680326827, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:07'),
(1271, NULL, NULL, 1680326827, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:07'),
(1272, NULL, NULL, 1680326830, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:10'),
(1273, NULL, NULL, 1680326830, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:10'),
(1274, NULL, NULL, 1680326843, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:23'),
(1275, NULL, NULL, 1680326843, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:23'),
(1276, NULL, NULL, 1680326879, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:59'),
(1277, NULL, NULL, 1680326879, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:57:59'),
(1278, NULL, NULL, 1680326906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:58:26'),
(1279, NULL, NULL, 1680326906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 10:58:26'),
(1280, NULL, NULL, 1680327004, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:00:04'),
(1281, NULL, NULL, 1680327004, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:00:04'),
(1282, NULL, NULL, 1680327215, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:03:35'),
(1283, NULL, NULL, 1680327215, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:03:35'),
(1284, NULL, NULL, 1680327339, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:05:39'),
(1285, NULL, NULL, 1680327339, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:05:40'),
(1286, NULL, NULL, 1680327402, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:06:42'),
(1287, NULL, NULL, 1680327402, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:06:42'),
(1288, NULL, NULL, 1680327405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:06:45'),
(1289, NULL, NULL, 1680327405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:06:45'),
(1290, NULL, NULL, 1680327437, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:07:17'),
(1291, NULL, NULL, 1680327437, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:07:17'),
(1292, NULL, NULL, 1680327533, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:08:54'),
(1293, NULL, NULL, 1680327534, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:08:54'),
(1294, NULL, NULL, 1680327709, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:11:49'),
(1295, NULL, NULL, 1680327709, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:11:49'),
(1296, NULL, NULL, 1680327717, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:11:57'),
(1297, NULL, NULL, 1680327717, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:11:57'),
(1298, NULL, NULL, 1680327721, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:12:01'),
(1299, NULL, NULL, 1680327721, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:12:01'),
(1300, NULL, NULL, 1680327737, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:12:17'),
(1301, NULL, NULL, 1680327737, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:12:17'),
(1302, NULL, NULL, 1680329998, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:49:58'),
(1303, NULL, NULL, 1680329998, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:49:58'),
(1304, NULL, NULL, 1680330339, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:55:39'),
(1305, NULL, NULL, 1680330339, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:55:39'),
(1306, NULL, NULL, 1680330361, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:56:01'),
(1307, NULL, NULL, 1680330361, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:56:01'),
(1308, NULL, NULL, 1680330368, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:56:08'),
(1309, NULL, NULL, 1680330368, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:56:08'),
(1310, NULL, NULL, 1680330425, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:05'),
(1311, NULL, NULL, 1680330425, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:05'),
(1312, NULL, NULL, 1680330427, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:07'),
(1313, NULL, NULL, 1680330427, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:07'),
(1314, NULL, NULL, 1680330432, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:12'),
(1315, NULL, NULL, 1680330432, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:12'),
(1316, NULL, NULL, 1680330457, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:37'),
(1317, NULL, NULL, 1680330457, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:57:37'),
(1318, NULL, NULL, 1680330517, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:58:37'),
(1319, NULL, NULL, 1680330517, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:58:37'),
(1320, NULL, NULL, 1680330518, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:58:38'),
(1321, NULL, NULL, 1680330518, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:58:38'),
(1322, NULL, NULL, 1680330538, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:58:58'),
(1323, NULL, NULL, 1680330538, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:58:58'),
(1324, NULL, NULL, 1680330552, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:59:12'),
(1325, NULL, NULL, 1680330552, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:59:12'),
(1326, NULL, NULL, 1680330556, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:59:16'),
(1327, NULL, NULL, 1680330556, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 11:59:16'),
(1328, NULL, NULL, 1680330610, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:10'),
(1329, NULL, NULL, 1680330610, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:10'),
(1330, NULL, NULL, 1680330617, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:17'),
(1331, NULL, NULL, 1680330620, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:20'),
(1332, NULL, NULL, 1680330620, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:20'),
(1333, NULL, NULL, 1680330653, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:53'),
(1334, NULL, NULL, 1680330653, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:53'),
(1335, NULL, NULL, 1680330655, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:55'),
(1336, NULL, NULL, 1680330655, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:00:55'),
(1337, NULL, NULL, 1680330664, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:01:04'),
(1338, NULL, NULL, 1680330664, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:01:04'),
(1339, NULL, NULL, 1680332157, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:25:57'),
(1340, NULL, NULL, 1680332157, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:25:57'),
(1341, NULL, NULL, 1680332163, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:26:03'),
(1342, NULL, NULL, 1680332163, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:26:03'),
(1343, 121, 5, 1680332366, 'createUsers method of userController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'User created successfully', '2023-04-01 12:29:26'),
(1344, 110, 5, 1680332413, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'User updated successfully', '2023-04-01 12:30:13'),
(1345, NULL, NULL, 1680332784, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:36:24'),
(1346, NULL, NULL, 1680332784, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 12:36:24'),
(1347, 0, 0, 1680332968, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 12:39:28'),
(1348, 0, 0, 1680333171, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 12:42:51'),
(1349, 121, 5, 1680335807, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:26:47'),
(1350, 121, 4, 1680335867, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:27:47'),
(1351, 0, 0, 1680336003, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 13:30:03'),
(1352, 121, 4, 1680336012, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:30:12'),
(1353, 121, 4, 1680336399, 'updateUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:36:39'),
(1354, NULL, NULL, 1680336410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:36:50'),
(1355, NULL, NULL, 1680336410, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:36:50'),
(1356, 118, 3, 1680336419, 'updateUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:36:59'),
(1357, 120, 6, 1680336437, 'updateUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:37:17'),
(1358, 120, 6, 1680336457, 'updateUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:37:37'),
(1359, 118, 3, 1680336551, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:39:11'),
(1360, 118, 3, 1680336569, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:39:29'),
(1361, 118, 3, 1680336618, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:40:18'),
(1362, 118, 3, 1680336651, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:40:51'),
(1363, 118, 3, 1680336668, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:41:08'),
(1364, 0, 0, 1680336697, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 13:41:37'),
(1365, 0, 0, 1680336724, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 13:42:04'),
(1366, 118, 3, 1680336731, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:42:11'),
(1367, 118, 3, 1680336776, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'User updated successfully', '2023-04-01 13:42:56'),
(1368, NULL, NULL, 1680336898, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:44:58'),
(1369, NULL, NULL, 1680336898, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:44:58'),
(1370, 0, 0, 1680337147, 'createUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 13:49:07'),
(1371, 0, 0, 1680337401, 'createUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 13:53:21'),
(1372, NULL, NULL, 1680337585, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:56:25'),
(1373, NULL, NULL, 1680337585, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:56:25'),
(1374, NULL, NULL, 1680337642, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:57:22'),
(1375, NULL, NULL, 1680337642, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:57:22'),
(1376, NULL, NULL, 1680337713, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:58:33'),
(1377, NULL, NULL, 1680337713, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:58:33'),
(1378, NULL, NULL, 1680337779, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:59:39');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(1379, NULL, NULL, 1680337779, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:59:39'),
(1380, NULL, NULL, 1680337799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:59:59'),
(1381, NULL, NULL, 1680337799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 13:59:59'),
(1382, NULL, NULL, 1680337812, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:00:12'),
(1383, NULL, NULL, 1680337812, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:00:12'),
(1384, NULL, NULL, 1680337816, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:00:16'),
(1385, NULL, NULL, 1680337816, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:00:16'),
(1386, NULL, NULL, 1680337829, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:00:29'),
(1387, NULL, NULL, 1680337829, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:00:29'),
(1388, NULL, NULL, 1680337882, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:01:22'),
(1389, NULL, NULL, 1680337882, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:01:22'),
(1390, NULL, NULL, 1680337883, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:01:23'),
(1391, NULL, NULL, 1680337883, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:01:23'),
(1392, NULL, NULL, 1680337913, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:01:53'),
(1393, NULL, NULL, 1680337913, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:01:53'),
(1394, NULL, NULL, 1680337947, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:02:27'),
(1395, NULL, NULL, 1680337947, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:02:27'),
(1396, NULL, NULL, 1680337968, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:02:48'),
(1397, NULL, NULL, 1680337968, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:02:48'),
(1398, NULL, NULL, 1680337980, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:03:00'),
(1399, NULL, NULL, 1680337980, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:03:00'),
(1400, NULL, NULL, 1680338013, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:03:33'),
(1401, NULL, NULL, 1680338013, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:03:33'),
(1402, NULL, NULL, 1680338023, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:03:43'),
(1403, NULL, NULL, 1680338023, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:03:43'),
(1404, NULL, NULL, 1680338072, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:04:32'),
(1405, NULL, NULL, 1680338072, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:04:32'),
(1406, NULL, NULL, 1680338113, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:05:13'),
(1407, NULL, NULL, 1680338113, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:05:13'),
(1408, NULL, NULL, 1680338177, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:06:17'),
(1409, NULL, NULL, 1680338177, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:06:17'),
(1410, NULL, NULL, 1680338182, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:06:22'),
(1411, NULL, NULL, 1680338182, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:06:22'),
(1412, 0, 0, 1680338287, 'createUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 14:08:07'),
(1413, 0, 0, 1680338298, 'createUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 14:08:18'),
(1414, 0, 0, 1680338320, 'createUsers method of userController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 14:08:40'),
(1415, NULL, NULL, 1680338661, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:14:21'),
(1416, NULL, NULL, 1680338662, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:14:22'),
(1417, NULL, NULL, 1680338727, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:15:27'),
(1418, NULL, NULL, 1680338727, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:15:27'),
(1419, NULL, NULL, 1680338779, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:16:19'),
(1420, NULL, NULL, 1680338779, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:16:19'),
(1421, NULL, NULL, 1680338821, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:17:01'),
(1422, NULL, NULL, 1680338821, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:17:01'),
(1423, NULL, NULL, 1680338828, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:17:08'),
(1424, NULL, NULL, 1680338828, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:17:08'),
(1425, NULL, NULL, 1680338863, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:17:43'),
(1426, NULL, NULL, 1680338863, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:17:43'),
(1427, NULL, NULL, 1680338881, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:01'),
(1428, NULL, NULL, 1680338881, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:01'),
(1429, NULL, NULL, 1680338894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:14'),
(1430, NULL, NULL, 1680338894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:14'),
(1431, NULL, NULL, 1680338911, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:31'),
(1432, NULL, NULL, 1680338911, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:31'),
(1433, NULL, NULL, 1680338912, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:32'),
(1434, NULL, NULL, 1680338912, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:18:32'),
(1435, NULL, NULL, 1680338967, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:19:27'),
(1436, NULL, NULL, 1680338967, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:19:27'),
(1437, NULL, NULL, 1680339071, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:21:11'),
(1438, NULL, NULL, 1680339071, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:21:11'),
(1439, NULL, NULL, 1680339292, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:24:52'),
(1440, NULL, NULL, 1680339292, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:24:52'),
(1441, NULL, NULL, 1680339293, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:24:53'),
(1442, NULL, NULL, 1680339293, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:24:53'),
(1443, NULL, NULL, 1680339358, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:25:58'),
(1444, NULL, NULL, 1680339358, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:25:58'),
(1445, NULL, NULL, 1680339362, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:26:02'),
(1446, NULL, NULL, 1680339362, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 14:26:02'),
(1447, NULL, NULL, 1680341987, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:09:47'),
(1448, NULL, NULL, 1680341987, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:09:47'),
(1449, NULL, NULL, 1680342276, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:14:36'),
(1450, NULL, NULL, 1680342276, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:14:36'),
(1451, NULL, NULL, 1680342441, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:17:21'),
(1452, NULL, NULL, 1680342441, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:17:21'),
(1453, NULL, NULL, 1680342611, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:11'),
(1454, NULL, NULL, 1680342611, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:11'),
(1455, NULL, NULL, 1680342627, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:27'),
(1456, NULL, NULL, 1680342627, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:27'),
(1457, NULL, NULL, 1680342631, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:31'),
(1458, NULL, NULL, 1680342631, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:31'),
(1459, NULL, NULL, 1680342635, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:35'),
(1460, NULL, NULL, 1680342636, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:36'),
(1461, NULL, NULL, 1680342643, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:43'),
(1462, NULL, NULL, 1680342643, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:43'),
(1463, NULL, NULL, 1680342647, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:47'),
(1464, NULL, NULL, 1680342647, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:20:47'),
(1465, NULL, NULL, 1680343052, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:27:32'),
(1466, NULL, NULL, 1680343052, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:27:32'),
(1467, NULL, NULL, 1680343128, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:28:48'),
(1468, NULL, NULL, 1680343129, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:28:49'),
(1469, NULL, NULL, 1680343145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:29:05'),
(1470, NULL, NULL, 1680343145, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:29:05'),
(1471, NULL, NULL, 1680343157, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:29:17'),
(1472, NULL, NULL, 1680343157, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:29:17'),
(1473, NULL, NULL, 1680343336, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:32:16'),
(1474, NULL, NULL, 1680343336, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:32:16'),
(1475, NULL, NULL, 1680343375, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:32:55'),
(1476, NULL, NULL, 1680343375, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:32:55'),
(1477, NULL, NULL, 1680343402, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:33:22'),
(1478, NULL, NULL, 1680343402, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:33:22'),
(1479, NULL, NULL, 1680343414, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:33:34'),
(1480, NULL, NULL, 1680343414, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:33:34'),
(1481, NULL, NULL, 1680343433, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:33:53'),
(1482, NULL, NULL, 1680343433, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:33:53'),
(1483, NULL, NULL, 1680343489, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:34:49'),
(1484, NULL, NULL, 1680343489, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:34:49'),
(1485, NULL, NULL, 1680343493, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:34:53'),
(1486, NULL, NULL, 1680343493, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:34:53'),
(1487, NULL, NULL, 1680343502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:35:02'),
(1488, NULL, NULL, 1680343502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:35:02'),
(1489, NULL, NULL, 1680343571, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:11'),
(1490, NULL, NULL, 1680343571, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:11'),
(1491, NULL, NULL, 1680343579, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:19'),
(1492, NULL, NULL, 1680343579, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:19'),
(1493, NULL, NULL, 1680343585, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:25'),
(1494, NULL, NULL, 1680343585, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:25'),
(1495, NULL, NULL, 1680343594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:34'),
(1496, NULL, NULL, 1680343594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:36:34'),
(1497, NULL, NULL, 1680343645, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:37:25'),
(1498, NULL, NULL, 1680343645, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:37:25'),
(1499, NULL, NULL, 1680343743, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:39:03'),
(1500, NULL, NULL, 1680343743, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:39:03'),
(1501, NULL, NULL, 1680343883, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:41:23'),
(1502, NULL, NULL, 1680343883, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:41:23'),
(1503, NULL, NULL, 1680343925, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:42:05'),
(1504, NULL, NULL, 1680343925, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:42:05'),
(1505, NULL, NULL, 1680343962, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:42:42'),
(1506, NULL, NULL, 1680343962, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:42:42'),
(1507, NULL, NULL, 1680344010, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:43:30'),
(1508, NULL, NULL, 1680344010, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:43:30'),
(1509, NULL, NULL, 1680344176, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:46:16'),
(1510, NULL, NULL, 1680344176, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:46:16'),
(1511, NULL, NULL, 1680344367, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:49:27'),
(1512, NULL, NULL, 1680344367, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:49:27'),
(1513, NULL, NULL, 1680344482, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:51:22'),
(1514, NULL, NULL, 1680344482, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:51:22'),
(1515, NULL, NULL, 1680344491, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:51:31'),
(1516, NULL, NULL, 1680344491, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:51:31'),
(1517, NULL, NULL, 1680344494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:51:34'),
(1518, NULL, NULL, 1680344494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:51:34'),
(1519, 0, 0, 1680344579, 'createUsers method of userController ', '::ffff:192.168.1.4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 15:52:59'),
(1520, NULL, NULL, 1680344619, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:53:39'),
(1521, NULL, NULL, 1680344619, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:53:39'),
(1522, NULL, NULL, 1680344621, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:53:41'),
(1523, NULL, NULL, 1680344621, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:53:41'),
(1524, 0, 0, 1680344657, 'createUsers method of userController ', '::ffff:192.168.1.4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 15:54:17'),
(1525, NULL, NULL, 1680344693, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:54:53'),
(1526, NULL, NULL, 1680344693, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:54:53'),
(1527, NULL, NULL, 1680344696, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:54:56'),
(1528, NULL, NULL, 1680344696, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:54:56'),
(1529, 0, 0, 1680344705, 'createUsers method of userController ', '::ffff:192.168.1.4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'res is not defined', '2023-04-01 15:55:05'),
(1530, NULL, NULL, 1680344814, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:56:54'),
(1531, NULL, NULL, 1680344814, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:56:54'),
(1532, NULL, NULL, 1680344829, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:57:09'),
(1533, NULL, NULL, 1680344829, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:57:09'),
(1534, NULL, NULL, 1680344854, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:57:34'),
(1535, NULL, NULL, 1680344854, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:57:34'),
(1536, NULL, NULL, 1680344862, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:57:42'),
(1537, NULL, NULL, 1680344862, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:57:42'),
(1538, NULL, NULL, 1680344897, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:58:17'),
(1539, NULL, NULL, 1680344897, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:58:17'),
(1540, NULL, NULL, 1680344939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:58:59'),
(1541, NULL, NULL, 1680344939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:58:59'),
(1542, NULL, NULL, 1680344954, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:59:14'),
(1543, NULL, NULL, 1680344954, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:59:14'),
(1544, NULL, NULL, 1680344963, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:59:23'),
(1545, NULL, NULL, 1680344963, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:59:23'),
(1546, NULL, NULL, 1680344988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:59:48'),
(1547, NULL, NULL, 1680344988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 15:59:48'),
(1548, NULL, NULL, 1680345054, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:00:54'),
(1549, NULL, NULL, 1680345054, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:00:54'),
(1550, NULL, NULL, 1680345068, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:01:08'),
(1551, NULL, NULL, 1680345068, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:01:08'),
(1552, NULL, NULL, 1680345109, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:01:49'),
(1553, NULL, NULL, 1680345109, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:01:49'),
(1554, NULL, NULL, 1680345126, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:06'),
(1555, NULL, NULL, 1680345126, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:06'),
(1556, NULL, NULL, 1680345143, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:23'),
(1557, NULL, NULL, 1680345143, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:23'),
(1558, NULL, NULL, 1680345161, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:41'),
(1559, NULL, NULL, 1680345161, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:41'),
(1560, NULL, NULL, 1680345177, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:57'),
(1561, NULL, NULL, 1680345177, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:02:57'),
(1562, NULL, NULL, 1680345204, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:03:24'),
(1563, NULL, NULL, 1680345204, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:03:24'),
(1564, NULL, NULL, 1680345213, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:03:33'),
(1565, NULL, NULL, 1680345213, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:03:33'),
(1566, NULL, NULL, 1680345220, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:03:40'),
(1567, NULL, NULL, 1680345220, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:03:40'),
(1568, NULL, NULL, 1680345361, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:01'),
(1569, NULL, NULL, 1680345386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:26'),
(1570, NULL, NULL, 1680345386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:26'),
(1571, NULL, NULL, 1680345386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:26'),
(1572, NULL, NULL, 1680345386, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:26');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(1573, NULL, NULL, 1680345405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:45'),
(1574, NULL, NULL, 1680345405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:45'),
(1575, NULL, NULL, 1680345405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:45'),
(1576, NULL, NULL, 1680345406, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:46'),
(1577, NULL, NULL, 1680345406, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:46'),
(1578, NULL, NULL, 1680345419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:59'),
(1579, NULL, NULL, 1680345419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:06:59'),
(1580, NULL, NULL, 1680345442, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:07:22'),
(1581, NULL, NULL, 1680345442, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:07:22'),
(1582, NULL, NULL, 1680345493, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:08:13'),
(1583, NULL, NULL, 1680345493, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:08:13'),
(1584, NULL, NULL, 1680345511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:08:31'),
(1585, NULL, NULL, 1680345511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:08:31'),
(1586, NULL, NULL, 1680345593, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:09:53'),
(1587, NULL, NULL, 1680345593, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:09:53'),
(1588, NULL, NULL, 1680345594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:09:54'),
(1589, NULL, NULL, 1680345594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:09:54'),
(1590, NULL, NULL, 1680345601, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:10:01'),
(1591, NULL, NULL, 1680345602, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:10:02'),
(1592, NULL, NULL, 1680345624, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:10:24'),
(1593, NULL, NULL, 1680345624, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:10:24'),
(1594, NULL, NULL, 1680345670, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:11:10'),
(1595, NULL, NULL, 1680345670, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:11:10'),
(1596, NULL, NULL, 1680345714, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:11:54'),
(1597, NULL, NULL, 1680345714, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:11:54'),
(1598, NULL, NULL, 1680345720, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:12:00'),
(1599, NULL, NULL, 1680345720, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:12:00'),
(1600, NULL, NULL, 1680345873, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:14:33'),
(1601, NULL, NULL, 1680345873, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:14:33'),
(1602, NULL, NULL, 1680345885, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:14:45'),
(1603, NULL, NULL, 1680345885, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:14:45'),
(1604, NULL, NULL, 1680345891, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:14:51'),
(1605, NULL, NULL, 1680345891, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:14:51'),
(1606, NULL, NULL, 1680345944, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:15:44'),
(1607, NULL, NULL, 1680345944, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:15:44'),
(1608, NULL, NULL, 1680345945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:15:45'),
(1609, NULL, NULL, 1680345945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:15:45'),
(1610, NULL, NULL, 1680345946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:15:46'),
(1611, NULL, NULL, 1680345946, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:15:46'),
(1612, NULL, NULL, 1680345964, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:16:04'),
(1613, NULL, NULL, 1680345964, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:16:04'),
(1614, NULL, NULL, 1680345964, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:16:04'),
(1615, NULL, NULL, 1680345964, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:16:04'),
(1616, NULL, NULL, 1680345969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:16:09'),
(1617, NULL, NULL, 1680345969, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:16:09'),
(1618, NULL, NULL, 1680346054, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:17:34'),
(1619, NULL, NULL, 1680346054, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:17:34'),
(1620, NULL, NULL, 1680346070, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:17:50'),
(1621, NULL, NULL, 1680346070, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:17:50'),
(1622, NULL, NULL, 1680346098, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:18:18'),
(1623, NULL, NULL, 1680346098, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:18:18'),
(1624, NULL, NULL, 1680346107, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:18:27'),
(1625, NULL, NULL, 1680346107, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:18:27'),
(1626, NULL, NULL, 1680346125, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:18:45'),
(1627, NULL, NULL, 1680346125, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:18:45'),
(1628, NULL, NULL, 1680346206, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:20:06'),
(1629, NULL, NULL, 1680346206, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:20:06'),
(1630, NULL, NULL, 1680346210, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:20:10'),
(1631, NULL, NULL, 1680346210, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:20:10'),
(1632, NULL, NULL, 1680346288, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:28'),
(1633, NULL, NULL, 1680346288, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:28'),
(1634, NULL, NULL, 1680346289, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:29'),
(1635, NULL, NULL, 1680346289, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:29'),
(1636, NULL, NULL, 1680346293, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:33'),
(1637, NULL, NULL, 1680346293, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:33'),
(1638, NULL, NULL, 1680346294, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:34'),
(1639, NULL, NULL, 1680346294, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:21:34'),
(1640, NULL, NULL, 1680346373, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:22:53'),
(1641, NULL, NULL, 1680346373, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:22:53'),
(1642, NULL, NULL, 1680346373, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:22:53'),
(1643, NULL, NULL, 1680346373, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:22:53'),
(1644, NULL, NULL, 1680346389, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:23:09'),
(1645, NULL, NULL, 1680346389, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:23:09'),
(1646, NULL, NULL, 1680346390, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:23:10'),
(1647, NULL, NULL, 1680346390, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:23:10'),
(1648, 0, 0, 1680346420, 'createUsers method of userController ', '::ffff:192.168.1.4', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 16:23:40'),
(1649, NULL, NULL, 1680346508, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:08'),
(1650, NULL, NULL, 1680346508, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:08'),
(1651, NULL, NULL, 1680346522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:22'),
(1652, NULL, NULL, 1680346522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:22'),
(1653, NULL, NULL, 1680346532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:32'),
(1654, NULL, NULL, 1680346532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:32'),
(1655, NULL, NULL, 1680346541, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:41'),
(1656, NULL, NULL, 1680346541, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:25:41'),
(1657, NULL, NULL, 1680346603, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:26:43'),
(1658, NULL, NULL, 1680346603, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:26:43'),
(1659, NULL, NULL, 1680346659, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:27:39'),
(1660, NULL, NULL, 1680346659, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:27:39'),
(1661, NULL, NULL, 1680346672, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:27:52'),
(1662, NULL, NULL, 1680346672, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:27:52'),
(1663, NULL, NULL, 1680346697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:28:17'),
(1664, NULL, NULL, 1680346697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:28:17'),
(1665, NULL, NULL, 1680346735, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:28:55'),
(1666, NULL, NULL, 1680346735, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:28:55'),
(1667, NULL, NULL, 1680346779, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:29:39'),
(1668, NULL, NULL, 1680346779, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:29:39'),
(1669, NULL, NULL, 1680346789, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:29:49'),
(1670, NULL, NULL, 1680346789, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:29:49'),
(1671, NULL, NULL, 1680346838, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:30:38'),
(1672, NULL, NULL, 1680346838, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:30:38'),
(1673, NULL, NULL, 1680348027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:50:27'),
(1674, NULL, NULL, 1680348027, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:50:27'),
(1675, 0, 0, 1680348100, 'createUsers method of userController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-04-01 16:51:40'),
(1676, NULL, NULL, 1680348101, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:51:41'),
(1677, NULL, NULL, 1680348101, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:51:41'),
(1678, NULL, NULL, 1680348138, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:52:18'),
(1679, NULL, NULL, 1680348138, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:52:18'),
(1680, NULL, NULL, 1680348244, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:54:04'),
(1681, NULL, NULL, 1680348244, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:54:04'),
(1682, NULL, NULL, 1680348283, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:54:43'),
(1683, NULL, NULL, 1680348283, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:54:43'),
(1684, NULL, NULL, 1680348295, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:54:55'),
(1685, NULL, NULL, 1680348295, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:54:55'),
(1686, NULL, NULL, 1680348333, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:55:33'),
(1687, NULL, NULL, 1680348333, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:55:33'),
(1688, NULL, NULL, 1680348352, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:55:52'),
(1689, NULL, NULL, 1680348352, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:55:52'),
(1690, NULL, NULL, 1680348357, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:55:57'),
(1691, NULL, NULL, 1680348357, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:55:57'),
(1692, NULL, NULL, 1680348477, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:57:57'),
(1693, NULL, NULL, 1680348477, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:57:57'),
(1694, NULL, NULL, 1680348504, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:58:24'),
(1695, NULL, NULL, 1680348504, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:58:24'),
(1696, NULL, NULL, 1680348532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:58:52'),
(1697, NULL, NULL, 1680348532, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:58:52'),
(1698, NULL, NULL, 1680348555, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:59:15'),
(1699, NULL, NULL, 1680348555, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:59:15'),
(1700, NULL, NULL, 1680348566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:59:26'),
(1701, NULL, NULL, 1680348566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:59:26'),
(1702, NULL, NULL, 1680348579, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:59:39'),
(1703, NULL, NULL, 1680348579, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 16:59:39'),
(1704, NULL, NULL, 1680348620, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:00:20'),
(1705, NULL, NULL, 1680348620, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:00:20'),
(1706, NULL, NULL, 1680348642, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:00:42'),
(1707, NULL, NULL, 1680348642, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:00:42'),
(1708, NULL, NULL, 1680348668, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:01:08'),
(1709, NULL, NULL, 1680348668, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:01:08'),
(1710, NULL, NULL, 1680348701, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:01:41'),
(1711, NULL, NULL, 1680348701, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:01:41'),
(1712, NULL, NULL, 1680348795, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:03:15'),
(1713, NULL, NULL, 1680348795, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:03:15'),
(1714, NULL, NULL, 1680348825, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:03:45'),
(1715, NULL, NULL, 1680348825, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:03:45'),
(1716, NULL, NULL, 1680348833, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:03:53'),
(1717, NULL, NULL, 1680348833, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:03:53'),
(1718, NULL, NULL, 1680348863, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:04:23'),
(1719, NULL, NULL, 1680348863, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:04:23'),
(1720, NULL, NULL, 1680348890, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:04:50'),
(1721, NULL, NULL, 1680348890, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:04:50'),
(1722, NULL, NULL, 1680348909, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:05:09'),
(1723, NULL, NULL, 1680348909, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:05:09'),
(1724, NULL, NULL, 1680348939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:05:39'),
(1725, NULL, NULL, 1680348939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:05:39'),
(1726, NULL, NULL, 1680348977, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:06:17'),
(1727, NULL, NULL, 1680348977, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:06:17'),
(1728, NULL, NULL, 1680348989, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:06:29'),
(1729, NULL, NULL, 1680348989, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:06:29'),
(1730, NULL, NULL, 1680349017, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:06:57'),
(1731, NULL, NULL, 1680349017, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:06:57'),
(1732, NULL, NULL, 1680349059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:07:39'),
(1733, NULL, NULL, 1680349059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:07:39'),
(1734, NULL, NULL, 1680349101, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:08:21'),
(1735, NULL, NULL, 1680349101, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:08:21'),
(1736, NULL, NULL, 1680349118, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:08:38'),
(1737, NULL, NULL, 1680349118, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:08:38'),
(1738, NULL, NULL, 1680349132, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:08:52'),
(1739, NULL, NULL, 1680349132, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:08:52'),
(1740, NULL, NULL, 1680349159, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:09:19'),
(1741, NULL, NULL, 1680349159, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:09:19'),
(1742, NULL, NULL, 1680349172, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:09:32'),
(1743, NULL, NULL, 1680349172, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:09:32'),
(1744, NULL, NULL, 1680349192, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:09:52'),
(1745, NULL, NULL, 1680349192, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:09:52'),
(1746, NULL, NULL, 1680349206, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:06'),
(1747, NULL, NULL, 1680349206, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:06'),
(1748, NULL, NULL, 1680349221, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:21'),
(1749, NULL, NULL, 1680349221, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:21'),
(1750, NULL, NULL, 1680349239, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:39'),
(1751, NULL, NULL, 1680349239, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:39'),
(1752, NULL, NULL, 1680349240, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:40'),
(1753, NULL, NULL, 1680349240, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:10:40'),
(1754, NULL, NULL, 1680349244, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 17:10:44'),
(1755, NULL, NULL, 1680349317, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:11:57'),
(1756, NULL, NULL, 1680349317, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:11:57'),
(1757, NULL, NULL, 1680349346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:12:26'),
(1758, NULL, NULL, 1680349346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:12:26'),
(1759, NULL, NULL, 1680349374, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:12:54'),
(1760, NULL, NULL, 1680349374, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:12:54'),
(1761, NULL, NULL, 1680349399, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:13:19'),
(1762, NULL, NULL, 1680349399, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:13:19'),
(1763, NULL, NULL, 1680349426, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:13:46'),
(1764, NULL, NULL, 1680349426, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:13:46'),
(1765, NULL, NULL, 1680349430, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:13:50');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(1766, NULL, NULL, 1680349430, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:13:50'),
(1767, NULL, NULL, 1680349464, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:24'),
(1768, NULL, NULL, 1680349464, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:24'),
(1769, NULL, NULL, 1680349494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:54'),
(1770, NULL, NULL, 1680349494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:54'),
(1771, NULL, NULL, 1680349495, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:55'),
(1772, NULL, NULL, 1680349495, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:55'),
(1773, NULL, NULL, 1680349499, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:59'),
(1774, NULL, NULL, 1680349499, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:14:59'),
(1775, NULL, NULL, 1680349565, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:16:05'),
(1776, NULL, NULL, 1680349565, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:16:05'),
(1777, NULL, NULL, 1680349708, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:18:28'),
(1778, NULL, NULL, 1680349708, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:18:28'),
(1779, NULL, NULL, 1680349713, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:18:33'),
(1780, NULL, NULL, 1680349713, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:18:33'),
(1781, NULL, NULL, 1680349735, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:18:55'),
(1782, NULL, NULL, 1680349735, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:18:55'),
(1783, NULL, NULL, 1680349747, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:19:07'),
(1784, NULL, NULL, 1680349747, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:19:07'),
(1785, NULL, NULL, 1680349784, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:19:44'),
(1786, NULL, NULL, 1680349784, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:19:44'),
(1787, NULL, NULL, 1680349819, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:20:19'),
(1788, NULL, NULL, 1680349819, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:20:19'),
(1789, NULL, NULL, 1680349894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:21:34'),
(1790, NULL, NULL, 1680349894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:21:34'),
(1791, NULL, NULL, 1680349918, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:21:58'),
(1792, NULL, NULL, 1680349918, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:21:58'),
(1793, NULL, NULL, 1680349945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:22:25'),
(1794, NULL, NULL, 1680349945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:22:25'),
(1795, NULL, NULL, 1680349974, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:22:54'),
(1796, NULL, NULL, 1680349974, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:22:54'),
(1797, NULL, NULL, 1680350004, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:23:24'),
(1798, NULL, NULL, 1680350004, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:23:24'),
(1799, NULL, NULL, 1680350087, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:24:47'),
(1800, NULL, NULL, 1680350087, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:24:47'),
(1801, NULL, NULL, 1680350121, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:25:21'),
(1802, NULL, NULL, 1680350121, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:25:21'),
(1803, NULL, NULL, 1680350140, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:25:40'),
(1804, NULL, NULL, 1680350140, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:25:40'),
(1805, NULL, NULL, 1680350165, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:26:05'),
(1806, NULL, NULL, 1680350165, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:26:05'),
(1807, NULL, NULL, 1680350182, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:26:22'),
(1808, NULL, NULL, 1680350182, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:26:22'),
(1809, NULL, NULL, 1680350212, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:26:52'),
(1810, NULL, NULL, 1680350212, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:26:52'),
(1811, NULL, NULL, 1680350228, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:27:08'),
(1812, NULL, NULL, 1680350228, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:27:08'),
(1813, NULL, NULL, 1680350250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:27:30'),
(1814, NULL, NULL, 1680350250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:27:30'),
(1815, NULL, NULL, 1680350274, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:27:54'),
(1816, NULL, NULL, 1680350274, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:27:54'),
(1817, NULL, NULL, 1680350297, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:28:17'),
(1818, NULL, NULL, 1680350297, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:28:17'),
(1819, NULL, NULL, 1680350346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:29:06'),
(1820, NULL, NULL, 1680350346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:29:06'),
(1821, NULL, NULL, 1680350414, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:30:14'),
(1822, NULL, NULL, 1680350414, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:30:14'),
(1823, NULL, NULL, 1680350894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:38:14'),
(1824, NULL, NULL, 1680350895, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:38:15'),
(1825, NULL, NULL, 1680350904, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:38:24'),
(1826, NULL, NULL, 1680350904, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:38:24'),
(1827, NULL, NULL, 1680350940, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:39:00'),
(1828, NULL, NULL, 1680350940, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:39:00'),
(1829, NULL, NULL, 1680350957, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:39:17'),
(1830, NULL, NULL, 1680350957, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:39:17'),
(1831, NULL, NULL, 1680351017, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:40:17'),
(1832, NULL, NULL, 1680351017, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:40:17'),
(1833, NULL, NULL, 1680351022, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:40:22'),
(1834, NULL, NULL, 1680351022, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:40:22'),
(1835, NULL, NULL, 1680351031, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:40:31'),
(1836, NULL, NULL, 1680351031, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:40:31'),
(1837, NULL, NULL, 1680351077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:41:17'),
(1838, NULL, NULL, 1680351077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:41:17'),
(1839, NULL, NULL, 1680351131, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:42:11'),
(1840, NULL, NULL, 1680351131, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:42:11'),
(1841, NULL, NULL, 1680351193, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:43:13'),
(1842, NULL, NULL, 1680351193, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:43:13'),
(1843, NULL, NULL, 1680351206, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:43:26'),
(1844, NULL, NULL, 1680351206, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:43:26'),
(1845, NULL, NULL, 1680351381, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:46:21'),
(1846, NULL, NULL, 1680351381, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:46:21'),
(1847, NULL, NULL, 1680351429, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:47:09'),
(1848, NULL, NULL, 1680351429, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:47:09'),
(1849, NULL, NULL, 1680351510, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:48:30'),
(1850, NULL, NULL, 1680351510, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:48:30'),
(1851, NULL, NULL, 1680351514, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:48:34'),
(1852, NULL, NULL, 1680351514, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:48:35'),
(1853, NULL, NULL, 1680351582, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:49:42'),
(1854, NULL, NULL, 1680351582, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:49:42'),
(1855, NULL, NULL, 1680351600, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:00'),
(1856, NULL, NULL, 1680351600, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:00'),
(1857, NULL, NULL, 1680351602, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:02'),
(1858, NULL, NULL, 1680351602, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:02'),
(1859, NULL, NULL, 1680351618, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:18'),
(1860, NULL, NULL, 1680351618, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:18'),
(1861, NULL, NULL, 1680351620, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:20'),
(1862, NULL, NULL, 1680351620, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:50:20'),
(1863, NULL, NULL, 1680351667, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:51:07'),
(1864, NULL, NULL, 1680351667, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:51:07'),
(1865, NULL, NULL, 1680351769, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:52:49'),
(1866, NULL, NULL, 1680351769, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:52:49'),
(1867, NULL, NULL, 1680351820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:53:40'),
(1868, NULL, NULL, 1680351820, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:53:40'),
(1869, NULL, NULL, 1680351834, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:53:54'),
(1870, NULL, NULL, 1680351834, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:53:54'),
(1871, NULL, NULL, 1680351851, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:54:11'),
(1872, NULL, NULL, 1680351851, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:54:11'),
(1873, NULL, NULL, 1680351868, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:54:28'),
(1874, NULL, NULL, 1680351868, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:54:28'),
(1875, NULL, NULL, 1680352005, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:56:45'),
(1876, NULL, NULL, 1680352006, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 17:56:46'),
(1877, NULL, NULL, 1680352295, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:01:35'),
(1878, NULL, NULL, 1680352295, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:01:35'),
(1879, NULL, NULL, 1680352344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:02:24'),
(1880, NULL, NULL, 1680352344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:02:24'),
(1881, NULL, NULL, 1680352344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:02:24'),
(1882, NULL, NULL, 1680352344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:02:24'),
(1883, NULL, NULL, 1680352654, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:07:34'),
(1884, NULL, NULL, 1680352654, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:07:34'),
(1885, NULL, NULL, 1680352848, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:10:48'),
(1886, NULL, NULL, 1680352848, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:10:48'),
(1887, NULL, NULL, 1680352849, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:10:49'),
(1888, NULL, NULL, 1680352849, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:10:49'),
(1889, NULL, NULL, 1680352878, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:18'),
(1890, NULL, NULL, 1680352878, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:18'),
(1891, NULL, NULL, 1680352878, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:18'),
(1892, NULL, NULL, 1680352878, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:18'),
(1893, NULL, NULL, 1680352892, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:32'),
(1894, NULL, NULL, 1680352892, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:32'),
(1895, NULL, NULL, 1680352893, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:33'),
(1896, NULL, NULL, 1680352893, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:33'),
(1897, NULL, NULL, 1680352901, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:41'),
(1898, NULL, NULL, 1680352901, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:41'),
(1899, NULL, NULL, 1680352902, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:42'),
(1900, NULL, NULL, 1680352902, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:42'),
(1901, NULL, NULL, 1680352902, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:42'),
(1902, NULL, NULL, 1680352902, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:42'),
(1903, NULL, NULL, 1680352903, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:43'),
(1904, NULL, NULL, 1680352903, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:43'),
(1905, NULL, NULL, 1680352906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:46'),
(1906, NULL, NULL, 1680352906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:46'),
(1907, NULL, NULL, 1680352906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:46'),
(1908, NULL, NULL, 1680352906, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:11:46'),
(1909, NULL, NULL, 1680352943, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:23'),
(1910, NULL, NULL, 1680352943, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:23'),
(1911, NULL, NULL, 1680352944, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:24'),
(1912, NULL, NULL, 1680352944, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:24'),
(1913, NULL, NULL, 1680352956, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:36'),
(1914, NULL, NULL, 1680352956, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:36'),
(1915, NULL, NULL, 1680352970, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:50'),
(1916, NULL, NULL, 1680352970, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:12:50'),
(1917, NULL, NULL, 1680353023, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:43'),
(1918, NULL, NULL, 1680353023, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:43'),
(1919, NULL, NULL, 1680353023, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:43'),
(1920, NULL, NULL, 1680353023, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:43'),
(1921, NULL, NULL, 1680353035, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:55'),
(1922, NULL, NULL, 1680353035, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:55'),
(1923, NULL, NULL, 1680353036, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:56'),
(1924, NULL, NULL, 1680353036, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:56'),
(1925, NULL, NULL, 1680353038, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:58'),
(1926, NULL, NULL, 1680353038, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:13:58'),
(1927, NULL, NULL, 1680353042, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:14:02'),
(1928, NULL, NULL, 1680353042, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:14:02'),
(1929, NULL, NULL, 1680353042, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:14:02'),
(1930, NULL, NULL, 1680353042, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:14:02'),
(1931, NULL, NULL, 1680353089, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:14:49'),
(1932, NULL, NULL, 1680353089, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:14:49'),
(1933, NULL, NULL, 1680353128, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:15:28'),
(1934, NULL, NULL, 1680353128, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:15:28'),
(1935, NULL, NULL, 1680353148, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:15:48'),
(1936, NULL, NULL, 1680353148, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:15:48'),
(1937, NULL, NULL, 1680353250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:17:30'),
(1938, NULL, NULL, 1680353250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:17:30'),
(1939, NULL, NULL, 1680353419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:20:19'),
(1940, NULL, NULL, 1680353419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:20:19'),
(1941, NULL, NULL, 1680353537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:17'),
(1942, NULL, NULL, 1680353537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:17'),
(1943, NULL, NULL, 1680353537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:17'),
(1944, NULL, NULL, 1680353537, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:17'),
(1945, NULL, NULL, 1680353566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:46'),
(1946, NULL, NULL, 1680353566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:46'),
(1947, NULL, NULL, 1680353566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:46'),
(1948, NULL, NULL, 1680353566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:46'),
(1949, NULL, NULL, 1680353568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:48'),
(1950, NULL, NULL, 1680353568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:48'),
(1951, NULL, NULL, 1680353568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:48'),
(1952, NULL, NULL, 1680353568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:48'),
(1953, NULL, NULL, 1680353569, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:49'),
(1954, NULL, NULL, 1680353569, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:22:49'),
(1955, NULL, NULL, 1680353608, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:23:28'),
(1956, NULL, NULL, 1680353608, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:23:28'),
(1957, NULL, NULL, 1680353608, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:23:28'),
(1958, NULL, NULL, 1680353608, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:23:28');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(1959, NULL, NULL, 1680353661, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:24:21'),
(1960, NULL, NULL, 1680353661, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:24:21'),
(1961, NULL, NULL, 1680353697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:24:57'),
(1962, NULL, NULL, 1680353697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:24:57'),
(1963, NULL, NULL, 1680353697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:24:57'),
(1964, NULL, NULL, 1680353697, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:24:57'),
(1965, NULL, NULL, 1680353725, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:25:25'),
(1966, NULL, NULL, 1680353725, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:25:25'),
(1967, NULL, NULL, 1680353761, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:26:01'),
(1968, NULL, NULL, 1680353923, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:28:43'),
(1969, NULL, NULL, 1680353939, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:28:59'),
(1970, NULL, NULL, 1680353941, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:01'),
(1971, NULL, NULL, 1680353945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:05'),
(1972, NULL, NULL, 1680353950, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:10'),
(1973, NULL, NULL, 1680353950, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:10'),
(1974, NULL, NULL, 1680353968, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:28'),
(1975, NULL, NULL, 1680353968, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:28'),
(1976, NULL, NULL, 1680353995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:55'),
(1977, NULL, NULL, 1680353995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:55'),
(1978, NULL, NULL, 1680353995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:55'),
(1979, NULL, NULL, 1680353995, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:29:55'),
(1980, NULL, NULL, 1680354010, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:10'),
(1981, NULL, NULL, 1680354010, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:10'),
(1982, NULL, NULL, 1680354010, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:10'),
(1983, NULL, NULL, 1680354010, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:10'),
(1984, NULL, NULL, 1680354040, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:40'),
(1985, NULL, NULL, 1680354040, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:40'),
(1986, NULL, NULL, 1680354040, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:40'),
(1987, NULL, NULL, 1680354040, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:40'),
(1988, NULL, NULL, 1680354059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:59'),
(1989, NULL, NULL, 1680354059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:59'),
(1990, NULL, NULL, 1680354059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:59'),
(1991, NULL, NULL, 1680354059, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:30:59'),
(1992, NULL, NULL, 1680354071, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:31:11'),
(1993, NULL, NULL, 1680354071, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:31:11'),
(1994, NULL, NULL, 1680354071, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:31:11'),
(1995, NULL, NULL, 1680354071, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:31:11'),
(1996, NULL, NULL, 1680354122, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:02'),
(1997, NULL, NULL, 1680354122, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:02'),
(1998, NULL, NULL, 1680354122, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:02'),
(1999, NULL, NULL, 1680354122, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:02'),
(2000, NULL, NULL, 1680354141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:21'),
(2001, NULL, NULL, 1680354141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:21'),
(2002, NULL, NULL, 1680354141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:21'),
(2003, NULL, NULL, 1680354141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:21'),
(2004, NULL, NULL, 1680354146, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:26'),
(2005, NULL, NULL, 1680354146, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:26'),
(2006, NULL, NULL, 1680354146, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:26'),
(2007, NULL, NULL, 1680354146, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:26'),
(2008, NULL, NULL, 1680354164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:44'),
(2009, NULL, NULL, 1680354164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:44'),
(2010, NULL, NULL, 1680354164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:44'),
(2011, NULL, NULL, 1680354164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:44'),
(2012, NULL, NULL, 1680354171, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:51'),
(2013, NULL, NULL, 1680354171, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:51'),
(2014, NULL, NULL, 1680354171, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:51'),
(2015, NULL, NULL, 1680354171, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:32:51'),
(2016, NULL, NULL, 1680354185, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:05'),
(2017, NULL, NULL, 1680354185, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:05'),
(2018, NULL, NULL, 1680354189, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:33:09'),
(2019, NULL, NULL, 1680354203, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:23'),
(2020, NULL, NULL, 1680354203, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:23'),
(2021, NULL, NULL, 1680354203, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:23'),
(2022, NULL, NULL, 1680354203, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:23'),
(2023, NULL, NULL, 1680354208, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:28'),
(2024, NULL, NULL, 1680354208, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:28'),
(2025, NULL, NULL, 1680354212, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:32'),
(2026, NULL, NULL, 1680354213, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:33:33'),
(2027, NULL, NULL, 1680354301, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:01'),
(2028, NULL, NULL, 1680354301, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:01'),
(2029, NULL, NULL, 1680354301, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:01'),
(2030, NULL, NULL, 1680354301, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:01'),
(2031, NULL, NULL, 1680354302, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:02'),
(2032, NULL, NULL, 1680354302, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:02'),
(2033, NULL, NULL, 1680354306, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:06'),
(2034, NULL, NULL, 1680354306, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:06'),
(2035, NULL, NULL, 1680354312, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:12'),
(2036, NULL, NULL, 1680354312, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:12'),
(2037, NULL, NULL, 1680354315, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:15'),
(2038, NULL, NULL, 1680354315, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:15'),
(2039, NULL, NULL, 1680354336, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:36'),
(2040, NULL, NULL, 1680354336, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:36'),
(2041, NULL, NULL, 1680354336, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:36'),
(2042, NULL, NULL, 1680354336, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:36'),
(2043, NULL, NULL, 1680354343, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:44'),
(2044, NULL, NULL, 1680354344, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:44'),
(2045, NULL, NULL, 1680354346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:46'),
(2046, NULL, NULL, 1680354346, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:35:46'),
(2047, NULL, NULL, 1680354360, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:00'),
(2048, NULL, NULL, 1680354360, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:00'),
(2049, NULL, NULL, 1680354367, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:36:07'),
(2050, NULL, NULL, 1680354395, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:35'),
(2051, NULL, NULL, 1680354395, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:35'),
(2052, NULL, NULL, 1680354396, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:36'),
(2053, NULL, NULL, 1680354396, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:36'),
(2054, NULL, NULL, 1680354405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:36:45'),
(2055, NULL, NULL, 1680354412, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:52'),
(2056, NULL, NULL, 1680354412, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:36:52'),
(2057, NULL, NULL, 1680354440, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:37:20'),
(2058, NULL, NULL, 1680354441, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:37:21'),
(2059, NULL, NULL, 1680354448, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:37:28'),
(2060, NULL, NULL, 1680354448, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:37:28'),
(2061, NULL, NULL, 1680354494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:38:14'),
(2062, NULL, NULL, 1680354494, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:38:14'),
(2063, NULL, NULL, 1680354522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:38:42'),
(2064, NULL, NULL, 1680354522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:38:42'),
(2065, NULL, NULL, 1680354522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:38:42'),
(2066, NULL, NULL, 1680354522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:38:42'),
(2067, NULL, NULL, 1680354609, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:40:09'),
(2068, NULL, NULL, 1680354609, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:40:09'),
(2069, NULL, NULL, 1680354614, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:40:14'),
(2070, NULL, NULL, 1680354614, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:40:14'),
(2071, NULL, NULL, 1680354763, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:42:43'),
(2072, NULL, NULL, 1680354763, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:42:43'),
(2073, NULL, NULL, 1680354768, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:42:48'),
(2074, NULL, NULL, 1680354819, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:43:39'),
(2075, NULL, NULL, 1680354821, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:43:41'),
(2076, NULL, NULL, 1680354886, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:44:46'),
(2077, NULL, NULL, 1680354886, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:44:46'),
(2078, NULL, NULL, 1680354912, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-01 18:45:12'),
(2079, NULL, NULL, 1680354928, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:45:28'),
(2080, NULL, NULL, 1680354928, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:45:28'),
(2081, NULL, NULL, 1680355001, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:46:41'),
(2082, NULL, NULL, 1680355001, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:46:41'),
(2083, NULL, NULL, 1680355067, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:47:47'),
(2084, NULL, NULL, 1680355067, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:47:47'),
(2085, NULL, NULL, 1680355075, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:47:55'),
(2086, NULL, NULL, 1680355075, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:47:55'),
(2087, NULL, NULL, 1680355079, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:47:59'),
(2088, NULL, NULL, 1680355079, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:47:59'),
(2089, NULL, NULL, 1680355086, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:48:06'),
(2090, NULL, NULL, 1680355086, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-01 18:48:06'),
(2091, NULL, NULL, 1680498125, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:32:05'),
(2092, NULL, NULL, 1680498125, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:32:05'),
(2093, NULL, NULL, 1680498129, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:32:09'),
(2094, NULL, NULL, 1680498129, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:32:09'),
(2095, NULL, NULL, 1680498134, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:32:14'),
(2096, NULL, NULL, 1680498134, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:32:14'),
(2097, NULL, NULL, 1680498260, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:34:20'),
(2098, NULL, NULL, 1680498260, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:34:20'),
(2099, NULL, NULL, 1680498310, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:35:10'),
(2100, NULL, NULL, 1680498310, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:35:10'),
(2101, NULL, NULL, 1680498361, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:36:01'),
(2102, NULL, NULL, 1680498361, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:36:01'),
(2103, NULL, NULL, 1680498374, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:36:14'),
(2104, NULL, NULL, 1680498374, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:36:14'),
(2105, NULL, NULL, 1680498452, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:37:32'),
(2106, NULL, NULL, 1680498454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:37:34'),
(2107, NULL, NULL, 1680498454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:37:34'),
(2108, NULL, NULL, 1680498466, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:37:46'),
(2109, NULL, NULL, 1680498482, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:38:02'),
(2110, NULL, NULL, 1680498492, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:38:12'),
(2111, NULL, NULL, 1680498527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:38:47'),
(2112, NULL, NULL, 1680498527, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:38:47'),
(2113, NULL, NULL, 1680498547, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:07'),
(2114, NULL, NULL, 1680498547, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:07'),
(2115, NULL, NULL, 1680498557, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:17'),
(2116, NULL, NULL, 1680498563, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:23'),
(2117, NULL, NULL, 1680498563, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:23'),
(2118, NULL, NULL, 1680498566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:26'),
(2119, NULL, NULL, 1680498566, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:39:26'),
(2120, NULL, NULL, 1680498746, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:42:26'),
(2121, NULL, NULL, 1680498746, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:42:26'),
(2122, NULL, NULL, 1680498821, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:43:41'),
(2123, NULL, NULL, 1680498821, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:43:41'),
(2124, NULL, NULL, 1680498841, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:44:01'),
(2125, NULL, NULL, 1680498866, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:44:26'),
(2126, NULL, NULL, 1680498866, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:44:26'),
(2127, NULL, NULL, 1680498918, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:45:18'),
(2128, NULL, NULL, 1680498918, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:45:18'),
(2129, NULL, NULL, 1680498957, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:45:57'),
(2130, NULL, NULL, 1680498958, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:45:58'),
(2131, NULL, NULL, 1680498964, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:46:04'),
(2132, NULL, NULL, 1680498964, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:46:04'),
(2133, NULL, NULL, 1680498984, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:46:24'),
(2134, NULL, NULL, 1680498984, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:46:24'),
(2135, NULL, NULL, 1680499001, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:46:41'),
(2136, NULL, NULL, 1680499001, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:46:41'),
(2137, NULL, NULL, 1680499033, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:47:13'),
(2138, NULL, NULL, 1680499033, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:47:13'),
(2139, NULL, NULL, 1680499052, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:47:32'),
(2140, NULL, NULL, 1680499052, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:47:32'),
(2141, NULL, NULL, 1680499077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:47:57'),
(2142, NULL, NULL, 1680499077, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:47:57'),
(2143, NULL, NULL, 1680499080, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:00'),
(2144, NULL, NULL, 1680499085, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:05'),
(2145, NULL, NULL, 1680499085, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:05'),
(2146, NULL, NULL, 1680499098, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:18'),
(2147, NULL, NULL, 1680499098, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:18'),
(2148, NULL, NULL, 1680499099, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:19'),
(2149, NULL, NULL, 1680499099, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:19'),
(2150, NULL, NULL, 1680499102, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:22'),
(2151, NULL, NULL, 1680499102, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:22');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(2152, NULL, NULL, 1680499109, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:29'),
(2153, NULL, NULL, 1680499109, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:48:29'),
(2154, NULL, NULL, 1680499158, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:18'),
(2155, NULL, NULL, 1680499158, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:18'),
(2156, NULL, NULL, 1680499164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:24'),
(2157, NULL, NULL, 1680499164, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:24'),
(2158, NULL, NULL, 1680499168, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:28'),
(2159, NULL, NULL, 1680499174, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:34'),
(2160, NULL, NULL, 1680499193, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:49:53'),
(2161, NULL, NULL, 1680499198, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:49:58'),
(2162, NULL, NULL, 1680499202, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:50:02'),
(2163, NULL, NULL, 1680499202, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:50:02'),
(2164, NULL, NULL, 1680499220, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:50:20'),
(2165, NULL, NULL, 1680499220, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:50:20'),
(2166, NULL, NULL, 1680499221, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:50:21'),
(2167, NULL, NULL, 1680499221, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:50:21'),
(2168, NULL, NULL, 1680499302, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:51:42'),
(2169, NULL, NULL, 1680499341, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:52:21'),
(2170, NULL, NULL, 1680499341, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:52:21'),
(2171, NULL, NULL, 1680499351, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:52:31'),
(2172, NULL, NULL, 1680499361, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:52:41'),
(2173, NULL, NULL, 1680499363, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:52:43'),
(2174, NULL, NULL, 1680499363, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:52:43'),
(2175, NULL, NULL, 1680499368, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:52:48'),
(2176, NULL, NULL, 1680499385, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:53:05'),
(2177, NULL, NULL, 1680499392, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:53:12'),
(2178, NULL, NULL, 1680499419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:53:39'),
(2179, NULL, NULL, 1680499419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:53:39'),
(2180, NULL, NULL, 1680499435, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:53:55'),
(2181, NULL, NULL, 1680499502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:55:02'),
(2182, NULL, NULL, 1680499502, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:55:02'),
(2183, NULL, NULL, 1680499506, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:55:06'),
(2184, NULL, NULL, 1680499523, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:55:23'),
(2185, NULL, NULL, 1680499525, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:55:25'),
(2186, NULL, NULL, 1680499558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:55:58'),
(2187, NULL, NULL, 1680499558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:55:58'),
(2188, NULL, NULL, 1680499568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:56:08'),
(2189, NULL, NULL, 1680499590, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:56:30'),
(2190, NULL, NULL, 1680499639, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:57:19'),
(2191, NULL, NULL, 1680499639, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:57:19'),
(2192, NULL, NULL, 1680499662, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:57:42'),
(2193, NULL, NULL, 1680499669, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:57:49'),
(2194, NULL, NULL, 1680499671, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:57:51'),
(2195, NULL, NULL, 1680499671, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:57:51'),
(2196, NULL, NULL, 1680499678, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:57:58'),
(2197, NULL, NULL, 1680499728, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:58:48'),
(2198, NULL, NULL, 1680499759, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:19'),
(2199, NULL, NULL, 1680499761, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:21'),
(2200, NULL, NULL, 1680499761, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:21'),
(2201, NULL, NULL, 1680499770, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:59:30'),
(2202, NULL, NULL, 1680499786, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:46'),
(2203, NULL, NULL, 1680499786, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:46'),
(2204, NULL, NULL, 1680499794, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:54'),
(2205, NULL, NULL, 1680499794, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 10:59:54'),
(2206, NULL, NULL, 1680499799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 10:59:59'),
(2207, NULL, NULL, 1680499838, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:00:38'),
(2208, NULL, NULL, 1680499838, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:00:38'),
(2209, NULL, NULL, 1680499841, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:00:41'),
(2210, NULL, NULL, 1680499841, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:00:41'),
(2211, NULL, NULL, 1680499848, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:00:48'),
(2212, NULL, NULL, 1680499889, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:01:29'),
(2213, NULL, NULL, 1680499889, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:01:29'),
(2214, NULL, NULL, 1680499897, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:01:37'),
(2215, NULL, NULL, 1680499916, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:01:56'),
(2216, NULL, NULL, 1680499919, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:01:59'),
(2217, NULL, NULL, 1680499921, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:01'),
(2218, NULL, NULL, 1680499921, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:01'),
(2219, NULL, NULL, 1680499926, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:02:06'),
(2220, NULL, NULL, 1680499936, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:16'),
(2221, NULL, NULL, 1680499938, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:02:18'),
(2222, NULL, NULL, 1680499940, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:20'),
(2223, NULL, NULL, 1680499945, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:25'),
(2224, NULL, NULL, 1680499947, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:02:27'),
(2225, NULL, NULL, 1680499956, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:36'),
(2226, NULL, NULL, 1680499965, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:02:45'),
(2227, NULL, NULL, 1680499975, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:56'),
(2228, NULL, NULL, 1680499977, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:57'),
(2229, NULL, NULL, 1680499979, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:02:59'),
(2230, NULL, NULL, 1680499980, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:00'),
(2231, NULL, NULL, 1680499983, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:03'),
(2232, NULL, NULL, 1680499985, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:05'),
(2233, NULL, NULL, 1680499988, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:08'),
(2234, NULL, NULL, 1680499992, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:12'),
(2235, NULL, NULL, 1680499994, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:14'),
(2236, NULL, NULL, 1680499997, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:03:17'),
(2237, NULL, NULL, 1680500001, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:21'),
(2238, NULL, NULL, 1680500004, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:03:24'),
(2239, NULL, NULL, 1680500018, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:38'),
(2240, NULL, NULL, 1680500018, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:03:38'),
(2241, NULL, NULL, 1680500029, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:03:49'),
(2242, NULL, NULL, 1680500047, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:04:07'),
(2243, NULL, NULL, 1680500047, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:04:07'),
(2244, NULL, NULL, 1680500049, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:04:09'),
(2245, NULL, NULL, 1680500049, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:04:09'),
(2246, NULL, NULL, 1680500056, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:04:16'),
(2247, NULL, NULL, 1680500064, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:04:24'),
(2248, NULL, NULL, 1680500064, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:04:24'),
(2249, NULL, NULL, 1680500263, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:07:43'),
(2250, NULL, NULL, 1680500275, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:07:55'),
(2251, NULL, NULL, 1680500276, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:07:56'),
(2252, NULL, NULL, 1680500278, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:07:58'),
(2253, NULL, NULL, 1680500278, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:07:58'),
(2254, NULL, NULL, 1680500284, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:08:04'),
(2255, NULL, NULL, 1680500324, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:08:44'),
(2256, NULL, NULL, 1680500330, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:08:50'),
(2257, NULL, NULL, 1680500345, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:09:06'),
(2258, NULL, NULL, 1680500347, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:09:07'),
(2259, NULL, NULL, 1680500375, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:09:35'),
(2260, NULL, NULL, 1680500375, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:09:35'),
(2261, NULL, NULL, 1680500377, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:09:37'),
(2262, NULL, NULL, 1680500377, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:09:37'),
(2263, NULL, NULL, 1680500481, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:11:21'),
(2264, NULL, NULL, 1680500484, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:11:24'),
(2265, NULL, NULL, 1680500489, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:11:29'),
(2266, NULL, NULL, 1680500506, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:11:46'),
(2267, NULL, NULL, 1680500508, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:11:48'),
(2268, NULL, NULL, 1680500510, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:11:50'),
(2269, NULL, NULL, 1680500510, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:11:50'),
(2270, NULL, NULL, 1680500514, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:11:54'),
(2271, NULL, NULL, 1680500522, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:12:02'),
(2272, NULL, NULL, 1680500524, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:12:04'),
(2273, NULL, NULL, 1680500579, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:12:59'),
(2274, NULL, NULL, 1680500581, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:13:01'),
(2275, NULL, NULL, 1680500584, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:13:04'),
(2276, NULL, NULL, 1680500584, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:13:04'),
(2277, NULL, NULL, 1680500588, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 11:13:08'),
(2278, NULL, NULL, 1680500632, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:13:52'),
(2279, NULL, NULL, 1680500632, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:13:52'),
(2280, NULL, NULL, 1680501092, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:21:32'),
(2281, NULL, NULL, 1680501092, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:21:32'),
(2282, NULL, NULL, 1680501103, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:21:43'),
(2283, NULL, NULL, 1680501103, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:21:43'),
(2284, NULL, NULL, 1680501111, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:21:51'),
(2285, NULL, NULL, 1680501111, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:21:51'),
(2286, NULL, NULL, 1680501230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:23:50'),
(2287, NULL, NULL, 1680501230, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:23:50'),
(2288, NULL, NULL, 1680501232, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:23:52'),
(2289, NULL, NULL, 1680501232, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:23:52'),
(2290, NULL, NULL, 1680501325, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:25:25'),
(2291, NULL, NULL, 1680501325, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:25:25'),
(2292, NULL, NULL, 1680501419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:26:59'),
(2293, NULL, NULL, 1680501419, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:26:59'),
(2294, NULL, NULL, 1680501471, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:27:51'),
(2295, NULL, NULL, 1680501471, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:27:51'),
(2296, NULL, NULL, 1680501824, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:33:44'),
(2297, NULL, NULL, 1680501824, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 11:33:44'),
(2298, 110, 5, 1680509981, 'updateUsers method of userController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'User updated successfully', '2023-04-03 13:49:41'),
(2299, NULL, NULL, 1680510780, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-04-03 14:03:00'),
(2300, NULL, NULL, 1680511246, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:10:46'),
(2301, NULL, NULL, 1680511246, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:10:46'),
(2302, NULL, NULL, 1680511250, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:10:50'),
(2303, NULL, NULL, 1680511257, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:10:57'),
(2304, NULL, NULL, 1680511257, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:10:57'),
(2305, NULL, NULL, 1680511263, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 14:11:03'),
(2306, NULL, NULL, 1680511292, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:11:33'),
(2307, NULL, NULL, 1680511294, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 14:11:34'),
(2308, NULL, NULL, 1680511476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:14:36'),
(2309, NULL, NULL, 1680511476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:14:36'),
(2310, NULL, NULL, 1680511481, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:14:41'),
(2311, NULL, NULL, 1680511481, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:14:41'),
(2312, NULL, NULL, 1680511497, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:14:57'),
(2313, NULL, NULL, 1680511498, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:14:58'),
(2314, NULL, NULL, 1680511508, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 14:15:08'),
(2315, NULL, NULL, 1680511510, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:10'),
(2316, NULL, NULL, 1680511511, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:11'),
(2317, NULL, NULL, 1680511513, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:13'),
(2318, NULL, NULL, 1680511520, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 14:15:20'),
(2319, NULL, NULL, 1680511521, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:21'),
(2320, NULL, NULL, 1680511523, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:23'),
(2321, NULL, NULL, 1680511546, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 14:15:46'),
(2322, NULL, NULL, 1680511556, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-03 14:15:56'),
(2323, NULL, NULL, 1680511558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:58'),
(2324, NULL, NULL, 1680511558, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 14:15:58'),
(2325, NULL, NULL, 1680514966, 'timeSheet method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 15:12:46'),
(2326, NULL, NULL, 1680514966, 'timeSheet method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 15:12:46'),
(2327, NULL, NULL, 1680514976, 'timeSheet method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 15:12:56'),
(2328, NULL, NULL, 1680514983, 'timeSheet method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 15:13:03'),
(2329, NULL, NULL, 1680514983, 'timeSheet method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-03 15:13:03'),
(2330, NULL, NULL, 1680522565, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:19:25'),
(2331, NULL, NULL, 1680522606, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:20:06'),
(2332, 1, 1, 1680522687, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:21:27'),
(2333, 1, 1, 1680522701, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:21:41'),
(2334, 1, 1, 1680522726, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:22:06'),
(2335, 1, 1, 1680522893, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:24:53'),
(2336, 1, 1, 1680522909, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:25:09'),
(2337, 1, 1, 1680522992, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:26:32'),
(2338, 1, 1, 1680524124, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:45:24'),
(2339, 1, 1, 1680524149, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:45:49'),
(2340, 1, 1, 1680524227, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:47:07'),
(2341, 1, 1, 1680524238, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'validate\')', '2023-04-03 17:47:18'),
(2342, 1, 1, 1680524251, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:47:31'),
(2343, 1, 1, 1680524273, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:47:53'),
(2344, 1, 1, 1680524339, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:48:59'),
(2345, 1, 1, 1680524386, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:49:46'),
(2346, 1, 1, 1680524402, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:50:02'),
(2347, 1, 1, 1680524430, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:50:30'),
(2348, 1, 1, 1680524836, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 17:57:16'),
(2349, 1, 1, 1680525233, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 18:03:53'),
(2350, 1, 1, 1680525524, 'applyLeave method of leaveApplicationController ', '::1', 'PostmanRuntime/7.31.3', 'response', '2023-04-03 18:08:44'),
(2351, 1, 1, 1680526907, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-03 18:31:47'),
(2352, 1, 1, 1680527256, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-03 18:37:36');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(2353, 1, 1, 1680527455, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-03 18:40:55'),
(2354, 1, 1, 1680527490, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-03 18:41:30'),
(2355, 1, 1, 1680527558, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-03 18:42:38'),
(2356, NULL, NULL, 1680583243, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-04 10:10:43'),
(2357, NULL, NULL, 1680583243, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-04 10:10:43'),
(2358, NULL, NULL, 1680583247, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-04 10:10:47'),
(2359, NULL, NULL, 1680583247, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-04 10:10:47'),
(2360, NULL, NULL, 1680583285, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-04 10:11:25'),
(2361, NULL, NULL, 1680583285, 'timeSheet method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-04 10:11:25'),
(2362, NULL, NULL, 1680583774, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Fetched successfully', '2023-04-04 10:19:34'),
(2363, 1, 1, 1680583970, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-04 10:22:50'),
(2364, NULL, NULL, 1680584854, 'clockIn method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-04 10:37:34'),
(2365, NULL, NULL, 1680584924, 'clockIn method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-04 10:38:44'),
(2366, NULL, NULL, 1680585016, 'clockIn method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-04 10:40:16'),
(2367, NULL, NULL, 1680585112, 'clockOut method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 10:41:52'),
(2368, NULL, NULL, 1680585143, 'clockOut method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Clock out', '2023-04-04 10:42:23'),
(2369, NULL, NULL, 1680585375, 'startBreak method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'ER_BAD_NULL_ERROR: Column \'user_id\' cannot be null', '2023-04-04 10:46:15'),
(2370, NULL, NULL, 1680585392, 'startBreak method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Break marked', '2023-04-04 10:46:32'),
(2371, NULL, NULL, 1680585445, 'startBreak method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Break marked', '2023-04-04 10:47:25'),
(2372, NULL, NULL, 1680585491, 'endBreak method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 10:48:11'),
(2373, NULL, NULL, 1680585504, 'endBreak method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 10:48:24'),
(2374, NULL, NULL, 1680585543, 'endBreak method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'Break ended', '2023-04-04 10:49:03'),
(2375, 1, 1, 1680590005, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-04 12:03:25'),
(2376, NULL, NULL, 1680590213, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-04 12:06:53'),
(2377, NULL, NULL, 1680590250, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Clock out', '2023-04-04 12:07:30'),
(2378, NULL, NULL, 1680590486, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-04 12:11:26'),
(2379, NULL, NULL, 1680591154, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 12:22:34'),
(2380, NULL, NULL, 1680592766, 'clockIn method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 12:49:26'),
(2381, NULL, NULL, 1680593838, 'startBreak method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Break marked', '2023-04-04 13:07:18'),
(2382, NULL, NULL, 1680594077, 'endBreak method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 13:11:17'),
(2383, NULL, NULL, 1680596444, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 13:50:44'),
(2384, NULL, NULL, 1680596521, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 13:52:01'),
(2385, NULL, NULL, 1680596552, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 13:52:32'),
(2386, NULL, NULL, 1680596588, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 13:53:08'),
(2387, NULL, NULL, 1680596620, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 13:53:40'),
(2388, NULL, NULL, 1680596637, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 13:53:57'),
(2389, NULL, NULL, 1680596824, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 13:57:04'),
(2390, NULL, NULL, 1680596873, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 13:57:53'),
(2391, NULL, NULL, 1680599627, 'clockOut method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 14:43:47'),
(2392, NULL, NULL, 1680600450, 'clockIn method of attendanceController ', '::1', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-04 14:57:30'),
(2393, NULL, NULL, 1680601055, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 15:07:35'),
(2394, NULL, NULL, 1680601082, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 15:08:02'),
(2395, NULL, NULL, 1680601248, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 15:10:48'),
(2396, NULL, NULL, 1680601274, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 15:11:14'),
(2397, NULL, NULL, 1680601576, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 15:16:16'),
(2398, NULL, NULL, 1680602808, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 15:36:48'),
(2399, NULL, NULL, 1680606503, 'clockIn method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 16:38:23'),
(2400, NULL, NULL, 1680608083, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 17:04:43'),
(2401, NULL, NULL, 1680608186, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 17:06:26'),
(2402, NULL, NULL, 1680608343, 'clockIn method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 17:09:03'),
(2403, NULL, NULL, 1680608397, 'clockOut method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 17:09:57'),
(2404, NULL, NULL, 1680609035, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-04 17:20:35'),
(2405, NULL, NULL, 1680609169, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 17:22:49'),
(2406, NULL, NULL, 1680609178, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 17:22:58'),
(2407, NULL, NULL, 1680609195, 'clockOut method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Clock out', '2023-04-04 17:23:15'),
(2408, NULL, NULL, 1680609608, 'endBreak method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'Cannot read properties of undefined (reading \'id\')', '2023-04-04 17:30:08'),
(2409, NULL, NULL, 1680609764, 'startBreak method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break marked', '2023-04-04 17:32:44'),
(2410, NULL, NULL, 1680609828, 'endBreak method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 17:33:48'),
(2411, NULL, NULL, 1680610420, 'startBreak method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break marked', '2023-04-04 17:43:40'),
(2412, NULL, NULL, 1680610430, 'endBreak method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 17:43:50'),
(2413, NULL, NULL, 1680610445, 'endBreak method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 17:44:05'),
(2414, NULL, NULL, 1680610473, 'endBreak method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 17:44:33'),
(2415, NULL, NULL, 1680611544, 'startBreak method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break marked', '2023-04-04 18:02:24'),
(2416, NULL, NULL, 1680611562, 'endBreak method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 18:02:42'),
(2417, NULL, NULL, 1680611604, 'endBreak method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 18:03:24'),
(2418, NULL, NULL, 1680611627, 'endBreak method of attendanceController ', '::ffff:192.168.1.24', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Break ended', '2023-04-04 18:03:47'),
(2419, NULL, NULL, 1680669448, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'clock in', '2023-04-05 10:07:28'),
(2420, NULL, NULL, 1680669640, 'clockIn method of attendanceController ', '::ffff:192.168.1.33', 'PostmanRuntime/7.31.3', 'clock in', '2023-04-05 10:10:40'),
(2421, 1, 1, 1681295314, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.38', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'response', '2023-04-12 15:58:34'),
(2422, NULL, NULL, 1681386551, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-13 17:19:11'),
(2423, NULL, NULL, 1681474159, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-14 17:39:19'),
(2424, NULL, NULL, 1681474417, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-14 17:43:37'),
(2425, NULL, NULL, 1681474905, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-14 17:51:45'),
(2426, NULL, NULL, 1681475320, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-14 17:58:40'),
(2427, NULL, NULL, 1681475443, 'timeSheet method of attendanceController ', '::ffff:192.168.1.17', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-14 18:00:43'),
(2428, NULL, NULL, 1681476910, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-14 18:25:10'),
(2429, NULL, NULL, 1681476960, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-14 18:26:00'),
(2430, NULL, NULL, 1681562271, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-15 18:07:51'),
(2431, NULL, NULL, 1681562277, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-15 18:07:57'),
(2432, NULL, NULL, 1681562280, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:08:00'),
(2433, NULL, NULL, 1681562507, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:11:47'),
(2434, NULL, NULL, 1681562613, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:13:33'),
(2435, NULL, NULL, 1681562640, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:14:00'),
(2436, NULL, NULL, 1681562669, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:14:29'),
(2437, NULL, NULL, 1681562681, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:14:41'),
(2438, NULL, NULL, 1681562768, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-15 18:16:08'),
(2439, NULL, NULL, 1681707663, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-17 10:31:03'),
(2440, NULL, NULL, 1681707672, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-17 10:31:12'),
(2441, NULL, NULL, 1681707688, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 10:31:28'),
(2442, NULL, NULL, 1681709359, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 10:59:19'),
(2443, NULL, NULL, 1681709364, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 10:59:24'),
(2444, NULL, NULL, 1681709368, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 10:59:28'),
(2445, NULL, NULL, 1681709384, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 10:59:44'),
(2446, NULL, NULL, 1681709405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:00:05'),
(2447, NULL, NULL, 1681709405, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:00:05'),
(2448, NULL, NULL, 1681709442, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-17 11:00:42'),
(2449, NULL, NULL, 1681709446, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 11:00:46'),
(2450, NULL, NULL, 1681709451, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Records not found', '2023-04-17 11:00:51'),
(2451, NULL, NULL, 1681709455, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 11:00:55'),
(2452, NULL, NULL, 1681709497, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:01:37'),
(2453, NULL, NULL, 1681709572, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:02:52'),
(2454, NULL, NULL, 1681709844, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:07:24'),
(2455, NULL, NULL, 1681709844, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:07:24'),
(2456, NULL, NULL, 1681711426, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:33:46'),
(2457, NULL, NULL, 1681711454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:34:14'),
(2458, NULL, NULL, 1681711454, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:34:14'),
(2459, NULL, NULL, 1681711497, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:34:57'),
(2460, NULL, NULL, 1681711562, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:36:02'),
(2461, NULL, NULL, 1681711936, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:42:16'),
(2462, NULL, NULL, 1681711955, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:42:35'),
(2463, NULL, NULL, 1681711963, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:42:43'),
(2464, NULL, NULL, 1681712040, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:44:00'),
(2465, NULL, NULL, 1681712046, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:44:06'),
(2466, NULL, NULL, 1681712055, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:44:15'),
(2467, NULL, NULL, 1681712066, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:44:26'),
(2468, NULL, NULL, 1681712073, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:44:33'),
(2469, NULL, NULL, 1681712183, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:46:23'),
(2470, NULL, NULL, 1681712199, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:46:39'),
(2471, NULL, NULL, 1681712204, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:46:44'),
(2472, NULL, NULL, 1681712214, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:46:54'),
(2473, NULL, NULL, 1681712735, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:55:35'),
(2474, NULL, NULL, 1681712744, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:55:44'),
(2475, NULL, NULL, 1681712752, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:55:52'),
(2476, NULL, NULL, 1681712758, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:55:58'),
(2477, NULL, NULL, 1681712766, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:56:06'),
(2478, NULL, NULL, 1681712856, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:57:36'),
(2479, NULL, NULL, 1681712865, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:57:45'),
(2480, NULL, NULL, 1681712888, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:58:08'),
(2481, NULL, NULL, 1681712891, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:58:11'),
(2482, NULL, NULL, 1681712894, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:58:14'),
(2483, NULL, NULL, 1681712899, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:58:19'),
(2484, NULL, NULL, 1681712900, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:58:20'),
(2485, NULL, NULL, 1681712917, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 11:58:37'),
(2486, NULL, NULL, 1681712920, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 11:58:40'),
(2487, NULL, NULL, 1681713302, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:05:02'),
(2488, NULL, NULL, 1681713317, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:05:17'),
(2489, NULL, NULL, 1681713351, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:05:51'),
(2490, NULL, NULL, 1681713476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:07:56'),
(2491, NULL, NULL, 1681713476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:07:56'),
(2492, NULL, NULL, 1681713485, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:08:05'),
(2493, NULL, NULL, 1681713489, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:08:09'),
(2494, NULL, NULL, 1681713492, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:08:12'),
(2495, NULL, NULL, 1681713495, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:08:15'),
(2496, NULL, NULL, 1681713498, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:08:18'),
(2497, NULL, NULL, 1681713501, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:08:21'),
(2498, NULL, NULL, 1681713538, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:08:58'),
(2499, NULL, NULL, 1681713538, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:08:58'),
(2500, NULL, NULL, 1681713628, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:10:28'),
(2501, NULL, NULL, 1681713713, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 12:11:53'),
(2502, NULL, NULL, 1681713789, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-17 12:13:09'),
(2503, NULL, NULL, 1681713870, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:14:30'),
(2504, NULL, NULL, 1681713961, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:16:01'),
(2505, NULL, NULL, 1681713961, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:16:01'),
(2506, NULL, NULL, 1681713961, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:16:01'),
(2507, NULL, NULL, 1681713961, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:16:01'),
(2508, NULL, NULL, 1681714028, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:17:08'),
(2509, NULL, NULL, 1681714028, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:17:08'),
(2510, NULL, NULL, 1681714028, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:17:08'),
(2511, NULL, NULL, 1681714028, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:17:08'),
(2512, NULL, NULL, 1681714549, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:25:49'),
(2513, NULL, NULL, 1681714549, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:25:49'),
(2514, NULL, NULL, 1681714549, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:25:49'),
(2515, NULL, NULL, 1681714550, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:25:50'),
(2516, NULL, NULL, 1681714607, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:26:47'),
(2517, NULL, NULL, 1681714607, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:26:47'),
(2518, NULL, NULL, 1681714680, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:28:00'),
(2519, NULL, NULL, 1681714681, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:28:01'),
(2520, NULL, NULL, 1681714708, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:28:28'),
(2521, NULL, NULL, 1681714709, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:28:29'),
(2522, NULL, NULL, 1681714740, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:29:00'),
(2523, NULL, NULL, 1681714740, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:29:00'),
(2524, NULL, NULL, 1681715181, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:36:21'),
(2525, NULL, NULL, 1681715188, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:36:28'),
(2526, NULL, NULL, 1681715200, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:36:40'),
(2527, NULL, NULL, 1681715200, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:36:40'),
(2528, NULL, NULL, 1681715422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:22'),
(2529, NULL, NULL, 1681715422, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:22'),
(2530, NULL, NULL, 1681715436, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:36'),
(2531, NULL, NULL, 1681715442, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:42'),
(2532, NULL, NULL, 1681715442, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:42'),
(2533, NULL, NULL, 1681715450, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:50'),
(2534, NULL, NULL, 1681715451, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:40:51'),
(2535, NULL, NULL, 1681715476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:41:16'),
(2536, NULL, NULL, 1681715476, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:41:16'),
(2537, NULL, NULL, 1681715557, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:42:37'),
(2538, NULL, NULL, 1681715568, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:42:48'),
(2539, NULL, NULL, 1681715569, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:42:49'),
(2540, NULL, NULL, 1681715593, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:43:13'),
(2541, NULL, NULL, 1681715594, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:43:14'),
(2542, NULL, NULL, 1681715662, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:44:22'),
(2543, NULL, NULL, 1681715662, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:44:22'),
(2544, NULL, NULL, 1681715712, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:45:12'),
(2545, NULL, NULL, 1681715756, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:45:56'),
(2546, NULL, NULL, 1681715833, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:47:13'),
(2547, NULL, NULL, 1681715889, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:48:09'),
(2548, NULL, NULL, 1681715900, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:48:20'),
(2549, NULL, NULL, 1681715957, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:49:17'),
(2550, NULL, NULL, 1681715983, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-17 12:49:43'),
(2551, NULL, NULL, 1681715987, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:49:47'),
(2552, NULL, NULL, 1681716014, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:50:14'),
(2553, NULL, NULL, 1681716014, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:50:14'),
(2554, NULL, NULL, 1681716089, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:51:29'),
(2555, NULL, NULL, 1681716089, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:51:29'),
(2556, NULL, NULL, 1681716131, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:52:11'),
(2557, NULL, NULL, 1681716131, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:52:11'),
(2558, NULL, NULL, 1681716141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:52:21'),
(2559, NULL, NULL, 1681716141, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:52:21'),
(2560, NULL, NULL, 1681716240, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:54:00'),
(2561, NULL, NULL, 1681716241, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:54:01'),
(2562, NULL, NULL, 1681716248, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:54:08'),
(2563, NULL, NULL, 1681716248, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:54:08'),
(2564, NULL, NULL, 1681716348, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:55:48');
INSERT INTO `user_activity_logs` (`id`, `user_id`, `role_id`, `timestamp`, `action`, `ip_address`, `user_agent`, `result`, `created_at`) VALUES
(2565, NULL, NULL, 1681716348, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:55:48'),
(2566, NULL, NULL, 1681716360, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:56:00'),
(2567, NULL, NULL, 1681716360, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:56:00'),
(2568, NULL, NULL, 1681716401, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:56:41'),
(2569, NULL, NULL, 1681716401, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:56:41'),
(2570, NULL, NULL, 1681716421, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:57:01'),
(2571, NULL, NULL, 1681716421, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:57:01'),
(2572, NULL, NULL, 1681716431, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:57:11'),
(2573, NULL, NULL, 1681716432, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:57:12'),
(2574, NULL, NULL, 1681716493, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:58:13'),
(2575, NULL, NULL, 1681716493, 'timeSheet method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 12:58:13'),
(2576, NULL, NULL, 1681717313, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 13:11:53'),
(2577, NULL, NULL, 1681717313, 'timeSheet method of attendanceController ', '::ffff:192.168.1.18', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-17 13:11:53'),
(2578, 123, 2, 1681796366, 'createUsers method of userController ', '::ffff:192.168.1.14', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User created successfully', '2023-04-18 11:09:26'),
(2579, NULL, NULL, 1681889999, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-19 13:09:59'),
(2580, NULL, NULL, 1681890016, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-19 13:10:16'),
(2581, NULL, NULL, 1681890038, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-19 13:10:38'),
(2582, NULL, NULL, 1681897832, 'timeSheet method of attendanceController ', '::ffff:192.168.1.27', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-19 15:20:32'),
(2583, NULL, NULL, 1681897832, 'timeSheet method of attendanceController ', '::ffff:192.168.1.27', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-04-19 15:20:32'),
(2584, NULL, NULL, 1681907778, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-19 18:06:18'),
(2585, NULL, NULL, 1681907778, 'timeSheet method of attendanceController ', '::ffff:192.168.1.19', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-19 18:06:18'),
(2586, 125, 5, 1681969825, 'createUsers method of userController ', '::ffff:192.168.1.5', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User created successfully', '2023-04-20 11:20:25'),
(2587, 1, 1, 1681993320, 'applyLeave method of leaveApplicationController ', '::ffff:192.168.1.27', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'response', '2023-04-20 17:52:00'),
(2588, NULL, NULL, 1681994346, 'timeSheet method of attendanceController ', '::1', 'PostmanRuntime/7.32.2', 'Fetched successfully', '2023-04-20 18:09:06'),
(2589, NULL, NULL, 1682422775, 'timeSheet method of attendanceController ', '::ffff:192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-25 17:09:35'),
(2590, NULL, NULL, 1682422775, 'timeSheet method of attendanceController ', '::ffff:192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-25 17:09:35'),
(2591, NULL, NULL, 1682422792, 'timeSheet method of attendanceController ', '::ffff:192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-25 17:09:52'),
(2592, NULL, NULL, 1682422792, 'timeSheet method of attendanceController ', '::ffff:192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-25 17:09:52'),
(2593, NULL, NULL, 1682485937, 'clockIn method of attendanceController ', '::ffff:192.168.1.17', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'clock in', '2023-04-26 10:42:17'),
(2594, NULL, NULL, 1682490062, 'timeSheet method of attendanceController ', '::ffff:192.168.1.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-26 11:51:02'),
(2595, NULL, NULL, 1682490062, 'timeSheet method of attendanceController ', '::ffff:192.168.1.13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-04-26 11:51:02'),
(2596, NULL, NULL, 1683181560, 'clockIn method of attendanceController ', '::ffff:192.168.1.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'clock in', '2023-05-04 11:56:00'),
(2597, NULL, NULL, 1683520132, 'clockIn method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'clock in', '2023-05-08 09:58:52'),
(2598, NULL, NULL, 1683520134, 'clockOut method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 09:58:54'),
(2599, NULL, NULL, 1683520135, 'clockOut method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 09:58:55'),
(2600, NULL, NULL, 1683520136, 'clockOut method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 09:58:56'),
(2601, NULL, NULL, 1683520136, 'clockOut method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 09:58:56'),
(2602, NULL, NULL, 1683520137, 'startBreak method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Break marked', '2023-05-08 09:58:57'),
(2603, NULL, NULL, 1683520138, 'clockOut method of attendanceController ', '::ffff:192.168.1.7', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 09:58:58'),
(2604, NULL, NULL, 1683520546, 'clockIn method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'clock in', '2023-05-08 10:05:46'),
(2605, NULL, NULL, 1683520584, 'clockOut method of attendanceController ', '::ffff:192.168.1.11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 10:06:24'),
(2606, NULL, NULL, 1683531534, 'clockOut method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 13:08:54'),
(2607, NULL, NULL, 1683531544, 'clockOut method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-08 13:09:04'),
(2608, NULL, NULL, 1683624055, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 14:50:55'),
(2609, NULL, NULL, 1683624055, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 14:50:55'),
(2610, NULL, NULL, 1683624120, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 14:52:00'),
(2611, NULL, NULL, 1683624120, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 14:52:00'),
(2612, NULL, NULL, 1683626601, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 15:33:21'),
(2613, NULL, NULL, 1683626601, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 15:33:21'),
(2614, NULL, NULL, 1683629449, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:20:49'),
(2615, NULL, NULL, 1683629449, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:20:49'),
(2616, NULL, NULL, 1683629490, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:21:30'),
(2617, NULL, NULL, 1683629582, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:23:02'),
(2618, NULL, NULL, 1683629611, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:23:31'),
(2619, NULL, NULL, 1683629634, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:23:54'),
(2620, NULL, NULL, 1683629656, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:24:16'),
(2621, NULL, NULL, 1683629729, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:25:29'),
(2622, NULL, NULL, 1683629729, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 16:25:29'),
(2623, NULL, NULL, 1683637019, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 18:26:59'),
(2624, NULL, NULL, 1683637019, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-09 18:26:59'),
(2625, 126, 7, 1683783294, 'createUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User created successfully', '2023-05-11 11:04:54'),
(2626, NULL, NULL, 1683783612, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 11:10:12'),
(2627, NULL, NULL, 1683783612, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 11:10:12'),
(2628, NULL, NULL, 1683783618, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 11:10:18'),
(2629, NULL, NULL, 1683783622, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Records not found', '2023-05-11 11:10:22'),
(2630, NULL, NULL, 1683783624, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 11:10:24'),
(2631, NULL, NULL, 1683783626, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 11:10:26'),
(2632, NULL, NULL, 1683810694, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 18:41:34'),
(2633, NULL, NULL, 1683810694, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 18:41:34'),
(2634, NULL, NULL, 1683810826, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 18:43:46'),
(2635, NULL, NULL, 1683810826, 'timeSheet method of attendanceController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-11 18:43:46'),
(2636, NULL, NULL, 1683866770, 'clockIn method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'clock in', '2023-05-12 10:16:10'),
(2637, NULL, NULL, 1683866799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 10:16:39'),
(2638, NULL, NULL, 1683866799, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 10:16:39'),
(2639, NULL, NULL, 1683866830, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 10:17:10'),
(2640, NULL, NULL, 1683866830, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 10:17:10'),
(2641, 0, 0, 1683870110, 'updateUsers method of userController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 11:11:50'),
(2642, 0, 0, 1683870273, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 11:14:33'),
(2643, 0, 0, 1683870311, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 11:15:11'),
(2644, 0, 0, 1683870317, 'updateUsers method of userController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 11:15:17'),
(2645, 0, 0, 1683870369, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 11:16:09'),
(2646, 126, 7, 1683870747, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 11:22:27'),
(2647, 126, 7, 1683870859, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 11:24:19'),
(2648, 126, 7, 1683871033, 'updateUsers method of userController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 11:27:13'),
(2649, 126, 7, 1683871683, 'updateUsers method of userController ', '::ffff:192.168.1.39', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 11:38:03'),
(2650, 121, 4, 1683873577, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 12:09:37'),
(2651, 0, 0, 1683873596, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 12:09:56'),
(2652, 121, 4, 1683873629, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 12:10:29'),
(2653, 0, 0, 1683873705, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 12:11:45'),
(2654, 121, 4, 1683873745, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 12:12:25'),
(2655, 0, 0, 1683873798, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 12:13:18'),
(2656, 121, 4, 1683873853, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 12:14:13'),
(2657, 0, 0, 1683873872, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 12:14:32'),
(2658, 0, 0, 1683873937, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 12:15:37'),
(2659, 0, 0, 1683874051, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Cannot read properties of undefined (reading \'name\')', '2023-05-12 12:17:31'),
(2660, 0, 0, 1683874490, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'error in update employee details', '2023-05-12 12:24:50'),
(2661, 0, 0, 1683874551, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'error in update employee details', '2023-05-12 12:25:51'),
(2662, 0, 0, 1683874569, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'error in update employee details', '2023-05-12 12:26:09'),
(2663, 0, 0, 1683874584, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'error in update employee details', '2023-05-12 12:26:24'),
(2664, 0, 0, 1683874601, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'error in update employee details', '2023-05-12 12:26:41'),
(2665, 121, 4, 1683874641, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 12:27:21'),
(2666, 121, 4, 1683875316, 'updateUsers method of userController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'User updated successfully', '2023-05-12 12:38:36'),
(2667, NULL, NULL, 1683881949, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 14:29:09'),
(2668, NULL, NULL, 1683881949, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 14:29:09'),
(2669, NULL, NULL, 1683885684, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 15:31:24'),
(2670, NULL, NULL, 1683885684, 'timeSheet method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Fetched successfully', '2023-05-12 15:31:24'),
(2671, NULL, NULL, 1683891623, 'clockOut method of attendanceController ', '::ffff:192.168.1.37', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36', 'Clock out', '2023-05-12 17:10:23');



CREATE TABLE `items_used` (
  `item_id` int(100) NOT NULL,
  `complaint_id` varchar(100) NOT NULL,
  `quantity` int(100) NOT NULL,
  `item_price` int(100) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `total_price` int(100) NOT NULL,
  `outlet_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`outlet_id`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items_used`
--

INSERT INTO `items_used` (`item_id`, `complaint_id`, `quantity`, `item_price`, `created_by`, `created_at`, `updated_by`, `updated_at`, `total_price`, `outlet_id`) VALUES
(1, 'cms30007', 2, 20, '125', '2023-07-10 13:04:17', NULL, '0000-00-00 00:00:00', 40, '[3,4,5,6]'),
(2, 'cms30007', 2, 20, '125', '2023-07-10 13:05:01', NULL, NULL, 40, '[3,4,5,6]');



-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE `zones` (
  `zone_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `zone_name` varchar(120) NOT NULL,
  `zone_description` longtext DEFAULT NULL,
  `zone_status` smallint(3) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`zone_id`, `energy_company_id`, `zone_name`, `zone_description`, `zone_status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 2, 'EAST ZONE', 'East zone description', 1, 1, '2023-03-06 10:47:33', NULL),
(2, 8, 'West zone', 'West ZONE DESCRIPTION', 1, 1, '2023-03-06 10:47:50', NULL),
(3, 10, 'North Zone', 'North zone description', 1, 1, '2023-03-06 10:48:10', NULL),
(4, 10, 'South ZOne', 'South ZONE DESCRIPTION', 1, 1, '2023-03-06 10:48:27', NULL),
(6, 3, 'Zone 5', 'success', 1, 1, '2023-03-21 11:55:51', NULL),
(7, 3, 'Rahul Check zone', 'asdsd', 1, 1, '2023-03-21 12:09:13', NULL),
(9, 2, 'Zone 25', 'test', 1, 1, '2023-04-01 14:26:07', NULL),
(10, 11, 'rahul EC 1', 'scasca', 1, 1, '2023-04-12 11:02:19', NULL),
(11, 13, 'rahul EC 13', 'sdfrthjn', 1, 1, '2023-04-13 14:40:08', NULL),
(13, 13, 'Rahul zone 12', 'this is test generated zone', 1, 1, '2023-05-11 10:22:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `zone_assigns`
--

CREATE TABLE `zone_assigns` (
  `id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `energy_company_id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone_assigns`
--

INSERT INTO `zone_assigns` (`id`, `zone_id`, `energy_company_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 4, 16, 1, '2023-02-15 14:07:03', '2023-02-17 18:20:57'),
(2, 3, 68, 1, '2023-02-16 11:31:14', '2023-04-01 14:14:00'),
(7, 3, 84, 0, '2023-03-16 13:31:12', '2023-03-17 10:05:56'),
(8, 3, 82, 0, '2023-03-16 18:00:17', '2023-03-17 10:20:30'),
(9, 6, 88, 0, '2023-03-17 10:21:12', '2023-04-12 10:53:43'),
(10, 7, 92, 0, '2023-03-21 12:09:13', '2023-04-12 12:03:01'),
(11, 8, 99, 0, '2023-03-21 12:27:48', '2023-05-11 10:19:45'),
(12, 9, 2, 0, '2023-04-01 14:26:07', NULL),
(13, 10, 89, 0, '2023-04-12 10:59:21', '2023-04-12 11:31:15'),
(14, 10, 11, 0, '2023-04-12 11:02:19', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `allowances`
--
ALTER TABLE `allowances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `allowances_applied_details`
--
ALTER TABLE `allowances_applied_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `breaks`
--
ALTER TABLE `breaks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `company_gst_details`
--
ALTER TABLE `company_gst_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_types`
--
ALTER TABLE `company_types`
  ADD PRIMARY KEY (`company_type_id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `complaint_types`
--
ALTER TABLE `complaint_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deductions`
--
ALTER TABLE `deductions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_categories`
--
ALTER TABLE `document_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_promotion_demotions`
--
ALTER TABLE `employee_promotion_demotions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_resignations`
--
ALTER TABLE `employee_resignations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_retirements`
--
ALTER TABLE `employee_retirements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `energy_companies`
--
ALTER TABLE `energy_companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback_and_suggestions`
--
ALTER TABLE `feedback_and_suggestions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fnf_statements`
--
ALTER TABLE `fnf_statements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_insurances`
--
ALTER TABLE `group_insurances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hr_teams`
--
ALTER TABLE `hr_teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insurance_companies`
--
ALTER TABLE `insurance_companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insurance_company_plans`
--
ALTER TABLE `insurance_company_plans`
  ADD PRIMARY KEY (`plan_id`);

--
-- Indexes for table `item_masters`
--
ALTER TABLE `item_masters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_applications`
--
ALTER TABLE `leave_applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loan_emis`
--
ALTER TABLE `loan_emis`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `module_of_sub_modules`
--
ALTER TABLE `module_of_sub_modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `new_permissions`
--
ALTER TABLE `new_permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outlets`
--
ALTER TABLE `outlets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll_master_settings`
--
ALTER TABLE `payroll_master_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plan_checklists`
--
ALTER TABLE `plan_checklists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purpose_masters`
--
ALTER TABLE `purpose_masters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `regional_offices`
--
ALTER TABLE `regional_offices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `regional_office_assigns`
--
ALTER TABLE `regional_office_assigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary_disburses`
--
ALTER TABLE `salary_disburses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_area`
--
ALTER TABLE `sales_area`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_area_assigns`
--
ALTER TABLE `sale_area_assigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_companies`
--
ALTER TABLE `sale_companies`
  ADD PRIMARY KEY (`sale_company_id`);

--
-- Indexes for table `software_activation_requests`
--
ALTER TABLE `software_activation_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_modules`
--
ALTER TABLE `sub_modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey_questions`
--
ALTER TABLE `survey_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `survey_question_responses`
--
ALTER TABLE `survey_question_responses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_categories`
--
ALTER TABLE `task_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_comments`
--
ALTER TABLE `task_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `term_conditions`
--
ALTER TABLE `term_conditions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trackings`
--
ALTER TABLE `trackings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tutorials`
--
ALTER TABLE `tutorials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`zone_id`);

--
-- Indexes for table `zone_assigns`
--
ALTER TABLE `zone_assigns`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `allowances`
--
ALTER TABLE `allowances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `allowances_applied_details`
--
ALTER TABLE `allowances_applied_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `breaks`
--
ALTER TABLE `breaks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `company_gst_details`
--
ALTER TABLE `company_gst_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `company_types`
--
ALTER TABLE `company_types`
  MODIFY `company_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `complaint_types`
--
ALTER TABLE `complaint_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `deductions`
--
ALTER TABLE `deductions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `document_categories`
--
ALTER TABLE `document_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employee_promotion_demotions`
--
ALTER TABLE `employee_promotion_demotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_resignations`
--
ALTER TABLE `employee_resignations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_retirements`
--
ALTER TABLE `employee_retirements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `energy_companies`
--
ALTER TABLE `energy_companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `feedback_and_suggestions`
--
ALTER TABLE `feedback_and_suggestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `fnf_statements`
--
ALTER TABLE `fnf_statements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `group_insurances`
--
ALTER TABLE `group_insurances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `hr_teams`
--
ALTER TABLE `hr_teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `insurance_companies`
--
ALTER TABLE `insurance_companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `insurance_company_plans`
--
ALTER TABLE `insurance_company_plans`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `item_masters`
--
ALTER TABLE `item_masters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `leave_applications`
--
ALTER TABLE `leave_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `loan_emis`
--
ALTER TABLE `loan_emis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `module_of_sub_modules`
--
ALTER TABLE `module_of_sub_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `new_permissions`
--
ALTER TABLE `new_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `outlets`
--
ALTER TABLE `outlets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payroll_master_settings`
--
ALTER TABLE `payroll_master_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `plan_checklists`
--
ALTER TABLE `plan_checklists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `purpose_masters`
--
ALTER TABLE `purpose_masters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `regional_offices`
--
ALTER TABLE `regional_offices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `regional_office_assigns`
--
ALTER TABLE `regional_office_assigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `salary_disburses`
--
ALTER TABLE `salary_disburses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `sales_area`
--
ALTER TABLE `sales_area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `sale_area_assigns`
--
ALTER TABLE `sale_area_assigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sale_companies`
--
ALTER TABLE `sale_companies`
  MODIFY `sale_company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `software_activation_requests`
--
ALTER TABLE `software_activation_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sub_modules`
--
ALTER TABLE `sub_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `survey`
--
ALTER TABLE `survey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `survey_questions`
--
ALTER TABLE `survey_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `survey_question_responses`
--
ALTER TABLE `survey_question_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `task_categories`
--
ALTER TABLE `task_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `task_comments`
--
ALTER TABLE `task_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `term_conditions`
--
ALTER TABLE `term_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `trackings`
--
ALTER TABLE `trackings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tutorials`
--
ALTER TABLE `tutorials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2672;

--
-- AUTO_INCREMENT for table `zones`
--
ALTER TABLE `zones`
  MODIFY `zone_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `zone_assigns`
--
ALTER TABLE `zone_assigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;





