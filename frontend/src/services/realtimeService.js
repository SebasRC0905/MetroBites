import api from "../api/axios";

/**
 * Ticket de un solo uso para abrir el stream SSE de pedidos.
 * Vive un minuto y se consume al conectarse.
 */
const crearTicket = async () => {
  const response = await api.post("/pedidos/stream/ticket");

  return response.data;
};

export default {
  crearTicket,
};
