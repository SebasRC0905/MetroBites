import api from '../api/axios';

const getProfile = async () => {

    const response =
        await api.get(
            '/usuarios/perfil'
        );

    return response.data;

};

const updateProfile = async (
    data
) => {

    const response =
        await api.patch(
            '/usuarios/perfil',
            data
        );

    return response.data;

};

export default {
    getProfile,
    updateProfile
};