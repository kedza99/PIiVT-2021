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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

DROP TABLE IF EXISTS `animator`;
CREATE TABLE IF NOT EXISTS `animator` (
  `animator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `special_offer_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`animator_id`),
  UNIQUE KEY `uq_animator_nickname` (`nickname`),
  KEY `fk_animator_special_offer_id` (`special_offer_id`),
  CONSTRAINT `fk_animator_special_offer_id` FOREIGN KEY (`special_offer_id`) REFERENCES `special_offer` (`special_offer_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `animator` DISABLE KEYS */;
/*!40000 ALTER TABLE `animator` ENABLE KEYS */;

DROP TABLE IF EXISTS `animator_date`;
CREATE TABLE IF NOT EXISTS `animator_date` (
  `animator_date_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `animator_id` int(10) unsigned NOT NULL,
  `reserved_date` date DEFAULT NULL,
  PRIMARY KEY (`animator_date_id`),
  UNIQUE KEY `uq_animator_id_reserved_date` (`animator_id`,`reserved_date`),
  CONSTRAINT `fk_animator_date_animator_id` FOREIGN KEY (`animator_id`) REFERENCES `animator` (`animator_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  PRIMARY KEY (`reservation_id`),
  UNIQUE KEY `uq_reservation_client_phone_number` (`client_phone_number`),
  UNIQUE KEY `uq_reservation_client_email` (`client_email`),
  UNIQUE KEY `uq_reservation_animator_date_id` (`animator_date_id`),
  CONSTRAINT `fk_reservation_animator_date_id` FOREIGN KEY (`animator_date_id`) REFERENCES `animator_date` (`animator_date_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;

DROP TABLE IF EXISTS `special_offer`;
CREATE TABLE IF NOT EXISTS `special_offer` (
  `special_offer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `video_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`special_offer_id`),
  UNIQUE KEY `uq_special_offer_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `special_offer` DISABLE KEYS */;
/*!40000 ALTER TABLE `special_offer` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
