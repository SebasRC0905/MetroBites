const express = require('express');

const router = express.Router();

const categoriasController =
    require('./categorias.controller');

router.get(
    '/',
    categoriasController.getCategories
);

module.exports = router;