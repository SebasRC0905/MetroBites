const horariosService =
require('./horarios.service');

const getSchedules = async (
    req,
    res
) => {

    try {

        const horarios =
            await horariosService.getAllSchedules();

        res.json({
            success: true,
            data: horarios
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getSchedules
};