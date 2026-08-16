import api from '../api/axios';

const getProfile = async () => {

    const response =
        await api.get(
            '/usuarios/perfil'
        );

    return response.data;

};

/**
 * Actualiza solo lo que se le mande (nombre, carrera, teléfono,
 * tolerancia al picante y/o preferencias dietéticas).
 */
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

/** Catálogo de alergias y estilos de vida. */
const getPreferencias = async () => {

    const response =
        await api.get('/usuarios/preferencias');

    return response.data;

};

const uploadPhoto = async (file) => {

    const formData = new FormData();

    formData.append('imagen', file);

    const response =
        await api.post(
            '/usuarios/perfil/foto',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

    return response.data;

};

const deletePhoto = async () => {

    const response =
        await api.delete('/usuarios/perfil/foto');

    return response.data;

};

const changePassword = async (actual, nueva) => {

    const response =
        await api.patch(
            '/usuarios/perfil/password',
            { actual, nueva }
        );

    return response.data;

};

export default {
    getProfile,
    updateProfile,
    getPreferencias,
    uploadPhoto,
    deletePhoto,
    changePassword
};
