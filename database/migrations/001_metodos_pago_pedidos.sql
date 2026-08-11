-- ============================================================
-- Migración 001: métodos de pago guardados
-- ------------------------------------------------------------
-- Habilita el flujo de "guardar método de pago" (tarjeta de
-- crédito, débito o PayPal) que ya existía como intención en la
-- tabla `metodos_pago` pero nunca se usaba desde el backend.
--
-- Todos los cambios son aditivos (no se elimina ni renombra nada
-- existente), por lo que es seguro aplicarla sobre una base con
-- datos reales.
-- ============================================================

-- 1. Amplía los tipos de método de pago que un alumno puede guardar.
ALTER TABLE `metodos_pago`
    MODIFY COLUMN `tipo` ENUM(
        'efectivo',
        'tarjeta_credito',
        'tarjeta_debito',
        'paypal',
        'transferencia'
    ) NOT NULL;

-- 2. Nombre amigable ("Mi tarjeta BBVA") y marca de método preferido.
ALTER TABLE `metodos_pago`
    ADD COLUMN `alias` VARCHAR(60) NULL AFTER `tipo`,
    ADD COLUMN `predeterminado` TINYINT(1) NOT NULL DEFAULT 0 AFTER `referencia`;

-- 3. Los pedidos pueden apuntar al método guardado que se usó,
--    sin perder el pedido si el usuario borra ese método después.
ALTER TABLE `pedidos`
    ADD COLUMN `metodo_pago_id` INT NULL AFTER `metodo_pago`,
    ADD CONSTRAINT `pedidos_ibfk_4`
        FOREIGN KEY (`metodo_pago_id`)
        REFERENCES `metodos_pago` (`id`)
        ON DELETE SET NULL;

-- 4. PayPal como categoría propia de pago a nivel de pedido
--    (antes solo existía el genérico "tarjeta").
ALTER TABLE `pedidos`
    MODIFY COLUMN `metodo_pago` ENUM(
        'efectivo',
        'tarjeta',
        'paypal',
        'transferencia'
    ) NOT NULL;
