import useCountUp from "../hooks/useCountUp";

/**
 * Cifra que "corre" hasta su nuevo valor.
 * Se usa en los indicadores del panel y del tablero de pedidos.
 */
function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 900,
  className = "",
}) {
  const mostrado = useCountUp(value, {
    duracion: duration,
    decimales: decimals,
  });

  const texto = mostrado.toLocaleString("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {prefix}
      {texto}
      {suffix}
    </span>
  );
}

export default AnimatedNumber;
