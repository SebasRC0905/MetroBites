import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import AnimatedNumber from "../../components/AnimatedNumber";

import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

import { itemVariants, listaVariants, resorte } from "../../lib/motion";

import "./Cart.css";

const API_URL = "http://localhost:3000";

const MAXIMO_NOTAS = 140;

function Cart() {
  const navigate = useNavigate();

  const {
    items,
    total,
    totalUnidades,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    updateItem,
  } = useCart();

  const { equivalente } = useCurrency();

  const [editandoNota, setEditandoNota] = useState(null);

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

          <motion.div
            variants={listaVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.article
                  key={item.uid}
                  layout
                  className="cart-item"
                  variants={itemVariants}
                  exit="exit"
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
                          removeItem(item.uid);
                          toast.success("Producto eliminado del carrito");
                        }}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </div>

                    {item.personalizaciones.length > 0 && (
                      <ul className="cart-item-extras">
                        {item.personalizaciones.map((extra) => (
                          <li key={extra.id}>
                            {extra.nombre}

                            {Number(extra.precio_adicional) > 0 && (
                              <b>+${Number(extra.precio_adicional).toFixed(2)}</b>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {editandoNota === item.uid ? (
                      <div className="cart-item-note-edit">
                        <textarea
                          className="mb-textarea"
                          rows={2}
                          autoFocus
                          maxLength={MAXIMO_NOTAS}
                          placeholder="Ej. sin cebolla, salsa aparte…"
                          defaultValue={item.notas}
                          onBlur={(evento) => {
                            updateItem(item.uid, {
                              notas: evento.target.value.trim(),
                            });

                            setEditandoNota(null);
                          }}
                        />

                        <small>Se guarda al salir del campo</small>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={`cart-item-note ${item.notas ? "has-note" : ""}`}
                        onClick={() => setEditandoNota(item.uid)}
                      >
                        <Icon name={item.notas ? "edit" : "plus"} size={13} />
                        {item.notas || "Agregar nota para la cocina"}
                      </button>
                    )}

                    <div className="cart-item-foot">
                      <div className="cart-stepper">
                        <button
                          type="button"
                          aria-label="Quitar uno"
                          onClick={() => decreaseQuantity(item.uid)}
                        >
                          <Icon name="minus" size={16} strokeWidth={2.4} />
                        </button>

                        <AnimatePresence mode="popLayout">
                          <motion.strong
                            key={item.cantidad}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={resorte}
                          >
                            {item.cantidad}
                          </motion.strong>
                        </AnimatePresence>

                        <button
                          type="button"
                          aria-label="Agregar uno"
                          onClick={() => increaseQuantity(item.uid)}
                        >
                          <Icon name="plus" size={16} strokeWidth={2.4} />
                        </button>
                      </div>

                      <span className="cart-item-price">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
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

            <strong>
              <AnimatedNumber value={total} decimals={2} prefix="$" />
            </strong>
          </div>

          {equivalente(total) && (
            <p className="cart-summary-currency">
              {equivalente(total)} al tipo de cambio de hoy
            </p>
          )}

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
