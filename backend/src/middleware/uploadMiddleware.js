const path = require('path');
const crypto = require('crypto');

const multer = require('multer');

/**
 * Subida de imágenes (productos y fotos de perfil).
 *
 * Reglas:
 *  - Solo imágenes reales (jpg, png, webp, gif) por tipo MIME y por
 *    extensión: confiar solo en el nombre del archivo permitiría subir
 *    un script disfrazado.
 *  - Máximo 3 MB y un archivo por petición.
 *  - Nombre generado al azar: el nombre original del usuario nunca
 *    toca el disco, así no hay forma de escribir fuera de /uploads.
 */

const TIPOS_PERMITIDOS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const LIMITE_BYTES = 3 * 1024 * 1024;

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/');

    },

    filename: (req, file, cb) => {

        const extension =
            TIPOS_PERMITIDOS[file.mimetype] ||
            path.extname(file.originalname).toLowerCase();

        const aleatorio = crypto.randomBytes(8).toString('hex');

        cb(null, `${Date.now()}-${aleatorio}${extension}`);

    }

});

const fileFilter = (req, file, cb) => {

    const extension = path.extname(file.originalname).toLowerCase();

    const tipoValido = Boolean(TIPOS_PERMITIDOS[file.mimetype]);
    const extensionValida = EXTENSIONES_PERMITIDAS.includes(extension);

    if (!tipoValido || !extensionValida) {

        const error = new Error(
            'Solo se permiten imágenes JPG, PNG, WEBP o GIF'
        );

        // Es culpa de lo que se envió, no del servidor.
        error.status = 400;

        return cb(error);

    }

    return cb(null, true);

};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: LIMITE_BYTES,
        files: 1
    }
});

module.exports = upload;
module.exports.LIMITE_BYTES = LIMITE_BYTES;
