const express = require('express');

const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validationMiddleware');
const crearLimitador = require('../../middleware/rateLimitMiddleware');

const {
    registerValidator,
    loginValidator
} = require('./auth.validators');

/*
 Los endpoints de credenciales se limitan por IP para que nadie pueda
 probar contraseñas a fuerza bruta desde el mismo equipo.
*/
const limitarLogin = crearLimitador({
    intentos: 10,
    ventanaMs: 10 * 60 * 1000,
    mensaje: 'Demasiados intentos de inicio de sesión. Espera unos minutos.'
});

const limitarRegistro = crearLimitador({
    intentos: 5,
    ventanaMs: 60 * 60 * 1000,
    mensaje: 'Demasiadas cuentas creadas desde este equipo. Intenta más tarde.'
});

router.get('/test-db', async (req, res) => {
    const pool = require('../../config/database');

    try {
        const [rows] = await pool.query(
            'SELECT DATABASE() AS bd'
        );

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post(
    '/register',
    limitarRegistro,
    registerValidator,
    validate,
    authController.register
);
router.post(
    '/login',
    limitarLogin,
    loginValidator,
    validate,
    authController.login
);
router.get(
    '/profile',
    authMiddleware,
    authController.profile
);
module.exports = router;
