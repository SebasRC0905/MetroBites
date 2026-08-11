import api from "../api/axios";

const getFavorites = async () => {
  const response = await api.get("/favoritos");

  return response.data;
};

const addFavorite = async (productoId) => {
  const response = await api.post("/favoritos", { producto_id: productoId });

  return response.data;
};

const removeFavorite = async (productoId) => {
  const response = await api.delete(`/favoritos/${productoId}`);

  return response.data;
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};
