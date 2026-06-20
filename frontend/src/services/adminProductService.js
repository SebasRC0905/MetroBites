import api from "../api/axios";

const getProductsAdmin = async () => {

    const response =
        await api.get(
            "/productos/admin"
        );

    return response.data;

};

const createProduct = async (
    productData
) => {

    const response =
        await api.post(
            "/productos",
            productData
        );

    return response.data;

};

const updateProduct = async (
    id,
    productData
) => {

    const response =
        await api.put(
            `/productos/${id}`,
            productData
        );

    return response.data;

};

const toggleAvailability = async (
    id,
    disponible
) => {

    const response =
        await api.patch(
            `/productos/${id}/disponible`,
            {
                disponible
            }
        );

    return response.data;

};

export default {
    getProductsAdmin,
    createProduct,
    updateProduct,
    toggleAvailability
};