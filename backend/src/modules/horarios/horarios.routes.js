const express = require('express');

const router = express.Router();

const horariosController =
require('./horarios.controller');

router.get(
    '/',
    horariosController.getSchedules
);

module.exports = router;