const climaService = require('./clima.service');

const getCurrentWeather = async (req, res) => {

    try {

        const clima = await climaService.getCurrentWeather();

        res.json({
            success: true,
            data: clima
        });

    } catch (error) {

        console.error(error);

        res.status(502).json({
            success: false,
            message: 'No se pudo obtener el clima en este momento'
        });

    }

};

module.exports = {
    getCurrentWeather
};
