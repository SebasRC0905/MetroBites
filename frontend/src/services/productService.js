import api
from '../api/axios';

const getProducts =
async () => {

    const response =
        await api.get(
            '/productos'
        );

    return response.data;
};
const getProductDetail =
async (id) => {

    const response =
        await api.get(
            `/productos/detalle/${id}`
        );

    return response.data;
};
export default {
    getProducts,
    getProductDetail
};