import api from "../api/axios";

/**
 * Información nutrimental de referencia (backend → Open Food Facts).
 */
const getByProduct = async (productoId) => {
  const response = await api.get(`/nutricion/producto/${productoId}`);

  return response.data;
};

const search = async (termino) => {
  const response = await api.get("/nutricion/buscar", {
    params: { q: termino },
  });

  return response.data;
};

export default {
  getByProduct,
  search,
};
