import api from '../api/axios';

const getHorarios =
async () => {

    const response =
        await api.get(
            '/horarios'
        );

    return response.data;
};

export default {
    getHorarios
};