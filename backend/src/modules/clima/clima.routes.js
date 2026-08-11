const express = require('express');

const router = express.Router();

const climaController = require('./clima.controller');

router.get(
    '/actual',
    climaController.getCurrentWeather
);

module.exports = router;
