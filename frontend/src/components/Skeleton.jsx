/**
 * Placeholders animados para los estados de carga.
 * Evitan el clásico "Cargando..." y mantienen estable el layout.
 */

export function SkeletonLine({ width = "100%", height = 12, radius = 6, style }) {
  return (
    <span
      className="mb-skeleton"
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

export function SkeletonCard({ image = true, lines = 3 }) {
  return (
    <div className="mb-skeleton-card">
      {image && <SkeletonLine height={168} radius={14} style={{ marginBottom: 16 }} />}

      <SkeletonLine width="45%" height={14} style={{ marginBottom: 12 }} />

      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine
          key={index}
          width={index === lines - 1 ? "60%" : "100%"}
          style={{ marginBottom: 10 }}
        />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6, image = true, lines = 3, className = "" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} image={image} lines={lines} />
      ))}
    </div>
  );
}

export default SkeletonCard;
