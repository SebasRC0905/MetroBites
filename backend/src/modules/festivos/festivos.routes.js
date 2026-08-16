const express = require('express');

const router = express.Router();

const festivosController = require('./festivos.controller');

router.get(
    '/proximos',
    festivosController.getUpcoming
);

module.exports = router;
