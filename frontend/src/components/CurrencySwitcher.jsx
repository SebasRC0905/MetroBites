import { motion } from "framer-motion";

import { useCurrency } from "../context/CurrencyContext";

import "./CurrencySwitcher.css";

/**
 * Selector de moneda para ver los precios en pesos, dólares o euros.
 * El cobro siempre es en pesos: esto es una referencia con el tipo de
 * cambio del día (backend → Frankfurter / BCE).
 */
function CurrencySwitcher() {
  const { moneda, monedas, cambiarMoneda, fecha, disponible } = useCurrency();

  if (!disponible || monedas.length <= 1) {
    return null;
  }

  return (
    <div
      className="currency-switcher"
      title={fecha ? `Tipo de cambio del ${fecha}` : undefined}
    >
      {monedas.map((item) => {
        const activa = item.codigo === moneda.codigo;

        return (
          <button
            key={item.codigo}
            type="button"
            className={`currency-option ${activa ? "is-active" : ""}`}
            aria-pressed={activa}
            onClick={() => cambiarMoneda(item.codigo)}
          >
            {activa && (
              <motion.span
                layoutId="currency-pill"
                className="currency-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}

            <span className="currency-label">
              {item.bandera} {item.codigo}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default CurrencySwitcher;
