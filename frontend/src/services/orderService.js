import api from '../api/axios';

const getOrderById =
async (id) => {

    const response =
        await api.get(
            `/pedidos/${id}`
        );

    return response.data;
};

export default {
    getOrderById
};