import { useEffect, useRef, useState } from "react";

/**
 * Anima un número desde su valor anterior hasta el nuevo.
 *
 * Se usa en los indicadores del panel para que un cambio de datos se
 * note, en vez de que la cifra salte de golpe. Respeta la preferencia
 * del sistema de "reducir movimiento".
 */
export function useCountUp(valor, { duracion = 900, decimales = 0 } = {}) {
  const destino = Number(valor) || 0;

  const [mostrado, setMostrado] = useState(destino);

  const origenRef = useRef(destino);
  const cuadroRef = useRef(null);

  /* Se consulta una sola vez: la preferencia no cambia a media sesión. */
  const [sinMovimiento] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const animado = !sinMovimiento && duracion > 0;

  useEffect(() => {
    if (!animado) {
      origenRef.current = destino;

      return undefined;
    }

    const origen = origenRef.current;

    if (origen === destino) {
      return undefined;
    }

    const inicio = performance.now();

    const animar = (ahora) => {
      const avance = Math.min((ahora - inicio) / duracion, 1);

      // Curva easeOutCubic: rápido al principio, suave al final.
      const suavizado = 1 - Math.pow(1 - avance, 3);

      setMostrado(origen + (destino - origen) * suavizado);

      if (avance < 1) {
        cuadroRef.current = requestAnimationFrame(animar);
      } else {
        origenRef.current = destino;
      }
    };

    cuadroRef.current = requestAnimationFrame(animar);

    /*
     En una pestaña en segundo plano el navegador no ejecuta
     requestAnimationFrame, así que la cifra se quedaría congelada en el
     valor viejo. Este seguro salta al valor final pasada la duración.
    */
    const seguro = setTimeout(() => {
      origenRef.current = destino;

      setMostrado(destino);
    }, duracion + 80);

    return () => {
      cancelAnimationFrame(cuadroRef.current);
      clearTimeout(seguro);
    };
  }, [destino, duracion, animado]);

  /*
   Sin animación se devuelve el valor real: así el número siempre está
   correcto aunque el estado interno no se haya movido.
  */
  const valorFinal = animado ? mostrado : destino;

  return Number(valorFinal.toFixed(decimales));
}

export default useCountUp;
