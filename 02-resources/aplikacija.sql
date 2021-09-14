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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'Zoran', '$2b$11$OXpPTBkfYOnTH6ctKg.qzu9zGauTMrmiUIy4oopZkKyFSlZl1g5eu', 1);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `animator` DISABLE KEYS */;
INSERT INTO `animator` (`animator_id`, `name`, `surname`, `nickname`, `description`, `price`, `image_path`, `special_offer_id`) VALUES
	(4, 'Aleksa', 'Nikolic', 'Alex', 'dsafadsfafsa', 25, 'static/uploads/2021/09/0583427d-13d3-4711-a9fc-dd20bf595cc5-bjorn.jpg', 1),
	(6, 'Vasilije', 'Redzic', 'Vasa', 'ssdfasdfrwerfsdadsfagrewa', 100, 'static/uploads/2021/09/867ac442-e8da-4223-85eb-46e7af08290c-end.jpg', 5);
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
INSERT INTO `animator_date` (`animator_date_id`, `animator_id`, `reserved_date`) VALUES
	(2, 4, '2021-09-10'),
	(3, 4, '2021-09-11'),
	(5, 4, '2021-09-12'),
	(8, 4, '2021-09-13'),
	(4, 4, '2021/09/11');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` (`reservation_id`, `client_name`, `client_surname`, `client_email`, `client_phone_number`, `postal_address`, `animator_date_id`, `created_at`) VALUES
	(1, 'Aleksa', 'Kedzic', 'aleksa@singimail.rs', '0633334444', 'Cegarska43', 5, '2021-09-10 19:53:37');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `special_offer` DISABLE KEYS */;
INSERT INTO `special_offer` (`special_offer_id`, `name`, `description`, `video_url`, `image_path`) VALUES
	(1, 'clown', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', '...', '/static/specialOffers/clown.png'),
	(2, 'vivo', 'fsdfsdfds', 'realm', 'zzzzz.jpg'),
	(5, 'dry ice specialist', 'ggg', 'realm', 'static/uploads/2021/09/4c1f6ac2-00cc-4218-8d98-b50588c64a99-65030cc4-bdc6-44ac-b009-c3cf4ae97596.jpg');
/*!40000 ALTER TABLE `special_offer` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
