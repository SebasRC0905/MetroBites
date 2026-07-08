const express = require('express');

const router = express.Router();

const authMiddleware =
require('../../middleware/authMiddleware');

const roleMiddleware =
require('../../middleware/roleMiddleware');

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

router.get(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.getAllUsersAdmin
);

router.post(
    '/admin',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.createUserAdmin
);

router.put(
    '/admin/:id',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.updateUserAdmin
);

router.delete(
    '/admin/:id',
    authMiddleware,
    roleMiddleware('admin'),
    usuariosController.deleteUserAdmin
);

module.exports = router;
