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
  `USUA_IDVETERINARIO` int(11) NOT NULL,
  `CIT_CREADO_POR` int(11) DEFAULT NULL,
  PRIMARY KEY (`CIT_ID`),
  UNIQUE KEY `idx_cita_unica` (`USUA_IDVETERINARIO`,`CIT_FECHACITA`,`CIT_HORA`),
  KEY `MACT_ID` (`MACT_ID`),
  KEY `fk_citas_usuario_veterinario` (`USUA_IDVETERINARIO`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`MACT_ID`) REFERENCES `mascotas` (`MACT_ID`),
  CONSTRAINT `fk_citas_usuario_veterinario` FOREIGN KEY (`USUA_IDVETERINARIO`) REFERENCES `usuarios` (`USUA_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especie`
--

LOCK TABLES `especie` WRITE;
/*!40000 ALTER TABLE `especie` DISABLE KEYS */;
INSERT INTO `especie` VALUES (1,'Perro','Perro Domestico','activo','2025-05-16 02:25:12',NULL),(2,'Gato','Gato Domestico','activo','2025-05-16 02:25:32',NULL);
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
  `HM_TIPO` enum('vacuna','tratamiento','enfermedad','procedimiento','control','otros') NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medico`
--

LOCK TABLES `historial_medico` WRITE;
/*!40000 ALTER TABLE `historial_medico` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'1100974873','Edward Camilo Cifuentes Moreno','edwkamilo@gmail.com','$2b$10$hshlIBu2gfUydnQ1B7kiSuhUn/T0dciGOGoLsikCPgH915T6X3YN2','3223219673',NULL,1,'activo','2025-05-16 01:50:31',NULL,'2025-05-16 01:50:58',NULL);
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

-- Dump completed on 2025-05-15 21:35:34
