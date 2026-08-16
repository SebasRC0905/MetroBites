import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import Icon from "./Icon";
import AnimatedNumber from "./AnimatedNumber";
import { SkeletonLine } from "./Skeleton";

import { useProducto } from "../hooks/useProducts";
import useCustomizer from "../hooks/useCustomizer";

import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";

import {
  backdropVariants,
  itemVariants,
  listaVariants,
  modalVariants,
  resorte,
} from "../lib/motion";

import "./CustomizeSheet.css";

const API_URL = "http://localhost:3000";

const MAXIMO_NOTAS = 140;

/* Icono sugerido según el grupo, para que se lea de un vistazo. */
const ICONO_GRUPO = {
  Tamaño: "package",
  Temperatura: "flame",
  Salsa: "flame",
  "Nivel de picante": "flame",
  Endulzante: "sparkles",
  "Tipo de leche": "bottle",
  "Tipo de pan": "utensils",
  Acompañamiento: "utensils",
  Toppings: "snack",
  Extras: "plus",
  "Sin ingredientes": "close",
};

const textoReglaGrupo = (grupo) => {
  if (grupo.tipo === "unica") {
    return grupo.minimo > 0 ? "Elige 1 · obligatorio" : "Elige 1";
  }

  if (grupo.maximo) {
    return `Hasta ${grupo.maximo}`;
  }

  return "Los que quieras";
};

/**
 * Contenido de la hoja.
 *
 * Va en su propio componente y montado con `key={productoId}`: al
 * cerrarse se desmonta, así la siguiente apertura arranca con cantidad
 * 1 y sin notas, sin lógica de reinicio.
 */
function SheetContent({ productoId, onClose }) {
  const { addItem } = useCart();
  const { equivalente } = useCurrency();

  const consulta = useProducto(productoId);

  const producto = consulta.data;

  const {
    grupos,
    alternar,
    estaSeleccionada,
    grupoLleno,
    opcionesElegidas,
    extrasTotal,
    grupoPendiente,
    esValida,
  } = useCustomizer(producto?.personalizaciones || []);

  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState("");

  /* Cerrar con Escape y bloquear el scroll del fondo mientras está abierta. */
  useEffect(() => {
    const alPresionar = (evento) => {
      if (evento.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const precioUnitario = producto
    ? Number(producto.precio_base) + extrasTotal
    : 0;

  const total = precioUnitario * cantidad;

  const agregar = () => {
    if (!producto || !esValida) {
      toast.error(
        grupoPendiente
          ? `Elige una opción de "${grupoPendiente.nombre}"`
          : "Revisa tu personalización",
      );

      return;
    }

    addItem(producto, {
      cantidad,
      personalizaciones: opcionesElegidas.map((opcion) => ({
        id: opcion.id,
        nombre: opcion.nombre,
        precio_adicional: Number(opcion.precio_adicional),
        nombre_grupo: opcion.nombre_grupo,
      })),
      notas,
    });

    toast.success(`${producto.nombre} agregado al carrito`);

    onClose();
  };

  return (
    <motion.div
      className="sheet-backdrop"
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="presentation"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.section
        className="sheet"
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label={`Personalizar ${producto?.nombre || "producto"}`}
      >
        <span className="sheet-grabber" aria-hidden="true" />

        {consulta.isLoading || !producto ? (
          <div className="sheet-loading">
            <SkeletonLine height={70} radius={18} />
            <SkeletonLine width="55%" height={16} />
            <SkeletonLine height={54} radius={14} />
            <SkeletonLine height={54} radius={14} />
          </div>
        ) : (
          <>
            <header className="sheet-head">
              <div className="sheet-media">
                {producto.url_imagen ? (
                  <img
                    src={`${API_URL}${producto.url_imagen}`}
                    alt={producto.nombre}
                  />
                ) : (
                  <Icon name="utensils" size={24} />
                )}
              </div>

              <div className="sheet-headings">
                <span className="mb-badge violet">{producto.categoria}</span>

                <h2>{producto.nombre}</h2>

                <p>
                  {producto.descripcion ||
                    "Preparado al momento en la cafetería."}
                </p>
              </div>

              <button
                type="button"
                className="sheet-close"
                aria-label="Cerrar"
                onClick={onClose}
              >
                <Icon name="close" size={18} strokeWidth={2.2} />
              </button>
            </header>

            <motion.div
              className="sheet-body"
              variants={listaVariants}
              initial="initial"
              animate="animate"
            >
              {grupos.length === 0 && (
                <motion.p
                  className="sheet-sin-opciones"
                  variants={itemVariants}
                >
                  <Icon name="checkCircle" size={16} />
                  Este producto se sirve tal cual, sin opciones extra.
                </motion.p>
              )}

              {grupos.map((grupo) => (
                <motion.fieldset
                  key={grupo.nombre}
                  className="sheet-group"
                  variants={itemVariants}
                >
                  <legend>
                    <span className="sheet-group-title">
                      <Icon
                        name={ICONO_GRUPO[grupo.nombre] || "tag"}
                        size={15}
                      />
                      {grupo.nombre}
                    </span>

                    <span
                      className={`sheet-group-rule ${
                        grupo.minimo > 0 ? "is-required" : ""
                      }`}
                    >
                      {textoReglaGrupo(grupo)}
                    </span>
                  </legend>

                  <div className="sheet-options">
                    {grupo.opciones.map((opcion) => {
                      const activa = estaSeleccionada(grupo, opcion);

                      const bloqueada =
                        !activa &&
                        grupo.tipo === "multiple" &&
                        grupoLleno(grupo);

                      return (
                        <motion.button
                          key={opcion.id}
                          type="button"
                          className={`sheet-option ${activa ? "is-active" : ""}`}
                          disabled={bloqueada}
                          onClick={() => alternar(grupo, opcion)}
                          whileTap={{ scale: 0.97 }}
                          transition={resorte}
                        >
                          <span
                            className={`sheet-option-mark ${
                              grupo.tipo === "unica" ? "is-round" : ""
                            }`}
                          >
                            <AnimatePresence>
                              {activa && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={resorte}
                                >
                                  <Icon
                                    name="check"
                                    size={12}
                                    strokeWidth={3}
                                  />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>

                          <span className="sheet-option-text">
                            <strong>{opcion.nombre}</strong>

                            {opcion.descripcion && (
                              <small>{opcion.descripcion}</small>
                            )}
                          </span>

                          <span className="sheet-option-price">
                            {Number(opcion.precio_adicional) > 0
                              ? `+$${Number(opcion.precio_adicional).toFixed(2)}`
                              : "Incluido"}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.fieldset>
              ))}

              <motion.label className="sheet-notes" variants={itemVariants}>
                <span className="sheet-group-title">
                  <Icon name="edit" size={15} />
                  Instrucciones para la cocina
                </span>

                <textarea
                  className="mb-textarea"
                  rows={2}
                  maxLength={MAXIMO_NOTAS}
                  placeholder="Ej. sin cebolla, poca sal, salsa aparte…"
                  value={notas}
                  onChange={(evento) => setNotas(evento.target.value)}
                />

                <small className="sheet-notes-count">
                  {notas.length}/{MAXIMO_NOTAS}
                </small>
              </motion.label>
            </motion.div>

            <footer className="sheet-foot">
              <div className="sheet-qty">
                <button
                  type="button"
                  aria-label="Quitar uno"
                  onClick={() =>
                    setCantidad((previa) => Math.max(1, previa - 1))
                  }
                  disabled={cantidad <= 1}
                >
                  <Icon name="minus" size={16} strokeWidth={2.4} />
                </button>

                <AnimatePresence mode="popLayout">
                  <motion.strong
                    key={cantidad}
                    initial={{ y: -12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 12, opacity: 0 }}
                    transition={resorte}
                  >
                    {cantidad}
                  </motion.strong>
                </AnimatePresence>

                <button
                  type="button"
                  aria-label="Agregar uno"
                  onClick={() =>
                    setCantidad((previa) => Math.min(20, previa + 1))
                  }
                  disabled={cantidad >= 20}
                >
                  <Icon name="plus" size={16} strokeWidth={2.4} />
                </button>
              </div>

              <div className="sheet-total">
                <span>Total</span>

                <strong>
                  <AnimatedNumber
                    value={total}
                    decimals={2}
                    prefix="$"
                    duration={380}
                  />
                </strong>

                {equivalente(total) && <small>{equivalente(total)}</small>}
              </div>

              <motion.button
                type="button"
                className="mb-btn mb-btn-accent mb-btn-lg sheet-add"
                onClick={agregar}
                disabled={!producto.disponible || !esValida}
                whileTap={{ scale: 0.98 }}
              >
                <Icon name="cart" size={18} />

                {!producto.disponible
                  ? "No disponible"
                  : esValida
                    ? "Agregar al carrito"
                    : `Elige ${grupoPendiente?.nombre}`}
              </motion.button>
            </footer>
          </>
        )}
      </motion.section>
    </motion.div>
  );
}

/**
 * Hoja de personalización que se abre al agregar un producto.
 *
 * Los grupos y sus reglas vienen del backend según la categoría del
 * producto, así que una bebida pide tamaño y temperatura mientras que
 * una torta pide tipo de pan y salsa, con el mismo componente.
 */
function CustomizeSheet({ productoId, abierto, onClose }) {
  return (
    <AnimatePresence>
      {abierto && (
        <SheetContent
          key={productoId}
          productoId={productoId}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

export default CustomizeSheet;
