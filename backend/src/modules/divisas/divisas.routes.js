const express = require('express');

const router = express.Router();

const divisasController = require('./divisas.controller');

router.get(
    '/tasas',
    divisasController.getRates
);

router.get(
    '/convertir',
    divisasController.convert
);

module.exports = router;
