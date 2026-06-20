const pedidosService =
require('./pedidos.service');

const createOrder = async (
    req,
    res
) => {

    try {

        const pedido =
            await pedidosService.createOrder(
                req.user.id,
                req.body
            );

        res.status(201).json({
            success: true,
            data: pedido
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getUserOrders = async (
    req,
    res
) => {

    try {

        const pedidos =
            await pedidosService.getUserOrders(
                req.user.id
            );

        res.json({
            success: true,
            data: pedidos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getOrderById = async (
    req,
    res
) => {

    try {

        const pedido =
            await pedidosService.getOrderById(
                req.params.id,
                req.user.id
            );

        res.json({
            success: true,
            data: pedido
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }
};
const getAllOrders = async (
    req,
    res
) => {

    try {

        const pedidos =
            await pedidosService.getAllOrders();

        res.json({
            success: true,
            data: pedidos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const updateOrderStatus = async (
    req,
    res
) => {

    try {

        const resultado =
            await pedidosService.updateOrderStatus(
                req.params.id,
                req.body.estado
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
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};