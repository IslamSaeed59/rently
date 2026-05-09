-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: rently
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_blackout`
--

DROP TABLE IF EXISTS `booking_blackout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_blackout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `rental_id` int DEFAULT NULL,
  `status` enum('active','expired') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rental_id` (`rental_id`),
  KEY `idx_product_time` (`product_id`,`start_datetime`,`end_datetime`),
  CONSTRAINT `booking_blackout_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `booking_blackout_ibfk_2` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_blackout`
--

LOCK TABLES `booking_blackout` WRITE;
/*!40000 ALTER TABLE `booking_blackout` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_blackout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','Cable','Electronics',NULL),(2,'Camera &creator gear','Camera','camera-creator-gear',NULL),(3,'Sports & Fitness ','Bike','sports-fitness',NULL),(4,' medical home-care','HeartPulse','medical-home-care',NULL),(5,'Events','Gift','events',NULL),(6,'Laptops','Laptop','laptops',1),(7,'Gaming','Headset','gaming',1),(8,'Web Cam','','web-cam',2),(9,'DJ Light','','dj-light',2);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_message_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_conversation_no_product` (`sender_id`,`receiver_id`,`product_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_receiver` (`receiver_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_last_message` (`last_message_at`),
  KEY `idx_sender_receiver` (`sender_id`,`receiver_id`),
  CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fav` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message_text` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation` (`conversation_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_conversation_created` (`conversation_id`,`created_at`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `sender_id` int DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `message` text,
  `related_id` int DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (10,13,14,'rental_request','New rental request for your product: قاعدة ماوس احترافية 70 × 30 سم',23,1,'2026-05-08 18:38:25'),(12,13,14,'rental_request','New rental request for your product: لابتوب من لينوفو، بمعالج انتل، شاشة 15.6 إنش، وذاكرة رام 16 جيجابايت',24,1,'2026-05-08 18:47:58'),(15,13,14,'request_accepted','Your rental request for Mobile has been accepted',25,1,'2026-05-08 18:53:45'),(17,13,14,'request_accepted','Your rental request for Mobile has been accepted',26,1,'2026-05-08 18:58:40'),(19,13,14,'request_accepted','Your rental request for Mobile has been accepted',27,1,'2026-05-08 19:02:53'),(21,19,14,'request_accepted','Your rental request for Mobile has been accepted',28,1,'2026-05-08 19:07:29'),(23,19,14,'request_accepted','Your rental request for Mobile has been accepted',29,1,'2026-05-08 19:39:13'),(25,19,14,'request_accepted','Your rental request for Mobile has been accepted',30,1,'2026-05-08 19:45:43'),(27,19,14,'request_accepted','Your rental request for Mobile has been accepted',31,1,'2026-05-08 19:50:43'),(29,19,14,'request_accepted','Your rental request for Mobile has been accepted',32,1,'2026-05-08 19:57:59'),(31,19,14,'request_accepted','Your rental request for Mobile has been accepted',33,1,'2026-05-08 20:00:12'),(33,19,14,'request_accepted','Your rental request for Mobile has been accepted',34,1,'2026-05-08 20:04:54'),(35,13,14,'request_accepted','Your rental request for Mobile has been accepted',35,1,'2026-05-09 06:22:46'),(37,13,14,'request_accepted','Your rental request for Mobile has been accepted',36,1,'2026-05-09 07:34:05'),(39,13,14,'request_accepted','Your rental request for Mobile has been accepted',37,1,'2026-05-09 07:36:34'),(41,13,14,'request_accepted','Your rental request for Mobile has been accepted',38,1,'2026-05-09 07:41:27'),(43,19,14,'request_accepted','Your rental request for Mobile has been accepted',39,1,'2026-05-09 07:47:37'),(45,19,14,'request_accepted','Your rental request for Mobile has been accepted',40,1,'2026-05-09 08:18:07'),(47,19,14,'request_accepted','Your rental request for Mobile has been accepted',41,1,'2026-05-09 08:56:56'),(49,19,14,'request_accepted','Your rental request for Mobile has been accepted',42,1,'2026-05-09 09:12:49'),(51,19,14,'request_accepted','Your rental request for Mobile has been accepted',43,0,'2026-05-09 09:32:45'),(53,13,14,'request_accepted','Your rental request for Mobile has been accepted',44,1,'2026-05-09 11:07:18'),(55,13,14,'request_accepted','Your rental request for Mobile has been accepted',45,1,'2026-05-09 11:12:18'),(56,13,14,'request_accepted','Your rental request for Mobile has been accepted',45,1,'2026-05-09 11:12:21');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
INSERT INTO `otps` VALUES (19,'mekdamgasser28@gmail.com','666927','2026-04-22 23:11:34','2026-04-22 21:01:33'),(20,'test@example.com','304319','2026-04-24 22:55:27','2026-04-24 19:45:26'),(23,'Alimohamed@gmail.com','802278','2026-04-29 21:02:13','2026-04-29 17:52:12'),(28,'admin1@gmail.com','304176','2026-05-08 16:16:15','2026-05-08 13:06:15'),(29,'admin11@gmail.com','168072','2026-05-08 16:17:53','2026-05-08 13:07:52');
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_availability`
--

DROP TABLE IF EXISTS `product_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `date` date NOT NULL,
  `available_hours` json DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_date` (`product_id`,`date`),
  CONSTRAINT `product_availability_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_availability`
--

LOCK TABLES `product_availability` WRITE;
/*!40000 ALTER TABLE `product_availability` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (34,14,'/uploads/Laptops/1777587955409-790968685.webp',1,0),(35,15,'/uploads/Gaming/1777588104614-22020539.jpg',1,0),(36,15,'/uploads/Gaming/1777588104614-661003518.jpg',0,1),(37,16,'/uploads/Gaming/1777588156080-833271083.jpg',1,0),(38,16,'/uploads/Gaming/1777588156081-883266642.jpg',0,1),(39,16,'/uploads/Gaming/1777588156081-111129542.jpg',0,2),(40,17,'/uploads/Gaming/1777588223281-818143270.jpg',1,0),(41,17,'/uploads/Gaming/1777588223282-252508825.jpg',0,1),(42,18,'/uploads/Web%20Cam/1777588423765-854902660.jpg',1,0),(43,18,'/uploads/Web%20Cam/1777588423765-399101852.jpg',0,1),(44,19,'/uploads/DJ%20Light/1777588781888-479425046.jpg',1,0),(45,19,'/uploads/DJ%20Light/1777588781889-224106091.jpg',0,1),(46,19,'/uploads/DJ%20Light/1777588781891-60834920.jpg',0,2),(57,13,'http://localhost:9000/uploads/Laptops/1777587901512-576663336.webp',1,0),(58,13,'http://localhost:9000/uploads/Laptops/1777587901513-391747201.webp',0,1);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (3,17,13,5,'شخص محترم جدا ','2026-05-09 12:04:13');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `price_per_hour` decimal(10,2) DEFAULT NULL,
  `price_per_day` decimal(10,2) DEFAULT NULL,
  `price_per_week` decimal(10,2) DEFAULT NULL,
  `price_per_month` decimal(10,2) DEFAULT NULL,
  `deposit_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `location` varchar(150) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_rentals` int DEFAULT '0',
  `total_earnings` decimal(15,2) DEFAULT '0.00',
  `is_featured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (13,13,6,'لابتوب من لينوفو، بمعالج انتل، شاشة 15.6 إنش، وذاكرة رام 16 جيجابايت','انتل كور i5-12450HX، مع 8 أنوية (4 بي + 4 اي) / 12 خيطًا، بتردد يصل إلى 4.4 جيجاهرتز لأنوية بي، و3.1 جيجاهرتز لأنوية اي، وذاكرة تخزين مؤقت 12 ميجابايت.\r\nبطاقة رسومات: انفيديا جي فورس ار تي اكس 2050 ذاكرة GDDR6 سعة 4 جيجابايت، أقصى تردد 1575 ميجاهرتز، حد طاقة وحدة معالجة الرسومات 65 وات\r\nالذاكرة: 1× ذاكرة DDR5-4800 SO-DIMM سعة 8 جيجابايت\r\nسعة التخزين: ذاكرة SSD M.2 2242 سعة 512 جيجابايت، منفذ الملحقات الإضافية السريع وذاكرة مستديمة 4.0×4\r\nالشاشة: 15.6 بوصة FHD (1920×1080) IPS 300 وحدة مضيئة في البيكسل مضادة للتوهج، 100% ار جي بي، 144 هرتز.',NULL,100.00,NULL,NULL,50.00,'الإسكندرية العامرية',1,1,'2026-04-30 22:25:01',NULL,NULL,0),(14,13,6,'لابتوب ألعاب ال او كيو اسينشال 15IAX9E','جودة العرض: توفر شاشة ال او كيو صوراً واضحة وألواناً زاهية لتجربة مشاهدة غامرة.\r\nوظائف ذكية: يتميز بخيارات اتصال ذكية وإمكانيات تكامل مع الأجهزة الذكية لتجربة مستخدم محسنة.\r\nالتصميم: تصميم جمالي أنيق وعصري بجودة تصميم احترافية مناسب لكل من إعدادات العمل والترفيه.\r\nالتوافق: يضمن الاتصال العالمي تكاملاً سلسلاً مع أجهزة وأنظمة تشغيل متعددة.\r\nموثوقية العلامة التجارية: تم تصنيعه بواسطة ال او كيو، والمعروفة بتقديم حلول موثوقة للحوسبة والعرض.',100.00,NULL,NULL,NULL,10.00,'الإسكندرية العامرية',1,1,'2026-04-30 22:25:55',0,0.00,1),(15,13,7,'لوحة مفاتيح ميكانيكية للألعاب F3001، ','لوحة مفاتيح ميكانيكية للألعاب F3001، بإضاءة خلفية ار جي بي، مفاتيح خطية مشحمة مسبقًا، متوافقة مع الكمبيوتر، PlayStation، وإكس بوكس',99.99,NULL,NULL,NULL,0.00,'الإسكندرية العامرية',1,1,'2026-04-30 22:28:24',0,0.00,1),(16,13,7,'ماوس العاب ريبر مضيء 220','ماوس العاب ريبر مضيء 220 سلكي وغير قابل للانزلاق مع مفاتيح اومرون كليك ومستشعر افاجو 4800 نقطة في البوصة و6 ازرار قابلة للبرمجة من يوراج',NULL,250.00,NULL,NULL,10.00,'الإسكندرية العامرية',1,1,'2026-04-30 22:29:16',0,0.00,0),(17,13,7,'قاعدة ماوس احترافية 70 × 30 سم','قاعدة ماوس احترافية 70 × 30 سم بقاعدة غير قابلة للانزلاق وسطح املس مثالية للالعاب والاستخدام المكتبي. تضمن التحكم الدقيق والثبات والمتانة طويلة الامد\r\n',NULL,70.00,NULL,NULL,10.00,'الإسكندرية العامرية',1,1,'2026-04-30 22:30:23',0,0.00,0),(18,13,8,'كاميرا ويب FHD Q5 بدقة 1080 بكسل/','كاميرا ويب FHD Q5 بدقة 1080 بكسل/30 إطار في الثانية 2 ميجابكسل مع ميكروفون مزدوج بتقنية خفض الضوضاء والتوصيل والتشغيل للبث المباشر لمؤتمرات الفيديو لأجهزة اللاب توب وأندرويد تي في بوكس أندرويد، أسود',NULL,150.00,NULL,NULL,10.00,'العاشر من رمضان, الشرقية',1,1,'2026-04-30 22:33:43',0,0.00,1),(19,13,9,'مصباح مسرح ليد 54 × 3 وات','مصباح مسرح ليد 54 × 3 وات من زوميوزي، مصابيح دي ام اكس 512 للتحكم في المسرح ودي جيه بإضاءة ار جي بي تعمل بالصوت مع 4 أوضاع عمل لحفلات الزفاف وعيد الميلاد...\r\n',NULL,500.00,NULL,NULL,100.00,'العاشر من رمضان, الشرقية',1,1,'2026-04-30 22:39:41',0,0.00,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bio` text,
  `governorate` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (8,13,'','الإسكندرية','العامرية','http://localhost:9000/uploads/profiles/profile-1778328235162-575250367.png','2026-04-30 22:16:09'),(18,19,'','','','','2026-05-08 19:04:22'),(19,20,'','','','','2026-05-09 11:17:42');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_requests`
--

DROP TABLE IF EXISTS `rental_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `rental_type` enum('hourly','daily','weekly') NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `request_status` enum('pending','accepted','rejected','cancelled_by_buyer') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at` datetime DEFAULT NULL,
  `payment_method` enum('cash','vodafone_cash','instapay','wallet') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `buyer_id` (`buyer_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `rental_requests_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `rental_requests_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rental_requests_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_requests`
--

LOCK TABLES `rental_requests` WRITE;
/*!40000 ALTER TABLE `rental_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `rental_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rentals`
--

DROP TABLE IF EXISTS `rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `rental_type` enum('hourly','daily','weekly') NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `deposit_paid` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','confirmed','active','returned','cancelled') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rental_request_id` int DEFAULT NULL,
  `payment_method` enum('cash','vodafone_cash','instapay','wallet') NOT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `refunded_at` datetime DEFAULT NULL,
  `commission_amount` decimal(10,2) DEFAULT '0.00',
  `commission_percentage` decimal(5,2) DEFAULT '10.00',
  `dispute_status` enum('none','pending_resolution','resolved') DEFAULT 'none',
  `dispute_reason` text,
  `dispute_opened_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `buyer_id` (`buyer_id`),
  KEY `rental_request_id` (`rental_request_id`),
  CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rentals_ibfk_3` FOREIGN KEY (`rental_request_id`) REFERENCES `rental_requests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rentals`
--

LOCK TABLES `rentals` WRITE;
/*!40000 ALTER TABLE `rentals` DISABLE KEYS */;
/*!40000 ALTER TABLE `rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `buyer_id` int NOT NULL,
  `rental_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `one_review_per_rental` (`rental_id`),
  KEY `product_id` (`product_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wallet_id` int NOT NULL,
  `type` enum('deposit_escrow','escrow_release','commission_deduction','withdrawal','payment_out','commission_earned') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `reference_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `wallet_id` (`wallet_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Firstname` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) NOT NULL,
  `DateofBrith` date DEFAULT NULL,
  `Gender` enum('Male','Female','Other') DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_front` varchar(255) DEFAULT NULL,
  `id_back` varchar(255) DEFAULT NULL,
  `verification_status` enum('unverified','pending','verified','rejected') DEFAULT 'unverified',
  `id_number` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `PhoneNumber` (`PhoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (13,'Saed','Gasser','admin@gmail.com','01026237058','2002-04-03','Male','$2b$10$vhJ1On45OoZBgc30DUt8RuHKYGZaq5DfPSTwRYOUpC5XtG6NZlXIC','2026-04-30 22:16:09','id-1778245453473-884097748.jpeg','id-1778245453473-412754513.jpeg','verified','30204031301873'),(19,'Islam','saeid','esied72@gmail.com','01026237052','2002-04-03','Other','$2b$10$JkEyS2T8pQaFEM7qLn4knutlX.WPPBWWD4EM1DHTl13QhGamnCnGi','2026-05-08 19:04:22','id-1778267097101-250410287.jpeg','id-1778267097101-102062391.jpeg','verified','30204031301873'),(20,'Rently','project','rentlyprojectt@gmail.com','01026237025','2002-04-03','Other','$2b$10$DfBfuBa81.TQ9OijzuPBv.QnafyNkLQ7gYT/Vna09aI9iU4j4QbCa','2026-05-09 11:17:42',NULL,NULL,'unverified',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `available_balance` decimal(10,2) DEFAULT '0.00',
  `pending_balance` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawal_requests`
--

DROP TABLE IF EXISTS `withdrawal_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawal_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(50) DEFAULT 'Vodafone Cash',
  `account_details` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `admin_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `withdrawal_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_requests`
--

LOCK TABLES `withdrawal_requests` WRITE;
/*!40000 ALTER TABLE `withdrawal_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawal_requests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-09 15:05:57
