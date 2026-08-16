const dashboardService =
require('./dashboard.service');

const getSummary = async (
    req,
    res
) => {

    try {

        const resumen =
            await dashboardService.getSummary();

        res.json({
            success: true,
            data: resumen
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getTopProducts = async (
    req,
    res
) => {

    try {

        const productos =
            await dashboardService.getTopProducts();

        res.json({
            success: true,
            data: productos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getTodaySales = async (
    req,
    res
) => {

    try {

        const ventas =
            await dashboardService.getTodaySales();

        res.json({
            success: true,
            data: ventas
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getSalesByDay = async (
    req,
    res
) => {

    try {

        const serie =
            await dashboardService.getSalesByDay(
                req.query.dias
            );

        res.json({
            success: true,
            data: serie
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getOrdersByHour = async (
    req,
    res
) => {

    try {

        const distribucion =
            await dashboardService.getOrdersByHour();

        res.json({
            success: true,
            data: distribucion
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    getSummary,
    getTopProducts,
    getTodaySales,
    getSalesByDay,
    getOrdersByHour
};