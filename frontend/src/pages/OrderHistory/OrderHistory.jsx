import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import historyService from "../../services/historyService";
import "./OrderHistory.css";

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
    <div className="history-container">
      <div className="history-header">
        <span className="eyebrow">Historial</span>
        <h1>Mis pedidos</h1>

        <p>Consulta el historial y estado de todos tus pedidos.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-history">
          <h2>No tienes pedidos todavía</h2>

          <p>Cuando realices tu primer pedido aparecerá aquí.</p>

          <button
            type="button"
            className="history-btn"
            onClick={() => navigate("/home")}
          >
            Ir al menú
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {orders.map((order) => (
            <div key={order.id} className="history-card">
              <div className="history-top">
                <h2>Pedido #{order.id}</h2>

                <span
                  className={`history-status ${order.estado.toLowerCase()}`}
                >
                  {order.estado}
                </span>
              </div>

              <div className="history-info">
                <div>
                  <span>Total</span>

                  <strong>${Number(order.total).toFixed(2)}</strong>
                </div>

                <div>
                  <span>Pedido</span>

                  <strong>#{order.id}</strong>
                </div>
              </div>

              <button
                type="button"
                className="history-btn"
                onClick={() => navigate(`/order-status/${order.id}`)}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
