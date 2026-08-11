import { useEffect } from "react";

import Icon from "./Icon";

/**
 * Diálogo de confirmación accesible que sustituye a `window.confirm`.
 * Se cierra con Escape o al hacer clic fuera de la tarjeta.
 */
function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKey = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="mb-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="mb-modal" role="alertdialog" aria-modal="true" aria-label={title}>
        <div className={`mb-modal-icon ${tone}`}>
          <Icon name={tone === "danger" ? "alert" : "checkCircle"} size={24} />
        </div>

        <h3>{title}</h3>

        {description && <p>{description}</p>}

        <div className="mb-modal-actions">
          <button type="button" className="mb-btn mb-btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`mb-btn ${tone === "danger" ? "mb-btn-danger" : "mb-btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="mb-spinner" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
