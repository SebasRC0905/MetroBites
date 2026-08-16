import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { pageVariants } from "../lib/motion";

/**
 * Sustituye a `<Outlet />` dentro de los layouts para animar el cambio
 * de pantalla sin remontar la barra lateral ni el encabezado.
 *
 * Se usa `useOutlet()` en vez de `<Outlet />` porque devuelve el
 * elemento ya resuelto: así `AnimatePresence` puede conservar la
 * pantalla anterior mientras se desvanece (`mode="wait"`).
 */
function AnimatedOutlet({ className = "" }) {
  const outlet = useOutlet();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className={className}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedOutlet;
