const { body } = require('express-validator');

const {
    MENSAJE_CONTRASENA,
    MENSAJE_CORREO_INSTITUCIONAL,
    esContrasenaSegura,
    esCorreoInstitucional
} = require('../../utils/validaciones');

/**
 * Reglas del registro público.
 *
 * La más importante: el correo tiene que ser institucional. Sin eso no
 * se crea la cuenta, aunque el formulario del navegador diga otra cosa.
 */
const registerValidator = [

    body('nombre')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Escribe tu nombre completo'),

    body('matricula')
        .trim()
        .matches(/^[A-Za-z0-9-]{4,20}$/)
        .withMessage('La matrícula solo puede tener letras, números y guiones'),

    body('correo')
        .trim()
        .custom((valor) => esCorreoInstitucional(valor))
        .withMessage(MENSAJE_CORREO_INSTITUCIONAL),

    body('password')
        .custom((valor) => esContrasenaSegura(valor))
        .withMessage(MENSAJE_CONTRASENA),

    body('carrera')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: 100 })
        .withMessage('El programa educativo no es válido'),

    body('tolerancia_picante')
        .optional({ values: 'falsy' })
        .isIn(['ninguno', 'medio', 'habanero'])
        .withMessage('Nivel de picante no válido')
];

const loginValidator = [

    body('correo')
        .trim()
        .isEmail()
        .withMessage('Escribe un correo válido'),

    body('password')
        .notEmpty()
        .withMessage('Escribe tu contraseña')
];

module.exports = {
    registerValidator,
    loginValidator
};
