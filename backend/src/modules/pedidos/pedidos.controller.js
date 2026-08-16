const pedidosService =
require('./pedidos.service');

const eventBus =
require('../../realtime/eventBus');

const {
    obtenerCatalogo
} = require('./pedidos.estados');

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

        /*
         Los errores al crear un pedido son de validación (producto
         agotado, personalización obligatoria, cupón vencido…), así que
         se responden como 400 para que la app los muestre tal cual.
        */
        res.status(400).json({
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
                req.user
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
            await pedidosService.getAllOrders({
                estado: req.query.estado,
                busqueda: req.query.busqueda,
                soloActivos: req.query.activos === 'true'
            });

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

const getOrdersSummary = async (
    req,
    res
) => {

    try {

        const resumen =
            await pedidosService.getOrdersSummary();

        res.json({
            success: true,
            data: resumen
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getStatusCatalog = (
    req,
    res
) => {

    res.json({
        success: true,
        data: obtenerCatalogo(req.user.rol)
    });

};

const getOrderHistory = async (
    req,
    res
) => {

    try {

        const historial =
            await pedidosService.getOrderHistory(
                req.params.id,
                req.user
            );

        res.json({
            success: true,
            data: historial
        });

    } catch (error) {

        res.status(404).json({
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
                req.body,
                req.user
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

const cancelOrder = async (
    req,
    res
) => {

    try {

        const resultado =
            await pedidosService.cancelOrderByUser(
                req.params.id,
                req.user,
                req.body.motivo
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

const confirmPayment = async (
    req,
    res
) => {

    try {

        const resultado =
            await pedidosService.confirmPayment(
                req.params.id,
                req.user
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

/**
 * Ticket de un solo uso para abrir el stream SSE. EventSource no puede
 * mandar el header Authorization, así que el cliente cambia su JWT por
 * este ticket efímero.
 */
const createStreamTicket = (
    req,
    res
) => {

    res.json({
        success: true,
        data: eventBus.crearTicket(req.user)
    });

};

/**
 * Stream Server-Sent Events con los cambios de estado en vivo.
 * El personal recibe todos los pedidos; el alumno solo los suyos.
 */
const streamOrders = (
    req,
    res
) => {

    const usuario =
        eventBus.consumirTicket(req.query.ticket);

    if (!usuario) {

        return res.status(401).json({
            success: false,
            message: 'Ticket de conexión inválido o vencido'
        });

    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no'
    });

    const enviar = (evento, datos) => {

        res.write(`event: ${evento}\n`);
        res.write(`data: ${JSON.stringify(datos)}\n\n`);

    };

    enviar('conectado', {
        rol: usuario.rol,
        desde: new Date().toISOString()
    });

    const esPersonal =
        usuario.rol === 'admin' ||
        usuario.rol === 'empleado';

    const cancelarSuscripcion = eventBus.suscribir((evento) => {

        if (
            !esPersonal &&
            evento.usuarioId !== usuario.id
        ) {

            return;

        }

        enviar('pedido', evento);

    });

    /*
     Comentario periódico para que proxies y navegadores no cierren la
     conexión por inactividad.
    */
    const latido = setInterval(() => {
        res.write(': latido\n\n');
    }, 25000);

    req.on('close', () => {
        clearInterval(latido);
        cancelarSuscripcion();
        res.end();
    });

};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    getOrdersSummary,
    getStatusCatalog,
    getOrderHistory,
    updateOrderStatus,
    cancelOrder,
    confirmPayment,
    createStreamTicket,
    streamOrders
};
