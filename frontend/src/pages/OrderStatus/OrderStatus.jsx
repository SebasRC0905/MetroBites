import { useCallback, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

import Icon from "../../components/Icon";
import StatusBadge from "../../components/StatusBadge";
import OrderTimeline from "../../components/OrderTimeline";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SkeletonLine } from "../../components/Skeleton";

import useOrderStatuses from "../../hooks/useOrderStatuses";
import useOrderEvents from "../../hooks/useOrderEvents";

import { useCurrency } from "../../context/CurrencyContext";

import { queryKeys } from "../../lib/queryClient";
import { resorte } from "../../lib/motion";

import "./OrderStatus.css";

const paymentLabels = {
  tarjeta_credito: "Tarjeta de crédito",
  tarjeta_debito: "Tarjeta de débito",
  paypal: "PayPal",
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

const formatPaymentMethod = (order) => {
  const label =
    paymentLabels[order.metodo_pago_tipo] ||
    paymentLabels[order.metodo_pago] ||
    order.metodo_pago;

  return order.metodo_pago_alias
    ? `${label} · ${order.metodo_pago_alias}`
    : label;
};

function OrderStatus() {
  const { id } = useParams();

  const navigate = useNavigate();

  const clienteConsultas = useQueryClient();

  const { obtener, flujoPrincipal } = useOrderStatuses();
  const { equivalente } = useCurrency();

  const qrRef = useRef(null);

  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);

  const consulta = useQuery({
    queryKey: queryKeys.pedido(id),
    queryFn: () => orderService.getOrderById(id),
    select: (respuesta) => respuesta.data,
    /*
     El stream SSE es la vía principal de actualización; este intervalo
     largo solo cubre el caso de que la conexión se pierda.
    */
    refetchInterval: 60 * 1000,
  });

  const order = consulta.data;

  /* Solo interesan los eventos de este pedido. */
  const alRecibirEvento = useCallback(
    (evento) => {
      if (String(evento.pedidoId) !== String(id)) {
        return;
      }

      clienteConsultas.invalidateQueries({ queryKey: queryKeys.pedido(id) });
      clienteConsultas.invalidateQueries({ queryKey: queryKeys.misPedidos });

      if (evento.tipo === "pedido:estado") {
        toast.success(obtener(evento.estado).mensajeAlumno || "Tu pedido avanzó");
      }
    },
    [id, clienteConsultas, obtener],
  );

  const { conectado } = useOrderEvents(alRecibirEvento);

  const cancelacion = useMutation({
    mutationFn: () => orderService.cancelOrder(id, "Cancelado desde la app"),
    onSuccess: () => {
      toast.success("Pedido cancelado");

      setConfirmandoCancelacion(false);

      clienteConsultas.invalidateQueries({ queryKey: queryKeys.pedido(id) });
      clienteConsultas.invalidateQueries({ queryKey: queryKeys.misPedidos });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "No pudimos cancelar el pedido",
      );
    },
  });

  const pago = useMutation({
    mutationFn: () => orderService.confirmPayment(id),
    onSuccess: () => {
      toast.success("Pago confirmado");

      clienteConsultas.invalidateQueries({ queryKey: queryKeys.pedido(id) });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "No pudimos confirmar el pago",
      );
    },
  });

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) {
      return;
    }

    const link = document.createElement("a");

    link.download = `metrobites-${order.codigo_qr}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast.success("Código QR descargado");
  };

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

  const info = obtener(order.estado);

  const terminado = ["cancelado", "rechazado", "no_recogido"].includes(
    order.estado,
  );

  /* Pasos del flujo normal, sin los estados de excepción. */
  const pasos = flujoPrincipal
    .filter((clave) => clave !== "pendiente_pago" || order.estado === "pendiente_pago")
    .map((clave) => ({ clave, ...obtener(clave) }));

  const indiceActual = pasos.findIndex((paso) => paso.clave === order.estado);

  const progreso =
    indiceActual <= 0 ? 0 : (indiceActual / (pasos.length - 1)) * 100;

  const puedeCancelar = (order.acciones || []).some(
    (accion) => accion.estado === "cancelado",
  );

  const puedePagar =
    order.estado_pago === "pendiente" && order.metodo_pago !== "efectivo";

  return (
    <div className="status">
      <section className={`status-card ${terminado ? "is-cancelled" : ""}`}>
        <motion.span
          className="status-icon"
          key={order.estado}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={resorte}
        >
          <Icon name={info.icono} size={32} strokeWidth={2.2} />
        </motion.span>

        <h1>{info.etiqueta}</h1>

        <p>{info.mensajeAlumno || info.descripcion}</p>

        {order.motivo_cancelacion && terminado && (
          <p className="status-reason">
            <Icon name="alert" size={15} />
            {order.motivo_cancelacion}
          </p>
        )}

        <span className="status-order-id">Orden #{order.id}</span>

        {order.tiempo_estimado_min > 0 && !terminado && (
          <motion.p
            className="status-eta"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Icon name="clock" size={15} />
            Listo en aproximadamente {order.tiempo_estimado_min} minutos
          </motion.p>
        )}

        <div className="status-ticket">
          <div ref={qrRef} className="status-ticket-qr">
            <QRCodeCanvas
              value={order.codigo_qr}
              size={148}
              bgColor="#ffffff"
              fgColor="#200645"
              level="M"
              marginSize={2}
            />
          </div>

          <div className="status-ticket-code">
            <span>Código de recolección</span>
            <strong>{order.codigo_qr}</strong>

            <button
              type="button"
              className="mb-btn mb-btn-ghost mb-btn-sm status-ticket-download"
              onClick={handleDownloadQr}
            >
              <Icon name="qr" size={15} />
              Descargar QR
            </button>
          </div>
        </div>

        <p className="status-hint">
          <Icon name="store" size={15} />
          Muestra este código en la caja de la cafetería.
        </p>

        <AnimatePresence>
          {puedePagar && (
            <motion.div
              className="status-payment-cta"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <strong>Confirma tu pago</strong>
                <span>
                  Tu pedido entra a la cocina en cuanto se registre el pago.
                </span>
              </div>

              <button
                type="button"
                className="mb-btn mb-btn-primary"
                onClick={() => pago.mutate()}
                disabled={pago.isPending}
              >
                {pago.isPending && <span className="mb-spinner" />}
                <Icon name="wallet" size={17} />
                Ya pagué
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {!terminado && (
        <section className="status-track">
          <div className="status-track-head">
            <h2>Seguimiento</h2>

            <span className={`mb-badge ${conectado ? "violet live" : "neutral"}`}>
              {conectado && <span className="mb-badge-dot" />}
              {conectado ? "En vivo" : "Sin conexión en vivo"}
            </span>
          </div>

          <div className="status-steps">
            <div className="status-line">
              <motion.span
                animate={{ width: `${progreso}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {pasos.map((paso, index) => {
              const estado =
                index < indiceActual
                  ? "is-done"
                  : index === indiceActual
                    ? "is-current"
                    : "";

              return (
                <div key={paso.clave} className={`status-step ${estado}`}>
                  <span className="status-step-dot">
                    <Icon
                      name={index < indiceActual ? "check" : paso.icono}
                      size={16}
                      strokeWidth={2.2}
                    />
                  </span>

                  <span className="status-step-label">{paso.etiqueta}</span>
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

                  {item.notas && <em>“{item.notas}”</em>}
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

            {equivalente(order.total) && (
              <span className="status-detail-currency">
                {equivalente(order.total)}
              </span>
            )}
          </div>

          <div className="mb-stat">
            <span className="mb-stat-label">Estado</span>
            <span className="mb-stat-value">
              <StatusBadge estado={order.estado} />
            </span>
          </div>

          <div className="mb-stat">
            <span className="mb-stat-label">Recolección</span>
            <span className="mb-stat-value">{order.horario || "—"}</span>
          </div>

          <div className="mb-stat">
            <span className="mb-stat-label">Método de pago</span>
            <span className="mb-stat-value status-detail-payment">
              {formatPaymentMethod(order)}
            </span>
          </div>
        </div>

        {order.historial?.length > 0 && (
          <div className="status-history">
            <h2>Historial del pedido</h2>

            <OrderTimeline historial={order.historial} />
          </div>
        )}

        <div className="status-actions">
          {puedeCancelar && (
            <button
              type="button"
              className="mb-btn mb-btn-danger"
              onClick={() => setConfirmandoCancelacion(true)}
            >
              <Icon name="close" size={18} />
              Cancelar pedido
            </button>
          )}

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

      <ConfirmDialog
        open={confirmandoCancelacion}
        title="¿Cancelar tu pedido?"
        description="Solo puedes cancelar mientras la cafetería no lo haya puesto en preparación."
        confirmLabel="Sí, cancelar"
        cancelLabel="No, mantenerlo"
        loading={cancelacion.isPending}
        onConfirm={() => cancelacion.mutate()}
        onCancel={() => setConfirmandoCancelacion(false)}
      />
    </div>
  );
}

export default OrderStatus;
