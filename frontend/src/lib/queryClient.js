import { QueryClient } from "@tanstack/react-query";

/**
 * Cliente único de React Query.
 *
 * Centraliza el estado del servidor (menú, pedidos, catálogos) para que
 * las pantallas no repitan `useEffect` + `useState` + `try/catch`, se
 * compartan los datos entre vistas y las listas se refresquen solas
 * cuando el usuario vuelve a la pestaña.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Un minuto de "frescura": evita recargar el menú al navegar.
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: (fallos, error) => {
        // No tiene sentido reintentar un 401/403/404.
        const estado = error?.response?.status;

        if (estado >= 400 && estado < 500) {
          return false;
        }

        return fallos < 2;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Llaves de caché en un solo lugar: así invalidar desde una mutación
 * nunca depende de recordar cómo se escribió la llave en otra pantalla.
 */
export const queryKeys = {
  productos: ["productos"],
  producto: (id) => ["producto", String(id)],
  categorias: ["categorias"],
  favoritos: ["favoritos"],
  clima: ["clima"],
  divisas: ["divisas"],
  festivos: ["festivos"],
  nutricion: (id) => ["nutricion", String(id)],
  horarios: ["horarios"],
  catalogoEstados: ["catalogo-estados"],
  misPedidos: ["mis-pedidos"],
  pedido: (id) => ["pedido", String(id)],
  pedidosAdmin: (filtros) => ["pedidos-admin", filtros ?? {}],
  resumenPedidos: ["pedidos-resumen"],
  dashboard: ["dashboard"],
};
