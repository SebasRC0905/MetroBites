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

/** Serie de ventas de los últimos días para la gráfica del panel. */
const getSalesByDay = async (dias = 7) => {
  const response = await api.get("/dashboard/ventas-por-dia", {
    params: { dias },
  });

  return response.data;
};

/** Distribución de pedidos por hora (qué receso satura la cafetería). */
const getOrdersByHour = async () => {
  const response = await api.get("/dashboard/pedidos-por-hora");

  return response.data;
};

export default {
  getSummary,
  getTopProducts,
  getTodaySales,
  getSalesByDay,
  getOrdersByHour,
};
