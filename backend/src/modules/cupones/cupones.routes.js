const express = require('express');

const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const cuponesController = require('./cupones.controller');

router.post(
    '/validar',
    authMiddleware,
    cuponesController.validateCoupon
);

router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    cuponesController.getCoupons
);

router.post(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    cuponesController.createCoupon
);

router.delete(
    '/admin/:id',
    authMiddleware,
    roleMiddleware('admin'),
    cuponesController.deleteCoupon
);

module.exports = router;
