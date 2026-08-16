import { motion } from "framer-motion";

import Icon from "./Icon";
import useOrderStatuses from "../hooks/useOrderStatuses";

import "./OrderTimeline.css";

const formatearHora = (valor) =>
  new Date(valor).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatearFecha = (valor) =>
  new Date(valor).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });

/**
 * Bitácora real del pedido: cada cambio de estado con su hora, quién lo
 * hizo y el motivo cuando lo hubo. Se alimenta de la tabla
 * `historial_estados_pedido`, no de suposiciones del frontend.
 */
function OrderTimeline({ historial = [], compacto = false }) {
  const { obtener } = useOrderStatuses();

  if (historial.length === 0) {
    return null;
  }

  return (
    <ol className={`timeline ${compacto ? "is-compact" : ""}`}>
      {historial.map((paso, indice) => {
        const info = obtener(paso.estado_nuevo);

        const esUltimo = indice === historial.length - 1;

        return (
          <motion.li
            key={paso.id ?? `${paso.estado_nuevo}-${indice}`}
            className={`timeline-item ${esUltimo ? "is-current" : ""}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(indice * 0.05, 0.4) }}
          >
            <span className={`timeline-dot ${info.tono}`}>
              <Icon name={info.icono} size={13} strokeWidth={2.2} />
            </span>

            <div className="timeline-body">
              <div className="timeline-head">
                <strong>{info.etiqueta}</strong>

                <time dateTime={paso.creado_en}>
                  {formatearFecha(paso.creado_en)} · {formatearHora(paso.creado_en)}
                </time>
              </div>

              {paso.nota && <p className="timeline-note">{paso.nota}</p>}

              <span className="timeline-actor">
                {paso.responsable
                  ? `${paso.responsable} · ${paso.responsable_rol}`
                  : "Sistema"}
              </span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export default OrderTimeline;
