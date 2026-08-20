/**
 * Variantes de animación compartidas (Framer Motion).
 *
 * Tener el movimiento en un solo archivo evita que cada pantalla
 * invente su propia curva y su propia duración: la app se siente
 * hecha por la misma mano.
 */

/* Curvas alineadas con las variables --ease del sistema de diseño. */
export const easeOut = [0.16, 1, 0.3, 1];
export const easeSoft = [0.22, 0.85, 0.28, 1];

export const resorte = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

export const resorteSuave = {
  type: "spring",
  stiffness: 260,
  damping: 30,
};

/* Entrada y salida de una página completa. */
export const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: easeSoft },
  },
};

/* Contenedor que reparte la entrada de sus hijos en cascada. */
export const listaVariants = {
  animate: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.03,
    },
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.18, ease: easeSoft },
  },
};

/*
 Tarjetas que se reordenan entre columnas del tablero.

 La salida apaga `pointerEvents`: mientras un pedido cambia de columna
 conviven un instante la tarjeta que sale y la que entra, y sin esto se
 podía hacer clic en la que ya iba de salida, mandando una transición
 con datos viejos.
*/
export const tarjetaTableroVariants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: resorteSuave },
  exit: {
    opacity: 0,
    scale: 0.94,
    pointerEvents: "none",
    transition: { duration: 0.16, ease: easeSoft },
  },
};

/* Modales y hojas inferiores. */
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.16 } },
};

export const modalVariants = {
  initial: { opacity: 0, y: 28, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: resorte },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.98,
    transition: { duration: 0.16, ease: easeSoft },
  },
};

/* Aparición de un bloque que se despliega (acordeón, detalle). */
export const desplegableVariants = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.28, ease: easeOut },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.18, ease: easeSoft },
  },
};
