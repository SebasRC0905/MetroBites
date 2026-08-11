-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: metrobites_db
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupones`
--

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
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
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_pedido`
--

LOCK TABLES `detalles_pedido` WRITE;
/*!40000 ALTER TABLE `detalles_pedido` DISABLE KEYS */;
INSERT INTO `detalles_pedido` VALUES (1,2,1,2,65.00,130.00),(2,3,1,2,65.00,150.00),(3,4,1,1,65.00,65.00),(4,5,1,1,65.00,90.00),(5,6,1,1,65.00,90.00),(6,7,1,1,65.00,65.00),(7,8,1,1,65.00,65.00),(8,9,4,1,30.00,30.00),(9,10,1,1,65.00,65.00),(10,11,4,1,30.00,30.00),(11,12,4,1,30.00,30.00),(12,13,4,1,30.00,30.00),(13,14,4,1,30.00,30.00),(14,15,4,1,30.00,30.00),(15,16,4,1,30.00,30.00);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
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
  `estado` enum('recibido','preparando','listo','entregado','cancelado') DEFAULT 'recibido',
  `estado_pago` enum('pendiente','pagado','cancelado') DEFAULT 'pendiente',
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('efectivo','tarjeta','paypal','transferencia') NOT NULL,
  `metodo_pago_id` int DEFAULT NULL,
  `codigo_qr` varchar(100) NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_qr` (`codigo_qr`),
  KEY `horario_id` (`horario_id`),
  KEY `cupon_id` (`cupon_id`),
  KEY `metodo_pago_id` (`metodo_pago_id`),
  KEY `idx_pedido_usuario` (`usuario_id`),
  KEY `idx_pedido_estado` (`estado`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`horario_id`) REFERENCES `horarios_recoleccion` (`id`),
  CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`cupon_id`) REFERENCES `cupones` (`id`),
  CONSTRAINT `pedidos_ibfk_4` FOREIGN KEY (`metodo_pago_id`) REFERENCES `metodos_pago` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,1,NULL,'recibido','pendiente',130.00,'efectivo','MB-1780285334202','2026-06-01 03:42:14'),(2,1,1,NULL,'preparando','pendiente',130.00,'efectivo','MB-1780285639521','2026-06-01 03:47:19'),(3,1,1,NULL,'recibido','pendiente',150.00,'efectivo','MB-1780285834863','2026-06-01 03:50:34'),(4,1,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1780357274757','2026-06-01 23:41:14'),(5,1,1,NULL,'recibido','pendiente',90.00,'efectivo','MB-1780358797697','2026-06-02 00:06:37'),(6,1,1,NULL,'recibido','pendiente',90.00,'efectivo','MB-1780363150222','2026-06-02 01:19:10'),(7,1,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1780363541206','2026-06-02 01:25:41'),(8,1,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1780963913134','2026-06-09 00:11:53'),(9,2,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782167463485','2026-06-22 22:31:03'),(10,3,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1782171346722','2026-06-22 23:35:46'),(11,3,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782174331017','2026-06-23 00:25:31'),(12,2,2,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782517881967','2026-06-26 23:51:21'),(13,2,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782520783785','2026-06-27 00:39:43'),(14,2,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782520998894','2026-06-27 00:43:18'),(15,2,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782757893293','2026-06-29 18:31:33'),(16,2,2,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782777053835','2026-06-29 23:50:53');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizaciones_detalle_pedido`
--

LOCK TABLES `personalizaciones_detalle_pedido` WRITE;
/*!40000 ALTER TABLE `personalizaciones_detalle_pedido` DISABLE KEYS */;
INSERT INTO `personalizaciones_detalle_pedido` VALUES (1,2,'Salsa Verde',0.00),(2,2,'Extra Queso',10.00),(3,3,'Salsa Verde',0.00),(4,4,'Extra Queso',10.00),(5,4,'Extra Pollo',15.00),(6,5,'Extra Queso',10.00),(7,5,'Extra Pollo',15.00);
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
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `personalizaciones_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizaciones_producto`
--

LOCK TABLES `personalizaciones_producto` WRITE;
/*!40000 ALTER TABLE `personalizaciones_producto` DISABLE KEYS */;
INSERT INTO `personalizaciones_producto` VALUES (5,1,'Salsa Verde',0.00,1,'Salsa'),(6,1,'Salsa Roja',0.00,1,'Salsa'),(7,1,'Extra Queso',10.00,0,'Extras'),(8,1,'Extra Pollo',15.00,0,'Extras');
/*!40000 ALTER TABLE `personalizaciones_producto` ENABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferencias_dieteticas`
--

LOCK TABLES `preferencias_dieteticas` WRITE;
/*!40000 ALTER TABLE `preferencias_dieteticas` DISABLE KEYS */;
INSERT INTO `preferencias_dieteticas` VALUES (1,'Cacahuate','alergia'),(2,'Gluten','alergia'),(3,'Lactosa','alergia'),(4,'Huevo','alergia'),(5,'Vegano','estilo_vida'),(6,'Vegetariano','estilo_vida'),(7,'Keto','estilo_vida');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,2,'Chilaquiles Verdes','Chilaquiles con crema y queso',65.00,50,NULL,1),(2,2,'Hot Cakes','Hot cakes con miel',55.00,40,NULL,1),(3,3,'Torta Cubana','Torta con jamón y salchicha',70.00,30,NULL,1),(4,4,'Café Americano','Café recién preparado',30.00,100,'/uploads/1781993059756-cafe_a.jpg',1),(5,5,'Papas Preparadas','Papas con queso y salsa',45.00,25,NULL,1),(6,2,'Molletes Especiales','Molletes con queso y pico de gallo',55.00,80,NULL,1),(7,3,'Cuernito','Rico cuernito de jamón',35.00,50,'/uploads/1781991323119-cuernito.jpg',1);
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
  `rol` enum('alumno','empleado','admin') DEFAULT 'alumno',
  `tolerancia_picante` enum('ninguno','medio','habanero') DEFAULT 'medio',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula` (`matricula`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_usuario_correo` (`correo`),
  KEY `idx_usuario_matricula` (`matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'2230110','Sebastian Ruiz','sebastian@upmh.edu.mx','$2b$10$OENWuyp.DCVZRmgTUKco7uW3Gv3LKzfigRJh3982Jwngfmihk1/9W','Ingenieria en Software','admin','ninguno','2026-05-30 17:15:45'),(2,'233110970','Edgar Montaño Hernandez','233110970@upmh.edu.mx','$2b$10$yrAN.rnZZDvQt6B4IpAzv.txP2vKyRkXSybar6vPi2Df7WIAeBcsa','Tecnologías de la Información e Innovación Digital','alumno','medio','2026-06-22 19:43:08'),(3,'233112186','Emmanuel Tapia','233112186@upmh.edu.mx','$2b$10$LkKCxc5ANA32rrlyXfE88OS5EUDrF1edeYJocSwUISwh.V4rsaNvW','Tecnologías de la Información e Innovación Digital','alumno','medio','2026-06-22 23:35:05');
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

-- Dump completed on 2026-07-07 22:41:20
