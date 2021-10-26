/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `aplikacija_animatori`;
CREATE DATABASE IF NOT EXISTS `aplikacija_animatori` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `aplikacija_animatori`;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'Zoran', '$2b$11$OXpPTBkfYOnTH6ctKg.qzu9zGauTMrmiUIy4oopZkKyFSlZl1g5eu', 1),
	(4, 'Marijan', '$2b$11$pmJ0cgLky0/0exFz1l2mXO7thu4eCrCI4WhwEH5xeslNELc82jcXu', 1),
	(5, 'Borijan', '$2b$11$s/2qVsxq/LMBUW5lfrbUQOfO3utEm9sPTcMCoRHzNXAYSzrY27JYq', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

DROP TABLE IF EXISTS `animator`;
CREATE TABLE IF NOT EXISTS `animator` (
  `animator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(3) unsigned NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `special_offer_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`animator_id`),
  UNIQUE KEY `uq_animator_nickname` (`nickname`),
  KEY `fk_animator_special_offer_id` (`special_offer_id`),
  CONSTRAINT `fk_animator_special_offer_id` FOREIGN KEY (`special_offer_id`) REFERENCES `special_offer` (`special_offer_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `animator` DISABLE KEYS */;
/*!40000 ALTER TABLE `animator` ENABLE KEYS */;

DROP TABLE IF EXISTS `animator_date`;
CREATE TABLE IF NOT EXISTS `animator_date` (
  `animator_date_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `animator_id` int(10) unsigned NOT NULL,
  `reserved_date` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`animator_date_id`),
  UNIQUE KEY `uq_animator_id_reserved_date` (`animator_id`,`reserved_date`),
  CONSTRAINT `fk_animator_date_animator_id` FOREIGN KEY (`animator_id`) REFERENCES `animator` (`animator_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `animator_date` DISABLE KEYS */;
/*!40000 ALTER TABLE `animator_date` ENABLE KEYS */;

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_phone_number` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `animator_date_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`reservation_id`),
  UNIQUE KEY `uq_reservation_client_phone_number` (`client_phone_number`),
  UNIQUE KEY `uq_reservation_client_email` (`client_email`),
  UNIQUE KEY `uq_reservation_animator_date_id` (`animator_date_id`),
  CONSTRAINT `fk_reservation_animator_date_id` FOREIGN KEY (`animator_date_id`) REFERENCES `animator_date` (`animator_date_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;

DROP TABLE IF EXISTS `special_offer`;
CREATE TABLE IF NOT EXISTS `special_offer` (
  `special_offer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`special_offer_id`),
  UNIQUE KEY `uq_special_offer_name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `special_offer` DISABLE KEYS */;
INSERT INTO `special_offer` (`special_offer_id`, `name`, `description`, `video_url`, `image_path`) VALUES
	(7, 'LED show', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'YF39NtnfdxY', 'static/uploads/2021/10/e0c122f4-a777-4958-a864-40a3141c10de-led-show-bg.jpg'),
	(8, 'Magician', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', 'ovaLaF6Rmhg', 'static/uploads/2021/10/3cccdd8d-a2a4-48ec-81f3-ee67fbf1b780-sajt-madjionicar-pozadina-nova.jpg'),
	(9, 'Clowns and balloons', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', '2XN5mhdWoM0', 'static/uploads/2021/10/66f683fb-63c9-4716-96a6-569ea44920c2-sajt-klovnovi-pozadina-1.jpg'),
	(10, 'face painting', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', '_feon_ie5I4', 'static/uploads/2021/10/373d94a4-e778-45cc-bbb8-4e22bacdf107-sajt-fp-pozadina.jpg'),
	(11, 'dry ice', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', 'oVmIAqwgIRo', 'static/uploads/2021/10/ce9a3085-7059-4cce-8b27-a68112bb2480-suvi-ledi800px.jpg'),
	(12, 'fire show', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', 'yyTSYqBIXRQ', 'static/uploads/2021/10/a84bcbf0-d5cd-494a-aa88-4628c85a519c-vatra-800px.jpg'),
	(13, 'stilt walk', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', 'J6fnEvpUS4k', 'static/uploads/2021/10/9cbdcd66-9afc-41ca-8721-694029781162-Dzin-specijalne-ponuda-1024x427-1.jpg');
/*!40000 ALTER TABLE `special_offer` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
