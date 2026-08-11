import api from "../api/axios";

const validateCoupon = async (codigo, subtotal) => {
  const response = await api.post("/cupones/validar", { codigo, subtotal });

  return response.data;
};

const getCouponsAdmin = async () => {
  const response = await api.get("/cupones/admin");

  return response.data;
};

const createCoupon = async (data) => {
  const response = await api.post("/cupones/admin", data);

  return response.data;
};

const deleteCoupon = async (id) => {
  const response = await api.delete(`/cupones/admin/${id}`);

  return response.data;
};

export default {
  validateCoupon,
  getCouponsAdmin,
  createCoupon,
  deleteCoupon,
};
