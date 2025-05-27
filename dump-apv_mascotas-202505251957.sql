-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: apv_mascotas
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `CIT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `MACT_ID` int(11) NOT NULL,
  `CIT_FECHACITA` date NOT NULL,
  `CIT_HORA` time NOT NULL,
  `CIT_DURACION` int(11) NOT NULL DEFAULT 30 COMMENT 'Duración en minutos',
  `CIT_TIPO` enum('consulta','vacunación','emergencia','cirugía','estética','otros') DEFAULT 'consulta',
  `CIT_ESTADO` enum('Pendiente','Atendida','Cancelada') DEFAULT 'Pendiente',
  `CIT_MOTIVOCITA` text DEFAULT NULL,
  `CIT_OBSERVACIONMEDICA` text DEFAULT NULL,
  `CIT_FECHACAMBIO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `USUA_IDVETERINARIO` int(11) DEFAULT NULL,
  `CIT_CREADO_POR` int(11) DEFAULT NULL,
  PRIMARY KEY (`CIT_ID`),
  UNIQUE KEY `idx_cita_unica` (`USUA_IDVETERINARIO`,`CIT_FECHACITA`,`CIT_HORA`),
  KEY `MACT_ID` (`MACT_ID`),
  KEY `fk_citas_usuario_veterinario` (`USUA_IDVETERINARIO`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`MACT_ID`) REFERENCES `mascotas` (`MACT_ID`),
  CONSTRAINT `fk_citas_usuario_veterinario` FOREIGN KEY (`USUA_IDVETERINARIO`) REFERENCES `usuarios` (`USUA_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,4,'2024-12-15','14:30:00',30,'consulta','Cancelada','Revisión anual','El paciente presentó fiebre alta','2025-05-23 00:11:27',9,9),(2,3,'2024-12-19','14:30:00',30,'consulta','Atendida','Revisión anual','Paciente respondió bien al tratamiento, se aplicó vacuna anual','2025-05-23 01:18:54',9,9),(3,5,'2025-05-27','08:00:00',30,'vacunación','Pendiente','Tiene que hacerse la vacunación anual ya que este año no esta vacunado ',NULL,'2025-05-25 00:04:10',NULL,9);
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especie`
--

DROP TABLE IF EXISTS `especie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especie` (
  `ESP_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ESP_NOMBRE` varchar(100) NOT NULL,
  `ESP_DESCRIPCION` text DEFAULT NULL,
  `ESP_ESTADO` enum('activo','inactivo') DEFAULT 'activo',
  `ESP_FECHACAMBIO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ESP_CREADO_POR` int(11) DEFAULT NULL,
  PRIMARY KEY (`ESP_ID`),
  UNIQUE KEY `ESP_NOMBRE` (`ESP_NOMBRE`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especie`
--

LOCK TABLES `especie` WRITE;
/*!40000 ALTER TABLE `especie` DISABLE KEYS */;
INSERT INTO `especie` VALUES (1,'Perro','Perro Domestico','activo','2025-05-16 02:25:12',NULL),(2,'Gato','Gato Domestico','activo','2025-05-16 02:25:32',NULL),(3,'Loro','Loro Pequeño','activo','2025-05-17 22:13:56',NULL);
/*!40000 ALTER TABLE `especie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_medico`
--

DROP TABLE IF EXISTS `historial_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_medico` (
  `HM_ID` int(11) NOT NULL AUTO_INCREMENT,
  `MACT_ID` int(11) NOT NULL,
  `HM_FECHA` date NOT NULL,
  `HM_TIPO` enum('consulta','vacunación','emergencia','cirugía','estética','otros') NOT NULL,
  `HM_DESCRIPCION` text NOT NULL,
  `HM_DETALLES` text DEFAULT NULL,
  `HM_OBSERVACIONES` text DEFAULT NULL,
  `USUA_IDVETERINARIO` int(11) NOT NULL,
  `HM_FECHACAMBIO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`HM_ID`),
  KEY `fk_historial_mascota` (`MACT_ID`),
  KEY `fk_historial_veterinario` (`USUA_IDVETERINARIO`),
  CONSTRAINT `fk_historial_mascota` FOREIGN KEY (`MACT_ID`) REFERENCES `mascotas` (`MACT_ID`),
  CONSTRAINT `fk_historial_veterinario` FOREIGN KEY (`USUA_IDVETERINARIO`) REFERENCES `usuarios` (`USUA_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medico`
--

LOCK TABLES `historial_medico` WRITE;
/*!40000 ALTER TABLE `historial_medico` DISABLE KEYS */;
INSERT INTO `historial_medico` VALUES (1,3,'2024-12-19','consulta','Revisión anual',NULL,'Paciente respondió bien al tratamiento, se aplicó vacuna anual',9,'2025-05-23 01:18:54');
/*!40000 ALTER TABLE `historial_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
  `MACT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USUA_ID` int(11) NOT NULL,
  `MACT_NOMBRE` varchar(100) NOT NULL,
  `ESP_ID` int(11) NOT NULL,
  `MACT_SEXO` enum('Macho','Hembra','Desconocido') DEFAULT 'Desconocido',
  `MACT_FECHA_NACIMIENTO` date DEFAULT NULL,
  `MACT_RAZA` varchar(200) DEFAULT NULL,
  `MACT_PESO` decimal(5,2) DEFAULT NULL COMMENT 'Peso en kilogramos',
  `MACT_COLOR` varchar(100) DEFAULT NULL,
  `MACT_FOTO` varchar(255) DEFAULT NULL COMMENT 'Ruta a la imagen',
  `MACT_FECHACAMBIO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `MACT_CREADO_POR` int(11) DEFAULT NULL,
  PRIMARY KEY (`MACT_ID`),
  KEY `USUA_ID` (`USUA_ID`),
  KEY `fk_mascotas_especie` (`ESP_ID`),
  CONSTRAINT `fk_mascotas_especie` FOREIGN KEY (`ESP_ID`) REFERENCES `especie` (`ESP_ID`),
  CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`USUA_ID`) REFERENCES `usuarios` (`USUA_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT INTO `mascotas` VALUES (3,9,'Firulais',1,'Macho','2020-05-15','Labrador',25.50,'Dorado','ruta/foto.jpg','2025-05-17 17:11:13',9),(4,9,'Michu',2,'Macho','2022-05-10','Angora',10.20,'Griz','ruta/foto.jpg','2025-05-17 22:15:51',9),(5,9,'starry',3,'Macho','2022-05-10','cacatua',0.50,'Verde Azul','ruta/foto.jpg','2025-05-24 01:15:34',9);
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `ROL_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ROL_NOMBRE` varchar(30) NOT NULL,
  `ROL_FECHACAMBIO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ROL_CREADO_POR` int(11) DEFAULT NULL,
  PRIMARY KEY (`ROL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'administrador','2025-05-16 01:48:54',NULL),(2,'veterinario','2025-05-16 01:50:23',NULL),(3,'cliente','2025-05-16 01:50:23',NULL);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `USUA_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USUA_DOCUMENTO` varchar(20) NOT NULL,
  `USUA_NOMBRES` varchar(100) NOT NULL,
  `USUA_CORREO` varchar(150) NOT NULL,
  `USUA_PASSWORD` varchar(255) NOT NULL,
  `USUA_TELEFONO` varchar(20) NOT NULL,
  `USUA_DIRECCION` text DEFAULT NULL,
  `ROL_ID` int(11) NOT NULL,
  `USUA_ESTADO` enum('activo','inactivo') DEFAULT 'activo',
  `USUA_FECHA_REGISTRO` timestamp NOT NULL DEFAULT current_timestamp(),
  `USUA_ULTIMA_CONEXION` timestamp NULL DEFAULT NULL,
  `USUA_FECHACAMBIO` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `USUA_CREADO_POR` int(11) DEFAULT NULL,
  PRIMARY KEY (`USUA_ID`),
  UNIQUE KEY `USUA_DOCUMENTO` (`USUA_DOCUMENTO`),
  UNIQUE KEY `USUA_CORREO` (`USUA_CORREO`),
  KEY `ROL_ID` (`ROL_ID`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`ROL_ID`) REFERENCES `rol` (`ROL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'1100974873','Edward Camilo Cifuentes Moreno','edwkamilo@gmail.com','$2b$10$hshlIBu2gfUydnQ1B7kiSuhUn/T0dciGOGoLsikCPgH915T6X3YN2','3223219673',NULL,1,'activo','2025-05-16 01:50:31',NULL,'2025-05-16 01:50:58',NULL),(10,'110986597','Oscar Andres Villa Prada','oprada@gmail.com','$2b$10$9ziJ8VdDVkVBdqhbC0GKOeD9p./Ije/gCyfe4OcqjolbWk4rpBcE2','3223219673',NULL,2,'activo','2025-05-17 19:21:49',NULL,'2025-05-17 19:22:06',NULL),(11,'12345678','Edward García','edward@outlook.com','$2b$10$7clfGJx/9PG/LP3xqgUMreZ1iL0qdqAxcKObgMr8omnE47ATUHLCK','3001234567',NULL,3,'activo','2025-05-17 22:06:12',NULL,'2025-05-24 18:56:53',NULL),(14,'1489746987','Carlos Andres Martines Oviedo','coviedoa@gmail.com','$2b$10$JPnNtNbMmL8.khYezAjxJecT7Qa1S5EouQzP/dWbgGl/ss57Gunx2','3145698736',NULL,2,'activo','2025-05-17 22:12:54',NULL,'2025-05-17 22:12:54',NULL),(15,'135416515','Carlos Andres Afanador Gonzales','cafanador@gmail.com','$2b$10$3BKUY8uXXZJFpg7760FnPuY/zCkGppHwT48/kmjxBTL9qEqpuZYla','3213269874',NULL,3,'activo','2025-05-24 00:58:45',NULL,'2025-05-24 00:58:45',NULL),(16,'135418943','Carlos Andres Libero Paz','cpas@gmail.com','$2b$10$f9pmwuKn1u3N/qDCJTGQ6O96uXLinGCwVKvIBryhj0Jg5MFundhGS','3145698743',NULL,2,'activo','2025-05-24 14:08:07',NULL,'2025-05-24 14:08:23',NULL),(17,'978463597','Martha Yannet Diaz Paez','mdiazperez@gmail.com','$2b$10$ac5ANoxXCNEPJM6C2NtJXeDzYmNXDevd3LXyi/RDPO/ItXgfHy/ly','3212659846',NULL,3,'activo','2025-05-24 19:10:30',NULL,'2025-05-24 19:19:15',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'apv_mascotas'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-25 19:57:46
