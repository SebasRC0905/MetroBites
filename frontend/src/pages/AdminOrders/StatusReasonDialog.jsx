import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Icon from "../../components/Icon";

import { backdropVariants, modalVariants } from "../../lib/motion";

const MOTIVOS_SUGERIDOS = {
  cancelado: [
    "El alumno pidió cancelar",
    "No se pudo confirmar el pago",
    "Fuera del horario de recolección",
  ],
  rechazado: [
    "Se agotaron los ingredientes",
    "La cafetería ya cerró",
    "Pedido duplicado",
  ],
};

/**
 * Diálogo para completar la información que exige la transición:
 * el motivo cuando se cancela o se rechaza, y el tiempo estimado
 * cuando el pedido entra a cocina.
 */
function FormularioMotivo({
  accion,
  pedido,
  guardando,
  onConfirmar,
  onCerrar,
}) {
  const [nota, setNota] = useState("");
  const [tiempo, setTiempo] = useState("");

  useEffect(() => {
    const alPresionar = (evento) => {
      if (evento.key === "Escape") {
        onCerrar();
      }
    };

    document.addEventListener("keydown", alPresionar);

    return () => document.removeEventListener("keydown", alPresionar);
  }, [onCerrar]);

  const requiereMotivo = accion.requiereMotivo;

  const pideTiempo =
    accion.estado === "confirmado" || accion.estado === "preparando";

  const sugerencias = MOTIVOS_SUGERIDOS[accion.estado] || [];

  const confirmar = () => {
    onConfirmar({
      nota: nota.trim() || undefined,
      tiempoEstimado: tiempo === "" ? undefined : Number(tiempo),
    });
  };

  return (
    <motion.div
      className="mb-modal-backdrop"
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="presentation"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar();
        }
      }}
    >
      <motion.div
        className="mb-modal"
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label={`Pasar el pedido a ${accion.etiqueta}`}
      >
        <div className={`mb-modal-icon ${requiereMotivo ? "danger" : "info"}`}>
          <Icon name={accion.icono || "receipt"} size={24} />
        </div>

        <h3>
          Pedido #{pedido?.id} → {accion.etiqueta}
        </h3>

        <p>
          {requiereMotivo
            ? "El alumno verá este motivo en el seguimiento de su pedido."
            : "Puedes dejar una nota interna para el resto del equipo."}
        </p>

        {sugerencias.length > 0 && (
          <div className="admin-reason-chips">
            {sugerencias.map((sugerencia) => (
              <button
                key={sugerencia}
                type="button"
                className={`mb-chip ${nota === sugerencia ? "is-active" : ""}`}
                onClick={() => setNota(sugerencia)}
              >
                {sugerencia}
              </button>
            ))}
          </div>
        )}

        <label className="mb-field admin-reason-field">
          <span>
            {requiereMotivo ? "Motivo (obligatorio)" : "Nota (opcional)"}
          </span>

          <textarea
            className="mb-textarea"
            rows={2}
            maxLength={200}
            autoFocus
            value={nota}
            onChange={(evento) => setNota(evento.target.value)}
            placeholder={
              requiereMotivo
                ? "Explica por qué no se pudo completar…"
                : "Ej. entra después del pedido #42"
            }
          />
        </label>

        {pideTiempo && (
          <label className="mb-field admin-reason-field">
            <span>Tiempo estimado (minutos)</span>

            <input
              className="mb-input"
              type="number"
              min="0"
              max="120"
              value={tiempo}
              onChange={(evento) => setTiempo(evento.target.value)}
              placeholder="Se usa el valor por defecto si lo dejas vacío"
            />
          </label>
        )}

        <div className="mb-modal-actions">
          <button
            type="button"
            className="mb-btn mb-btn-ghost"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`mb-btn ${
              requiereMotivo ? "mb-btn-danger" : "mb-btn-primary"
            }`}
            onClick={confirmar}
            disabled={guardando || (requiereMotivo && nota.trim().length < 4)}
          >
            {guardando && <span className="mb-spinner" />}
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Envoltura que monta el formulario solo cuando hay una acción
 * pendiente. La `key` garantiza que cada acción abra el diálogo en
 * limpio, sin arrastrar el motivo escrito para la anterior.
 */
function StatusReasonDialog({
  accion,
  pedido,
  guardando,
  onConfirmar,
  onCerrar,
}) {
  return (
    <AnimatePresence>
      {accion && (
        <FormularioMotivo
          key={`${pedido?.id}-${accion.estado}`}
          accion={accion}
          pedido={pedido}
          guardando={guardando}
          onConfirmar={onConfirmar}
          onCerrar={onCerrar}
        />
      )}
    </AnimatePresence>
  );
}

export default StatusReasonDialog;
