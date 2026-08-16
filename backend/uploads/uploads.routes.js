const express =
require('express');

const router =
express.Router();

const upload =
require('../src/middleware/uploadMiddleware');

const authMiddleware =
require('../src/middleware/authMiddleware');

/*
 Subir archivos exige sesión: sin esto cualquiera en la red podría
 llenar el disco del servidor con imágenes.
*/
router.post(
    '/',
    authMiddleware,
    upload.single(
        'imagen'
    ),
    (
        req,
        res
    ) => {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: 'No se recibió ninguna imagen'
            });

        }

        res.json({

            success: true,

            imageUrl:
                `/uploads/${req.file.filename}`

        });

    }
);

module.exports =
router;
