import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

const STORAGE_KEY = "metrobites_cart";

const loadStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState(loadStoredCart);

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
    const syncCartWithSession = () => {
      const currentUserId = user?.id ?? null;

      if (previousUserId.current === currentUserId) {
        return;
      }

      previousUserId.current = currentUserId;

      if (currentUserId === null) {
        setItems([]);
      }
    };

    syncCartWithSession();
  }, [user]);

  const addItem = (product, quantity = 1, personalizaciones = []) => {
    const extrasTotal = personalizaciones.reduce(
      (acc, item) => acc + Number(item.precio_adicional),
      0,
    );

    const subtotal = (Number(product.precio_base) + extrasTotal) * quantity;

    const newItem = {
      producto_id: product.id,

      nombre: product.nombre,

      precio_base: Number(product.precio_base),

      url_imagen: product.url_imagen,

      cantidad: quantity,

      personalizaciones,

      subtotal,
    };

    setItems((prev) => [...prev, newItem]);
  };
  const increaseQuantity = (index) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        const extrasTotal = item.personalizaciones.reduce(
          (acc, extra) => acc + Number(extra.precio_adicional),
          0,
        );

        const nuevaCantidad = item.cantidad + 1;

        return {
          ...item,

          cantidad: nuevaCantidad,

          subtotal: (item.precio_base + extrasTotal) * nuevaCantidad,
        };
      }),
    );
  };

  const decreaseQuantity = (index) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) {
          return item;
        }

        const extrasTotal = item.personalizaciones.reduce(
          (acc, extra) => acc + Number(extra.precio_adicional),
          0,
        );

        const nuevaCantidad = Math.max(1, item.cantidad - 1);

        return {
          ...item,

          cantidad: nuevaCantidad,

          subtotal: (item.precio_base + extrasTotal) * nuevaCantidad,
        };
      }),
    );
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
