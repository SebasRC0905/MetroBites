import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";

import { useCart } from "../../context/CartContext";

import "./Cart.css";

const API_URL = "http://localhost:3000";

function Cart() {
  const navigate = useNavigate();

  const { items, total, removeItem, increaseQuantity, decreaseQuantity } =
    useCart();

  const totalUnidades = items.reduce((acc, item) => acc + item.cantidad, 0);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="cart"
        title="Tu carrito está vacío"
        description="Agrega algo rico del menú para comenzar tu pedido."
        action={
          <button
            type="button"
            className="mb-btn mb-btn-accent mb-btn-lg"
            onClick={() => navigate("/home")}
          >
            Ver el menú
            <Icon name="arrowRight" size={18} />
          </button>
        }
      />
    );
  }

  return (
    <div className="cart">
      <button
        type="button"
        className="mb-btn mb-btn-ghost cart-back"
        onClick={() => navigate("/home")}
      >
        <Icon name="arrowLeft" size={18} />
        Seguir comprando
      </button>

      <div className="cart-layout">
        <section className="cart-items">
          <div className="mb-section-head">
            <h2>Tus platillos ({items.length})</h2>
            <span>{totalUnidades} unidades</span>
          </div>

          {items.map((item, index) => (
            <article
              key={`${item.producto_id}-${index}`}
              className="cart-item mb-reveal"
              style={{ "--i": index }}
            >
              <div className="cart-item-media">
                {item.url_imagen ? (
                  <img
                    src={`${API_URL}${item.url_imagen}`}
                    alt={item.nombre}
                    loading="lazy"
                  />
                ) : (
                  <Icon name="utensils" size={26} />
                )}
              </div>

              <div className="cart-item-body">
                <div className="cart-item-head">
                  <h3>{item.nombre}</h3>

                  <button
                    type="button"
                    className="cart-remove"
                    aria-label={`Eliminar ${item.nombre}`}
                    onClick={() => {
                      removeItem(index);
                      toast.success("Producto eliminado del carrito");
                    }}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </div>

                {item.personalizaciones.length > 0 && (
                  <p className="cart-item-extras">
                    {item.personalizaciones.map((extra) => extra.nombre).join(" · ")}
                  </p>
                )}

                <div className="cart-item-foot">
                  <div className="cart-stepper">
                    <button
                      type="button"
                      aria-label="Quitar uno"
                      onClick={() => decreaseQuantity(index)}
                    >
                      <Icon name="minus" size={16} strokeWidth={2.4} />
                    </button>

                    <strong>{item.cantidad}</strong>

                    <button
                      type="button"
                      aria-label="Agregar uno"
                      onClick={() => increaseQuantity(index)}
                    >
                      <Icon name="plus" size={16} strokeWidth={2.4} />
                    </button>
                  </div>

                  <span className="cart-item-price">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Resumen del pedido</h2>

          <dl className="cart-summary-rows">
            <div>
              <dt>Subtotal</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>

            <div>
              <dt>Servicio</dt>
              <dd className="is-free">Gratis</dd>
            </div>
          </dl>

          <div className="cart-summary-total">
            <span>Total a pagar</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="mb-btn mb-btn-accent mb-btn-lg mb-btn-block"
            onClick={() => navigate("/checkout")}
          >
            Ir a pagar
            <Icon name="arrowRight" size={18} />
          </button>

          <p className="cart-summary-note">
            <Icon name="shield" size={15} />
            Confirmas y pagas al recoger en ventanilla.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
