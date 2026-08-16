import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

import Icon from "../../components/Icon";
import StatusBadge from "../../components/StatusBadge";
import OrderTimeline from "../../components/OrderTimeline";
import { SkeletonLine } from "../../components/Skeleton";

import adminOrderService from "../../services/adminOrderService";
import { queryKeys } from "../../lib/queryClient";

/**
 * Panel lateral con todo el pedido: productos con sus
 * personalizaciones, notas del alumno y la bitácora completa de
 * estados. Es la vista que usa la cafetería para preparar la orden.
 */
function OrderDetailDrawer({ pedidoId, onCerrar }) {
  const abierto = Boolean(pedidoId);

  const consulta = useQuery({
    queryKey: queryKeys.pedido(pedidoId),
    queryFn: () => adminOrderService.getOrderDetail(pedidoId),
    enabled: abierto,
    select: (respuesta) => respuesta.data,
  });

  const pedido = consulta.data;

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onClick={(evento) => {
            if (evento.target === evento.currentTarget) {
              onCerrar();
            }
          }}
        >
          <motion.aside
            className="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle del pedido ${pedidoId}`}
          >
            <header className="drawer-head">
              <div>
                <span className="mb-eyebrow">
                  <Icon name="receipt" size={13} />
                  Pedido #{pedidoId}
                </span>

                {pedido && <h2>{pedido.cliente}</h2>}
              </div>

              <button
                type="button"
                className="drawer-close"
                aria-label="Cerrar detalle"
                onClick={onCerrar}
              >
                <Icon name="close" size={18} strokeWidth={2.2} />
              </button>
            </header>

            {consulta.isLoading || !pedido ? (
              <div className="drawer-body">
                <SkeletonLine height={70} radius={14} />
                <SkeletonLine height={140} radius={14} />
                <SkeletonLine height={180} radius={14} />
              </div>
            ) : (
              <div className="drawer-body">
                <div className="drawer-status">
                  <StatusBadge estado={pedido.estado} />

                  <span className="drawer-total">
                    ${Number(pedido.total).toFixed(2)}
                  </span>
                </div>

                <section className="drawer-block">
                  <h3>Productos</h3>

                  <ul className="drawer-items">
                    {pedido.productos.map((item) => (
                      <li key={item.id}>
                        <span className="drawer-item-qty">{item.cantidad}x</span>

                        <div className="drawer-item-body">
                          <strong>{item.nombre}</strong>

                          {item.personalizaciones.length > 0 && (
                            <span className="drawer-item-extras">
                              {item.personalizaciones
                                .map((extra) => extra.nombre_personalizacion)
                                .join(" · ")}
                            </span>
                          )}

                          {item.notas && (
                            <span className="drawer-item-note">
                              <Icon name="edit" size={12} />
                              {item.notas}
                            </span>
                          )}
                        </div>

                        <strong>${Number(item.subtotal).toFixed(2)}</strong>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="drawer-block">
                  <h3>Datos del pedido</h3>

                  <dl className="drawer-data">
                    <div>
                      <dt>Matrícula</dt>
                      <dd>{pedido.matricula}</dd>
                    </div>

                    <div>
                      <dt>Horario</dt>
                      <dd>{pedido.horario || "—"}</dd>
                    </div>

                    <div>
                      <dt>Pago</dt>
                      <dd className="is-capital">
                        {pedido.metodo_pago} · {pedido.estado_pago}
                      </dd>
                    </div>

                    <div>
                      <dt>Estimado</dt>
                      <dd>
                        {pedido.tiempo_estimado_min
                          ? `${pedido.tiempo_estimado_min} min`
                          : "—"}
                      </dd>
                    </div>
                  </dl>

                  {pedido.notas && (
                    <p className="drawer-order-note">
                      <Icon name="edit" size={13} />
                      {pedido.notas}
                    </p>
                  )}
                </section>

                <section className="drawer-block">
                  <h3>Código de recolección</h3>

                  <div className="drawer-qr">
                    <QRCodeCanvas
                      value={pedido.codigo_qr}
                      size={104}
                      bgColor="#ffffff"
                      fgColor="#200645"
                      level="M"
                      marginSize={2}
                    />

                    <span>{pedido.codigo_qr}</span>
                  </div>
                </section>

                <section className="drawer-block">
                  <h3>Bitácora de estados</h3>

                  <OrderTimeline historial={pedido.historial} />
                </section>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OrderDetailDrawer;
