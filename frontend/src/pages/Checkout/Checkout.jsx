import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";

import horarioService from "../../services/horarioService";
import pedidoService from "../../services/pedidoService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";

import "./Checkout.css";

const formatHour = (value) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 5);
};

function Checkout() {
  const navigate = useNavigate();

  const { items, total, clearCart } = useCart();

  const [horarios, setHorarios] = useState([]);

  const [horarioId, setHorarioId] = useState("");

  const [metodoPago, setMetodoPago] = useState("efectivo");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadHorarios = async () => {
      try {
        const response = await horarioService.getHorarios();

        setHorarios(response.data);
      } catch (error) {
        console.error(error);

        toast.error("No pudimos cargar los horarios");
      }
    };

    loadHorarios();
  }, []);

  const handleCheckout = async () => {
    if (!horarioId) {
      toast.error("Selecciona un horario de recolección");

      return;
    }

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const productos = items.map((item) => ({
        producto_id: item.producto_id,

        cantidad: item.cantidad,

        personalizaciones: item.personalizaciones.map((p) => p.id),
      }));

      const response = await pedidoService.createOrder({
        horario_id: Number(horarioId),

        metodo_pago: metodoPago,

        productos,
      });

      clearCart();

      toast.success("¡Pedido confirmado!");

      navigate(`/order-status/${response.data.pedidoId}`);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Error al crear el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon="receipt"
        title="No hay nada por confirmar"
        description="Agrega productos a tu carrito para poder finalizar un pedido."
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
    <div className="checkout">
      <header className="checkout-top">
        <button
          type="button"
          className="mb-btn mb-btn-ghost"
          onClick={() => navigate("/cart")}
        >
          <Icon name="arrowLeft" size={18} />
          Volver
        </button>

        <h1>Finalizar pedido</h1>
      </header>

      <div className="checkout-layout">
        <div className="checkout-steps">
          <section className="checkout-step mb-reveal" style={{ "--i": 0 }}>
            <div className="checkout-step-head">
              <span className="checkout-step-number">1</span>

              <div>
                <h2>¿A qué hora lo recoges?</h2>
                <p>Elige el receso que mejor te acomode.</p>
              </div>
            </div>

            <div className="checkout-slots">
              {horarios.map((horario) => (
                <label
                  key={horario.id}
                  className={`checkout-slot ${
                    String(horarioId) === String(horario.id) ? "is-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="horario"
                    value={horario.id}
                    checked={String(horarioId) === String(horario.id)}
                    onChange={(e) => setHorarioId(e.target.value)}
                  />

                  <Icon name="clock" size={19} />

                  <span>
                    <strong>{horario.nombre}</strong>

                    {horario.hora_inicio && (
                      <small>
                        {formatHour(horario.hora_inicio)} –{" "}
                        {formatHour(horario.hora_fin)}
                      </small>
                    )}
                  </span>
                </label>
              ))}

              {horarios.length === 0 && (
                <p className="checkout-empty-slots">
                  No hay horarios disponibles por ahora.
                </p>
              )}
            </div>
          </section>

          <section className="checkout-step mb-reveal" style={{ "--i": 1 }}>
            <div className="checkout-step-head">
              <span className="checkout-step-number">2</span>

              <div>
                <h2>Método de pago</h2>
                <p>El cobro se realiza al momento de la entrega.</p>
              </div>
            </div>

            <div className="checkout-payments">
              <label className="mb-option">
                <input
                  type="radio"
                  name="pago"
                  value="efectivo"
                  checked={metodoPago === "efectivo"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />

                <span className="mb-option-mark" />

                <span className="mb-option-body">
                  <strong>Pago en efectivo</strong>
                  <span>Pagas al recoger en ventanilla.</span>
                </span>

                <Icon name="cash" size={22} />
              </label>

              <label className="mb-option">
                <input
                  type="radio"
                  name="pago"
                  value="tarjeta"
                  checked={metodoPago === "tarjeta"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />

                <span className="mb-option-mark" />

                <span className="mb-option-body">
                  <strong>Tarjeta de débito/crédito</strong>
                  <span>Terminal disponible en la caja.</span>
                </span>

                <Icon name="card" size={22} />
              </label>
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Resumen de tu orden</h2>

          <ul className="checkout-list">
            {items.map((item, index) => (
              <li key={`${item.producto_id}-${index}`}>
                <span className="checkout-list-qty">{item.cantidad}x</span>

                <span className="checkout-list-name">
                  {item.nombre}

                  {item.personalizaciones.length > 0 && (
                    <small>
                      {item.personalizaciones
                        .map((extra) => extra.nombre)
                        .join(" · ")}
                    </small>
                  )}
                </span>

                <strong>${item.subtotal.toFixed(2)}</strong>
              </li>
            ))}
          </ul>

          <div className="checkout-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            type="button"
            className="mb-btn mb-btn-accent mb-btn-lg mb-btn-block"
            onClick={handleCheckout}
            disabled={submitting}
          >
            {submitting ? <span className="mb-spinner" /> : null}
            {submitting ? "Enviando…" : "Confirmar pedido"}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
