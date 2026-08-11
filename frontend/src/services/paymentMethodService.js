import api from "../api/axios";

const getMethods = async () => {
  const response = await api.get("/metodos-pago");

  return response.data;
};

const createMethod = async (data) => {
  const response = await api.post("/metodos-pago", data);

  return response.data;
};

const setDefaultMethod = async (id) => {
  const response = await api.patch(`/metodos-pago/${id}/predeterminado`);

  return response.data;
};

const deleteMethod = async (id) => {
  const response = await api.delete(`/metodos-pago/${id}`);

  return response.data;
};

export default {
  getMethods,
  createMethod,
  setDefaultMethod,
  deleteMethod,
};
