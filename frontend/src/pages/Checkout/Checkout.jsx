import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import horarioService from "../../services/horarioService";

import pedidoService from "../../services/pedidoService";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const { items, total, clearCart } = useCart();

  const [horarios, setHorarios] = useState([]);

  const [horarioId, setHorarioId] = useState("");

  const [metodoPago, setMetodoPago] = useState("efectivo");

  useEffect(() => {
    const loadHorarios = async () => {
      try {
        const response = await horarioService.getHorarios();

        setHorarios(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadHorarios();
  }, []);

  const handleCheckout = async () => {
    if (!horarioId) {
      alert("Selecciona un horario");

      return;
    }

    try {
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

      navigate(`/order-status/${response.data.pedidoId}`);
    } catch (error) {
      console.error(error);

      alert("Error al crear pedido");
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <div className="checkout-title">
          <h1>🧾 Confirmar Pedido</h1>

          <p>Revisa la información antes de confirmar tu pedido.</p>
        </div>

        <div className="checkout-section">
          <h3>📅 Horario de recolección</h3>

          <select
            className="checkout-select"
            value={horarioId}
            onChange={(e) => setHorarioId(e.target.value)}
          >
            <option value="">Selecciona horario</option>

            {horarios.map((horario) => (
              <option key={horario.id} value={horario.id}>
                {horario.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="checkout-section">
          <h3>💳 Método de pago</h3>

          <label className="payment-option">
            <input
              type="radio"
              value="efectivo"
              checked={metodoPago === "efectivo"}
              onChange={(e) => setMetodoPago(e.target.value)}
            />

            <span>Efectivo</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              value="tarjeta"
              checked={metodoPago === "tarjeta"}
              onChange={(e) => setMetodoPago(e.target.value)}
            />

            <span>Tarjeta</span>
          </label>
        </div>
      </div>

      <div className="checkout-summary">
        <h2>Resumen del pedido</h2>

        <hr />

        {items.map((item, index) => (
          <div key={index} className="checkout-product">
            <span>
              {item.nombre}
              {" x"}
              {item.cantidad}
            </span>

            <span>${item.subtotal.toFixed(2)}</span>
          </div>
        ))}

        <hr />

        <div className="checkout-total">
          <span>Total</span>

          <h1>${total.toFixed(2)}</h1>
        </div>

        <button className="confirm-button" onClick={handleCheckout}>
          Confirmar Pedido
        </button>
      </div>
    </div>
  );
}

export default Checkout;
