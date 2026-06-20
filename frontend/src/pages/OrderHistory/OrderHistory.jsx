import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import historyService from "../../services/historyService";

function OrderHistory() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await historyService.getMyOrders();

        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrders();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>Mis Pedidos</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",

            padding: "15px",

            marginBottom: "15px",

            borderRadius: "10px",
          }}
        >
          <h3>Orden #{order.id}</h3>

          <p>Estado: {order.estado}</p>

          <p>Total: ${order.total}</p>

          <button onClick={() => navigate(`/order-status/${order.id}`)}>
            Ver pedido
          </button>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
