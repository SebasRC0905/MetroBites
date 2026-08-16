import { motion } from "framer-motion";

import Icon from "../../components/Icon";
import StatusBadge from "../../components/StatusBadge";

import useOrderStatuses from "../../hooks/useOrderStatuses";

import { resorte, tarjetaTableroVariants } from "../../lib/motion";

const paymentLabels = {
  tarjeta_credito: "Tarjeta de crédito",
  tarjeta_debito: "Tarjeta de débito",
  paypal: "PayPal",
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

const formatPaymentMethod = (order) => {
  const etiqueta =
    paymentLabels[order.metodo_pago_tipo] ||
    paymentLabels[order.metodo_pago] ||
    order.metodo_pago;

  return order.metodo_pago_alias
    ? `${etiqueta} · ${order.metodo_pago_alias}`
    : etiqueta;
};

const pagoTono = {
  pagado: "green",
  pendiente: "amber",
  cancelado: "red",
  reembolsado: "neutral",
};

/**
 * Tarjeta de un pedido dentro del tablero.
 *
 * Los botones de acción no están escritos a mano: salen de las
 * transiciones que el backend declara para el estado actual y el rol
 * de quien está viendo el tablero.
 */
function OrderCard({ pedido, actualizando, onAccion, onVerDetalle }) {
  const { transiciones } = useOrderStatuses();

  const acciones = transiciones(pedido.estado);

  const minutos = Number(pedido.minutos_transcurridos ?? 0);

  const demorado =
    minutos >= 20 &&
    !["entregado", "cancelado", "rechazado", "no_recogido"].includes(
      pedido.estado,
    );

  return (
    <motion.article
      layout
      layoutId={`pedido-${pedido.id}`}
      className={`board-card ${demorado ? "is-late" : ""}`}
      variants={tarjetaTableroVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={resorte}
    >
      <header className="board-card-head">
        <div>
          <span className="board-card-id">#{pedido.id}</span>
          <h4>{pedido.cliente}</h4>
          <span className="board-card-mat">{pedido.matricula}</span>
        </div>

        <div className="board-card-badges">
          <span className={`mb-badge ${pagoTono[pedido.estado_pago] || "neutral"}`}>
            {pedido.estado_pago}
          </span>
        </div>
      </header>

      {pedido.resumen_productos && (
        <p className="board-card-items">{pedido.resumen_productos}</p>
      )}

      {pedido.notas && (
        <p className="board-card-note">
          <Icon name="edit" size={13} />
          {pedido.notas}
        </p>
      )}

      <dl className="board-card-meta">
        <div>
          <dt>Total</dt>
          <dd>${Number(pedido.total).toFixed(2)}</dd>
        </div>

        <div>
          <dt>Pago</dt>
          <dd>{formatPaymentMethod(pedido)}</dd>
        </div>

        <div>
          <dt>Horario</dt>
          <dd>{pedido.horario || "—"}</dd>
        </div>

        <div>
          <dt>Espera</dt>
          <dd className={demorado ? "is-late-text" : ""}>
            {minutos < 60
              ? `${minutos} min`
              : `${Math.floor(minutos / 60)} h ${minutos % 60} min`}
          </dd>
        </div>
      </dl>

      {pedido.tiempo_estimado_min > 0 && (
        <p className="board-card-eta">
          <Icon name="clock" size={13} />
          Estimado: {pedido.tiempo_estimado_min} min
        </p>
      )}

      {pedido.motivo_cancelacion && (
        <p className="board-card-reason">
          <Icon name="alert" size={13} />
          {pedido.motivo_cancelacion}
        </p>
      )}

      <footer className="board-card-actions">
        {acciones.map((accion) => (
          <motion.button
            key={accion.estado}
            type="button"
            className={`board-action ${accion.requiereMotivo ? "is-danger" : ""} ${
              accion.tono
            }`}
            disabled={actualizando}
            onClick={() => onAccion(pedido, accion)}
            whileTap={{ scale: 0.96 }}
          >
            <Icon name={accion.icono} size={14} />
            {accion.etiqueta}
          </motion.button>
        ))}

        {acciones.length === 0 && (
          <StatusBadge estado={pedido.estado} animar={false} />
        )}

        <button
          type="button"
          className="board-action is-ghost"
          onClick={() => onVerDetalle(pedido)}
        >
          <Icon name="eye" size={14} />
          Detalle
        </button>
      </footer>
    </motion.article>
  );
}

export default OrderCard;
