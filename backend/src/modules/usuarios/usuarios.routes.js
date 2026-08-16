const express = require('express');

const router = express.Router();

const { body } = require('express-validator');

const authMiddleware =
require('../../middleware/authMiddleware');

const roleMiddleware =
require('../../middleware/roleMiddleware');

const validate =
require('../../middleware/validationMiddleware');

const upload =
require('../../middleware/uploadMiddleware');

const crearLimitador =
require('../../middleware/rateLimitMiddleware');

const usuariosController =
require('./usuarios.controller');

const {
    MENSAJE_CONTRASENA,
    esContrasenaSegura
} = require('../../utils/validaciones');

/* Catálogo de alergias y estilos de vida (lo consume el perfil). */
router.get(
    '/preferencias',
    authMiddleware,
    usuariosController.getCatalogoPreferencias
);

router.get(
    '/perfil',
    authMiddleware,
    usuariosController.getProfile
);

router.patch(
    '/perfil',
    authMiddleware,
    [
        body('nombre')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('Escribe tu nombre completo'),

        body('telefono')
            .optional({ values: 'falsy' })
            .trim()
            .matches(/^[0-9+\-\s()]{10,20}$/)
            .withMessage('El teléfono debe tener 10 dígitos'),

        body('tolerancia_picante')
            .optional()
            .isIn(['ninguno', 'medio', 'habanero'])
            .withMessage('Nivel de picante no válido'),

        body('preferencias')
            .optional()
            .isArray({ max: 20 })
            .withMessage('Las preferencias no son válidas')
    ],
    validate,
    usuariosController.updateProfile
);

router.post(
    '/perfil/foto',
    authMiddleware,
    upload.single('imagen'),
    usuariosController.updateProfilePhoto
);

router.delete(
    '/perfil/foto',
    authMiddleware,
    usuariosController.deleteProfilePhoto
);

router.patch(
    '/perfil/password',
    authMiddleware,
    crearLimitador({
        intentos: 5,
        ventanaMs: 15 * 60 * 1000,
        mensaje: 'Demasiados intentos de cambio de contraseña. Espera un poco.'
    }),
    [
        body('actual')
            .notEmpty()
            .withMessage('Escribe tu contraseña actual'),

        body('nueva')
            .custom((valor) => esContrasenaSegura(valor))
            .withMessage(MENSAJE_CONTRASENA)
    ],
    validate,
    usuariosController.changePassword
);

router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.getAllUsersAdmin
);

router.post(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.createUserAdmin
);

router.put(
    '/admin/:id',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.updateUserAdmin
);

router.delete(
    '/admin/:id',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.deleteUserAdmin
);

module.exports = router;
