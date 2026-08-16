import { useEffect, useState } from "react";

/**
 * Retrasa un valor que cambia muy seguido (el texto de una búsqueda,
 * por ejemplo) para no filtrar ni pedir datos en cada tecla.
 */
export function useDebounce(valor, retraso = 300) {
  const [valorRetrasado, setValorRetrasado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorRetrasado(valor);
    }, retraso);

    return () => clearTimeout(temporizador);
  }, [valor, retraso]);

  return valorRetrasado;
}

export default useDebounce;
