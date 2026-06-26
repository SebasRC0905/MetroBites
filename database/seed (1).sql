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
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Populares'),(2,'Desayunos'),(3,'Comidas'),(4,'Bebidas'),(5,'Snacks');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cupones`
--

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
/*!40000 ALTER TABLE `cupones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `detalles_pedido`
--

LOCK TABLES `detalles_pedido` WRITE;
/*!40000 ALTER TABLE `detalles_pedido` DISABLE KEYS */;
INSERT INTO `detalles_pedido` VALUES (1,2,1,2,65.00,130.00),(2,3,1,2,65.00,150.00),(3,4,1,1,65.00,65.00),(4,5,1,1,65.00,90.00),(5,6,1,1,65.00,90.00),(6,7,1,1,65.00,65.00),(7,8,1,1,65.00,65.00),(8,9,4,1,30.00,30.00),(9,10,1,1,65.00,65.00),(10,11,4,1,30.00,30.00);
/*!40000 ALTER TABLE `detalles_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (1,1);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `horarios_recoleccion`
--

LOCK TABLES `horarios_recoleccion` WRITE;
/*!40000 ALTER TABLE `horarios_recoleccion` DISABLE KEYS */;
INSERT INTO `horarios_recoleccion` VALUES (1,'Receso 1','10:50:00','11:10:00',1),(2,'Receso 2','13:00:00','13:20:00',1);
/*!40000 ALTER TABLE `horarios_recoleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,1,NULL,'recibido','pendiente',130.00,'efectivo','MB-1780285334202','2026-06-01 03:42:14'),(2,1,1,NULL,'preparando','pendiente',130.00,'efectivo','MB-1780285639521','2026-06-01 03:47:19'),(3,1,1,NULL,'recibido','pendiente',150.00,'efectivo','MB-1780285834863','2026-06-01 03:50:34'),(4,1,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1780357274757','2026-06-01 23:41:14'),(5,1,1,NULL,'recibido','pendiente',90.00,'efectivo','MB-1780358797697','2026-06-02 00:06:37'),(6,1,1,NULL,'recibido','pendiente',90.00,'efectivo','MB-1780363150222','2026-06-02 01:19:10'),(7,1,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1780363541206','2026-06-02 01:25:41'),(8,1,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1780963913134','2026-06-09 00:11:53'),(9,2,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782167463485','2026-06-22 22:31:03'),(10,3,1,NULL,'recibido','pendiente',65.00,'efectivo','MB-1782171346722','2026-06-22 23:35:46'),(11,3,1,NULL,'recibido','pendiente',30.00,'efectivo','MB-1782174331017','2026-06-23 00:25:31');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `personalizaciones_detalle_pedido`
--

LOCK TABLES `personalizaciones_detalle_pedido` WRITE;
/*!40000 ALTER TABLE `personalizaciones_detalle_pedido` DISABLE KEYS */;
INSERT INTO `personalizaciones_detalle_pedido` VALUES (1,2,'Salsa Verde',0.00),(2,2,'Extra Queso',10.00),(3,3,'Salsa Verde',0.00),(4,4,'Extra Queso',10.00),(5,4,'Extra Pollo',15.00),(6,5,'Extra Queso',10.00),(7,5,'Extra Pollo',15.00);
/*!40000 ALTER TABLE `personalizaciones_detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `personalizaciones_producto`
--

LOCK TABLES `personalizaciones_producto` WRITE;
/*!40000 ALTER TABLE `personalizaciones_producto` DISABLE KEYS */;
INSERT INTO `personalizaciones_producto` VALUES (5,1,'Salsa Verde',0.00,1,'Salsa'),(6,1,'Salsa Roja',0.00,1,'Salsa'),(7,1,'Extra Queso',10.00,0,'Extras'),(8,1,'Extra Pollo',15.00,0,'Extras');
/*!40000 ALTER TABLE `personalizaciones_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `preferencias_dieteticas`
--

LOCK TABLES `preferencias_dieteticas` WRITE;
/*!40000 ALTER TABLE `preferencias_dieteticas` DISABLE KEYS */;
INSERT INTO `preferencias_dieteticas` VALUES (1,'Cacahuate','alergia'),(2,'Gluten','alergia'),(3,'Lactosa','alergia'),(4,'Huevo','alergia'),(5,'Vegano','estilo_vida'),(6,'Vegetariano','estilo_vida'),(7,'Keto','estilo_vida');
/*!40000 ALTER TABLE `preferencias_dieteticas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `preferencias_usuario`
--

LOCK TABLES `preferencias_usuario` WRITE;
/*!40000 ALTER TABLE `preferencias_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `preferencias_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,2,'Chilaquiles Verdes','Chilaquiles con crema y queso',65.00,50,NULL,1),(2,2,'Hot Cakes','Hot cakes con miel',55.00,40,NULL,1),(3,3,'Torta Cubana','Torta con jamón y salchicha',70.00,30,NULL,1),(4,4,'Café Americano','Café recién preparado',30.00,100,'/uploads/1781993059756-cafe_a.jpg',1),(5,5,'Papas Preparadas','Papas con queso y salsa',45.00,25,NULL,1),(6,2,'Molletes Especiales','Molletes con queso y pico de gallo',55.00,80,NULL,1),(7,3,'Cuernito','Rico cuernito de jamón',35.00,50,'/uploads/1781991323119-cuernito.jpg',1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2026-06-26 16:57:27
