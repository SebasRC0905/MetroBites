const nutricionService = require('./nutricion.service');

const getByProduct = async (req, res) => {

    try {

        const nutricion =
            await nutricionService.obtenerPorProducto(
                req.params.id
            );

        res.json({
            success: true,
            data: nutricion
        });

    } catch (error) {

        console.error(error);

        res.status(502).json({
            success: false,
            message:
                'No pudimos obtener la información nutrimental en este momento'
        });

    }

};

const search = async (req, res) => {

    try {

        const nutricion =
            await nutricionService.buscarPorTermino(
                String(req.query.q || '')
            );

        res.json({
            success: true,
            data: nutricion
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getByProduct,
    search
};
