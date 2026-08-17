-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: metrobites_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Populares'),(2,'Desayunos'),(3,'Comidas'),(4,'Bebidas'),(5,'Snacks');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cupones`
--

DROP TABLE IF EXISTS `cupones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cupones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `monto_descuento` decimal(10,2) NOT NULL,
  `compra_minima` decimal(10,2) DEFAULT '0.00',
  `valido_hasta` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `idx_cupon_codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupones`
--

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
INSERT INTO `cupones` VALUES (1,'BIENVENIDA10',10.00,50.00,'2027-01-01'),(2,'ELDED',50.00,100.00,'2026-09-11');
/*!40000 ALTER TABLE `cupones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_pedido`
--

DROP TABLE IF EXISTS `detalles_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int DEFAULT '1',
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `notas` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_pedido`
--

LOCK TABLES `detalles_pedido` WRITE;
/*!40000 ALTER TABLE `detalles_pedido` DISABLE KEYS */;
INSERT INTO `detalles_pedido` VALUES (1,2,1,2,65.00,130.00,NULL),(2,3,1,2,65.00,150.00,NULL),(3,4,1,1,65.00,65.00,NULL),(4,5,1,1,65.00,90.00,NULL),(5,6,1,1,65.00,90.00,NULL),(6,7,1,1,65.00,65.00,NULL),(7,8,1,1,65.00,65.00,NULL),(8,9,4,1,30.00,30.00,NULL),(9,10,1,1,65.00,65.00,NULL),(10,11,4,1,30.00,30.00,NULL),(11,12,4,1,30.00,30.00,NULL),(12,13,4,1,30.00,30.00,NULL),(13,14,4,1,30.00,30.00,NULL),(14,15,4,1,30.00,30.00,NULL),(15,16,4,1,30.00,30.00,NULL),(16,17,4,1,30.00,30.00,NULL),(17,18,4,1,30.00,30.00,NULL),(18,19,4,1,30.00,30.00,NULL),(19,20,4,1,30.00,30.00,NULL),(20,21,1,1,65.00,65.00,NULL),(21,21,4,1,30.00,30.00,NULL),(22,22,1,1,65.00,65.00,NULL),(23,23,4,1,30.00,30.00,NULL),(24,24,7,2,35.00,70.00,NULL),(25,25,4,1,30.00,30.00,NULL),(26,25,4,1,30.00,30.00,NULL),(34,33,4,1,30.00,30.00,NULL),(35,34,7,1,35.00,35.00,NULL);
/*!40000 ALTER TABLE `detalles_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `usuario_id` int NOT NULL,
  `producto_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (1,1);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_estados_pedido`
--

DROP TABLE IF EXISTS `historial_estados_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_estados_pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `estado_anterior` varchar(20) DEFAULT NULL,
  `estado_nuevo` varchar(20) NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `nota` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_historial_pedido` (`pedido_id`),
  KEY `historial_estados_pedido_ibfk_2` (`usuario_id`),
  CONSTRAINT `historial_estados_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historial_estados_pedido_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_estados_pedido`
--

LOCK TABLES `historial_estados_pedido` WRITE;
/*!40000 ALTER TABLE `historial_estados_pedido` DISABLE KEYS */;
INSERT INTO `historial_estados_pedido` VALUES (1,1,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-01 03:42:14'),(2,2,NULL,'preparando',NULL,'Registro inicial generado por la migración 002','2026-06-01 03:47:19'),(3,3,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-01 03:50:34'),(4,4,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-01 23:41:14'),(5,5,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-02 00:06:37'),(6,6,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-02 01:19:10'),(7,7,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-02 01:25:41'),(8,8,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-09 00:11:53'),(9,9,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-22 22:31:03'),(10,10,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-22 23:35:46'),(11,11,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-23 00:25:31'),(12,12,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-26 23:51:21'),(13,13,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-27 00:39:43'),(14,14,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-27 00:43:18'),(15,15,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-29 18:31:33'),(16,16,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-06-29 23:50:53'),(17,17,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-07-08 05:13:25'),(18,18,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-07-20 22:46:17'),(19,19,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-07-20 23:56:23'),(20,20,NULL,'preparando',NULL,'Registro inicial generado por la migración 002','2026-08-11 05:31:23'),(21,21,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-08-11 06:02:36'),(22,22,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-08-11 13:02:53'),(23,23,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-08-11 13:20:17'),(24,24,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-08-11 13:44:38'),(25,25,NULL,'recibido',NULL,'Registro inicial generado por la migración 002','2026-08-11 20:50:02'),(51,33,NULL,'recibido',2,'Pedido creado por el alumno','2026-08-16 06:32:05'),(52,20,'preparando','listo',1,NULL,'2026-08-16 06:57:38'),(53,34,NULL,'recibido',2,'Pedido creado por el alumno','2026-08-16 16:58:45');
/*!40000 ALTER TABLE `historial_estados_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_recoleccion`
--

DROP TABLE IF EXISTS `horarios_recoleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios_recoleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_recoleccion`
--

LOCK TABLES `horarios_recoleccion` WRITE;
/*!40000 ALTER TABLE `horarios_recoleccion` DISABLE KEYS */;
INSERT INTO `horarios_recoleccion` VALUES (1,'Receso 1','10:50:00','11:10:00',1),(2,'Receso 2','13:00:00','13:20:00',1);
/*!40000 ALTER TABLE `horarios_recoleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodos_pago`
--

DROP TABLE IF EXISTS `metodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `tipo` enum('efectivo','tarjeta_credito','tarjeta_debito','paypal','transferencia') NOT NULL,
  `alias` varchar(60) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `predeterminado` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `metodos_pago_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
INSERT INTO `metodos_pago` VALUES (2,4,'paypal','Personal','qa.test@upmh.edu.mx',1,1);
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `horario_id` int NOT NULL,
  `cupon_id` int DEFAULT NULL,
  `estado` enum('pendiente_pago','recibido','confirmado','preparando','listo','entregado','cancelado','rechazado','no_recogido') NOT NULL DEFAULT 'recibido',
  `estado_pago` enum('pendiente','pagado','cancelado','reembolsado') NOT NULL DEFAULT 'pendiente',
  `tiempo_estimado_min` int DEFAULT NULL,
  `notas` varchar(255) DEFAULT NULL,
  `motivo_cancelacion` varchar(255) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('efectivo','tarjeta','paypal','transferencia') NOT NULL,
  `metodo_pago_id` int DEFAULT NULL,
  `codigo_qr` varchar(100) NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_qr` (`codigo_qr`),
  KEY `horario_id` (`horario_id`),
  KEY `cupon_id` (`cupon_id`),
  KEY `idx_pedido_usuario` (`usuario_id`),
  KEY `idx_pedido_estado` (`estado`),
  KEY `pedidos_ibfk_4` (`metodo_pago_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`horario_id`) REFERENCES `horarios_recoleccion` (`id`),
  CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`cupon_id`) REFERENCES `cupones` (`id`),
  CONSTRAINT `pedidos_ibfk_4` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,130.00,'efectivo',NULL,'MB-1780285334202','2026-06-01 03:42:14','2026-08-16 05:31:28'),(2,1,1,NULL,'preparando','pendiente',NULL,NULL,NULL,130.00,'efectivo',NULL,'MB-1780285639521','2026-06-01 03:47:19','2026-08-16 05:31:28'),(3,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,150.00,'efectivo',NULL,'MB-1780285834863','2026-06-01 03:50:34','2026-08-16 05:31:28'),(4,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,65.00,'efectivo',NULL,'MB-1780357274757','2026-06-01 23:41:14','2026-08-16 05:31:28'),(5,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,90.00,'efectivo',NULL,'MB-1780358797697','2026-06-02 00:06:37','2026-08-16 05:31:28'),(6,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,90.00,'efectivo',NULL,'MB-1780363150222','2026-06-02 01:19:10','2026-08-16 05:31:28'),(7,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,65.00,'efectivo',NULL,'MB-1780363541206','2026-06-02 01:25:41','2026-08-16 05:31:28'),(8,1,1,NULL,'recibido','pendiente',NULL,NULL,NULL,65.00,'efectivo',NULL,'MB-1780963913134','2026-06-09 00:11:53','2026-08-16 05:31:28'),(9,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782167463485','2026-06-22 22:31:03','2026-08-16 05:31:28'),(10,3,1,NULL,'recibido','pendiente',NULL,NULL,NULL,65.00,'efectivo',NULL,'MB-1782171346722','2026-06-22 23:35:46','2026-08-16 05:31:28'),(11,3,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782174331017','2026-06-23 00:25:31','2026-08-16 05:31:28'),(12,2,2,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782517881967','2026-06-26 23:51:21','2026-08-16 05:31:28'),(13,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782520783785','2026-06-27 00:39:43','2026-08-16 05:31:28'),(14,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782520998894','2026-06-27 00:43:18','2026-08-16 05:31:28'),(15,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782757893293','2026-06-29 18:31:33','2026-08-16 05:31:28'),(16,2,2,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1782777053835','2026-06-29 23:50:53','2026-08-16 05:31:28'),(17,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1783487605960','2026-07-08 05:13:25','2026-08-16 05:31:28'),(18,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1784587577761','2026-07-20 22:46:17','2026-08-16 05:31:28'),(19,3,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'efectivo',NULL,'MB-1784591783786','2026-07-20 23:56:23','2026-08-16 05:31:28'),(20,2,1,NULL,'listo','pendiente',0,NULL,NULL,30.00,'efectivo',NULL,'MB-1786426283521','2026-08-11 05:31:23','2026-08-16 06:57:38'),(21,4,1,1,'recibido','pendiente',NULL,NULL,NULL,85.00,'efectivo',NULL,'MB-1786428156266','2026-08-11 06:02:36','2026-08-16 05:31:28'),(22,2,2,NULL,'recibido','pendiente',NULL,NULL,NULL,65.00,'tarjeta',NULL,'MB-1786453373921','2026-08-11 13:02:53','2026-08-16 05:31:28'),(23,4,1,NULL,'recibido','pendiente',NULL,NULL,NULL,30.00,'tarjeta',NULL,'MB-1786454417615','2026-08-11 13:20:17','2026-08-16 05:31:28'),(24,4,2,NULL,'recibido','pendiente',NULL,NULL,NULL,70.00,'paypal',2,'MB-1786455878210','2026-08-11 13:44:38','2026-08-16 05:31:28'),(25,2,1,NULL,'recibido','pendiente',NULL,NULL,NULL,60.00,'efectivo',NULL,'MB-1786481402657','2026-08-11 20:50:02','2026-08-16 05:31:28'),(33,2,1,NULL,'recibido','pendiente',20,NULL,NULL,30.00,'efectivo',NULL,'MB-1786861925123','2026-08-16 06:32:05','2026-08-16 06:32:05'),(34,2,1,NULL,'recibido','pendiente',20,NULL,NULL,35.00,'efectivo',NULL,'MB-1786899525486','2026-08-16 16:58:45','2026-08-16 16:58:45');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalizaciones_detalle_pedido`
--

DROP TABLE IF EXISTS `personalizaciones_detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizaciones_detalle_pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `detalle_pedido_id` int NOT NULL,
  `nombre_personalizacion` varchar(100) DEFAULT NULL,
  `precio_personalizacion` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detalle_pedido_id` (`detalle_pedido_id`),
  CONSTRAINT `personalizaciones_detalle_pedido_ibfk_1` FOREIGN KEY (`detalle_pedido_id`) REFERENCES `detalles_pedido` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizaciones_detalle_pedido`
--

LOCK TABLES `personalizaciones_detalle_pedido` WRITE;
/*!40000 ALTER TABLE `personalizaciones_detalle_pedido` DISABLE KEYS */;
INSERT INTO `personalizaciones_detalle_pedido` VALUES (1,2,'Salsa Verde',0.00),(2,2,'Extra Queso',10.00),(3,3,'Salsa Verde',0.00),(4,4,'Extra Queso',10.00),(5,4,'Extra Pollo',15.00),(6,5,'Extra Queso',10.00),(7,5,'Extra Pollo',15.00),(23,34,'Chico 355 ml',0.00),(24,34,'Caliente',0.00),(25,35,'Bolillo',0.00),(26,35,'Sin salsa',0.00);
/*!40000 ALTER TABLE `personalizaciones_detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalizaciones_producto`
--

DROP TABLE IF EXISTS `personalizaciones_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizaciones_producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio_adicional` decimal(10,2) DEFAULT '0.00',
  `es_requerido` tinyint(1) DEFAULT '0',
  `nombre_grupo` varchar(50) DEFAULT NULL,
  `tipo_grupo` enum('unica','multiple') NOT NULL DEFAULT 'multiple',
  `min_selecciones` int NOT NULL DEFAULT '0',
  `max_selecciones` int DEFAULT NULL,
  `orden` int NOT NULL DEFAULT '0',
  `orden_opcion` int NOT NULL DEFAULT '0',
  `descripcion` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `personalizaciones_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=391 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizaciones_producto`
--

LOCK TABLES `personalizaciones_producto` WRITE;
/*!40000 ALTER TABLE `personalizaciones_producto` DISABLE KEYS */;
INSERT INTO `personalizaciones_producto` VALUES (5,1,'Salsa Verde',0.00,1,'Salsa','unica',1,1,1,1,'La de casa, medianamente picante'),(6,1,'Salsa Roja',0.00,1,'Salsa','unica',1,1,1,2,'Con chile de árbol'),(7,1,'Extra Queso',10.00,0,'Extras','multiple',0,3,4,1,NULL),(8,1,'Extra Pollo',15.00,0,'Extras','multiple',0,3,4,2,NULL),(9,1,'Frijoles refritos',12.00,0,'Acompañamiento','unica',0,1,3,1,NULL),(10,1,'Papas cambray',15.00,0,'Acompañamiento','unica',0,1,3,2,NULL),(11,1,'Aguacate',12.00,0,'Extras','multiple',0,3,4,4,NULL),(12,1,'Huevo estrellado',8.00,0,'Extras','multiple',0,3,4,3,NULL),(13,1,'Bien picoso',0.00,1,'Nivel de picante','unica',1,1,2,3,NULL),(14,1,'Medio',0.00,1,'Nivel de picante','unica',1,1,2,2,NULL),(15,1,'Suave',0.00,1,'Nivel de picante','unica',1,1,2,1,NULL),(16,1,'Sin salsa',0.00,1,'Salsa','unica',1,1,1,3,NULL),(17,2,'Frijoles refritos',12.00,0,'Acompañamiento','unica',0,1,3,1,NULL),(18,2,'Papas cambray',15.00,0,'Acompañamiento','unica',0,1,3,2,NULL),(19,2,'Aguacate',12.00,0,'Extras','multiple',0,3,4,4,NULL),(20,2,'Extra pollo',15.00,0,'Extras','multiple',0,3,4,2,NULL),(21,2,'Extra queso',10.00,0,'Extras','multiple',0,3,4,1,NULL),(22,2,'Huevo estrellado',8.00,0,'Extras','multiple',0,3,4,3,NULL),(23,2,'Bien picoso',0.00,1,'Nivel de picante','unica',1,1,2,3,NULL),(24,2,'Medio',0.00,1,'Nivel de picante','unica',1,1,2,2,NULL),(25,2,'Suave',0.00,1,'Nivel de picante','unica',1,1,2,1,NULL),(26,2,'Salsa roja',0.00,1,'Salsa','unica',1,1,1,2,'Con chile de árbol'),(27,2,'Salsa verde',0.00,1,'Salsa','unica',1,1,1,1,'La de casa, medianamente picante'),(28,2,'Sin salsa',0.00,1,'Salsa','unica',1,1,1,3,NULL),(29,6,'Frijoles refritos',12.00,0,'Acompañamiento','unica',0,1,3,1,NULL),(30,6,'Papas cambray',15.00,0,'Acompañamiento','unica',0,1,3,2,NULL),(31,6,'Aguacate',12.00,0,'Extras','multiple',0,3,4,4,NULL),(32,6,'Extra pollo',15.00,0,'Extras','multiple',0,3,4,2,NULL),(33,6,'Extra queso',10.00,0,'Extras','multiple',0,3,4,1,NULL),(34,6,'Huevo estrellado',8.00,0,'Extras','multiple',0,3,4,3,NULL),(35,6,'Bien picoso',0.00,1,'Nivel de picante','unica',1,1,2,3,NULL),(36,6,'Medio',0.00,1,'Nivel de picante','unica',1,1,2,2,NULL),(37,6,'Suave',0.00,1,'Nivel de picante','unica',1,1,2,1,NULL),(38,6,'Salsa roja',0.00,1,'Salsa','unica',1,1,1,2,'Con chile de árbol'),(39,6,'Salsa verde',0.00,1,'Salsa','unica',1,1,1,1,'La de casa, medianamente picante'),(40,6,'Sin salsa',0.00,1,'Salsa','unica',1,1,1,3,NULL),(41,3,'Aguacate',12.00,0,'Extras','multiple',0,4,3,2,NULL),(42,3,'Doble carne',22.00,0,'Extras','multiple',0,4,3,3,NULL),(43,3,'Extra queso',10.00,0,'Extras','multiple',0,4,3,1,NULL),(44,3,'Jalapeños',5.00,0,'Extras','multiple',0,4,3,4,NULL),(45,3,'Chipotle',0.00,1,'Salsa','unica',1,1,2,1,NULL),(46,3,'Sin salsa',0.00,1,'Salsa','unica',1,1,2,3,NULL),(47,3,'Verde',0.00,1,'Salsa','unica',1,1,2,2,NULL),(48,3,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,4,1,NULL),(49,3,'Sin jitomate',0.00,0,'Sin ingredientes','multiple',0,4,4,2,NULL),(50,3,'Sin mayonesa',0.00,0,'Sin ingredientes','multiple',0,4,4,3,NULL),(51,3,'Bolillo',0.00,1,'Tipo de pan','unica',1,1,1,1,NULL),(52,3,'Pan integral',5.00,1,'Tipo de pan','unica',1,1,1,3,NULL),(53,3,'Telera',0.00,1,'Tipo de pan','unica',1,1,1,2,NULL),(54,7,'Aguacate',12.00,0,'Extras','multiple',0,4,3,2,NULL),(55,7,'Doble carne',22.00,0,'Extras','multiple',0,4,3,3,NULL),(56,7,'Extra queso',10.00,0,'Extras','multiple',0,4,3,1,NULL),(57,7,'Jalapeños',5.00,0,'Extras','multiple',0,4,3,4,NULL),(58,7,'Chipotle',0.00,1,'Salsa','unica',1,1,2,1,NULL),(59,7,'Sin salsa',0.00,1,'Salsa','unica',1,1,2,3,NULL),(60,7,'Verde',0.00,1,'Salsa','unica',1,1,2,2,NULL),(61,7,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,4,1,NULL),(62,7,'Sin jitomate',0.00,0,'Sin ingredientes','multiple',0,4,4,2,NULL),(63,7,'Sin mayonesa',0.00,0,'Sin ingredientes','multiple',0,4,4,3,NULL),(64,7,'Bolillo',0.00,1,'Tipo de pan','unica',1,1,1,1,NULL),(65,7,'Pan integral',5.00,1,'Tipo de pan','unica',1,1,1,3,NULL),(66,7,'Telera',0.00,1,'Tipo de pan','unica',1,1,1,2,NULL),(67,4,'Azúcar',0.00,0,'Endulzante','multiple',0,2,4,1,NULL),(68,4,'Miel de abeja',5.00,0,'Endulzante','multiple',0,2,4,3,NULL),(69,4,'Splenda',0.00,0,'Endulzante','multiple',0,2,4,2,NULL),(70,4,'Canela',0.00,0,'Extras','multiple',0,3,5,2,NULL),(71,4,'Crema batida',10.00,0,'Extras','multiple',0,3,5,3,NULL),(72,4,'Shot extra de café',12.00,0,'Extras','multiple',0,3,5,1,NULL),(73,4,'Chico 355 ml',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(74,4,'Grande 591 ml',15.00,1,'Tamaño','unica',1,1,1,3,NULL),(75,4,'Mediano 473 ml',8.00,1,'Tamaño','unica',1,1,1,2,NULL),(76,4,'Caliente',0.00,1,'Temperatura','unica',1,1,2,1,NULL),(77,4,'Con hielo',0.00,1,'Temperatura','unica',1,1,2,2,NULL),(78,4,'De almendra',12.00,0,'Tipo de leche','unica',0,1,3,3,NULL),(79,4,'Deslactosada',7.00,0,'Tipo de leche','unica',0,1,3,2,NULL),(80,4,'Entera',0.00,0,'Tipo de leche','unica',0,1,3,1,NULL),(81,5,'Individual',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(82,5,'Para compartir',18.00,1,'Tamaño','unica',1,1,1,2,NULL),(83,5,'Cacahuates',6.00,0,'Toppings','multiple',0,4,2,5,NULL),(84,5,'Chile en polvo',0.00,0,'Toppings','multiple',0,4,2,2,NULL),(85,5,'Cueritos',10.00,0,'Toppings','multiple',0,4,2,4,NULL),(86,5,'Queso amarillo',8.00,0,'Toppings','multiple',0,4,2,1,NULL),(87,5,'Salsa Valentina',0.00,0,'Toppings','multiple',0,4,2,3,NULL),(136,8,'Extra queso',10.00,0,'Extras','multiple',0,3,1,1,NULL),(137,9,'Extra queso',10.00,0,'Extras','multiple',0,3,1,1,NULL),(138,10,'Extra queso',10.00,0,'Extras','multiple',0,3,1,1,NULL),(139,8,'Porción extra',18.00,0,'Extras','multiple',0,3,1,2,NULL),(140,9,'Porción extra',18.00,0,'Extras','multiple',0,3,1,2,NULL),(141,10,'Porción extra',18.00,0,'Extras','multiple',0,3,1,2,NULL),(142,8,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,2,1,NULL),(143,9,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,2,1,NULL),(144,10,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,2,1,NULL),(145,8,'Sin crema',0.00,0,'Sin ingredientes','multiple',0,4,2,2,NULL),(146,9,'Sin crema',0.00,0,'Sin ingredientes','multiple',0,4,2,2,NULL),(147,10,'Sin crema',0.00,0,'Sin ingredientes','multiple',0,4,2,2,NULL),(148,8,'Sin picante',0.00,0,'Sin ingredientes','multiple',0,4,2,3,NULL),(149,9,'Sin picante',0.00,0,'Sin ingredientes','multiple',0,4,2,3,NULL),(150,10,'Sin picante',0.00,0,'Sin ingredientes','multiple',0,4,2,3,NULL),(151,11,'Salsa verde',0.00,1,'Salsa','unica',1,1,1,1,'La de casa, medianamente picante'),(152,12,'Salsa verde',0.00,1,'Salsa','unica',1,1,1,1,'La de casa, medianamente picante'),(153,13,'Salsa verde',0.00,1,'Salsa','unica',1,1,1,1,'La de casa, medianamente picante'),(154,11,'Salsa roja',0.00,1,'Salsa','unica',1,1,1,2,'Con chile de árbol'),(155,12,'Salsa roja',0.00,1,'Salsa','unica',1,1,1,2,'Con chile de árbol'),(156,13,'Salsa roja',0.00,1,'Salsa','unica',1,1,1,2,'Con chile de árbol'),(157,11,'Sin salsa',0.00,1,'Salsa','unica',1,1,1,3,NULL),(158,12,'Sin salsa',0.00,1,'Salsa','unica',1,1,1,3,NULL),(159,13,'Sin salsa',0.00,1,'Salsa','unica',1,1,1,3,NULL),(160,11,'Suave',0.00,1,'Nivel de picante','unica',1,1,2,1,NULL),(161,12,'Suave',0.00,1,'Nivel de picante','unica',1,1,2,1,NULL),(162,13,'Suave',0.00,1,'Nivel de picante','unica',1,1,2,1,NULL),(163,11,'Medio',0.00,1,'Nivel de picante','unica',1,1,2,2,NULL),(164,12,'Medio',0.00,1,'Nivel de picante','unica',1,1,2,2,NULL),(165,13,'Medio',0.00,1,'Nivel de picante','unica',1,1,2,2,NULL),(166,11,'Bien picoso',0.00,1,'Nivel de picante','unica',1,1,2,3,NULL),(167,12,'Bien picoso',0.00,1,'Nivel de picante','unica',1,1,2,3,NULL),(168,13,'Bien picoso',0.00,1,'Nivel de picante','unica',1,1,2,3,NULL),(169,11,'Frijoles refritos',12.00,0,'Acompañamiento','unica',0,1,3,1,NULL),(170,12,'Frijoles refritos',12.00,0,'Acompañamiento','unica',0,1,3,1,NULL),(171,13,'Frijoles refritos',12.00,0,'Acompañamiento','unica',0,1,3,1,NULL),(172,11,'Papas cambray',15.00,0,'Acompañamiento','unica',0,1,3,2,NULL),(173,12,'Papas cambray',15.00,0,'Acompañamiento','unica',0,1,3,2,NULL),(174,13,'Papas cambray',15.00,0,'Acompañamiento','unica',0,1,3,2,NULL),(175,11,'Extra queso',10.00,0,'Extras','multiple',0,3,4,1,NULL),(176,12,'Extra queso',10.00,0,'Extras','multiple',0,3,4,1,NULL),(177,13,'Extra queso',10.00,0,'Extras','multiple',0,3,4,1,NULL),(178,11,'Extra pollo',15.00,0,'Extras','multiple',0,3,4,2,NULL),(179,12,'Extra pollo',15.00,0,'Extras','multiple',0,3,4,2,NULL),(180,13,'Extra pollo',15.00,0,'Extras','multiple',0,3,4,2,NULL),(181,11,'Huevo estrellado',8.00,0,'Extras','multiple',0,3,4,3,NULL),(182,12,'Huevo estrellado',8.00,0,'Extras','multiple',0,3,4,3,NULL),(183,13,'Huevo estrellado',8.00,0,'Extras','multiple',0,3,4,3,NULL),(184,11,'Aguacate',12.00,0,'Extras','multiple',0,3,4,4,NULL),(185,12,'Aguacate',12.00,0,'Extras','multiple',0,3,4,4,NULL),(186,13,'Aguacate',12.00,0,'Extras','multiple',0,3,4,4,NULL),(187,14,'Bolillo',0.00,1,'Tipo de pan','unica',1,1,1,1,NULL),(188,15,'Bolillo',0.00,1,'Tipo de pan','unica',1,1,1,1,NULL),(189,16,'Bolillo',0.00,1,'Tipo de pan','unica',1,1,1,1,NULL),(190,14,'Telera',0.00,1,'Tipo de pan','unica',1,1,1,2,NULL),(191,15,'Telera',0.00,1,'Tipo de pan','unica',1,1,1,2,NULL),(192,16,'Telera',0.00,1,'Tipo de pan','unica',1,1,1,2,NULL),(193,14,'Pan integral',5.00,1,'Tipo de pan','unica',1,1,1,3,NULL),(194,15,'Pan integral',5.00,1,'Tipo de pan','unica',1,1,1,3,NULL),(195,16,'Pan integral',5.00,1,'Tipo de pan','unica',1,1,1,3,NULL),(196,14,'Chipotle',0.00,1,'Salsa','unica',1,1,2,1,NULL),(197,15,'Chipotle',0.00,1,'Salsa','unica',1,1,2,1,NULL),(198,16,'Chipotle',0.00,1,'Salsa','unica',1,1,2,1,NULL),(199,14,'Verde',0.00,1,'Salsa','unica',1,1,2,2,NULL),(200,15,'Verde',0.00,1,'Salsa','unica',1,1,2,2,NULL),(201,16,'Verde',0.00,1,'Salsa','unica',1,1,2,2,NULL),(202,14,'Sin salsa',0.00,1,'Salsa','unica',1,1,2,3,NULL),(203,15,'Sin salsa',0.00,1,'Salsa','unica',1,1,2,3,NULL),(204,16,'Sin salsa',0.00,1,'Salsa','unica',1,1,2,3,NULL),(205,14,'Extra queso',10.00,0,'Extras','multiple',0,4,3,1,NULL),(206,15,'Extra queso',10.00,0,'Extras','multiple',0,4,3,1,NULL),(207,16,'Extra queso',10.00,0,'Extras','multiple',0,4,3,1,NULL),(208,14,'Aguacate',12.00,0,'Extras','multiple',0,4,3,2,NULL),(209,15,'Aguacate',12.00,0,'Extras','multiple',0,4,3,2,NULL),(210,16,'Aguacate',12.00,0,'Extras','multiple',0,4,3,2,NULL),(211,14,'Doble carne',22.00,0,'Extras','multiple',0,4,3,3,NULL),(212,15,'Doble carne',22.00,0,'Extras','multiple',0,4,3,3,NULL),(213,16,'Doble carne',22.00,0,'Extras','multiple',0,4,3,3,NULL),(214,14,'Jalapeños',5.00,0,'Extras','multiple',0,4,3,4,NULL),(215,15,'Jalapeños',5.00,0,'Extras','multiple',0,4,3,4,NULL),(216,16,'Jalapeños',5.00,0,'Extras','multiple',0,4,3,4,NULL),(217,14,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,4,1,NULL),(218,15,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,4,1,NULL),(219,16,'Sin cebolla',0.00,0,'Sin ingredientes','multiple',0,4,4,1,NULL),(220,14,'Sin jitomate',0.00,0,'Sin ingredientes','multiple',0,4,4,2,NULL),(221,15,'Sin jitomate',0.00,0,'Sin ingredientes','multiple',0,4,4,2,NULL),(222,16,'Sin jitomate',0.00,0,'Sin ingredientes','multiple',0,4,4,2,NULL),(223,14,'Sin mayonesa',0.00,0,'Sin ingredientes','multiple',0,4,4,3,NULL),(224,15,'Sin mayonesa',0.00,0,'Sin ingredientes','multiple',0,4,4,3,NULL),(225,16,'Sin mayonesa',0.00,0,'Sin ingredientes','multiple',0,4,4,3,NULL),(226,17,'Chico 355 ml',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(227,18,'Chico 355 ml',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(228,19,'Chico 355 ml',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(229,20,'Chico 355 ml',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(230,17,'Mediano 473 ml',8.00,1,'Tamaño','unica',1,1,1,2,NULL),(231,18,'Mediano 473 ml',8.00,1,'Tamaño','unica',1,1,1,2,NULL),(232,19,'Mediano 473 ml',8.00,1,'Tamaño','unica',1,1,1,2,NULL),(233,20,'Mediano 473 ml',8.00,1,'Tamaño','unica',1,1,1,2,NULL),(234,17,'Grande 591 ml',15.00,1,'Tamaño','unica',1,1,1,3,NULL),(235,18,'Grande 591 ml',15.00,1,'Tamaño','unica',1,1,1,3,NULL),(236,19,'Grande 591 ml',15.00,1,'Tamaño','unica',1,1,1,3,NULL),(237,20,'Grande 591 ml',15.00,1,'Tamaño','unica',1,1,1,3,NULL),(238,17,'Caliente',0.00,1,'Temperatura','unica',1,1,2,1,NULL),(239,18,'Caliente',0.00,1,'Temperatura','unica',1,1,2,1,NULL),(240,19,'Caliente',0.00,1,'Temperatura','unica',1,1,2,1,NULL),(241,20,'Caliente',0.00,1,'Temperatura','unica',1,1,2,1,NULL),(242,17,'Con hielo',0.00,1,'Temperatura','unica',1,1,2,2,NULL),(243,18,'Con hielo',0.00,1,'Temperatura','unica',1,1,2,2,NULL),(244,19,'Con hielo',0.00,1,'Temperatura','unica',1,1,2,2,NULL),(245,20,'Con hielo',0.00,1,'Temperatura','unica',1,1,2,2,NULL),(246,17,'Entera',0.00,0,'Tipo de leche','unica',0,1,3,1,NULL),(247,18,'Entera',0.00,0,'Tipo de leche','unica',0,1,3,1,NULL),(248,19,'Entera',0.00,0,'Tipo de leche','unica',0,1,3,1,NULL),(249,20,'Entera',0.00,0,'Tipo de leche','unica',0,1,3,1,NULL),(250,17,'Deslactosada',7.00,0,'Tipo de leche','unica',0,1,3,2,NULL),(251,18,'Deslactosada',7.00,0,'Tipo de leche','unica',0,1,3,2,NULL),(252,19,'Deslactosada',7.00,0,'Tipo de leche','unica',0,1,3,2,NULL),(253,20,'Deslactosada',7.00,0,'Tipo de leche','unica',0,1,3,2,NULL),(254,17,'De almendra',12.00,0,'Tipo de leche','unica',0,1,3,3,NULL),(255,18,'De almendra',12.00,0,'Tipo de leche','unica',0,1,3,3,NULL),(256,19,'De almendra',12.00,0,'Tipo de leche','unica',0,1,3,3,NULL),(257,20,'De almendra',12.00,0,'Tipo de leche','unica',0,1,3,3,NULL),(258,17,'Azúcar',0.00,0,'Endulzante','multiple',0,2,4,1,NULL),(259,18,'Azúcar',0.00,0,'Endulzante','multiple',0,2,4,1,NULL),(260,19,'Azúcar',0.00,0,'Endulzante','multiple',0,2,4,1,NULL),(261,20,'Azúcar',0.00,0,'Endulzante','multiple',0,2,4,1,NULL),(262,17,'Splenda',0.00,0,'Endulzante','multiple',0,2,4,2,NULL),(263,18,'Splenda',0.00,0,'Endulzante','multiple',0,2,4,2,NULL),(264,19,'Splenda',0.00,0,'Endulzante','multiple',0,2,4,2,NULL),(265,20,'Splenda',0.00,0,'Endulzante','multiple',0,2,4,2,NULL),(266,17,'Miel de abeja',5.00,0,'Endulzante','multiple',0,2,4,3,NULL),(267,18,'Miel de abeja',5.00,0,'Endulzante','multiple',0,2,4,3,NULL),(268,19,'Miel de abeja',5.00,0,'Endulzante','multiple',0,2,4,3,NULL),(269,20,'Miel de abeja',5.00,0,'Endulzante','multiple',0,2,4,3,NULL),(270,17,'Shot extra de café',12.00,0,'Extras','multiple',0,3,5,1,NULL),(271,18,'Shot extra de café',12.00,0,'Extras','multiple',0,3,5,1,NULL),(272,19,'Shot extra de café',12.00,0,'Extras','multiple',0,3,5,1,NULL),(273,20,'Shot extra de café',12.00,0,'Extras','multiple',0,3,5,1,NULL),(274,17,'Canela',0.00,0,'Extras','multiple',0,3,5,2,NULL),(275,18,'Canela',0.00,0,'Extras','multiple',0,3,5,2,NULL),(276,19,'Canela',0.00,0,'Extras','multiple',0,3,5,2,NULL),(277,20,'Canela',0.00,0,'Extras','multiple',0,3,5,2,NULL),(278,17,'Crema batida',10.00,0,'Extras','multiple',0,3,5,3,NULL),(279,18,'Crema batida',10.00,0,'Extras','multiple',0,3,5,3,NULL),(280,19,'Crema batida',10.00,0,'Extras','multiple',0,3,5,3,NULL),(281,20,'Crema batida',10.00,0,'Extras','multiple',0,3,5,3,NULL),(282,21,'Individual',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(283,22,'Individual',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(284,23,'Individual',0.00,1,'Tamaño','unica',1,1,1,1,NULL),(285,21,'Para compartir',18.00,1,'Tamaño','unica',1,1,1,2,NULL),(286,22,'Para compartir',18.00,1,'Tamaño','unica',1,1,1,2,NULL),(287,23,'Para compartir',18.00,1,'Tamaño','unica',1,1,1,2,NULL),(288,21,'Queso amarillo',8.00,0,'Toppings','multiple',0,4,2,1,NULL),(289,22,'Queso amarillo',8.00,0,'Toppings','multiple',0,4,2,1,NULL),(290,23,'Queso amarillo',8.00,0,'Toppings','multiple',0,4,2,1,NULL),(291,21,'Chile en polvo',0.00,0,'Toppings','multiple',0,4,2,2,NULL),(292,22,'Chile en polvo',0.00,0,'Toppings','multiple',0,4,2,2,NULL),(293,23,'Chile en polvo',0.00,0,'Toppings','multiple',0,4,2,2,NULL),(294,21,'Salsa Valentina',0.00,0,'Toppings','multiple',0,4,2,3,NULL),(295,22,'Salsa Valentina',0.00,0,'Toppings','multiple',0,4,2,3,NULL),(296,23,'Salsa Valentina',0.00,0,'Toppings','multiple',0,4,2,3,NULL),(297,21,'Cueritos',10.00,0,'Toppings','multiple',0,4,2,4,NULL),(298,22,'Cueritos',10.00,0,'Toppings','multiple',0,4,2,4,NULL),(299,23,'Cueritos',10.00,0,'Toppings','multiple',0,4,2,4,NULL),(300,21,'Cacahuates',6.00,0,'Toppings','multiple',0,4,2,5,NULL),(301,22,'Cacahuates',6.00,0,'Toppings','multiple',0,4,2,5,NULL),(302,23,'Cacahuates',6.00,0,'Toppings','multiple',0,4,2,5,NULL);
/*!40000 ALTER TABLE `personalizaciones_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantillas_personalizacion`
--

DROP TABLE IF EXISTS `plantillas_personalizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantillas_personalizacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int NOT NULL,
  `nombre_grupo` varchar(50) NOT NULL,
  `tipo_grupo` enum('unica','multiple') NOT NULL DEFAULT 'multiple',
  `es_requerido` tinyint(1) NOT NULL DEFAULT '0',
  `min_selecciones` int NOT NULL DEFAULT '0',
  `max_selecciones` int DEFAULT NULL,
  `orden` int NOT NULL DEFAULT '0',
  `orden_opcion` int NOT NULL DEFAULT '0',
  `nombre` varchar(100) NOT NULL,
  `precio_adicional` decimal(10,2) NOT NULL DEFAULT '0.00',
  `descripcion` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_plantilla_opcion` (`categoria_id`,`nombre_grupo`,`nombre`),
  CONSTRAINT `plantillas_personalizacion_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantillas_personalizacion`
--

LOCK TABLES `plantillas_personalizacion` WRITE;
/*!40000 ALTER TABLE `plantillas_personalizacion` DISABLE KEYS */;
INSERT INTO `plantillas_personalizacion` VALUES (1,1,'Extras','multiple',0,0,3,1,1,'Extra queso',10.00,NULL),(2,1,'Extras','multiple',0,0,3,1,2,'Porción extra',18.00,NULL),(3,1,'Sin ingredientes','multiple',0,0,4,2,1,'Sin cebolla',0.00,NULL),(4,1,'Sin ingredientes','multiple',0,0,4,2,2,'Sin crema',0.00,NULL),(5,1,'Sin ingredientes','multiple',0,0,4,2,3,'Sin picante',0.00,NULL),(6,2,'Salsa','unica',1,1,1,1,1,'Salsa verde',0.00,'La de casa, medianamente picante'),(7,2,'Salsa','unica',1,1,1,1,2,'Salsa roja',0.00,'Con chile de árbol'),(8,2,'Salsa','unica',1,1,1,1,3,'Sin salsa',0.00,NULL),(9,2,'Nivel de picante','unica',1,1,1,2,1,'Suave',0.00,NULL),(10,2,'Nivel de picante','unica',1,1,1,2,2,'Medio',0.00,NULL),(11,2,'Nivel de picante','unica',1,1,1,2,3,'Bien picoso',0.00,NULL),(12,2,'Acompañamiento','unica',0,0,1,3,1,'Frijoles refritos',12.00,NULL),(13,2,'Acompañamiento','unica',0,0,1,3,2,'Papas cambray',15.00,NULL),(14,2,'Extras','multiple',0,0,3,4,1,'Extra queso',10.00,NULL),(15,2,'Extras','multiple',0,0,3,4,2,'Extra pollo',15.00,NULL),(16,2,'Extras','multiple',0,0,3,4,3,'Huevo estrellado',8.00,NULL),(17,2,'Extras','multiple',0,0,3,4,4,'Aguacate',12.00,NULL),(18,3,'Tipo de pan','unica',1,1,1,1,1,'Bolillo',0.00,NULL),(19,3,'Tipo de pan','unica',1,1,1,1,2,'Telera',0.00,NULL),(20,3,'Tipo de pan','unica',1,1,1,1,3,'Pan integral',5.00,NULL),(21,3,'Salsa','unica',1,1,1,2,1,'Chipotle',0.00,NULL),(22,3,'Salsa','unica',1,1,1,2,2,'Verde',0.00,NULL),(23,3,'Salsa','unica',1,1,1,2,3,'Sin salsa',0.00,NULL),(24,3,'Extras','multiple',0,0,4,3,1,'Extra queso',10.00,NULL),(25,3,'Extras','multiple',0,0,4,3,2,'Aguacate',12.00,NULL),(26,3,'Extras','multiple',0,0,4,3,3,'Doble carne',22.00,NULL),(27,3,'Extras','multiple',0,0,4,3,4,'Jalapeños',5.00,NULL),(28,3,'Sin ingredientes','multiple',0,0,4,4,1,'Sin cebolla',0.00,NULL),(29,3,'Sin ingredientes','multiple',0,0,4,4,2,'Sin jitomate',0.00,NULL),(30,3,'Sin ingredientes','multiple',0,0,4,4,3,'Sin mayonesa',0.00,NULL),(31,4,'Tamaño','unica',1,1,1,1,1,'Chico 355 ml',0.00,NULL),(32,4,'Tamaño','unica',1,1,1,1,2,'Mediano 473 ml',8.00,NULL),(33,4,'Tamaño','unica',1,1,1,1,3,'Grande 591 ml',15.00,NULL),(34,4,'Temperatura','unica',1,1,1,2,1,'Caliente',0.00,NULL),(35,4,'Temperatura','unica',1,1,1,2,2,'Con hielo',0.00,NULL),(36,4,'Tipo de leche','unica',0,0,1,3,1,'Entera',0.00,NULL),(37,4,'Tipo de leche','unica',0,0,1,3,2,'Deslactosada',7.00,NULL),(38,4,'Tipo de leche','unica',0,0,1,3,3,'De almendra',12.00,NULL),(39,4,'Endulzante','multiple',0,0,2,4,1,'Azúcar',0.00,NULL),(40,4,'Endulzante','multiple',0,0,2,4,2,'Splenda',0.00,NULL),(41,4,'Endulzante','multiple',0,0,2,4,3,'Miel de abeja',5.00,NULL),(42,4,'Extras','multiple',0,0,3,5,1,'Shot extra de café',12.00,NULL),(43,4,'Extras','multiple',0,0,3,5,2,'Canela',0.00,NULL),(44,4,'Extras','multiple',0,0,3,5,3,'Crema batida',10.00,NULL),(45,5,'Tamaño','unica',1,1,1,1,1,'Individual',0.00,NULL),(46,5,'Tamaño','unica',1,1,1,1,2,'Para compartir',18.00,NULL),(47,5,'Toppings','multiple',0,0,4,2,1,'Queso amarillo',8.00,NULL),(48,5,'Toppings','multiple',0,0,4,2,2,'Chile en polvo',0.00,NULL),(49,5,'Toppings','multiple',0,0,4,2,3,'Salsa Valentina',0.00,NULL),(50,5,'Toppings','multiple',0,0,4,2,4,'Cueritos',10.00,NULL),(51,5,'Toppings','multiple',0,0,4,2,5,'Cacahuates',6.00,NULL);
/*!40000 ALTER TABLE `plantillas_personalizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preferencias_dieteticas`
--

DROP TABLE IF EXISTS `preferencias_dieteticas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferencias_dieteticas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `tipo` enum('alergia','estilo_vida') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_preferencia` (`nombre`,`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferencias_dieteticas`
--

LOCK TABLES `preferencias_dieteticas` WRITE;
/*!40000 ALTER TABLE `preferencias_dieteticas` DISABLE KEYS */;
INSERT INTO `preferencias_dieteticas` VALUES (12,'Alto en proteína','estilo_vida'),(1,'Cacahuate','alergia'),(10,'Frutos secos','alergia'),(2,'Gluten','alergia'),(4,'Huevo','alergia'),(7,'Keto','estilo_vida'),(3,'Lactosa','alergia'),(8,'Mariscos','alergia'),(11,'Sin azúcar','estilo_vida'),(9,'Soya','alergia'),(5,'Vegano','estilo_vida'),(6,'Vegetariano','estilo_vida');
/*!40000 ALTER TABLE `preferencias_dieteticas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preferencias_usuario`
--

DROP TABLE IF EXISTS `preferencias_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferencias_usuario` (
  `usuario_id` int NOT NULL,
  `preferencia_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`,`preferencia_id`),
  KEY `preferencia_id` (`preferencia_id`),
  CONSTRAINT `preferencias_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preferencias_usuario_ibfk_2` FOREIGN KEY (`preferencia_id`) REFERENCES `preferencias_dieteticas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferencias_usuario`
--

LOCK TABLES `preferencias_usuario` WRITE;
/*!40000 ALTER TABLE `preferencias_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `preferencias_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio_base` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '999',
  `url_imagen` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_producto_categoria` (`categoria_id`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,2,'Chilaquiles Verdes','Chilaquiles con crema y queso',65.00,50,'/uploads/chilaquiles-verdes.jpg',1),(2,2,'Hot Cakes','Hot cakes con miel',55.00,40,'/uploads/hot-cakes.jpg',1),(3,3,'Torta Cubana','Torta con jamón y salchicha',70.00,30,'/uploads/torta-cubana.jpg',1),(4,4,'Café Americano','Café recién preparado',30.00,100,'/uploads/cafe-americano.jpg',1),(5,5,'Papas Preparadas','Papas con queso y salsa',45.00,25,'/uploads/papas-preparadas.jpg',1),(6,2,'Molletes Especiales','Molletes con queso y pico de gallo',55.00,80,'/uploads/molletes-especiales.jpg',1),(7,3,'Cuernito','Rico cuernito de jamón',35.00,50,'/uploads/cuernito.jpg',1),(8,1,'Quesadillas de Champiñones','Dos quesadillas de tortilla azul con queso Oaxaca y champiñones salteados',52.00,40,'/uploads/quesadillas-champinones.jpg',1),(9,1,'Hamburguesa Metro','Carne de res a la plancha con queso y tocino, acompañada de papas a la francesa',89.00,30,'/uploads/hamburguesa-metro.jpg',1),(10,1,'Pizza Individual','Pizza personal de peperoni recién horneada',75.00,25,'/uploads/pizza-individual.jpg',1),(11,2,'Huevos Rancheros','Dos huevos estrellados sobre tortilla con salsa de la casa y queso',62.00,45,'/uploads/huevos-rancheros.jpg',1),(12,2,'Omelette de Queso','Omelette de tres huevos relleno de queso manchego, con pan tostado',68.00,40,'/uploads/omelette-queso.jpg',1),(13,2,'Tamal Oaxaqueño','Tamal de pollo en mole, envuelto en hoja de plátano',32.00,60,'/uploads/tamal-oaxaqueno.jpg',1),(14,3,'Orden de Tacos al Pastor','Tres tacos con cebolla, cilantro, limón y salsa de la casa',65.00,50,'/uploads/tacos-al-pastor.jpg',1),(15,3,'Enchiladas Verdes','Cuatro enchiladas de pollo en salsa verde con crema, queso y aguacate',78.00,35,'/uploads/enchiladas-verdes.jpg',1),(16,3,'Pozole Rojo','Plato de pozole con maíz cacahuazintle y guarnición para preparar',85.00,25,'/uploads/pozole-rojo.jpg',1),(17,4,'Capuchino','Espresso con leche vaporizada, espuma cremosa y canela',38.00,80,'/uploads/capuchino.jpg',1),(18,4,'Agua de Horchata','Agua fresca de arroz con canela, preparada del día',25.00,70,'/uploads/agua-horchata.jpg',1),(19,4,'Chocolate Caliente','Chocolate de mesa batido con leche, ideal para los días fríos',35.00,60,'/uploads/chocolate-caliente.jpg',1),(20,4,'Agua de Jamaica','Agua fresca de flor de jamaica, con o sin azúcar',25.00,70,'/uploads/agua-fresca.jpg',1),(21,5,'Esquites','Vaso de granos de elote con mayonesa, queso y chile en polvo',35.00,50,'/uploads/esquites.jpg',1),(22,5,'Rebanada de Pastel de Chocolate','Rebanada del pastel de chocolate del día, con cobertura de cacao',45.00,20,'/uploads/pastel-chocolate.jpg',1),(23,5,'Dona del Día','Dona fresca de la charola: glaseada, de chocolate o rellena',22.00,45,'/uploads/dona-glaseada.jpg',1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `carrera` varchar(100) DEFAULT NULL,
  `url_foto` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('alumno','empleado','admin') DEFAULT 'alumno',
  `tolerancia_picante` enum('ninguno','medio','habanero') DEFAULT 'medio',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula` (`matricula`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_usuario_correo` (`correo`),
  KEY `idx_usuario_matricula` (`matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'2230110','Sebastian Ruiz','sebastian@upmh.edu.mx','$2b$10$OENWuyp.DCVZRmgTUKco7uW3Gv3LKzfigRJh3982Jwngfmihk1/9W','Ingenieria en Software',NULL,NULL,'admin','ninguno','2026-05-30 17:15:45','2026-08-16 17:08:33'),(2,'233110970','Edgar Montaño Hernandez','233110970@upmh.edu.mx','$2b$10$yrAN.rnZZDvQt6B4IpAzv.txP2vKyRkXSybar6vPi2Df7WIAeBcsa','Tecnologías de la Información e Innovación Digital',NULL,NULL,'alumno','medio','2026-06-22 19:43:08','2026-08-16 17:08:33'),(3,'233112186','Emmanuel Tapia','233112186@upmh.edu.mx','$2b$10$LkKCxc5ANA32rrlyXfE88OS5EUDrF1edeYJocSwUISwh.V4rsaNvW','Tecnologías de la Información e Innovación Digital',NULL,NULL,'alumno','medio','2026-06-22 23:35:05','2026-08-16 17:08:33'),(4,'TEST0001','Test QA','qa.test@upmh.edu.mx','$2b$10$k4l/zNLh4zS9bDQSLTVqfeD6v77vQatkWEFX6RJ42AS3fYb3psVFO','QA',NULL,NULL,'admin','medio','2026-08-11 06:00:33','2026-08-16 17:08:33');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-16 22:38:28
