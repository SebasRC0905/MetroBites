import { useQuery } from "@tanstack/react-query";

import orderService from "../services/orderService";
import { queryKeys } from "../lib/queryClient";

/*
 Respaldo mínimo por si el catálogo del servidor no carga: la pantalla
 sigue mostrando etiquetas legibles en vez de "pendiente_pago".
*/
const RESPALDO = {
  pendiente_pago: { etiqueta: "Pago pendiente", tono: "amber", icono: "wallet" },
  recibido: { etiqueta: "Recibido", tono: "blue", icono: "receipt" },
  confirmado: { etiqueta: "Confirmado", tono: "violet", icono: "checkCircle" },
  preparando: { etiqueta: "En preparación", tono: "amber", icono: "utensils" },
  listo: { etiqueta: "Listo para recoger", tono: "green", icono: "package" },
  entregado: { etiqueta: "Entregado", tono: "green", icono: "star" },
  cancelado: { etiqueta: "Cancelado", tono: "red", icono: "close" },
  rechazado: { etiqueta: "Rechazado", tono: "red", icono: "alert" },
  no_recogido: { etiqueta: "No recogido", tono: "neutral", icono: "clock" },
};

const ORDEN_TABLERO_RESPALDO = [
  "pendiente_pago",
  "recibido",
  "confirmado",
  "preparando",
  "listo",
];

/**
 * Catálogo de estados del pedido servido por el backend: etiquetas,
 * colores, columnas del tablero y transiciones permitidas para el rol
 * de quien pregunta. Cambia poco, así que se cachea una hora.
 */
export function useOrderStatuses() {
  const consulta = useQuery({
    queryKey: queryKeys.catalogoEstados,
    queryFn: orderService.getStatusCatalog,
    staleTime: 60 * 60 * 1000,
    select: (respuesta) => respuesta.data,
  });

  const catalogo = consulta.data;

  const porClave = (catalogo?.estados || []).reduce(
    (acumulado, estado) => ({
      ...acumulado,
      [estado.clave]: estado,
    }),
    {},
  );

  /** Datos de presentación de un estado (con respaldo local). */
  const obtener = (clave) =>
    porClave[clave] ||
    RESPALDO[clave] || {
      etiqueta: clave,
      tono: "neutral",
      icono: "receipt",
    };

  /** Acciones que el rol actual puede ejecutar sobre ese estado. */
  const transiciones = (clave) => porClave[clave]?.transiciones || [];

  return {
    cargando: consulta.isLoading,
    catalogo,
    estados: porClave,
    obtener,
    transiciones,
    ordenTablero: catalogo?.ordenTablero || ORDEN_TABLERO_RESPALDO,
    flujoPrincipal:
      catalogo?.flujoPrincipal || [
        "pendiente_pago",
        "recibido",
        "confirmado",
        "preparando",
        "listo",
        "entregado",
      ],
    estadosActivos: catalogo?.estadosActivos || ORDEN_TABLERO_RESPALDO,
  };
}

export default useOrderStatuses;
