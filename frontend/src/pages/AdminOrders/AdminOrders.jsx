import { useEffect, useState } from "react";

import adminOrderService from "../../services/adminOrderService";

import "./AdminOrders.css";

const statusLabels = {
  recibido: "Recibido",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const statusTransitions = {
  recibido: ["recibido", "preparando", "cancelado"],
  preparando: ["preparando", "listo", "cancelado"],
  listo: ["listo", "entregado"],
  entregado: ["entregado"],
  cancelado: ["cancelado"],
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      const response = await adminOrderService.getOrdersAdmin();

      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (order, estado) => {
    if (estado === order.estado) {
      return;
    }

    try {
      setUpdatingId(order.id);

      await adminOrderService.updateOrderStatus(order.id, estado);

      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? {
                ...item,
                estado,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error al actualizar pedido");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const activeOrders = orders.filter(
    (order) => !["entregado", "cancelado"].includes(order.estado),
  ).length;

  const totalSales = orders.reduce(
    (acc, order) => acc + Number(order.total || 0),
    0,
  );

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <div className="admin-title">
          <span className="eyebrow">Operación</span>
          <h1>Administración de pedidos</h1>

          <p>Cambia el estado de los pedidos y mantén informado al alumno.</p>
        </div>
      </div>

      <div className="admin-orders-summary">
        <div>
          <span>Pedidos</span>
          <strong>{orders.length}</strong>
        </div>

        <div>
          <span>Activos</span>
          <strong>{activeOrders}</strong>
        </div>

        <div>
          <span>Total vendido</span>
          <strong>${totalSales.toFixed(2)}</strong>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <div className="admin-empty-state">
          <h2>No hay pedidos todavía</h2>
          <p>Cuando los alumnos generen pedidos aparecerán aquí.</p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-top">
                <div>
                  <span className="admin-order-number">Pedido #{order.id}</span>
                  <h2>{order.cliente}</h2>
                </div>

                <span className={`order-status-badge ${order.estado}`}>
                  {statusLabels[order.estado] || order.estado}
                </span>
              </div>

              <div className="admin-order-meta">
                <div>
                  <span>Matrícula</span>
                  <strong>{order.matricula}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>${Number(order.total).toFixed(2)}</strong>
                </div>

                <div>
                  <span>Pago</span>
                  <strong>{order.metodo_pago}</strong>
                </div>

                <div>
                  <span>Creado</span>
                  <strong>{formatDate(order.creado_en)}</strong>
                </div>
              </div>

              <label className="admin-field admin-status-field">
                <span>Estado del pedido</span>
                <select
                  value={order.estado}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order, e.target.value)}
                >
                  {statusTransitions[order.estado].map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-order-code">
                <span>Código</span>
                <strong>{order.codigo_qr}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
