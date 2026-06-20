const express = require('express');

const router = express.Router();

const authMiddleware =
require('../../middleware/authMiddleware');

const favoritosController =
require('./favoritos.controller');

router.get(
    '/',
    authMiddleware,
    favoritosController.getFavorites
);

router.post(
    '/',
    authMiddleware,
    favoritosController.addFavorite
);

router.delete(
    '/:productoId',
    authMiddleware,
    favoritosController.removeFavorite
);

module.exports = router;