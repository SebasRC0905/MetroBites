import api from "../api/axios";

const getSummary = async () => {
  const response = await api.get("/dashboard/resumen");

  return response.data;
};

const getTopProducts = async () => {
  const response = await api.get("/dashboard/top-productos");

  return response.data;
};

const getTodaySales = async () => {
  const response = await api.get("/dashboard/ventas-hoy");

  return response.data;
};

export default {
  getSummary,
  getTopProducts,
  getTodaySales,
};
