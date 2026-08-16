import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import currencyService from "../services/currencyService";
import { queryKeys } from "../lib/queryClient";

const CurrencyContext = createContext();

const STORAGE_KEY = "metrobites_moneda";

const MONEDA_BASE = {
  codigo: "MXN",
  simbolo: "$",
  nombre: "Peso mexicano",
  bandera: "🇲🇽",
  tasa: 1,
};

const leerMonedaGuardada = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || MONEDA_BASE.codigo;
  } catch (error) {
    console.error(error);

    return MONEDA_BASE.codigo;
  }
};

/**
 * Moneda con la que el alumno ve los precios.
 *
 * Los precios siempre se guardan y se cobran en pesos; esto es solo una
 * conversión de referencia con el tipo de cambio del día que publica el
 * Banco Central Europeo (backend → Frankfurter). Sirve, por ejemplo,
 * para alumnos de intercambio.
 */
export const CurrencyProvider = ({ children }) => {
  const [codigo, setCodigo] = useState(leerMonedaGuardada);

  const consulta = useQuery({
    queryKey: queryKeys.divisas,
    queryFn: currencyService.getRates,
    // El BCE publica una vez al día.
    staleTime: 6 * 60 * 60 * 1000,
    retry: 1,
    select: (respuesta) => respuesta.data,
  });

  const monedas = useMemo(
    () => [MONEDA_BASE, ...(consulta.data?.monedas || [])],
    [consulta.data],
  );

  const moneda =
    monedas.find((item) => item.codigo === codigo) || MONEDA_BASE;

  const cambiarMoneda = useCallback((nuevoCodigo) => {
    setCodigo(nuevoCodigo);

    try {
      localStorage.setItem(STORAGE_KEY, nuevoCodigo);
    } catch (error) {
      console.error(error);
    }
  }, []);

  /** Formatea un monto en pesos usando la moneda elegida. */
  const formatear = useCallback(
    (montoEnPesos) => {
      const monto = Number(montoEnPesos) || 0;

      const convertido = monto * (moneda.tasa || 1);

      return `${moneda.simbolo}${convertido.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [moneda],
  );

  /** Texto de apoyo ("≈ US$3.50") cuando se muestra el precio en pesos. */
  const equivalente = useCallback(
    (montoEnPesos) => {
      if (moneda.codigo === MONEDA_BASE.codigo) {
        return null;
      }

      return `≈ ${formatear(montoEnPesos)}`;
    },
    [moneda, formatear],
  );

  const valor = useMemo(
    () => ({
      moneda,
      monedas,
      esMonedaBase: moneda.codigo === MONEDA_BASE.codigo,
      cambiarMoneda,
      formatear,
      equivalente,
      fecha: consulta.data?.fecha || null,
      fuente: consulta.data?.fuente || null,
      disponible: !consulta.isError,
    }),
    [moneda, monedas, cambiarMoneda, formatear, equivalente, consulta.data, consulta.isError],
  );

  return (
    <CurrencyContext.Provider value={valor}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
