import api from "../api/axios";

/**
 * Próximos días festivos oficiales de México
 * (backend → Nager.Date). Se usan para avisar cuándo no hay servicio.
 */
const getUpcoming = async (limite = 3) => {
  const response = await api.get("/festivos/proximos", {
    params: { limite },
  });

  return response.data;
};

export default {
  getUpcoming,
};
