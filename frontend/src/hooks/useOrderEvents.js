import { useEffect, useRef, useState } from "react";

import realtimeService from "../services/realtimeService";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Conexión en vivo (Server-Sent Events) con los cambios de estado de
 * los pedidos.
 *
 * Cómo funciona: `EventSource` no puede mandar el header Authorization,
 * así que primero se cambia el JWT por un ticket de un solo uso y ese
 * ticket es el que viaja en la URL del stream. Cuando la conexión se
 * cae, se pide un ticket nuevo con una espera creciente.
 *
 * @param {(evento: object) => void} alRecibir  Se llama con cada evento.
 * @param {{ activo?: boolean }} opciones
 * @returns {{ conectado: boolean }}
 */
export function useOrderEvents(alRecibir, { activo = true } = {}) {
  const [conectado, setConectado] = useState(false);

  /*
   El callback se guarda en una referencia para que un cambio de
   función (muy común, porque se define en el render) no reabra la
   conexión.
  */
  const manejadorRef = useRef(alRecibir);

  useEffect(() => {
    manejadorRef.current = alRecibir;
  }, [alRecibir]);

  useEffect(() => {
    if (!activo) {
      return undefined;
    }

    let fuente = null;
    let temporizador = null;
    let intentos = 0;
    let cancelado = false;

    const conectar = async () => {
      try {
        const { data } = await realtimeService.crearTicket();

        if (cancelado) {
          return;
        }

        fuente = new EventSource(
          `${API_URL}/pedidos/stream?ticket=${encodeURIComponent(data.ticket)}`,
        );

        fuente.addEventListener("conectado", () => {
          intentos = 0;
          setConectado(true);
        });

        fuente.addEventListener("pedido", (evento) => {
          try {
            manejadorRef.current?.(JSON.parse(evento.data));
          } catch (error) {
            console.error(error);
          }
        });

        fuente.onerror = () => {
          /*
           El ticket ya se consumió, así que la reconexión automática
           del navegador no serviría: se cierra y se reintenta con uno
           nuevo, esperando cada vez un poco más (máximo 30 s).
          */
          fuente.close();
          fuente = null;

          setConectado(false);

          if (cancelado) {
            return;
          }

          intentos += 1;

          temporizador = setTimeout(
            conectar,
            Math.min(2000 * intentos, 30000),
          );
        };
      } catch (error) {
        console.error(error);

        if (cancelado) {
          return;
        }

        intentos += 1;

        temporizador = setTimeout(conectar, Math.min(2000 * intentos, 30000));
      }
    };

    conectar();

    return () => {
      cancelado = true;

      clearTimeout(temporizador);

      fuente?.close();

      setConectado(false);
    };
  }, [activo]);

  return { conectado };
}

export default useOrderEvents;
