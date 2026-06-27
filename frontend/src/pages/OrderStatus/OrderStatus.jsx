import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import orderService from "../../services/orderService";
import "./OrderStatus.css";

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
    <div className="order-status-container">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <h1>¡Pedido Confirmado!</h1>

        <p>Tu pedido fue recibido correctamente y ya está siendo preparado.</p>
      </div>

      <div className="order-info-card">
        <h2>Información del Pedido</h2>

        <div className="info-row">
          <span>No. Pedido</span>
          <strong>#{order.id}</strong>
        </div>

        <div className="info-row">
          <span>Estado</span>

          <span className="status-badge">{order.estado}</span>
        </div>

        <div className="info-row">
          <span>Total</span>

          <strong>${Number(order.total).toFixed(2)}</strong>
        </div>

        <div className="info-row">
          <span>Código</span>

          <strong>{order.codigo_qr}</strong>
        </div>
      </div>

      <div className="progress-card">
        <h3>Estado del pedido</h3>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>

        <p>Tu pedido está siendo preparado por la cafetería.</p>
      </div>

      <div className="next-step-card">
        <h3>¿Qué sigue?</h3>

        <p>
          Cuando el pedido esté listo podrás pasar a recogerlo en la cafetería
          durante el horario seleccionado.
        </p>

        <div className="buttons">
          <button
            className="secondary-btn"
            onClick={() => navigate("/historial")}
          >
            Ver Mis Pedidos
          </button>

          <button className="primary-btn" onClick={() => navigate("/home")}>
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderStatus;
