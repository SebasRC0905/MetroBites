import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../context/CartContext";

import horarioService from "../../services/horarioService";
import pedidoService from "../../services/pedidoService";
import couponService from "../../services/couponService";
import paymentMethodService from "../../services/paymentMethodService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";

import "./Checkout.css";

const formatHour = (value) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 5);
};

const cardTypes = ["tarjeta_credito", "tarjeta_debito"];

const methodLabels = {
  tarjeta_credito: "Crédito",
  tarjeta_debito: "Débito",
  paypal: "PayPal",
};

function Checkout() {
  const navigate = useNavigate();

  const { items, total, clearCart } = useCart();

  const [horarios, setHorarios] = useState([]);

  const [horarioId, setHorarioId] = useState("");

  const [metodoPago, setMetodoPago] = useState("efectivo");

  const [savedMethods, setSavedMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await horarioService.getHorarios();

        setHorarios(response.data);
      } catch (error) {
        console.error(error);

        toast.error("No pudimos cargar los horarios");
      }

      try {
        const response = await paymentMethodService.getMethods();

        setSavedMethods(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const methodsForCategory = useMemo(() => {
    if (metodoPago === "tarjeta") {
      return savedMethods.filter((item) => cardTypes.includes(item.tipo));
    }

    if (metodoPago === "paypal") {
      return savedMethods.filter((item) => item.tipo === "paypal");
    }

    return [];
  }, [savedMethods, metodoPago]);

  useEffect(() => {
    const pickDefaultMethod = () => {
      if (methodsForCategory.length === 0) {
        setSelectedMethodId(null);

        return;
      }

      const preferido =
        methodsForCategory.find((item) => item.predeterminado) ||
        methodsForCategory[0];

      setSelectedMethodId(preferido.id);
    };

    pickDefaultMethod();
  }, [methodsForCategory]);

  const finalTotal = appliedCoupon ? appliedCoupon.total : total;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Ingresa un código de cupón");

      return;
    }

    try {
      setValidatingCoupon(true);
      setCouponError("");

      const response = await couponService.validateCoupon(
        couponCode.trim(),
        total,
      );

      setAppliedCoupon(response.data);

      toast.success(`Cupón ${response.data.codigo} aplicado`);
    } catch (error) {
      console.error(error);

      setAppliedCoupon(null);
      setCouponError(
        error.response?.data?.message || "No pudimos validar el cupón",
      );
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

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

        // Instrucciones que el alumno escribió para la cocina.
        notas: item.notas || undefined,
      }));

      const response = await pedidoService.createOrder({
        horario_id: Number(horarioId),

        metodo_pago: metodoPago,

        productos,

        ...(appliedCoupon ? { codigo_cupon: appliedCoupon.codigo } : {}),

        ...(selectedMethodId && metodoPago !== "efectivo"
          ? { metodo_pago_id: selectedMethodId }
          : {}),
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
                  <strong>Tarjeta de crédito o débito</strong>
                  <span>Terminal disponible en la caja.</span>
                </span>

                <Icon name="card" size={22} />
              </label>

              <label className="mb-option">
                <input
                  type="radio"
                  name="pago"
                  value="paypal"
                  checked={metodoPago === "paypal"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />

                <span className="mb-option-mark" />

                <span className="mb-option-body">
                  <strong>PayPal</strong>
                  <span>Se concilia con tu cuenta al recoger.</span>
                </span>

                <Icon name="wallet" size={22} />
              </label>
            </div>

            {(metodoPago === "tarjeta" || metodoPago === "paypal") && (
              <div className="checkout-saved-methods">
                {methodsForCategory.length === 0 ? (
                  <p className="checkout-no-methods">
                    <Icon name="alert" size={15} />
                    No tienes {metodoPago === "paypal" ? "PayPal" : "tarjetas"}{" "}
                    guardadas.{" "}
                    <Link to="/metodos-pago">Agrega una en tu perfil</Link>.
                  </p>
                ) : (
                  <>
                    <span className="checkout-saved-label">
                      Elige el método guardado
                    </span>

                    <div className="checkout-saved-list">
                      {methodsForCategory.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          className={`checkout-saved-chip ${
                            selectedMethodId === method.id ? "is-active" : ""
                          }`}
                          onClick={() => setSelectedMethodId(method.id)}
                        >
                          <Icon
                            name={method.tipo === "paypal" ? "wallet" : "card"}
                            size={16}
                          />
                          <span>
                            {method.alias || methodLabels[method.tipo]}
                          </span>
                          <small>{method.referencia}</small>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          <section className="checkout-step mb-reveal" style={{ "--i": 2 }}>
            <div className="checkout-step-head">
              <span className="checkout-step-number">3</span>

              <div>
                <h2>¿Tienes un cupón?</h2>
                <p>Aplica un código de descuento a este pedido.</p>
              </div>
            </div>

            {appliedCoupon ? (
              <div className="coupon-applied">
                <span className="coupon-applied-icon">
                  <Icon name="tag" size={18} />
                </span>

                <div>
                  <strong>{appliedCoupon.codigo}</strong>
                  <span>Descuento de ${appliedCoupon.descuento.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  className="mb-btn mb-btn-ghost mb-btn-sm"
                  onClick={handleRemoveCoupon}
                >
                  <Icon name="close" size={15} />
                  Quitar
                </button>
              </div>
            ) : (
              <div className="coupon-form">
                <input
                  className="mb-input"
                  type="text"
                  placeholder="Código de descuento…"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                />

                <button
                  type="button"
                  className="mb-btn mb-btn-soft"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon}
                >
                  {validatingCoupon ? <span className="mb-spinner" /> : null}
                  Aplicar
                </button>
              </div>
            )}

            {couponError && (
              <p className="coupon-error">
                <Icon name="alert" size={15} />
                {couponError}
              </p>
            )}
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Resumen de tu orden</h2>

          <ul className="checkout-list">
            {items.map((item) => (
              <li key={item.uid}>
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

                  {item.notas && <em>“{item.notas}”</em>}
                </span>

                <strong>${item.subtotal.toFixed(2)}</strong>
              </li>
            ))}
          </ul>

          <div className="checkout-subtotal-rows">
            <div>
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            {appliedCoupon && (
              <div className="is-discount">
                <span>Cupón {appliedCoupon.codigo}</span>
                <strong>-${appliedCoupon.descuento.toFixed(2)}</strong>
              </div>
            )}
          </div>

          <div className="checkout-total">
            <span>Total</span>
            <strong>${finalTotal.toFixed(2)}</strong>
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
