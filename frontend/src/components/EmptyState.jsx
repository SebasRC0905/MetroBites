import Icon from "./Icon";

/**
 * Bloque reutilizable para listas vacías o búsquedas sin resultados.
 */
function EmptyState({ icon = "sparkles", title, description, action }) {
  return (
    <div className="mb-empty">
      <span className="mb-empty-icon">
        <Icon name={icon} size={30} />
      </span>

      <h2>{title}</h2>

      {description && <p>{description}</p>}

      {action}
    </div>
  );
}

export default EmptyState;
