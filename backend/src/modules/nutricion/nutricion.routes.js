const express = require('express');

const router = express.Router();

const nutricionController = require('./nutricion.controller');

router.get(
    '/buscar',
    nutricionController.search
);

router.get(
    '/producto/:id',
    nutricionController.getByProduct
);

module.exports = router;
