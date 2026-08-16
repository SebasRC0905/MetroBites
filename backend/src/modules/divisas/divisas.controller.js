const divisasService = require('./divisas.service');

const getRates = async (req, res) => {

    try {

        const tasas = await divisasService.obtenerTasas();

        res.json({
            success: true,
            data: tasas
        });

    } catch (error) {

        console.error(error);

        res.status(502).json({
            success: false,
            message: 'No pudimos obtener el tipo de cambio en este momento'
        });

    }

};

const convert = async (req, res) => {

    try {

        const resultado = await divisasService.convertir(
            req.query.monto,
            req.query.moneda
        );

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getRates,
    convert
};
