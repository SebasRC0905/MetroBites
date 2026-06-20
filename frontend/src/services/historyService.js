import api from '../api/axios';

const getMyOrders =
async () => {

    const response =
        await api.get(
            '/pedidos/mis-pedidos'
        );

    return response.data;
};

export default {
    getMyOrders
};