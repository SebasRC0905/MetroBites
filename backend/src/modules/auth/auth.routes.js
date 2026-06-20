const express = require('express');

const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/test-db', async (req, res) => {
    const pool = require('../../config/database');

    try {
        const [rows] = await pool.query(
            'SELECT DATABASE() AS bd'
        );

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post(
    '/register',
    authController.register
);
router.post(
    '/login',
    authController.login
);
router.get(
    '/profile',
    authMiddleware,
    authController.profile
);
module.exports = router;