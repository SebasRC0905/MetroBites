import api from "../api/axios";

const getCategories = async () => {

    const response =
        await api.get(
            "/categorias"
        );

    return response.data;

};

export default {
    getCategories
};