import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import orderService from "../../services/orderService";

function OrderStatus() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);

        setOrder(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrder();
  }, [id]);

  if (!order) {
    return <p>Cargando...</p>;
  }

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>¡Tu pedido fue recibido!</h1>

      <h2>Orden #{order.id}</h2>

      <p>Código: {order.codigo_qr}</p>

      <hr />

      <h3>Estado actual</h3>

      <h2>{order.estado}</h2>

      <hr />

      <h3>Total</h3>

      <p>${order.total}</p>

      <button onClick={() => navigate("/home")}>Volver al Inicio</button>
    </div>
  );
}

export default OrderStatus;
