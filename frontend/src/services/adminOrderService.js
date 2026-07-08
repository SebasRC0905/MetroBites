import api from "../api/axios";

const getOrdersAdmin = async () => {
  const response = await api.get("/pedidos/admin");

  return response.data;
};

const updateOrderStatus = async (id, estado) => {
  const response = await api.patch(`/pedidos/${id}/estado`, {
    estado,
  });

  return response.data;
};

export default {
  getOrdersAdmin,
  updateOrderStatus,
};
