import api from "../api/axios";

/**
 * Pedidos del tablero. Acepta filtros de estado, búsqueda y "solo
 * activos" para no traerse el histórico completo.
 */
const getOrdersAdmin = async (filtros = {}) => {
  const response = await api.get("/pedidos/admin", {
    params: {
      estado: filtros.estado || undefined,
      busqueda: filtros.busqueda || undefined,
      activos: filtros.soloActivos ? "true" : undefined,
    },
  });

  return response.data;
};

/** Contadores por estado e indicadores del día. */
const getOrdersSummary = async () => {
  const response = await api.get("/pedidos/admin/resumen");

  return response.data;
};

/**
 * Mueve un pedido de estado. `nota` es obligatoria al cancelar o
 * rechazar; `tiempoEstimado` es opcional y se muestra al alumno.
 */
const updateOrderStatus = async (id, { estado, nota, tiempoEstimado }) => {
  const response = await api.patch(`/pedidos/${id}/estado`, {
    estado,
    nota,
    tiempo_estimado_min: tiempoEstimado,
  });

  return response.data;
};

const getOrderDetail = async (id) => {
  const response = await api.get(`/pedidos/${id}`);

  return response.data;
};

export default {
  getOrdersAdmin,
  getOrdersSummary,
  updateOrderStatus,
  getOrderDetail,
};
