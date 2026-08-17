-- ============================================================
-- Migración 005: catálogo ampliado con fotos
-- ------------------------------------------------------------
-- Agrega 16 productos nuevos repartidos en las cinco categorías y
-- completa la foto de los productos que ya existían sin imagen.
--
-- Las fotos son de Wikimedia Commons (licencias libres), recortadas a
-- 880x605 px —la proporción de la tarjeta del menú— y guardadas en
-- backend/uploads. Los créditos de cada una están en
-- docs/creditos-imagenes.md.
--
-- Al final se copian las plantillas de personalización de cada
-- categoría a los productos nuevos, para que un refresco pida "Tamaño /
-- Temperatura" y una torta pida "Tipo de pan / Salsa" sin capturar nada
-- a mano.
-- ============================================================

SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1. Fotos de los productos que ya existían
-- ------------------------------------------------------------

UPDATE `productos` SET `url_imagen` = '/uploads/chilaquiles-verdes.jpg'
WHERE `id` = 1 AND `url_imagen` IS NULL;

UPDATE `productos` SET `url_imagen` = '/uploads/hot-cakes.jpg'
WHERE `id` = 2 AND `url_imagen` IS NULL;

UPDATE `productos` SET `url_imagen` = '/uploads/torta-cubana.jpg'
WHERE `id` = 3 AND `url_imagen` IS NULL;

UPDATE `productos` SET `url_imagen` = '/uploads/papas-preparadas.jpg'
WHERE `id` = 5 AND `url_imagen` IS NULL;

UPDATE `productos` SET `url_imagen` = '/uploads/molletes-especiales.jpg'
WHERE `id` = 6 AND `url_imagen` IS NULL;

-- ------------------------------------------------------------
-- 2. Productos nuevos
-- ------------------------------------------------------------
-- `INSERT ... SELECT` con `NOT EXISTS`: si la migración se corre dos
-- veces no se duplica el menú.

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 1, 'Quesadillas de Champiñones', 'Dos quesadillas de tortilla azul con queso Oaxaca y champiñones salteados',
       52.00, 40, '/uploads/quesadillas-champinones.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Quesadillas de Champiñones'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 1, 'Hamburguesa Metro', 'Carne de res a la plancha con queso y tocino, acompañada de papas a la francesa',
       89.00, 30, '/uploads/hamburguesa-metro.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Hamburguesa Metro'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 1, 'Pizza Individual', 'Pizza personal de peperoni recién horneada',
       75.00, 25, '/uploads/pizza-individual.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Pizza Individual'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 2, 'Huevos Rancheros', 'Dos huevos estrellados sobre tortilla con salsa de la casa y queso',
       62.00, 45, '/uploads/huevos-rancheros.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Huevos Rancheros'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 2, 'Omelette de Queso', 'Omelette de tres huevos relleno de queso manchego, con pan tostado',
       68.00, 40, '/uploads/omelette-queso.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Omelette de Queso'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 2, 'Tamal Oaxaqueño', 'Tamal de pollo en mole, envuelto en hoja de plátano',
       32.00, 60, '/uploads/tamal-oaxaqueno.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Tamal Oaxaqueño'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 3, 'Orden de Tacos al Pastor', 'Tres tacos con cebolla, cilantro, limón y salsa de la casa',
       65.00, 50, '/uploads/tacos-al-pastor.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Orden de Tacos al Pastor'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 3, 'Enchiladas Verdes', 'Cuatro enchiladas de pollo en salsa verde con crema, queso y aguacate',
       78.00, 35, '/uploads/enchiladas-verdes.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Enchiladas Verdes'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 3, 'Pozole Rojo', 'Plato de pozole con maíz cacahuazintle y guarnición para preparar',
       85.00, 25, '/uploads/pozole-rojo.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Pozole Rojo'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 4, 'Capuchino', 'Espresso con leche vaporizada, espuma cremosa y canela',
       38.00, 80, '/uploads/capuchino.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Capuchino'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 4, 'Agua de Horchata', 'Agua fresca de arroz con canela, preparada del día',
       25.00, 70, '/uploads/agua-horchata.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Agua de Horchata'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 4, 'Chocolate Caliente', 'Chocolate de mesa batido con leche, ideal para los días fríos',
       35.00, 60, '/uploads/chocolate-caliente.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Chocolate Caliente'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 4, 'Agua de Jamaica', 'Agua fresca de flor de jamaica, con o sin azúcar',
       25.00, 70, '/uploads/agua-fresca.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Agua de Jamaica'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 5, 'Esquites', 'Vaso de granos de elote con mayonesa, queso y chile en polvo',
       35.00, 50, '/uploads/esquites.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Esquites'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 5, 'Rebanada de Pastel de Chocolate', 'Rebanada del pastel de chocolate del día, con cobertura de cacao',
       45.00, 20, '/uploads/pastel-chocolate.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Rebanada de Pastel de Chocolate'
);

INSERT INTO `productos`
    (`categoria_id`, `nombre`, `descripcion`, `precio_base`, `stock`, `url_imagen`, `disponible`)
SELECT 5, 'Dona del Día', 'Dona fresca de la charola: glaseada, de chocolate o rellena',
       22.00, 45, '/uploads/dona-glaseada.jpg', 1
WHERE NOT EXISTS (
    SELECT 1 FROM `productos` WHERE `nombre` = 'Dona del Día'
);

-- ------------------------------------------------------------
-- 3. Personalizaciones según la categoría de cada producto
-- ------------------------------------------------------------

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
