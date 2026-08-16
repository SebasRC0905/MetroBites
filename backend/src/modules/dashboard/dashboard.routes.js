const express = require('express');

const router = express.Router();

const authMiddleware =
require('../../middleware/authMiddleware');

const roleMiddleware =
require('../../middleware/roleMiddleware');

const dashboardController =
require('./dashboard.controller');

router.get(
    '/resumen',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    dashboardController.getSummary
);
router.get(
    '/top-productos',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    dashboardController.getTopProducts
);
router.get(
    '/ventas-hoy',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    dashboardController.getTodaySales
);
router.get(
    '/ventas-por-dia',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    dashboardController.getSalesByDay
);
router.get(
    '/pedidos-por-hora',
    authMiddleware,
    roleMiddleware(
        'admin',
        'empleado'
    ),
    dashboardController.getOrdersByHour
);
module.exports = router;