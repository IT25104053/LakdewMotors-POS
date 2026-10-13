-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: lakdew_pos_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Engine','Engine components and valves'),(2,'Brakes','Brake pads, discs, and calipers'),(3,'Transmission','Clutch kits and chains'),(4,'Suspension','Fork pipes and shock absorbers'),(5,'Electrical','Coils, switches, and carbon brushes'),(6,'Body Parts','Mirrors, locks, and fairings'),(7,'Oils & Fluids','Brake fluids and oil seals'),(8,'Filters','Air and oil filters'),(9,'Tyres & Tubes','Tyres and inner tubes');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_ledger`
--

DROP TABLE IF EXISTS `credit_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_ledger` (
  `amount_added` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `customer_id` bigint(20) NOT NULL,
  `ledger_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL,
  `transaction_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`ledger_id`),
  KEY `FKoarbsom0gg0q69yejh3umic4f` (`customer_id`),
  KEY `FK3lri3q57shbunb46htq8xuhjr` (`order_id`),
  CONSTRAINT `FK3lri3q57shbunb46htq8xuhjr` FOREIGN KEY (`order_id`) REFERENCES `sales_order` (`order_id`),
  CONSTRAINT `FKoarbsom0gg0q69yejh3umic4f` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_ledger`
--

LOCK TABLES `credit_ledger` WRITE;
/*!40000 ALTER TABLE `credit_ledger` DISABLE KEYS */;
INSERT INTO `credit_ledger` VALUES (13116.00,0.00,1,1,2,'2026-10-03 21:59:11.000000'),(480.00,0.00,1,2,3,'2026-10-03 22:07:59.000000'),(73440.00,0.00,1,3,4,'2026-10-03 22:15:29.000000'),(116740.00,0.00,1,4,6,'2026-10-03 22:32:00.000000');
/*!40000 ALTER TABLE `credit_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `outstanding_balance` decimal(10,2) DEFAULT NULL,
  `customer_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (203776.00,1,'0712345678','janithu');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hourly_rate` decimal(10,2) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `quantity` int(11) NOT NULL,
  `sub_total` decimal(10,2) NOT NULL,
  `detail_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `part_id` varchar(50) NOT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `FKgpk5e5no24nkrk2meotsnr74n` (`order_id`),
  KEY `FKmoy6o7cb5irf7iod13u4yo1lg` (`part_id`),
  CONSTRAINT `FKgpk5e5no24nkrk2meotsnr74n` FOREIGN KEY (`order_id`) REFERENCES `sales_order` (`order_id`),
  CONSTRAINT `FKmoy6o7cb5irf7iod13u4yo1lg` FOREIGN KEY (`part_id`) REFERENCES `spare_part` (`part_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,30.00,1,1,'14520KPL840S'),(10,300.00,2,2,'14520KPL840S'),(1,2.00,3,2,'14721AAT00099S'),(1,8980.00,4,2,'1610100501'),(1,980.00,5,2,'160FC01701'),(2,640.00,6,2,'1600200301'),(16,624.00,7,2,'14401AAW00099S'),(1,1590.00,8,2,'165FC00475'),(16,480.00,9,3,'14520KPL840S'),(12,73440.00,10,4,'2610300401'),(16,98560.00,11,5,'CDEI-GDTR-YM85'),(13,116740.00,12,6,'1610100501'),(1,8980.00,13,7,'1610100501'),(1,2.00,14,7,'14721AAT00099S'),(1,980.00,15,7,'160FC01701'),(1,30.00,16,7,'14520KPL840S');
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transaction`
--

DROP TABLE IF EXISTS `payment_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transaction` (
  `payment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `gateway_ref` varchar(255) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `UK7r8d4ymqmq6nnfqqi1i1d3wbs` (`order_id`),
  UNIQUE KEY `UKgcy893du9leshsl7jf8brcxo1` (`gateway_ref`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transaction`
--

LOCK TABLES `payment_transaction` WRITE;
/*!40000 ALTER TABLE `payment_transaction` DISABLE KEYS */;
INSERT INTO `payment_transaction` VALUES (1,'GW-REF-383BF540',7,'CASH','SUCCESS');
/*!40000 ALTER TABLE `payment_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `payroll_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `final_salary` decimal(10,2) NOT NULL,
  `month` varchar(20) NOT NULL,
  `total_hours` decimal(5,2) NOT NULL,
  `emp_id` bigint(20) NOT NULL,
  PRIMARY KEY (`payroll_id`),
  KEY `FKq5g6efn50dpql04olq3rnv40u` (`emp_id`),
  CONSTRAINT `FKq5g6efn50dpql04olq3rnv40u` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order`
--

DROP TABLE IF EXISTS `purchase_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order` (
  `expected_delivery` datetime(6) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `po_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`po_id`),
  KEY `FK4traogu3jriq9u7e8rvm86k7i` (`supplier_id`),
  CONSTRAINT `FK4traogu3jriq9u7e8rvm86k7i` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order`
--

LOCK TABLES `purchase_order` WRITE;
/*!40000 ALTER TABLE `purchase_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_order`
--

DROP TABLE IF EXISTS `sales_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_order` (
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `final_total` decimal(10,2) NOT NULL,
  `sub_total` decimal(10,2) NOT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cashier_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_order`
--

LOCK TABLES `sales_order` WRITE;
/*!40000 ALTER TABLE `sales_order` DISABLE KEYS */;
INSERT INTO `sales_order` VALUES (0.60,29.40,30.00,'2026-10-03 20:45:48.000000',1,NULL),(0.00,13116.00,13116.00,'2026-10-03 21:59:11.000000',2,NULL),(0.00,480.00,480.00,'2026-10-03 22:07:59.000000',3,NULL),(0.00,73440.00,73440.00,'2026-10-03 22:15:29.000000',4,NULL),(0.00,98560.00,98560.00,'2026-10-03 22:18:58.000000',5,'janithu'),(0.00,116740.00,116740.00,'2026-10-03 22:32:00.000000',6,'janithu'),(0.00,9992.00,9992.00,'2026-10-08 16:05:23.000000',7,NULL);
/*!40000 ALTER TABLE `sales_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spare_part`
--

DROP TABLE IF EXISTS `spare_part`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spare_part` (
  `stock_quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `part_id` varchar(50) NOT NULL,
  `part_name` varchar(100) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  PRIMARY KEY (`part_id`),
  KEY `FK4x99sfj199lx970cvamnrtcb1` (`category_id`),
  CONSTRAINT `FK4x99sfj199lx970cvamnrtcb1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spare_part`
--

LOCK TABLES `spare_part` WRITE;
/*!40000 ALTER TABLE `spare_part` DISABLE KEYS */;
INSERT INTO `spare_part` VALUES (0,39.00,3,'HERO','14401AAW00099S','CHAIN CAM',''),(19,30.00,1,'HERO','14520KPL840S','LIFTER ASSY.,TENSIONER',''),(26,2.00,1,'HERO','14721AAT00099S','VALVE EXHAUST',''),(33,320.00,3,'ENDURANCE','1600200301','SERVICE KIT CLUTCH CALIBER/BOXER',''),(40,980.00,2,'ENDURANCE','160FC01701','DISCOVER 100 /CT100 DLX (5PCS=1)',''),(4,8980.00,3,'ENDURANCE','1610100501','CLUTCH ASSLY DISCOVER - 100',''),(15,1590.00,3,'ENDURANCE','165FC00475','CLUTCH PLATE (5PCS=1) XCD 125',''),(38,890.00,3,'ENDURANCE','165FC01475','CLUTCH PLATE TVS VICTOR (1 SET= 4 PIECES)',''),(17,1750.00,1,'ENDURANCE','165FC01875','FRICTION PLATE KIT TVS APACHE (SET OF 05)',''),(17,950.00,3,'ENDURANCE','165FC03675','CL PLATE SET CD100/ SPLENDER 100/HUNK(1SET=04)',''),(7,3100.00,3,'ENDURANCE','165FC04175','CLUTCH PLAT GLAMOUR (SET 5)',''),(37,750.00,1,'ENDURANCE','165JT00475','PRESSURE PLATE TVS APACHE SET',''),(18,830.00,3,'ENDURANCE','165PP00517','CLUTCH WHEEL XCD 125',''),(15,1190.00,3,'ENDURANCE','169FW00126','CLUTCH HOUSIN PUL 150',''),(46,1340.00,3,'ENDURANCE','169FW00526','CLUTCH HOUSIN PUL 180',''),(11,1720.00,3,'ENDURANCE','169FY00426','DJ101027 CLUTCH HUB K2 PULSAR 180',''),(17,1480.00,3,'ENDURANCE','169JT06375','CLUTCH HOUSIN PUL 150',''),(39,840.00,3,'ENDURANCE','169PP00117','CLUTCH WHEEL DISCOVER 125/135 ,PUL150/180',''),(35,326.00,1,'HERO','17208ABS001S','HOLDER COMP ELEMENT',''),(7,8.00,8,'HERO','17211KVN900S','ELEMENT COMP., AIR CLEANER',''),(7,1.00,9,'HERO','17253KTP900S','TUBE,AIR/C CONNECTING',''),(27,126.00,3,'HERO','17920KTP305S','CABLE SET,THROTTLE',''),(19,41.00,1,'HERO','18652KPL840S','HOSE,AIR SUCTION VALVE',''),(27,3890.00,3,'HTHP','20K1010S','CHAIN SPROCKET KIT HUNK / EXTREME',''),(29,267.00,3,'HERO','22535KPL901S','WEIGHT,SET CLUTCH',''),(36,2.00,3,'HERO','22K180S','CAM CHAIN KIT (PLEASURE)',''),(30,224.00,1,'HERO','23237KPL900S','COLLAR SEAL',''),(11,151.00,1,'HERO','25K170S','BALL RACES KIT (ACHR/GLMR)',''),(16,21.00,1,'HERO','25K180S','BALL RACE KIT(PLEASURE)',''),(20,490.00,1,'ENDURANCE','2605100401','MINOR KIT (KBX TYPE) PULSAR 135/ 125ST',''),(49,490.00,2,'ENDURANCE','2605100601','MASTER CYLINDER MINOR KIT - PULSAR',''),(14,1830.00,1,'ENDURANCE','2605100901','CALIPER MAJOR KIT - PULSAR',''),(24,350.00,1,'ENDURANCE','2605101101','MINI KIT CALIPER ETPL TYPE(DIS 150/ST/PUL135/150',''),(23,490.00,1,'ENDURANCE','2605101201','SEAL KIT ( CALIPER) - PULSAR',''),(29,650.00,1,'ENDURANCE','2605104301','MINOR KIT WITH GREASE CALIPER PUL135',''),(45,1500.00,1,'ENDURANCE','2605106301','CALIPER MAJOR KIT - HONDA UNICORN',''),(50,650.00,1,'ENDURANCE','2605106401','CALIPER MINOR KIT - HONDA UNICORN',''),(14,6120.00,1,'ENDURANCE','2610300301','CALIPER ASSY DIS 125NEW/125ST/XCD135 SILVER',''),(14,6120.00,2,'ENDURANCE','2610300401','CALIPER ASSY PLSR 150 / DISCOVER 135 SILVER (JN131806)SILVER',''),(12,6870.00,2,'ENDURANCE','2630500531','BRAKE DISC - Pulsar 150/180, Discover (JN131807)',''),(31,21.00,1,'HERO','28120KPL901S','PINION ASSY., STARTER',''),(2,5000.00,2,'Bajaj','35465465','NS200','LM-BAR-8AAFF398'),(48,3500.00,3,'HTHP','36DD1504','CHAIN SPROCKET KIT CALIBER 115',''),(50,3700.00,3,'HTHP','36DH4013','CHAIN SPROCKET KIT PULSAR 150 UG4 N/M',''),(45,3430.00,3,'HTHP','36DU4017','CHAIN SPROCKET KIT CT 100 DELUXE NEW',''),(13,3530.00,3,'HTHP','36DZ0002','CHAIN SPROCKET KIT PLATINA 100 CC',''),(48,3600.00,3,'HTHP','36JA0005','CHAIN SPROCKET KIT XCD 125',''),(16,3460.00,3,'HTHP','36JB0003','CHAIN SPROCKET KIT PLATINA 125 CC DTSI',''),(17,4990.00,3,'HTHP','36JC0002','CHAIN SPROCKET KIT PULSAR 200/220',''),(13,3570.00,3,'HTHP','36JN0007','CHAIN SPROCKET KIT DISCOVER 135 CC',''),(10,3570.00,3,'HTHP','36JZ0007','CHAIN SPROCKET KIT DISCOVER 150 CC',''),(14,3760.00,3,'HTHP','36JZ0080','CHAIN SPROCKET KIT DISCOVER 125 ST',''),(24,3540.00,3,'HTHP','36PA0042','CHAIN SPROCKET KIT DISCOVER 100 CC',''),(44,2450.00,1,'ENDURANCE','410BT01775','HOSE PIPE PUL150NS',''),(47,96.00,3,'HERO','44830KST940S','CABLE COMP.SPEEDOMETER',''),(33,156.00,3,'HERO','44830KTP900S','CABLE COMP.,SPDMT',''),(22,57.00,1,'HERO','45530KCC841S','CYLINDER SET, MASTER',''),(2,5600.00,1,'Bajaj','4654654984','Crank shaft ','LM-BAR-9C9E3DD1'),(26,2100.00,2,'ENDURANCE','520AM00351','CAMSHAFT DISCOVER 100',''),(29,2450.00,2,'ENDURANCE','520AM00912','RCKR ARM DISCOVER 100T',''),(22,2820.00,2,'ENDURANCE','520AM01597','CL SHOE TVS SCOOTY PEP',''),(17,2700.00,2,'ENDURANCE','520AM01601','CL SHOE TVS XL SUPER',''),(43,630.00,1,'ENDURANCE','520AM01604','ROLLER ACTIVA NEW/ PLEASURE NEW',''),(15,640.00,1,'ENDURANCE','520AM01605','ROLLER ACTIVA HET',''),(20,280.00,1,'ENDURANCE','520AM01615','CL CVT KIT PLEASURE OLD/ ACT OLD',''),(35,340.00,1,'ENDURANCE','520AM01617','CL CVT KIT ACTIVA HET',''),(33,1080.00,3,'ENDURANCE','520AM01917','CLUTCH PLAT UNICORN (SET 5)',''),(13,1140.00,3,'ENDURANCE','520AM01922','CLUTCH PLAT S/SPLENDER (SET 5)',''),(20,1450.00,3,'ENDURANCE','520FY02202','HUB CLUTCH SUPER SPLENDER',''),(41,520.00,4,'ENDURANCE','520GN00175','FRONT FORK SPRING DISCOVER 125',''),(38,390.00,4,'ENDURANCE','520GN00575','FORK MAIN SPRING BOXER',''),(12,290.00,7,'ENDURANCE','520HN00275','FORK OIL SEAL PULSAR 31MM',''),(12,265.00,7,'ENDURANCE','520HN00375','DL181080) F OIL SEAL - ECO 30MM - OIL SEAL BLCK',''),(7,390.00,4,'ENDURANCE','520HN03575','FORK OIL SEAL PULSAR 200 DTSI/UG4/UG5',''),(50,130.00,2,'ENDURANCE','520JT00175','PRESSURE PLATE DISCOVER 100 (01PCS)',''),(13,300.00,7,'ENDURANCE','550HN00975','DL181080) F OIL SEAL - ECO 30MM - OIL SEAL GREEN',''),(48,1040.00,1,'HERO','90116KTP900S','SCREW,WASH,5 X 16',''),(43,180.00,7,'HERO','91255KPL901S','OIL SEAL,27X42X7',''),(49,3350.00,3,'HTHP','AMOUR-HTHP','CHAIN SPROCKET KIT GLAMOUR',''),(50,5250.00,2,'ENDURANCE','B202005000','MASTER CYLINDER ASSY PULSAR 150 NS',''),(33,7900.00,1,'ENDURANCE','B203004000','CALIPER ASSY PLSR 150 NS',''),(19,1285.04,1,'BETA','BETA1','CALIBER KICK LEVER',''),(36,640.00,2,'BETA','BETA131','DISCOVER 135',''),(23,220.00,2,'BETA','BETA155','DISCOVER',''),(34,220.00,2,'BETA','BETA157','DISCOVER 100CC/ XCD',''),(45,250.00,2,'BETA','BETA178','DISCOVER',''),(28,250.00,2,'BETA','BETA186','KB-100/ DISCOVER/ PLATINA',''),(44,1070.00,2,'BETA','BETA217','DISCOVER 125/135CC',''),(23,1070.00,2,'BETA','BETA218','DISCOVER 100CC',''),(13,1190.00,2,'BETA','BETA219','DISCOVER 150CC',''),(20,260.00,2,'BETA','BETA248','DISCOVER 100 M',''),(9,425.22,2,'BETA','BETA258','PULSAR DTS-I/ DISCOVER (RIGHT)',''),(31,1285.04,1,'BETA','BETA3','CT-100 KICK LEVER',''),(11,1040.00,2,'BETA','BETA46','DISCOVER-125',''),(7,2225.00,2,'BETA','BETA5','DISCOVER/ 125/ 135CC KICK LEVER',''),(8,1530.00,1,'BETA','BETA6','HONDA KICK LEVER',''),(5,575.00,2,'BETA','BETA61','XCD 125/ 135/ DISCOVER 100CC',''),(38,1285.04,1,'BETA','BETA7','PASSION PRO/ NXG KICK LEVER',''),(12,1250.00,2,'BOSCH','BRK-001','DISC BRAKE PAD SET',''),(24,850.00,2,'BOSCH','BRK-002','BRAKE SHOE REAR',''),(40,250.00,2,'VARROC','BRSW-ACTV-HM207','BRAKE SWITCH RR HON ACTIVA/DIO …',''),(8,300.00,2,'VARROC','BRSW-CLBR-BJ210','BRAKE SWITCH REAR CALIBER …',''),(50,220.00,2,'VARROC','BRSW-HPLZ-HH203','BRAKE SWITCH FRONT REAR PLEASURE',''),(30,6160.00,5,'VARROC','CDEI-GDTR-YM85','CDI Gladiator SS/YBR125/Fazer/FZ/FZS …',''),(24,1045.00,5,'VARROC','CDI-SPPA-HH14','CDI HERO HONDA.SPLENDER/PASSION',''),(18,1560.00,1,'VARROC','DURO-ATVA-0100S','ENGINE VALVE SET DIO/ACTIVA HET',''),(13,1900.00,1,'VARROC','DURO-AUTOLR-TV02S','DURO VALVE W/VALVE SEAL TVS:APACHI',''),(17,1490.00,1,'VARROC','DURO-DSVR-100CS','DURO Valve Set DSVR 100 CC …',''),(47,1515.00,1,'VARROC','DURO-PLSR-2WUGS','DURO Valve Set PLSR-150 DTSI UG …',''),(48,1670.00,1,'VARROC','DURO-PLSR-BJ14S','Engine Valve Set PLSR 180CC…',''),(34,1450.00,1,'VARROC','DURO-VCTR-2WHRS','Engine Valve Set Tvs VICTOR …',''),(37,1360.00,1,'VARROC','DURO-XCED-BJ16S','Engine Valve Set XCED-125 …',''),(47,1700.00,1,'VARROC','DURO-YMHA-YFZSS','VALVE SET YAMAHA FZ/SZ (SET OF 2)',''),(23,3600.00,4,'ENDURANCE','F20203204M','FORK PIPE DISCOVER 125 M',''),(47,1300.00,4,'ENDURANCE','F2GN03102B','FRONT FORK SPRING PULSAR 200RS',''),(26,650.00,4,'ENDURANCE','F2GN07375M','FRONT FORK SPRING PLATINA',''),(12,3600.00,4,'ENDURANCE','F800200204','FORK PIPE DISCOVER 125 A/WHEEL',''),(8,2750.00,4,'ENDURANCE','F800200304','FORK PIPE DISCOVER 100',''),(33,3580.00,4,'ENDURANCE','F800204104','FORK PIPE CT100 NEW 17\"',''),(41,3250.00,4,'ENDURANCE','F800204304','FORK PIPE XCD 125',''),(11,3400.00,4,'ENDURANCE','F800207804','FORK PIPE TVS STAR CITY',''),(48,3400.00,4,'ENDURANCE','F800208304','FORK PIPE HERO CD100SS',''),(13,4500.00,4,'ENDURANCE','F800209604','FORK PIPE PULSAR UG4 4.5',''),(43,4600.00,4,'ENDURANCE','F800210804','FORK PIPE PULSAR 200 NS OLD / 150 NS',''),(38,4450.00,4,'ENDURANCE','F90200902M','FORK PIPE HONDA CBZ XTREME',''),(24,625.00,2,'VARROC','FAIR-DSVR-JZ32','DISCOVER 125 ST…',''),(38,2170.00,6,'MINDA','FC-4901CZ','SUP SPLENDER/GLAMOUR W/ LOCK …',''),(20,175.00,8,'VARROC','FOIL-CLBR-DD81','OIL FILTER CALIBER 115…',''),(8,205.00,8,'VARROC','FOIL-YMFZ-21CE','OIL FILTER YAMAHA FZ',''),(31,450.00,1,'VARROC','GSKT-C100-FK29','GASKET FULL KIT CT00',''),(44,450.00,2,'VARROC','GSKT-D100-FK27','GASKET FULL KIT DISCOVER 100 NEW',''),(8,750.00,1,'VARROC','GSKT-P180-FK22','GASKET FULL KIT PULSAR 180 DTSI …',''),(22,900.00,1,'VARROC','GSKT-SPLN-FK01','GASKET FULL KIT SPLENDER/CD100 …',''),(44,460.00,1,'VARROC','GSKT-SUXL-FK57','GASKET FULL KIT XL SUPER…',''),(34,570.00,1,'VARROC','GSKT-XCED-HK28','GASKET HALF KIT XCED 125 135',''),(33,2850.00,5,'VARROC','HLAM-0254-HU81','HEAD LIGHT W/O PARKING BULB PLATINA/CT100',''),(47,2200.00,5,'VARROC','HLAM-CDLX-HA70','HEAD LIGHT HONDA DELUXE W/O/BULB …',''),(34,975.00,5,'VARROC','HLBR-PLTN-DZ44','Han/B Switch Assy (W/ORc) (RH)PLATINA100 …',''),(43,875.00,5,'VARROC','ICOL-CHMP-T209','HT IGNITION COIL TVS CHAMP',''),(49,1050.00,5,'VARROC','ICOL-SSPL-KTC9','HT IGNITION COIL SUPER SPLENDER/GLAMOUR…',''),(22,2065.00,5,'VARROC','ICOL-STRC-T435','HT IGNITION COIL STAR CITY …',''),(45,1680.00,5,'VARROC','ICOL-WEGO-TV15','HT IGNITION COIL WEGO/JUPITER…',''),(41,2185.00,5,'VARROC','IGBJ-PLTN-SW54','Switch Ignition PLTN100/CT100',''),(21,1770.00,1,'MINDA','IGN-0125FZ','BOXER (4 PIN COUPLER)',''),(26,2185.00,2,'VARROC','IGSW-BJXC-26BZ','Switch Ignition XCD 125/XCD135/DISCOVER 100',''),(20,920.00,5,'VARROC','IGSW-CD10-117Z','Switch Ig CD100',''),(22,2185.00,5,'VARROC','IGSW-SSPL-01DZ','Switch Ig Super Splender N/M/ GLAMOUR …',''),(17,2065.00,5,'VARROC','IGTV-SCTY-KT99','Switch Ig SCOOTY STREAK …',''),(13,174.00,3,'HERO','K22228KTPE900S','RUBBER CLUTCH DAMPER KIT',''),(15,14.00,1,'HERO','K23232KTPE900S','PIN ROLLER GUIDE KIT',''),(13,4700.00,2,'MINDA','KT-2152NZ','DISCOVER 125/135',''),(29,3750.00,6,'MINDA','KT-2152RZ','DICOVER 100 …',''),(34,690.00,6,'MINDA','LK-4213Z','SEAT LOCK SCOOTY PEP …',''),(30,935.00,5,'VARROC','MGCC-C100-HH04','Charging Coil HH CD-100 …',''),(13,440.00,5,'VARROC','MGCL-DSVR-0410','Pick Up Coil DSVR 100(GREEN) …',''),(23,525.00,5,'VARROC','MGCL-PLTN-EE12','PICK UP COIL PLATINA100 ES(BROWN) …',''),(45,495.00,5,'VARROC','MGCL-SPDR-HH49','Pick UP COIL SPLEN PLUS/PASSION PLUS…',''),(8,425.00,5,'VARROC','MGCL-SPLD-HH51','Pick UP COIL OLD GLAMOUR/SUPER SPLENDER …',''),(48,495.00,5,'VARROC','MGCL-VCTR-BJ48','PICK UP COIL TVS VICTOR',''),(14,3500.00,2,'VARROC','MGCP-DSVR-DS16','Coil Plate Assy DISCOVER 125 SS',''),(26,4510.00,2,'VARROC','MGCP-DSVR-JB22','Coil Plate Assy DISCOVER 100 SS …',''),(47,4950.00,5,'VARROC','MGCP-FZ16-2GSH','Coil Plate Assy YAMAHA FZ16/FZ-S 12 POLE …',''),(28,4950.00,5,'VARROC','MGCP-PLSR-DH81','Coil Plate Assy PULSAR 150/180 UG4',''),(12,4800.00,5,'VARROC','MGCP-PLTN-JK01','Coil Plate Assy PLTN 125 …',''),(47,4235.00,5,'VARROC','MGCP-PLTN-PF24','Coil Plate Assy PLTN 100ES (AFTER 2015) …',''),(19,625.00,3,'VARROC','MGRT-PLSR-EE10','GOLI CLUTCH KIT - PLSR 150',''),(8,3630.00,3,'HTHP','N9320450','CHAIN SPROCKET KIT FLAME',''),(17,3850.00,3,'HTHP','N9321930','CHAIN SPROCKET KIT APACHE RTR 160 CC',''),(30,450.00,7,'MOTUL','OIL-002','BRAKE FLUID DOT-4 250ML',''),(5,2420.00,2,'VARROC','REGR-DSVR-JF00','R.R DISCOVER 100M / 125M',''),(45,2750.00,2,'VARROC','REGR-DSVR-JZ00','R.R DISCOVER 125 ST…',''),(5,2640.00,6,'VARROC','REGR-PTUG-JK00','R. R. With Capacitor DSVR 100/PLTN-UG …',''),(30,1100.00,1,'VARROC','REGR-STAR-TV42','R.R. TVS STARCITY 5PIN …',''),(33,1300.00,1,'VARROC','RELY-PLSR-BJ40','PULSAR OLD MODDLE WITH RUBBER BOOT',''),(24,690.00,6,'VARROC','REVM-BXAR-DF37','Rear View Mirror LH BOXER …',''),(21,760.00,6,'VARROC','REVM-C115-DD07','Rear View Mirror LH CLBR-115 …',''),(20,760.00,6,'VARROC','REVM-C115-DD08','Rear View Mirror RH CLBR-115 …',''),(34,900.00,6,'VARROC','REVM-DSVR-JZ01','Rear View Mirror RH PLSR 100/125ST…',''),(38,4450.00,4,'ENDURANCE','S130109607','S/A BJ PLTN (S&S) PC RR',''),(24,4650.00,4,'ENDURANCE','S135106407','S/A TV SCTY PEP RR',''),(19,5650.00,2,'ENDURANCE','S330100303','DISCOVER 135 GAS SHOK ABSOBERS',''),(24,5750.00,4,'ENDURANCE','S330102601','PULSAR 150 UG4 SHOCK ABSOBERS BLACK',''),(47,3850.00,4,'ENDURANCE','S95105401M','S/A HND ACT FR (LH+RH) SET',''),(34,3390.00,3,'HTHP','STARCITY','CHAIN SPROCKET KIT STAR CITY A/W',''),(48,590.00,5,'VARROC','STMS-DSVR-DS27','Brush Box Kit Assy DSVR/PLSR135/Xced …',''),(18,495.00,5,'VARROC','STMS-DVSR-EE28','Carbon Brush Terminals PULSAR135/XCD135',''),(34,460.00,5,'VARROC','STMS-HERO-EE15','Carbon Brush Terminals ACTIVA/DIO/PLEASURE …',''),(21,460.00,5,'VARROC','STMS-PLSR-EE17','Carbon Brush Terminals PUL150/180/DISCOVER …',''),(25,630.00,5,'VARROC','STMS-PLSR-EE43','Brush Box KIT Assy PLSR-150/ 180(AFTER 2012)',''),(20,440.00,5,'VARROC','STMS-PSPR-EE26','Carbon Brush Terminals PASSION PRO …',''),(14,470.00,5,'VARROC','STMS-PSPR-EE31','Brush Box KIT ASSY PASION PRO …',''),(22,3410.00,1,'VARROC','STMS-SPRT-EE33C','ARMATURE ASSY SPIRIT / PEP W/CARBON KIT…',''),(38,495.00,5,'VARROC','STMS-SSPS-EE25','Carbon Brush Terminals SUP SPLEN/GLAMOUR …',''),(12,440.00,5,'VARROC','STMS-TVSC-EE23','Carbon Brush Terminals TVS STAR CITY …',''),(22,510.00,5,'VARROC','STMS-UNIC-EE37','Brush Box KIT Assy SHINE/UNICORN/STUNNER …',''),(14,2800.00,3,'VARROC','STMS-YAFZ-2110','F/WL 1-WAY CLUTCH (SMALL) YAMAHA FZ',''),(25,425.00,5,'VARROC','STMS-YFZS-EE48L','Carbon Brush Terminals YAMAHA FZ …',''),(44,1320.00,5,'VARROC','SWCH-BOXR-PF08','Han/B Switch Assy (W/ORc) (RH)BOXER 150',''),(46,1169.00,5,'VARROC','SWCH-C100-DU18','Han/B SWITCH RH CT100 (WITH RIDE CONTROL) …',''),(15,4600.00,9,'MRF','TYR-002','TYRE 3.00-17 REAR',''),(26,315.00,1,'VARROC','VLSL-AUTO4-3919','VALVE SEAL BOXER/CT100…',''),(44,7850.00,2,'MINDA','WH-1099UZ','DISCOVER125 DTSI SS (10-11)MODEL …','');
/*!40000 ALTER TABLE `spare_part` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `supplier_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `contact_number` varchar(15) DEFAULT NULL,
  `company_name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'0381234567','Lanka Importers',NULL);
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKsb8bbouer5wak8vyiiy4pf2bx` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin123','ADMIN','admin'),(2,'cash123','CASHIER','cashier'),(3,'jp123','CASHIER','janithu'),(4,'cy123','ADMIN','chathur'),(5,'','','');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-13 22:09:20
