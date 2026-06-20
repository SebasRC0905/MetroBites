const categoriasService = require('./categorias.service');

const getCategories = async (req, res) => {

    try {

        const categorias =
            await categoriasService.getAllCategories();

        res.json({
            success: true,
            data: categorias
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getCategories
};