import api from "../api/axios";

const getUsersAdmin = async () => {
  const response = await api.get("/usuarios/admin");

  return response.data;
};

const createUser = async (userData) => {
  const response = await api.post("/usuarios/admin", userData);

  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await api.put(`/usuarios/admin/${id}`, userData);

  return response.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/usuarios/admin/${id}`);

  return response.data;
};

export default {
  getUsersAdmin,
  createUser,
  updateUser,
  deleteUser,
};
