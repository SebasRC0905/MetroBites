import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

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
