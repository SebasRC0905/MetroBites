import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const STORAGE_KEY = "metrobites_cart";

const loadStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    const guardado = raw ? JSON.parse(raw) : [];

    /*
     Los carritos guardados por versiones anteriores no tenían `uid`
     ni `notas`; se completan al cargarlos para que el resto del código
     pueda asumir que siempre existen.
    */
    return guardado.map((item, indice) => ({
      notas: "",
      ...item,
      uid: item.uid || `legado-${indice}-${item.producto_id}`,
    }));
  } catch (error) {
    console.error(error);

    return [];
  }
};

/** Precio de una unidad ya con sus personalizaciones. */
const precioUnitario = (item) =>
  Number(item.precio_base) +
  (item.personalizaciones || []).reduce(
    (acumulado, extra) => acumulado + Number(extra.precio_adicional || 0),
    0,
  );

const conSubtotal = (item) => ({
  ...item,
  precio_unitario: precioUnitario(item),
  subtotal: precioUnitario(item) * item.cantidad,
});

/**
 * Huella de una línea del carrito: mismo producto, mismas
 * personalizaciones y misma nota. Sirve para sumar cantidades en vez
 * de llenar el carrito de líneas repetidas.
 */
const huella = (item) => {
  const opciones = (item.personalizaciones || [])
    .map((extra) => extra.id)
    .sort((a, b) => a - b)
    .join("-");

  return `${item.producto_id}|${opciones}|${(item.notas || "").trim().toLowerCase()}`;
};

const MAXIMO_POR_LINEA = 20;

/**
 * Toda la lógica del carrito vive en este reducer: las pantallas solo
 * despachan intenciones ("agrega esto", "sube uno") y aquí se decide
 * cómo queda el estado. Antes esta lógica estaba repartida en varias
 * funciones que recalculaban el subtotal cada una por su cuenta.
 */
const carritoReducer = (estado, accion) => {
  switch (accion.tipo) {
    case "agregar": {
      const nuevo = conSubtotal(accion.item);

      const huellaNueva = huella(nuevo);

      const existente = estado.find(
        (item) => huella(item) === huellaNueva,
      );

      if (existente) {
        return estado.map((item) =>
          item.uid === existente.uid
            ? conSubtotal({
                ...item,
                cantidad: Math.min(
                  item.cantidad + nuevo.cantidad,
                  MAXIMO_POR_LINEA,
                ),
              })
            : item,
        );
      }

      return [...estado, nuevo];
    }

    case "cantidad": {
      return estado.map((item) =>
        item.uid === accion.uid
          ? conSubtotal({
              ...item,
              cantidad: Math.min(
                Math.max(1, item.cantidad + accion.delta),
                MAXIMO_POR_LINEA,
              ),
            })
          : item,
      );
    }

    case "actualizar": {
      return estado.map((item) =>
        item.uid === accion.uid
          ? conSubtotal({ ...item, ...accion.cambios })
          : item,
      );
    }

    case "eliminar":
      return estado.filter((item) => item.uid !== accion.uid);

    case "vaciar":
      return [];

    default:
      return estado;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, despachar] = useReducer(
    carritoReducer,
    undefined,
    loadStoredCart,
  );

  const previousUserId = useRef(user?.id ?? null);

  // Persiste el carrito para que sobreviva a un refresh de la página.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error(error);
    }
  }, [items]);

  /*
   Si cambia el usuario logueado (logout o inicio de sesión con otra
   cuenta en el mismo equipo), se vacía el carrito para no arrastrar
   pedidos de una cuenta a otra en equipos compartidos.
  */
  useEffect(() => {
    const currentUserId = user?.id ?? null;

    if (previousUserId.current === currentUserId) {
      return;
    }

    previousUserId.current = currentUserId;

    if (currentUserId === null) {
      despachar({ tipo: "vaciar" });
    }
  }, [user]);

  const valor = useMemo(() => {
    const total = items.reduce((acumulado, item) => acumulado + item.subtotal, 0);

    const totalUnidades = items.reduce(
      (acumulado, item) => acumulado + item.cantidad,
      0,
    );

    return {
      items,

      total,

      totalUnidades,

      /**
       * @param {object} producto     Producto del menú.
       * @param {object} opciones     { cantidad, personalizaciones, notas }
       */
      addItem: (producto, opciones = {}) => {
        const {
          cantidad = 1,
          personalizaciones = [],
          notas = "",
        } = opciones;

        despachar({
          tipo: "agregar",
          item: {
            uid: `${producto.id}-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 7)}`,
            producto_id: producto.id,
            nombre: producto.nombre,
            precio_base: Number(producto.precio_base),
            url_imagen: producto.url_imagen,
            categoria: producto.categoria,
            cantidad,
            personalizaciones,
            notas: notas.trim(),
          },
        });
      },

      increaseQuantity: (uid) =>
        despachar({ tipo: "cantidad", uid, delta: 1 }),

      decreaseQuantity: (uid) =>
        despachar({ tipo: "cantidad", uid, delta: -1 }),

      updateItem: (uid, cambios) =>
        despachar({ tipo: "actualizar", uid, cambios }),

      removeItem: (uid) => despachar({ tipo: "eliminar", uid }),

      clearCart: () => despachar({ tipo: "vaciar" }),
    };
  }, [items]);

  return (
    <CartContext.Provider value={valor}>{children}</CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
