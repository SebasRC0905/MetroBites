import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import orderService from "../../services/orderService";

import Icon from "../../components/Icon";
import { SkeletonLine } from "../../components/Skeleton";

import "./OrderStatus.css";

const steps = [
  { key: "recibido", label: "Recibido", icon: "checkCircle" },
  { key: "preparando", label: "Preparando", icon: "utensils" },
  { key: "listo", label: "Listo", icon: "package" },
  { key: "entregado", label: "Entregado", icon: "star" },
];

const statusMessages = {
  recibido: "Tu pedido fue recibido correctamente.",
  preparando: "La cafetería está preparando tu pedido.",
  listo: "Tu pedido está listo para recoger.",
  entregado: "Tu pedido fue entregado. ¡Buen provecho!",
  cancelado: "Tu pedido fue cancelado.",
};

const statusLabels = {
  recibido: "Recibido",
  preparando: "Preparando",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const statusTitles = {
  recibido: "¡Tu pedido fue recibido!",
  preparando: "Estamos cocinando",
  listo: "¡Listo para recoger!",
  entregado: "Pedido entregado",
  cancelado: "Pedido cancelado",
};

function OrderStatus() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);

        if (isMounted) {
          setOrder(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadOrder();

    const intervalId = setInterval(loadOrder, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [id]);

  if (!order) {
    return (
      <div className="status">
        <div className="status-card">
          <SkeletonLine
            width={78}
            height={78}
            radius={999}
            style={{ margin: "0 auto 22px" }}
          />
          <SkeletonLine
            width="60%"
            height={26}
            style={{ margin: "0 auto 14px" }}
          />
          <SkeletonLine width="42%" height={14} style={{ margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  const cancelled = order.estado === "cancelado";

  const currentIndex = steps.findIndex((step) => step.key === order.estado);

  const progress =
    currentIndex <= 0 ? 0 : (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="status">
      <section className={`status-card ${cancelled ? "is-cancelled" : ""}`}>
        <span className="status-icon">
          <Icon name={cancelled ? "close" : "check"} size={34} strokeWidth={2.6} />
        </span>

        <h1>{statusTitles[order.estado] || "Pedido en curso"}</h1>

        <p>{statusMessages[order.estado] || statusMessages.recibido}</p>

        <span className="status-order-id">Orden #{order.id}</span>

        <div className="status-ticket">
          <div className="status-ticket-code">
            <span>Código de recolección</span>
            <strong>{order.codigo_qr}</strong>
          </div>

          <span className="status-ticket-icon">
            <Icon name="qr" size={30} />
          </span>
        </div>

        <p className="status-hint">
          <Icon name="store" size={15} />
          Muestra este código en la caja de la cafetería.
        </p>
      </section>

      {!cancelled && (
        <section className="status-track">
          <div className="status-track-head">
            <h2>Seguimiento</h2>

            <span className="mb-badge violet live">
              <span className="mb-badge-dot" />
              En vivo
            </span>
          </div>

          <div className="status-steps">
            <div className="status-line">
              <span style={{ width: `${progress}%` }} />
            </div>

            {steps.map((step, index) => {
              const state =
                index < currentIndex
                  ? "is-done"
                  : index === currentIndex
                    ? "is-current"
                    : "";

              return (
                <div key={step.key} className={`status-step ${state}`}>
                  <span className="status-step-dot">
                    <Icon
                      name={index < currentIndex ? "check" : step.icon}
                      size={16}
                      strokeWidth={2.2}
                    />
                  </span>

                  <span className="status-step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="status-detail">
        {Array.isArray(order.productos) && order.productos.length > 0 && (
          <ul className="status-products">
            {order.productos.map((item) => (
              <li key={item.id}>
                <span className="status-products-qty">{item.cantidad}x</span>

                <span className="status-products-name">
                  {item.nombre}

                  {item.personalizaciones?.length > 0 && (
                    <small>
                      {item.personalizaciones
                        .map((extra) => extra.nombre_personalizacion)
                        .join(" · ")}
                    </small>
                  )}
                </span>

                <strong>${Number(item.subtotal).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )}

        <div className="status-detail-grid">
          <div className="mb-stat">
            <span className="mb-stat-label">Total</span>
            <span className="mb-stat-value">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>

          <div className="mb-stat">
            <span className="mb-stat-label">Estado</span>
            <span className="mb-stat-value status-detail-state">
              {statusLabels[order.estado] || order.estado}
            </span>
          </div>

          <div className="mb-stat">
            <span className="mb-stat-label">Pedido</span>
            <span className="mb-stat-value">#{order.id}</span>
          </div>
        </div>

        <div className="status-actions">
          <button
            type="button"
            className="mb-btn mb-btn-ghost"
            onClick={() => navigate("/historial")}
          >
            <Icon name="receipt" size={18} />
            Ver mis pedidos
          </button>

          <button
            type="button"
            className="mb-btn mb-btn-primary"
            onClick={() => navigate("/home")}
          >
            Volver al inicio
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default OrderStatus;
