import api from '../api/axios';

const login = async (
    correo,
    password
) => {

    const response =
        await api.post(
            '/auth/login',
            {
                correo,
                password
            }
        );

    return response.data;
};

const register = async (
    userData
) => {

    const response =
        await api.post(
            '/auth/register',
            userData
        );

    return response.data;
};

const getProfile = async () => {

    const response =
        await api.get(
            '/auth/profile'
        );

    return response.data;
};

export default {
    login,
    register,
    getProfile
};