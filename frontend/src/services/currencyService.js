import api from "../api/axios";

/**
 * Tipo de cambio del día (backend → Frankfurter / Banco Central Europeo).
 */
const getRates = async () => {
  const response = await api.get("/divisas/tasas");

  return response.data;
};

const convert = async (monto, moneda) => {
  const response = await api.get("/divisas/convertir", {
    params: { monto, moneda },
  });

  return response.data;
};

export default {
  getRates,
  convert,
};
