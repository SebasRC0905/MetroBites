const express = require('express');

const router = express.Router();

const authMiddleware =
require('../../middleware/authMiddleware');

const usuariosController =
require('./usuarios.controller');

router.get(
    '/perfil',
    authMiddleware,
    usuariosController.getProfile
);

router.patch(
    '/perfil',
    authMiddleware,
    usuariosController.updateProfile
);

module.exports = router;