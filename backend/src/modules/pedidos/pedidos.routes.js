const express = require('express');

const router = express.Router();

const authMiddleware =require('../../middleware/authMiddleware');
const roleMiddleware =require('../../middleware/roleMiddleware');
const pedidosController =require('./pedidos.controller');

router.get(
    '/mis-pedidos',
    authMiddleware,
    pedidosController.getUserOrders
);
router.get(
    '/admin',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    pedidosController.getAllOrders
);
router.patch(
    '/:id/estado',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    pedidosController.updateOrderStatus
);
router.get(
    '/:id',
    authMiddleware,
    pedidosController.getOrderById
);
router.post(
    '/',
    authMiddleware,
    pedidosController.createOrder
);
module.exports = router;