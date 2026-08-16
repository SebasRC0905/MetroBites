import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import Icon from "./Icon";

import holidayService from "../services/holidayService";
import { queryKeys } from "../lib/queryClient";

import "./HolidayNotice.css";

/**
 * Aviso de días sin servicio en la cafetería, calculado con el
 * calendario oficial de días festivos de México (backend → Nager.Date).
 *
 * Si la API externa falla, el aviso simplemente no aparece: es
 * información de apoyo, nunca debe estorbar el menú.
 */
function HolidayNotice() {
  const consulta = useQuery({
    queryKey: queryKeys.festivos,
    queryFn: () => holidayService.getUpcoming(3),
    staleTime: 12 * 60 * 60 * 1000,
    retry: 1,
    select: (respuesta) => respuesta.data,
  });

  const datos = consulta.data;

  if (consulta.isError || !datos?.aviso) {
    return null;
  }

  const siguiente = datos.festivos[0];

  const cercano = siguiente.diasFaltantes <= 7;

  return (
    <motion.aside
      className={`holiday-notice ${cercano ? "is-close" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <span className="holiday-icon">
        <Icon name="calendar" size={20} />
      </span>

      <div className="holiday-body">
        <strong>{datos.aviso}</strong>

        <span>
          {siguiente.esHoy
            ? "Hoy no hay servicio en la cafetería."
            : `Faltan ${siguiente.diasFaltantes} días · calendario oficial de México`}
        </span>
      </div>

      <div className="holiday-next">
        {datos.festivos.slice(1).map((festivo) => (
          <span key={festivo.fecha} title={festivo.fechaLegible}>
            {festivo.nombre}
          </span>
        ))}
      </div>
    </motion.aside>
  );
}

export default HolidayNotice;
