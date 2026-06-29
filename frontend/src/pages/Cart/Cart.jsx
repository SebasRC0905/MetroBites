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
        <div className="empty-cart-icon">🛒</div>

        <h2>Tu carrito está vacío</h2>

        <p>Agrega algo rico para comenzar tu pedido.</p>

        <button
          type="button"
          className="checkout-btn"
          onClick={() => navigate("/home")}
        >
          Ver menú
        </button>
      </div>
    );
  }
  console.log(items);
  return (
    <div className="cart-container">
      <div className="cart-items">
        <div className="cart-title-section">
          <span className="eyebrow">Pedido actual</span>
          <h1>Mi carrito</h1>

          <p>Revisa tus productos antes de finalizar tu pedido.</p>
        </div>

        {items.map((item, index) => (
          <div key={index} className="cart-card">
            <div className="cart-image">
              {item.url_imagen ? (
                <img
                  src={`http://localhost:3000${item.url_imagen}`}
                  alt={item.nombre}
                />
              ) : (
                <span>🍽</span>
              )}
            </div>

            <div className="cart-product-content">
              <div className="cart-product-header">
                <span className="cart-product-name">{item.nombre}</span>

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  Eliminar
                </button>
              </div>

              {item.personalizaciones.map((extra) => (
                <p key={extra.id} className="cart-extra">
                  • {extra.nombre}
                </p>
              ))}

              <div className="cart-card-footer">
                <div className="cart-quantity-controls">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => decreaseQuantity(index)}
                  >
                    -
                  </button>

                  <span>{item.cantidad}</span>

                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => increaseQuantity(index)}
                  >
                    +
                  </button>
                </div>

                <p className="cart-subtotal">
                  <span>Subtotal</span>
                  <strong>${item.subtotal.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-card">
        <span className="eyebrow">Resumen</span>
        <h2>Tu orden</h2>

        <div className="summary-row">
          <span>Productos</span>
          <strong>{items.length}</strong>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Ir a pagar
        </button>
      </div>
    </div>
  );
}

export default Cart;
