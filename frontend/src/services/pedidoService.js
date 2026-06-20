import api from '../api/axios';

const createOrder =
async (orderData) => {

    const response =
        await api.post(
            '/pedidos',
            orderData
        );

    return response.data;
};

export default {
    createOrder
};