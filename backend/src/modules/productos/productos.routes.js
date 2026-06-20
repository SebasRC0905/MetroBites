const express = require('express');

const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const productosController =
require('./productos.controller');

router.get(
    '/',
    productosController.getProducts
);

router.get(
    '/categoria/:id',
    productosController.getProductsByCategory
);

router.get(
    '/detalle/:id',
    productosController.getProduct
);
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    productosController.createProduct
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    productosController.updateProduct
);

router.patch(
    '/:id/disponible',
    authMiddleware,
    roleMiddleware('admin'),
    productosController.toggleProductAvailability
);
router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    productosController.getProductsAdmin
);
module.exports = router;