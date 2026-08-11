import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import adminOrderService from "../../services/adminOrderService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import { SkeletonGrid } from "../../components/Skeleton";

import "./AdminOrders.css";

const statusLabels = {
  recibido: "Recibido",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const statusTones = {
  recibido: "blue",
  preparando: "amber",
  listo: "violet",
  entregado: "green",
  cancelado: "red",
};

const paymentLabels = {
  tarjeta_credito: "Tarjeta de crédito",
  tarjeta_debito: "Tarjeta de débito",
  paypal: "PayPal",
};

const formatPaymentMethod = (order) => {
  if (order.metodo_pago_tipo) {
    const label = paymentLabels[order.metodo_pago_tipo] || order.metodo_pago;

    return order.metodo_pago_alias
      ? `${label} · ${order.metodo_pago_alias}`
      : label;
  }

  return order.metodo_pago;
};

const statusTransitions = {
  recibido: ["recibido", "preparando", "cancelado"],
  preparando: ["preparando", "listo", "cancelado"],
  listo: ["listo", "entregado"],
  entregado: ["entregado"],
  cancelado: ["cancelado"],
};

const filters = [
  { key: "activos", label: "En curso" },
  { key: "todos", label: "Todos" },
  { key: "recibido", label: "Recibidos" },
  { key: "preparando", label: "Preparando" },
  { key: "listo", label: "Listos" },
  { key: "entregado", label: "Entregados" },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("activos");

  const loadOrders = async () => {
    try {
      const response = await adminOrderService.getOrdersAdmin();

      setOrders(response.data);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos cargar los pedidos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadOrders();
    };

    init();
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

      toast.success(`Pedido #${order.id} → ${statusLabels[estado]}`);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Error al actualizar pedido");
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

  const visibleOrders = useMemo(() => {
    if (filter === "todos") {
      return orders;
    }

    if (filter === "activos") {
      return orders.filter(
        (order) => !["entregado", "cancelado"].includes(order.estado),
      );
    }

    return orders.filter((order) => order.estado === filter);
  }, [orders, filter]);

  return (
    <div className="admin-orders">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-section-title">Pedidos</h2>
          <p className="admin-section-text">
            Cambia el estado y mantén informado al alumno.
          </p>
        </div>

        <button
          type="button"
          className="mb-btn mb-btn-ghost"
          onClick={() => {
            setRefreshing(true);
            loadOrders();
          }}
          disabled={refreshing}
        >
          <Icon name="refresh" size={18} className={refreshing ? "is-spinning" : ""} />
          Actualizar
        </button>
      </div>

      <section className="admin-orders-kpis">
        <div className="mb-stat">
          <span className="mb-stat-label">Pedidos totales</span>
          <span className="mb-stat-value">{orders.length}</span>
        </div>

        <div className="mb-stat">
          <span className="mb-stat-label">En curso</span>
          <span className="mb-stat-value">{activeOrders}</span>
        </div>

        <div className="mb-stat">
          <span className="mb-stat-label">Total vendido</span>
          <span className="mb-stat-value">${totalSales.toFixed(2)}</span>
        </div>
      </section>

      <div className="admin-filters">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`mb-chip ${filter === item.key ? "is-active" : ""}`}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonGrid
          count={4}
          image={false}
          lines={3}
          className="admin-orders-grid"
        />
      ) : visibleOrders.length === 0 ? (
        <EmptyState
          icon="receipt"
          title="No hay pedidos en este filtro"
          description="Cuando los alumnos generen pedidos aparecerán aquí."
        />
      ) : (
        <div className="admin-orders-grid">
          {visibleOrders.map((order, index) => (
            <article
              key={order.id}
              className="admin-order mb-reveal"
              style={{ "--i": index }}
            >
              <header className="admin-order-head">
                <div>
                  <span className="admin-order-number">Pedido #{order.id}</span>
                  <h3>{order.cliente}</h3>
                </div>

                <span
                  className={`mb-badge ${statusTones[order.estado] || "neutral"}`}
                >
                  {statusLabels[order.estado] || order.estado}
                </span>
              </header>

              <dl className="admin-order-meta">
                <div>
                  <dt>Matrícula</dt>
                  <dd>{order.matricula}</dd>
                </div>

                <div>
                  <dt>Total</dt>
                  <dd>${Number(order.total).toFixed(2)}</dd>
                </div>

                <div>
                  <dt>Pago</dt>
                  <dd className="is-capital">{formatPaymentMethod(order)}</dd>
                </div>

                <div>
                  <dt>Creado</dt>
                  <dd>{formatDate(order.creado_en)}</dd>
                </div>
              </dl>

              <div className="admin-order-code">
                <Icon name="qr" size={16} />
                {order.codigo_qr}
              </div>

              <label className="mb-field admin-order-status">
                <span>Cambiar estado</span>

                <select
                  className="mb-select"
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
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
