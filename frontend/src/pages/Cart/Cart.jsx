import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const { items, total, removeItem, increaseQuantity, decreaseQuantity } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h1>🛒</h1>

        <h2>Tu carrito está vacío</h2>

        <button className="checkout-btn" onClick={() => navigate("/home")}>
          Ver Menú
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items">
        <div className="cart-title-section">
          <h1>🛒 Mi Carrito</h1>

          <p>Revisa tus productos antes de finalizar tu pedido</p>
        </div>

        {items.map((item, index) => (
          <div key={index} className="cart-card">
            <div className="cart-left">
            <div className="cart-image">
              {item.url_imagen ? (
                <img src={item.url_imagen} alt={item.nombre} />
              ) : (
                <span>🍽</span>
              )}
            </div>
            <div className="cart-product-header">
              <span className="cart-product-name">{item.nombre}</span>

              <button className="remove-btn" onClick={() => removeItem(index)}>
                Eliminar
              </button>
            </div>

            {item.personalizaciones.map((extra) => (
              <p key={extra.id} className="cart-extra">
                • {extra.nombre}
              </p>
            ))}

            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => decreaseQuantity(index)}
              >
                -
              </button>

              <span>{item.cantidad}</span>

              <button
                className="quantity-btn"
                onClick={() => increaseQuantity(index)}
              >
                +
              </button>
            </div>

            <p>
              <strong>Subtotal:</strong> ${item.subtotal.toFixed(2)}
            </p>
          </div>
        </div>
        ))}
      </div>

      <div className="summary-card">
        <h2>Resumen</h2>

        <hr />

        <p>
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>

        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Ir a pagar
        </button>
      </div>
    </div>
  );
}

export default Cart;
