const express = require('express');

const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const metodosPagoController = require('./metodosPago.controller');

router.get(
    '/',
    authMiddleware,
    metodosPagoController.getMethods
);

router.post(
    '/',
    authMiddleware,
    metodosPagoController.createMethod
);

router.patch(
    '/:id/predeterminado',
    authMiddleware,
    metodosPagoController.setDefaultMethod
);

router.delete(
    '/:id',
    authMiddleware,
    metodosPagoController.deleteMethod
);

module.exports = router;
