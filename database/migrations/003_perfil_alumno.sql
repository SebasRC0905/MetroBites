-- ============================================================
-- Migración 003: perfil del alumno
-- ------------------------------------------------------------
-- Habilita la foto de perfil, un teléfono de contacto para avisos de
-- recolección y la marca de última actualización de la cuenta.
--
-- Las preferencias dietéticas (alergias y estilo de vida) ya existían
-- como tablas desde el diseño original pero nunca se usaban; esta
-- migración solo agrega las que faltaban al catálogo para que el
-- perfil las pueda ofrecer.
--
-- Todos los cambios son aditivos.
-- ============================================================

-- El archivo trae acentos ("Sin azúcar", "Alto en proteína") y en
-- Windows el cliente `mysql` arranca en cp850. Sin esta línea se
-- guardarían mal. No la quites.
SET NAMES utf8mb4;

ALTER TABLE `usuarios`
    ADD COLUMN `url_foto` VARCHAR(255) NULL AFTER `carrera`,
    ADD COLUMN `telefono` VARCHAR(20) NULL AFTER `url_foto`,
    ADD COLUMN `actualizado_en` TIMESTAMP NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
        AFTER `creado_en`;

-- Sin esta llave única, volver a correr el catálogo duplicaría filas.
ALTER TABLE `preferencias_dieteticas`
    ADD UNIQUE KEY `uq_preferencia` (`nombre`, `tipo`);

-- Catálogo de preferencias dietéticas completo.
INSERT IGNORE INTO `preferencias_dieteticas` (`nombre`, `tipo`)
VALUES
    ('Cacahuate', 'alergia'),
    ('Gluten', 'alergia'),
    ('Lactosa', 'alergia'),
    ('Huevo', 'alergia'),
    ('Mariscos', 'alergia'),
    ('Soya', 'alergia'),
    ('Frutos secos', 'alergia'),
    ('Vegano', 'estilo_vida'),
    ('Vegetariano', 'estilo_vida'),
    ('Keto', 'estilo_vida'),
    ('Sin azúcar', 'estilo_vida'),
    ('Alto en proteína', 'estilo_vida');
