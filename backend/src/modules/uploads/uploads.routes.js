const express =
require('express');

const router =
express.Router();

const upload =
require('../src/middleware/uploadMiddleware');

router.post(
    '/',
    upload.single(
        'imagen'
    ),
    (
        req,
        res
    ) => {

        res.json({

            success: true,

            imageUrl:
                `/uploads/${req.file.filename}`

        });

    }
);

module.exports =
router;