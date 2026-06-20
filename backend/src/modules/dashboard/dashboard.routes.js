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
module.exports = router;