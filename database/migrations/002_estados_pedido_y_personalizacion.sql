-- ============================================================
-- Migración 002: ciclo de vida real del pedido y personalización
--                por tipo de comida
-- ------------------------------------------------------------
-- 1. Amplía los estados del pedido para reflejar el flujo real de
--    una cafetería (pago pendiente, confirmación de cocina,
--    rechazo y pedidos que nadie recogió).
-- 2. Agrega bitácora de cambios de estado (quién, cuándo y por qué).
-- 3. Convierte las personalizaciones en grupos configurables
--    (opción única vs. múltiple, mínimos y máximos) y agrega
--    plantillas por categoría para que cada tipo de comida tenga
--    sus propias opciones.
--
-- Todos los cambios son aditivos: no se borra ni se renombra nada
-- que ya estuviera en uso, por lo que es seguro aplicarla sobre una
-- base con datos reales.
-- ============================================================

-- Este archivo está en UTF-8 y trae acentos y eñes ("Tamaño",
-- "Acompañamiento"). En Windows el cliente `mysql` arranca en cp850, y
-- sin esta línea el servidor guardaría "Tama├▒o". No la quites.
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1. Estados del pedido
-- ------------------------------------------------------------

ALTER TABLE `pedidos`
    MODIFY COLUMN `estado` ENUM(
        'pendiente_pago',
        'recibido',
        'confirmado',
        'preparando',
        'listo',
        'entregado',
        'cancelado',
        'rechazado',
        'no_recogido'
    ) NOT NULL DEFAULT 'recibido';

ALTER TABLE `pedidos`
    MODIFY COLUMN `estado_pago` ENUM(
        'pendiente',
        'pagado',
        'cancelado',
        'reembolsado'
    ) NOT NULL DEFAULT 'pendiente';

-- Datos operativos que el personal necesita ver en el tablero.
ALTER TABLE `pedidos`
    ADD COLUMN `tiempo_estimado_min` INT NULL AFTER `estado_pago`,
    ADD COLUMN `notas` VARCHAR(255) NULL AFTER `tiempo_estimado_min`,
    ADD COLUMN `motivo_cancelacion` VARCHAR(255) NULL AFTER `notas`,
    ADD COLUMN `actualizado_en` TIMESTAMP NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
        AFTER `creado_en`;

-- ------------------------------------------------------------
-- 2. Bitácora de estados
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `historial_estados_pedido` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `pedido_id` INT NOT NULL,
    `estado_anterior` VARCHAR(20) NULL,
    `estado_nuevo` VARCHAR(20) NOT NULL,
    `usuario_id` INT NULL,
    `nota` VARCHAR(255) NULL,
    `creado_en` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_historial_pedido` (`pedido_id`),
    CONSTRAINT `historial_estados_pedido_ibfk_1`
        FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `historial_estados_pedido_ibfk_2`
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Los pedidos que ya existían arrancan su bitácora con su estado actual.
INSERT INTO `historial_estados_pedido`
    (`pedido_id`, `estado_anterior`, `estado_nuevo`, `usuario_id`, `nota`, `creado_en`)
SELECT
    p.id,
    NULL,
    p.estado,
    NULL,
    'Registro inicial generado por la migración 002',
    p.creado_en
FROM `pedidos` p
LEFT JOIN `historial_estados_pedido` h
    ON h.pedido_id = p.id
WHERE h.id IS NULL;

-- ------------------------------------------------------------
-- 3. Notas del alumno por producto ("sin cebolla", "poco picante")
-- ------------------------------------------------------------

ALTER TABLE `detalles_pedido`
    ADD COLUMN `notas` VARCHAR(255) NULL AFTER `subtotal`;

-- ------------------------------------------------------------
-- 4. Personalizaciones agrupadas y configurables
-- ------------------------------------------------------------
-- La configuración del grupo (única/múltiple, mínimo y máximo) se
-- guarda repetida en cada opción del grupo. Es una desnormalización
-- deliberada: evita crear una tabla intermedia y romper el código
-- que ya consulta `nombre_grupo`. El backend toma la configuración
-- de la primera opción del grupo.

ALTER TABLE `personalizaciones_producto`
    ADD COLUMN `tipo_grupo` ENUM('unica', 'multiple') NOT NULL DEFAULT 'multiple'
        AFTER `nombre_grupo`,
    ADD COLUMN `min_selecciones` INT NOT NULL DEFAULT 0 AFTER `tipo_grupo`,
    ADD COLUMN `max_selecciones` INT NULL AFTER `min_selecciones`,
    ADD COLUMN `orden` INT NOT NULL DEFAULT 0 AFTER `max_selecciones`,
    ADD COLUMN `orden_opcion` INT NOT NULL DEFAULT 0 AFTER `orden`,
    ADD COLUMN `descripcion` VARCHAR(120) NULL AFTER `orden_opcion`;

-- Las opciones que ya existían quedan como grupo de selección única
-- si estaban marcadas como requeridas.
UPDATE `personalizaciones_producto`
SET `tipo_grupo` = 'unica',
    `min_selecciones` = 1,
    `max_selecciones` = 1
WHERE `es_requerido` = 1;

-- ------------------------------------------------------------
-- 5. Plantillas de personalización por categoría
-- ------------------------------------------------------------
-- Cada categoría (Bebidas, Desayunos, Comidas, Snacks…) define las
-- opciones típicas de ese tipo de comida. Al crear un producto el
-- backend copia la plantilla de su categoría, y el administrador
-- puede ajustarla después producto por producto.

CREATE TABLE IF NOT EXISTS `plantillas_personalizacion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `categoria_id` INT NOT NULL,
    `nombre_grupo` VARCHAR(50) NOT NULL,
    `tipo_grupo` ENUM('unica', 'multiple') NOT NULL DEFAULT 'multiple',
    `es_requerido` TINYINT(1) NOT NULL DEFAULT 0,
    `min_selecciones` INT NOT NULL DEFAULT 0,
    `max_selecciones` INT NULL,
    `orden` INT NOT NULL DEFAULT 0,
    `orden_opcion` INT NOT NULL DEFAULT 0,
    `nombre` VARCHAR(100) NOT NULL,
    `precio_adicional` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `descripcion` VARCHAR(120) NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_plantilla_opcion` (`categoria_id`, `nombre_grupo`, `nombre`),
    CONSTRAINT `plantillas_personalizacion_ibfk_1`
        FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT IGNORE INTO `plantillas_personalizacion`
    (`categoria_id`, `nombre_grupo`, `tipo_grupo`, `es_requerido`,
     `min_selecciones`, `max_selecciones`, `orden`, `orden_opcion`,
     `nombre`, `precio_adicional`, `descripcion`)
VALUES
    -- Populares (1): opciones genéricas
    (1, 'Extras', 'multiple', 0, 0, 3, 1, 1, 'Extra queso', 10.00, NULL),
    (1, 'Extras', 'multiple', 0, 0, 3, 1, 2, 'Porción extra', 18.00, NULL),
    (1, 'Sin ingredientes', 'multiple', 0, 0, 4, 2, 1, 'Sin cebolla', 0.00, NULL),
    (1, 'Sin ingredientes', 'multiple', 0, 0, 4, 2, 2, 'Sin crema', 0.00, NULL),
    (1, 'Sin ingredientes', 'multiple', 0, 0, 4, 2, 3, 'Sin picante', 0.00, NULL),

    -- Desayunos (2)
    (2, 'Salsa', 'unica', 1, 1, 1, 1, 1, 'Salsa verde', 0.00, 'La de casa, medianamente picante'),
    (2, 'Salsa', 'unica', 1, 1, 1, 1, 2, 'Salsa roja', 0.00, 'Con chile de árbol'),
    (2, 'Salsa', 'unica', 1, 1, 1, 1, 3, 'Sin salsa', 0.00, NULL),
    (2, 'Nivel de picante', 'unica', 1, 1, 1, 2, 1, 'Suave', 0.00, NULL),
    (2, 'Nivel de picante', 'unica', 1, 1, 1, 2, 2, 'Medio', 0.00, NULL),
    (2, 'Nivel de picante', 'unica', 1, 1, 1, 2, 3, 'Bien picoso', 0.00, NULL),
    (2, 'Acompañamiento', 'unica', 0, 0, 1, 3, 1, 'Frijoles refritos', 12.00, NULL),
    (2, 'Acompañamiento', 'unica', 0, 0, 1, 3, 2, 'Papas cambray', 15.00, NULL),
    (2, 'Extras', 'multiple', 0, 0, 3, 4, 1, 'Extra queso', 10.00, NULL),
    (2, 'Extras', 'multiple', 0, 0, 3, 4, 2, 'Extra pollo', 15.00, NULL),
    (2, 'Extras', 'multiple', 0, 0, 3, 4, 3, 'Huevo estrellado', 8.00, NULL),
    (2, 'Extras', 'multiple', 0, 0, 3, 4, 4, 'Aguacate', 12.00, NULL),

    -- Comidas (3)
    (3, 'Tipo de pan', 'unica', 1, 1, 1, 1, 1, 'Bolillo', 0.00, NULL),
    (3, 'Tipo de pan', 'unica', 1, 1, 1, 1, 2, 'Telera', 0.00, NULL),
    (3, 'Tipo de pan', 'unica', 1, 1, 1, 1, 3, 'Pan integral', 5.00, NULL),
    (3, 'Salsa', 'unica', 1, 1, 1, 2, 1, 'Chipotle', 0.00, NULL),
    (3, 'Salsa', 'unica', 1, 1, 1, 2, 2, 'Verde', 0.00, NULL),
    (3, 'Salsa', 'unica', 1, 1, 1, 2, 3, 'Sin salsa', 0.00, NULL),
    (3, 'Extras', 'multiple', 0, 0, 4, 3, 1, 'Extra queso', 10.00, NULL),
    (3, 'Extras', 'multiple', 0, 0, 4, 3, 2, 'Aguacate', 12.00, NULL),
    (3, 'Extras', 'multiple', 0, 0, 4, 3, 3, 'Doble carne', 22.00, NULL),
    (3, 'Extras', 'multiple', 0, 0, 4, 3, 4, 'Jalapeños', 5.00, NULL),
    (3, 'Sin ingredientes', 'multiple', 0, 0, 4, 4, 1, 'Sin cebolla', 0.00, NULL),
    (3, 'Sin ingredientes', 'multiple', 0, 0, 4, 4, 2, 'Sin jitomate', 0.00, NULL),
    (3, 'Sin ingredientes', 'multiple', 0, 0, 4, 4, 3, 'Sin mayonesa', 0.00, NULL),

    -- Bebidas (4)
    (4, 'Tamaño', 'unica', 1, 1, 1, 1, 1, 'Chico 355 ml', 0.00, NULL),
    (4, 'Tamaño', 'unica', 1, 1, 1, 1, 2, 'Mediano 473 ml', 8.00, NULL),
    (4, 'Tamaño', 'unica', 1, 1, 1, 1, 3, 'Grande 591 ml', 15.00, NULL),
    (4, 'Temperatura', 'unica', 1, 1, 1, 2, 1, 'Caliente', 0.00, NULL),
    (4, 'Temperatura', 'unica', 1, 1, 1, 2, 2, 'Con hielo', 0.00, NULL),
    (4, 'Tipo de leche', 'unica', 0, 0, 1, 3, 1, 'Entera', 0.00, NULL),
    (4, 'Tipo de leche', 'unica', 0, 0, 1, 3, 2, 'Deslactosada', 7.00, NULL),
    (4, 'Tipo de leche', 'unica', 0, 0, 1, 3, 3, 'De almendra', 12.00, NULL),
    (4, 'Endulzante', 'multiple', 0, 0, 2, 4, 1, 'Azúcar', 0.00, NULL),
    (4, 'Endulzante', 'multiple', 0, 0, 2, 4, 2, 'Splenda', 0.00, NULL),
    (4, 'Endulzante', 'multiple', 0, 0, 2, 4, 3, 'Miel de abeja', 5.00, NULL),
    (4, 'Extras', 'multiple', 0, 0, 3, 5, 1, 'Shot extra de café', 12.00, NULL),
    (4, 'Extras', 'multiple', 0, 0, 3, 5, 2, 'Canela', 0.00, NULL),
    (4, 'Extras', 'multiple', 0, 0, 3, 5, 3, 'Crema batida', 10.00, NULL),

    -- Snacks (5)
    (5, 'Tamaño', 'unica', 1, 1, 1, 1, 1, 'Individual', 0.00, NULL),
    (5, 'Tamaño', 'unica', 1, 1, 1, 1, 2, 'Para compartir', 18.00, NULL),
    (5, 'Toppings', 'multiple', 0, 0, 4, 2, 1, 'Queso amarillo', 8.00, NULL),
    (5, 'Toppings', 'multiple', 0, 0, 4, 2, 2, 'Chile en polvo', 0.00, NULL),
    (5, 'Toppings', 'multiple', 0, 0, 4, 2, 3, 'Salsa Valentina', 0.00, NULL),
    (5, 'Toppings', 'multiple', 0, 0, 4, 2, 4, 'Cueritos', 10.00, NULL),
    (5, 'Toppings', 'multiple', 0, 0, 4, 2, 5, 'Cacahuates', 6.00, NULL);

-- ------------------------------------------------------------
-- 6a. Alinear las opciones que ya existían con su plantilla
-- ------------------------------------------------------------
-- Las opciones capturadas a mano antes de esta migración no tienen
-- orden ni configuración de grupo. Si coinciden con una opción de la
-- plantilla de su categoría, heredan esos datos para que aparezcan
-- junto al resto de su grupo y en el orden correcto.

UPDATE `personalizaciones_producto` pp
INNER JOIN `productos` p
    ON p.id = pp.producto_id
INNER JOIN `plantillas_personalizacion` t
    ON t.categoria_id = p.categoria_id
    AND t.nombre_grupo = pp.nombre_grupo
    AND t.nombre = pp.nombre
SET
    pp.tipo_grupo = t.tipo_grupo,
    pp.es_requerido = t.es_requerido,
    pp.min_selecciones = t.min_selecciones,
    pp.max_selecciones = t.max_selecciones,
    pp.orden = t.orden,
    pp.orden_opcion = t.orden_opcion,
    pp.descripcion = COALESCE(pp.descripcion, t.descripcion);

-- ------------------------------------------------------------
-- 6b. Materializar las plantillas en los productos existentes
-- ------------------------------------------------------------
-- Se copian solo las opciones que el producto todavía no tiene, así
-- las personalizaciones que el administrador ya había capturado a
-- mano se conservan intactas.

INSERT INTO `personalizaciones_producto`
    (`producto_id`, `nombre`, `precio_adicional`, `es_requerido`,
     `nombre_grupo`, `tipo_grupo`, `min_selecciones`, `max_selecciones`,
     `orden`, `orden_opcion`, `descripcion`)
SELECT
    p.id,
    t.nombre,
    t.precio_adicional,
    t.es_requerido,
    t.nombre_grupo,
    t.tipo_grupo,
    t.min_selecciones,
    t.max_selecciones,
    t.orden,
    t.orden_opcion,
    t.descripcion
FROM `plantillas_personalizacion` t
INNER JOIN `productos` p
    ON p.categoria_id = t.categoria_id
LEFT JOIN `personalizaciones_producto` pp
    ON pp.producto_id = p.id
    AND pp.nombre_grupo = t.nombre_grupo
    AND pp.nombre = t.nombre
WHERE pp.id IS NULL;
