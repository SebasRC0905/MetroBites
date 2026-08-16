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
/*
 Catálogo de estados (etiquetas, colores y transiciones permitidas
 según el rol). El frontend lo usa para no duplicar las reglas.
*/
router.get(
    '/estados',
    authMiddleware,
    pedidosController.getStatusCatalog
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
router.get(
    '/admin/resumen',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    pedidosController.getOrdersSummary
);
/*
 Tiempo real: primero se pide un ticket con el JWT y luego se abre el
 stream SSE con ese ticket.
*/
router.post(
    '/stream/ticket',
    authMiddleware,
    pedidosController.createStreamTicket
);
router.get(
    '/stream',
    pedidosController.streamOrders
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
router.patch(
    '/:id/cancelar',
    authMiddleware,
    pedidosController.cancelOrder
);
router.patch(
    '/:id/pago',
    authMiddleware,
    pedidosController.confirmPayment
);
router.get(
    '/:id/historial',
    authMiddleware,
    pedidosController.getOrderHistory
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
