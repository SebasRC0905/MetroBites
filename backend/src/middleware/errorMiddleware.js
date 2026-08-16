const multer = require('multer');

const { LIMITE_BYTES } = require('./uploadMiddleware');

/**
 * Ruta inexistente: responde JSON en vez del HTML de Express, para que
 * el cliente siempre reciba la misma forma de respuesta.
 */
const notFoundHandler = (req, res) => {

    res.status(404).json({
        success: false,
        message: `La ruta ${req.method} ${req.originalUrl} no existe`
    });

};

/**
 * Último recurso: cualquier error que se escape de un controlador
 * termina aquí. Sin esto, un throw fuera de un try/catch tira la
 * petición sin respuesta y el navegador se queda esperando.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {

    console.error('Error no controlado:', error);

    if (error instanceof multer.MulterError) {

        const mensaje =
            error.code === 'LIMIT_FILE_SIZE'
                ? `La imagen no debe pesar más de ${LIMITE_BYTES / (1024 * 1024)} MB`
                : 'No se pudo procesar el archivo';

        return res.status(400).json({
            success: false,
            message: mensaje
        });

    }

    if (error.type === 'entity.parse.failed') {

        return res.status(400).json({
            success: false,
            message: 'El cuerpo de la petición no es JSON válido'
        });

    }

    const estado = error.status || error.statusCode || 500;

    return res.status(estado).json({
        success: false,
        message:
            estado === 500
                ? 'Ocurrió un error en el servidor'
                : error.message
    });

};

module.exports = {
    notFoundHandler,
    errorHandler
};
