import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import historyService from "../../services/historyService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import AnimatedNumber from "../../components/AnimatedNumber";
import { SkeletonGrid } from "../../components/Skeleton";

import useOrderStatuses from "../../hooks/useOrderStatuses";

import { queryKeys } from "../../lib/queryClient";
import { itemVariants, listaVariants } from "../../lib/motion";

import "./OrderHistory.css";

/* Estados que ya no cambian: sirven para separar "en curso" de "cerrados". */
const ESTADOS_CERRADOS = [
  "entregado",
  "cancelado",
  "rechazado",
  "no_recogido",
];

const filters = [
  { key: "todos", label: "Todos" },
  { key: "activos", label: "En curso" },
  { key: "entregado", label: "Entregados" },
  { key: "cancelado", label: "Cancelados" },
  { key: "rechazado", label: "Rechazados" },
];

const paymentLabels = {
  tarjeta_credito: "Crédito",
  tarjeta_debito: "Débito",
  paypal: "PayPal",
};

const formatPaymentMethod = (order) =>
  paymentLabels[order.metodo_pago_tipo] || order.metodo_pago;

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function OrderHistory() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("todos");

  const { obtener } = useOrderStatuses();

  const consulta = useQuery({
    queryKey: queryKeys.misPedidos,
    queryFn: historyService.getMyOrders,
    select: (respuesta) => respuesta.data,
  });

  const orders = useMemo(() => consulta.data || [], [consulta.data]);

  const loading = consulta.isLoading;

  const stats = useMemo(() => {
    const gastado = orders.reduce(
      (acc, order) => acc + Number(order.total || 0),
      0,
    );

    const activos = orders.filter(
      (order) => !ESTADOS_CERRADOS.includes(order.estado),
    ).length;

    return { gastado, activos };
  }, [orders]);

  const visibleOrders = useMemo(() => {
    if (filter === "todos") {
      return orders;
    }

    if (filter === "activos") {
      return orders.filter(
        (order) => !ESTADOS_CERRADOS.includes(order.estado),
      );
    }

    return orders.filter((order) => order.estado === filter);
  }, [orders, filter]);

  return (
    <div className="history">
      <header className="mb-page-head">
        <div>
          <span className="mb-eyebrow">
            <Icon name="receipt" size={13} />
            Historial
          </span>

          <h1>Tus pedidos</h1>

          <p>Consulta el estado y el detalle de todos tus pedidos.</p>
        </div>
      </header>

      <section className="history-hero">
        <div className="history-hero-copy">
          <h2>Todo tu consumo en un lugar</h2>
          <p>Revisa cuánto has pedido este cuatrimestre en la cafetería.</p>
        </div>

        <dl className="history-hero-stats">
          <div>
            <dt>Pedidos</dt>
            <dd>{loading ? "—" : orders.length}</dd>
          </div>

          <div>
            <dt>En curso</dt>
            <dd>{loading ? "—" : stats.activos}</dd>
          </div>

          <div>
            <dt>Total</dt>
            <dd>
              <AnimatedNumber value={stats.gastado} decimals={2} prefix="$" />
            </dd>
          </div>
        </dl>
      </section>

      <nav className="history-filters" aria-label="Filtrar pedidos">
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
      </nav>

      {loading ? (
        <SkeletonGrid
          count={3}
          image={false}
          lines={2}
          className="history-list"
        />
      ) : visibleOrders.length === 0 ? (
        <EmptyState
          icon="receipt"
          title={
            orders.length === 0
              ? "Todavía no tienes pedidos"
              : "Sin pedidos en este filtro"
          }
          description={
            orders.length === 0
              ? "Cuando realices tu primer pedido aparecerá aquí."
              : "Prueba con otra categoría del historial."
          }
          action={
            orders.length === 0 ? (
              <button
                type="button"
                className="mb-btn mb-btn-accent mb-btn-lg"
                onClick={() => navigate("/home")}
              >
                Ir al menú
                <Icon name="arrowRight" size={18} />
              </button>
            ) : null
          }
        />
      ) : (
        <motion.div
          className="history-list"
          variants={listaVariants}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
          {visibleOrders.map((order) => (
            <motion.article
              key={order.id}
              layout
              className="history-row"
              variants={itemVariants}
              exit="exit"
            >
              <div className="history-row-main">
                <div className="history-row-meta">
                  <span className="history-date">
                    {formatDate(order.creado_en)}
                  </span>

                  <StatusBadge estado={order.estado} animar={false} />
                </div>

                <h3>Orden #{order.id}</h3>

                <p className="history-row-code">
                  <Icon name="qr" size={14} />
                  {order.codigo_qr}

                  <span className="history-dot" />

                  <Icon name="wallet" size={14} />
                  {formatPaymentMethod(order)}

                  {order.horario && (
                    <>
                      <span className="history-dot" />

                      <Icon name="clock" size={14} />
                      {order.horario}
                    </>
                  )}
                </p>

                <p className="history-row-state">
                  {obtener(order.estado).mensajeAlumno}
                </p>
              </div>

              <div className="history-row-side">
                <span className="history-total">
                  ${Number(order.total).toFixed(2)}
                </span>

                <button
                  type="button"
                  className="mb-btn mb-btn-soft mb-btn-sm"
                  onClick={() => navigate(`/order-status/${order.id}`)}
                >
                  Ver detalle
                  <Icon name="chevronRight" size={16} />
                </button>
              </div>
            </motion.article>
          ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default OrderHistory;
