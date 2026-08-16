import api from '../api/axios';

const getOrderById =
async (id) => {

    const response =
        await api.get(
            `/pedidos/${id}`
        );

    return response.data;
};

/**
 * Catálogo de estados: etiquetas, colores, orden del tablero y las
 * transiciones permitidas para el rol de quien pregunta.
 */
const getStatusCatalog = async () => {

    const response =
        await api.get('/pedidos/estados');

    return response.data;
};

const getOrderHistory = async (id) => {

    const response =
        await api.get(`/pedidos/${id}/historial`);

    return response.data;
};

/** Cancelación desde la app del alumno (solo antes de cocina). */
const cancelOrder = async (id, motivo) => {

    const response =
        await api.patch(`/pedidos/${id}/cancelar`, {
            motivo
        });

    return response.data;
};

/** Confirma el pago de un pedido que quedó en "pago pendiente". */
const confirmPayment = async (id) => {

    const response =
        await api.patch(`/pedidos/${id}/pago`);

    return response.data;
};

export default {
    getOrderById,
    getStatusCatalog,
    getOrderHistory,
    cancelOrder,
    confirmPayment
};
