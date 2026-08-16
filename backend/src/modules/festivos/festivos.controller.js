const festivosService = require('./festivos.service');

const getUpcoming = async (req, res) => {

    try {

        const festivos = await festivosService.obtenerProximos(
            req.query.limite
        );

        res.json({
            success: true,
            data: festivos
        });

    } catch (error) {

        console.error(error);

        res.status(502).json({
            success: false,
            message: 'No pudimos consultar el calendario de días festivos'
        });

    }

};

module.exports = {
    getUpcoming
};
