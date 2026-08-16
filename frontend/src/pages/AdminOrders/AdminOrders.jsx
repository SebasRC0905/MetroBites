import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import adminOrderService from "../../services/adminOrderService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import AnimatedNumber from "../../components/AnimatedNumber";
import StatusBadge from "../../components/StatusBadge";
import { SkeletonGrid } from "../../components/Skeleton";

import useOrderStatuses from "../../hooks/useOrderStatuses";
import useOrderEvents from "../../hooks/useOrderEvents";
import useDebounce from "../../hooks/useDebounce";

import { queryKeys } from "../../lib/queryClient";
import { listaVariants } from "../../lib/motion";

import OrderCard from "./OrderCard";
import OrderDetailDrawer from "./OrderDetailDrawer";
import StatusReasonDialog from "./StatusReasonDialog";

import "./AdminOrders.css";

/* Estados que ya no se trabajan: se muestran aparte, en una lista. */
const ESTADOS_CERRADOS = [
  "entregado",
  "cancelado",
  "rechazado",
  "no_recogido",
];

function AdminOrders() {
  const clienteConsultas = useQueryClient();

  const { obtener, ordenTablero } = useOrderStatuses();

  const [busqueda, setBusqueda] = useState("");
  const [verCerrados, setVerCerrados] = useState(false);
  const [detalleId, setDetalleId] = useState(null);
  const [accionPendiente, setAccionPendiente] = useState(null);

  const busquedaRetrasada = useDebounce(busqueda, 300);

  const filtros = useMemo(
    () => ({ busqueda: busquedaRetrasada }),
    [busquedaRetrasada],
  );

  const pedidosConsulta = useQuery({
    queryKey: queryKeys.pedidosAdmin(filtros),
    queryFn: () => adminOrderService.getOrdersAdmin(filtros),
    select: (respuesta) => respuesta.data,
    // El stream ya avisa de los cambios; esto es solo una red de apoyo.
    refetchInterval: 60 * 1000,
  });

  const resumenConsulta = useQuery({
    queryKey: queryKeys.resumenPedidos,
    queryFn: adminOrderService.getOrdersSummary,
    select: (respuesta) => respuesta.data,
  });

  const pedidos = useMemo(
    () => pedidosConsulta.data || [],
    [pedidosConsulta.data],
  );

  const resumen = resumenConsulta.data;

  /*
   Cada evento del stream invalida las consultas para que el tablero se
   redibuje con datos frescos, sin que nadie tenga que dar "Actualizar".
  */
  const alRecibirEvento = useCallback(
    (evento) => {
      clienteConsultas.invalidateQueries({ queryKey: ["pedidos-admin"] });
      clienteConsultas.invalidateQueries({ queryKey: queryKeys.resumenPedidos });

      if (evento.pedidoId) {
        clienteConsultas.invalidateQueries({
          queryKey: queryKeys.pedido(evento.pedidoId),
        });
      }

      if (evento.tipo === "pedido:creado") {
        toast.success(`Nuevo pedido #${evento.pedidoId}`, { icon: "🔔" });
      }
    },
    [clienteConsultas],
  );

  const { conectado } = useOrderEvents(alRecibirEvento);

  const mutacion = useMutation({
    mutationFn: ({ pedido, accion, datos }) =>
      adminOrderService.updateOrderStatus(pedido.id, {
        estado: accion.estado,
        nota: datos?.nota,
        tiempoEstimado: datos?.tiempoEstimado,
      }),

    /* Actualización optimista: la tarjeta se mueve de columna al instante. */
    onMutate: async ({ pedido, accion }) => {
      await clienteConsultas.cancelQueries({
        queryKey: queryKeys.pedidosAdmin(filtros),
      });

      const previo = clienteConsultas.getQueryData(
        queryKeys.pedidosAdmin(filtros),
      );

      clienteConsultas.setQueryData(
        queryKeys.pedidosAdmin(filtros),
        (actual) =>
          actual
            ? {
                ...actual,
                data: actual.data.map((item) =>
                  item.id === pedido.id
                    ? { ...item, estado: accion.estado }
                    : item,
                ),
              }
            : actual,
      );

      return { previo };
    },

    onError: (error, _variables, contexto) => {
      if (contexto?.previo) {
        clienteConsultas.setQueryData(
          queryKeys.pedidosAdmin(filtros),
          contexto.previo,
        );
      }

      toast.error(
        error.response?.data?.message || "No se pudo actualizar el pedido",
      );
    },

    onSuccess: (respuesta) => {
      const { pedidoId, estadoNuevo } = respuesta.data;

      toast.success(`Pedido #${pedidoId} → ${obtener(estadoNuevo).etiqueta}`);
    },

    onSettled: () => {
      clienteConsultas.invalidateQueries({ queryKey: ["pedidos-admin"] });
      clienteConsultas.invalidateQueries({ queryKey: queryKeys.resumenPedidos });
    },
  });

  /**
   * Las transiciones que piden motivo (cancelar, rechazar) y las que
   * aceptan tiempo estimado abren un diálogo; el resto se ejecuta
   * directo desde la tarjeta.
   */
  const manejarAccion = (pedido, accion) => {
    const pideDatos =
      accion.requiereMotivo ||
      accion.estado === "confirmado" ||
      accion.estado === "preparando";

    if (pideDatos) {
      setAccionPendiente({ pedido, accion });

      return;
    }

    mutacion.mutate({ pedido, accion });
  };

  const columnas = useMemo(
    () =>
      ordenTablero.map((estado) => ({
        estado,
        info: obtener(estado),
        pedidos: pedidos.filter((pedido) => pedido.estado === estado),
      })),
    [ordenTablero, pedidos, obtener],
  );

  const cerrados = useMemo(
    () => pedidos.filter((pedido) => ESTADOS_CERRADOS.includes(pedido.estado)),
    [pedidos],
  );

  const enTablero = columnas.reduce(
    (total, columna) => total + columna.pedidos.length,
    0,
  );

  return (
    <div className="admin-orders">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-section-title">Tablero de pedidos</h2>

          <p className="admin-section-text">
            Usa los botones de cada tarjeta para avanzar el pedido: recibido →
            confirmado → preparando → listo → entregado.
          </p>
        </div>

        <div className="admin-toolbar-actions">
          <span className={`live-pill ${conectado ? "is-on" : ""}`}>
            <span className="live-dot" />
            {conectado ? "En vivo" : "Reconectando…"}
          </span>

          <div className="mb-input-icon admin-search">
            <Icon name="search" size={17} />

            <input
              type="search"
              className="mb-input"
              placeholder="Alumno, matrícula o código…"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>

          <button
            type="button"
            className="mb-btn mb-btn-ghost"
            onClick={() => {
              pedidosConsulta.refetch();
              resumenConsulta.refetch();
            }}
            disabled={pedidosConsulta.isFetching}
          >
            <Icon
              name="refresh"
              size={18}
              className={pedidosConsulta.isFetching ? "is-spinning" : ""}
            />
            Actualizar
          </button>
        </div>
      </div>

      <section className="admin-orders-kpis">
        <div className="mb-stat">
          <span className="mb-stat-label">En tablero</span>
          <span className="mb-stat-value">
            <AnimatedNumber value={resumen?.activos ?? enTablero} />
          </span>
        </div>

        <div className="mb-stat">
          <span className="mb-stat-label">Pedidos de hoy</span>
          <span className="mb-stat-value">
            <AnimatedNumber value={resumen?.pedidosHoy ?? 0} />
          </span>
        </div>

        <div className="mb-stat">
          <span className="mb-stat-label">Vendido hoy</span>
          <span className="mb-stat-value">
            <AnimatedNumber
              value={resumen?.vendidoHoy ?? 0}
              decimals={2}
              prefix="$"
            />
          </span>
        </div>

        <div className="mb-stat">
          <span className="mb-stat-label">Preparación promedio</span>
          <span className="mb-stat-value">
            {resumen?.minutosPromedioPreparacion === null ||
            resumen?.minutosPromedioPreparacion === undefined ? (
              "—"
            ) : (
              <AnimatedNumber
                value={resumen.minutosPromedioPreparacion}
                suffix=" min"
              />
            )}
          </span>
        </div>

        <div className="mb-stat">
          <span className="mb-stat-label">Cancelados hoy</span>
          <span className="mb-stat-value">
            <AnimatedNumber value={resumen?.canceladosHoy ?? 0} />
          </span>
        </div>
      </section>

      {pedidosConsulta.isLoading ? (
        <SkeletonGrid count={4} image={false} lines={3} className="board" />
      ) : (
        <div className="board">
          {columnas.map((columna) => (
            <section
              key={columna.estado}
              className={`board-column tone-${columna.info.tono}`}
            >
              <header className="board-column-head">
                <span className="board-column-title">
                  <Icon name={columna.info.icono} size={15} />
                  {columna.info.etiqueta}
                </span>

                <span className="board-column-count">
                  {columna.pedidos.length}
                </span>
              </header>

              <p className="board-column-hint">{columna.info.descripcion}</p>

              <motion.div
                className="board-column-list"
                variants={listaVariants}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence mode="popLayout">
                  {columna.pedidos.map((pedido) => (
                    <OrderCard
                      key={pedido.id}
                      pedido={pedido}
                      actualizando={
                        mutacion.isPending &&
                        mutacion.variables?.pedido?.id === pedido.id
                      }
                      onAccion={manejarAccion}
                      onVerDetalle={(item) => setDetalleId(item.id)}
                    />
                  ))}
                </AnimatePresence>

                {columna.pedidos.length === 0 && (
                  <p className="board-column-empty">Sin pedidos aquí</p>
                )}
              </motion.div>
            </section>
          ))}
        </div>
      )}

      {enTablero === 0 && !pedidosConsulta.isLoading && (
        <EmptyState
          icon="receipt"
          title="No hay pedidos en curso"
          description="Cuando un alumno haga un pedido aparecerá aquí al instante."
        />
      )}

      <section className="board-closed">
        <button
          type="button"
          className="board-closed-toggle"
          onClick={() => setVerCerrados((previo) => !previo)}
          aria-expanded={verCerrados}
        >
          <Icon name={verCerrados ? "chevronDown" : "chevronRight"} size={16} />
          Pedidos cerrados ({cerrados.length})
        </button>

        <AnimatePresence initial={false}>
          {verCerrados && (
            <motion.ul
              className="board-closed-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.26 }}
            >
              {cerrados.map((pedido) => (
                <li key={pedido.id}>
                  <span className="board-closed-id">#{pedido.id}</span>

                  <span className="board-closed-name">{pedido.cliente}</span>

                  <StatusBadge estado={pedido.estado} animar={false} />

                  <span className="board-closed-total">
                    ${Number(pedido.total).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    className="mb-btn mb-btn-ghost mb-btn-sm"
                    onClick={() => setDetalleId(pedido.id)}
                  >
                    <Icon name="eye" size={15} />
                    Ver
                  </button>
                </li>
              ))}

              {cerrados.length === 0 && (
                <li className="board-closed-empty">
                  Todavía no hay pedidos cerrados.
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </section>

      <OrderDetailDrawer
        pedidoId={detalleId}
        onCerrar={() => setDetalleId(null)}
      />

      <StatusReasonDialog
        accion={accionPendiente?.accion}
        pedido={accionPendiente?.pedido}
        guardando={mutacion.isPending}
        onCerrar={() => setAccionPendiente(null)}
        onConfirmar={(datos) => {
          mutacion.mutate(
            {
              pedido: accionPendiente.pedido,
              accion: accionPendiente.accion,
              datos,
            },
            {
              onSuccess: () => setAccionPendiente(null),
            },
          );
        }}
      />
    </div>
  );
}

export default AdminOrders;
