const { validationResult } = require('express-validator');

/**
 * Corta la petición cuando alguna regla de express-validator falló y
 * responde siempre con la misma forma:
 *
 *   { success: false, message: "<primer error>", errores: [...] }
 *
 * El frontend ya muestra `message` en un toast, así que con esto los
 * errores de validación se ven igual que los del resto de la API.
 */
const validate = (req, res, next) => {

    const resultado = validationResult(req);

    if (resultado.isEmpty()) {
        return next();
    }

    const errores = resultado.array();

    return res.status(400).json({
        success: false,
        message: errores[0].msg,
        errores: errores.map((error) => ({
            campo: error.path,
            mensaje: error.msg
        }))
    });

};

module.exports = validate;
