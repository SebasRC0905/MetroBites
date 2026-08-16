-- ============================================================
-- Migración 004: reparar acentos mal guardados
-- ------------------------------------------------------------
-- Qué pasó
-- --------
-- El cliente `mysql` de Windows arranca con `character_set_client =
-- cp850` (la página de códigos de la consola). Al importar las
-- migraciones 002 y 003 —que son archivos UTF-8— el servidor
-- interpretó cada byte como cp850 y lo volvió a codificar, así que
-- "Tamaño" quedó guardado como "Tama├▒o" y "Sin azúcar" como
-- "Sin az├║car".
--
-- Solo afecta a los textos insertados desde esos archivos .sql. Lo que
-- escribe la aplicación (pedidos, notas, usuarios) siempre viajó por
-- Node con utf8mb4 y está correcto.
--
-- Cómo se repara
-- --------------
-- Se deshace la doble codificación: el texto se pasa a bytes cp850
-- (que devuelve los bytes UTF-8 originales) y esos bytes se vuelven a
-- leer como utf8mb4.
--
-- El filtro `LIKE '%├%' OR LIKE '%┬%'` es la firma del problema: en
-- cp850, ├ es el byte 0xC3 y ┬ el 0xC2, que son justamente los primeros
-- bytes de las vocales acentuadas y la ñ en UTF-8. Las filas que ya
-- están bien no se tocan.
--
-- Correrla dos veces no hace daño: después de la primera pasada ya no
-- queda ninguna fila que cumpla el filtro.
-- ============================================================

-- Deja esta sesión en UTF-8 pase lo que pase en la consola.
SET NAMES utf8mb4;

UPDATE `personalizaciones_producto`
SET `nombre_grupo` =
        CONVERT(BINARY(CONVERT(`nombre_grupo` USING cp850)) USING utf8mb4)
WHERE `nombre_grupo` LIKE '%├%'
   OR `nombre_grupo` LIKE '%┬%';

UPDATE `personalizaciones_producto`
SET `nombre` =
        CONVERT(BINARY(CONVERT(`nombre` USING cp850)) USING utf8mb4)
WHERE `nombre` LIKE '%├%'
   OR `nombre` LIKE '%┬%';

UPDATE `personalizaciones_producto`
SET `descripcion` =
        CONVERT(BINARY(CONVERT(`descripcion` USING cp850)) USING utf8mb4)
WHERE `descripcion` LIKE '%├%'
   OR `descripcion` LIKE '%┬%';

UPDATE `plantillas_personalizacion`
SET `nombre_grupo` =
        CONVERT(BINARY(CONVERT(`nombre_grupo` USING cp850)) USING utf8mb4)
WHERE `nombre_grupo` LIKE '%├%'
   OR `nombre_grupo` LIKE '%┬%';

UPDATE `plantillas_personalizacion`
SET `nombre` =
        CONVERT(BINARY(CONVERT(`nombre` USING cp850)) USING utf8mb4)
WHERE `nombre` LIKE '%├%'
   OR `nombre` LIKE '%┬%';

UPDATE `plantillas_personalizacion`
SET `descripcion` =
        CONVERT(BINARY(CONVERT(`descripcion` USING cp850)) USING utf8mb4)
WHERE `descripcion` LIKE '%├%'
   OR `descripcion` LIKE '%┬%';

UPDATE `preferencias_dieteticas`
SET `nombre` =
        CONVERT(BINARY(CONVERT(`nombre` USING cp850)) USING utf8mb4)
WHERE `nombre` LIKE '%├%'
   OR `nombre` LIKE '%┬%';

UPDATE `historial_estados_pedido`
SET `nota` =
        CONVERT(BINARY(CONVERT(`nota` USING cp850)) USING utf8mb4)
WHERE `nota` LIKE '%├%'
   OR `nota` LIKE '%┬%';

-- Por si alguna nota de pedido se capturó desde la consola.
UPDATE `pedidos`
SET `notas` =
        CONVERT(BINARY(CONVERT(`notas` USING cp850)) USING utf8mb4)
WHERE `notas` LIKE '%├%'
   OR `notas` LIKE '%┬%';

UPDATE `pedidos`
SET `motivo_cancelacion` =
        CONVERT(BINARY(CONVERT(`motivo_cancelacion` USING cp850)) USING utf8mb4)
WHERE `motivo_cancelacion` LIKE '%├%'
   OR `motivo_cancelacion` LIKE '%┬%';

UPDATE `detalles_pedido`
SET `notas` =
        CONVERT(BINARY(CONVERT(`notas` USING cp850)) USING utf8mb4)
WHERE `notas` LIKE '%├%'
   OR `notas` LIKE '%┬%';
