import { motion } from "framer-motion";

import Icon from "./Icon";
import useOrderStatuses from "../hooks/useOrderStatuses";

/**
 * Etiqueta de estado del pedido. El color, el texto y el icono salen
 * del catálogo del backend, así que agregar un estado nuevo al servidor
 * no obliga a tocar la interfaz.
 */
function StatusBadge({ estado, size = "md", animar = true, mostrarIcono = true }) {
  const { obtener } = useOrderStatuses();

  const info = obtener(estado);

  const enVivo = ["preparando", "confirmado", "listo"].includes(estado);

  return (
    <motion.span
      key={estado}
      className={`mb-badge ${info.tono} ${enVivo ? "live" : ""} ${
        size === "sm" ? "is-sm" : ""
      }`}
      initial={animar ? { opacity: 0, scale: 0.86 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {enVivo ? (
        <span className="mb-badge-dot" />
      ) : (
        mostrarIcono && <Icon name={info.icono} size={13} strokeWidth={2.1} />
      )}

      {info.etiqueta}
    </motion.span>
  );
}

export default StatusBadge;
