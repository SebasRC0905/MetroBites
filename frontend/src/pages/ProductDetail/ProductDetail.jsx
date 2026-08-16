import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import Icon from "../../components/Icon";
import AnimatedNumber from "../../components/AnimatedNumber";
import NutritionPanel from "../../components/NutritionPanel";
import { SkeletonLine } from "../../components/Skeleton";

import { useProducto } from "../../hooks/useProducts";
import useCustomizer from "../../hooks/useCustomizer";

import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useCurrency } from "../../context/CurrencyContext";

import { itemVariants, listaVariants, resorte } from "../../lib/motion";

import "./ProductDetail.css";

const API_URL = "http://localhost:3000";

const MAXIMO_NOTAS = 140;

const textoReglaGrupo = (grupo) => {
  if (grupo.tipo === "unica") {
    return grupo.minimo > 0 ? "Elige 1 · obligatorio" : "Elige 1";
  }

  return grupo.maximo ? `Hasta ${grupo.maximo}` : "Los que quieras";
};

function ProductDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { equivalente } = useCurrency();

  const { data: product, isLoading } = useProducto(id);

  const {
    grupos,
    alternar,
    estaSeleccionada,
    grupoLleno,
    opcionesElegidas,
    extrasTotal,
    grupoPendiente,
    esValida,
  } = useCustomizer(product?.personalizaciones || []);

  const [quantity, setQuantity] = useState(1);
  const [notas, setNotas] = useState("");

  const liveTotal = product
    ? (Number(product.precio_base) + extrasTotal) * quantity
    : 0;

  const handleAddToCart = () => {
    if (!esValida) {
      toast.error(`Elige una opción de "${grupoPendiente.nombre}"`);

      return;
    }

    addItem(product, {
      cantidad: quantity,
      personalizaciones: opcionesElegidas.map((opcion) => ({
        id: opcion.id,
        nombre: opcion.nombre,
        precio_adicional: Number(opcion.precio_adicional),
        nombre_grupo: opcion.nombre_grupo,
      })),
      notas,
    });

    toast.success(`${product.nombre} agregado al carrito`);

    navigate("/home");
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(product);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos actualizar tus favoritos");
    }
  };

  if (isLoading) {
    return (
      <div className="detail">
        <SkeletonLine width={140} height={40} radius={999} />

        <div className="detail-skeleton">
          <SkeletonLine height={380} radius={22} />

          <div>
            <SkeletonLine width="40%" height={20} style={{ marginBottom: 18 }} />
            <SkeletonLine width="80%" height={40} style={{ marginBottom: 18 }} />
            <SkeletonLine height={14} style={{ marginBottom: 10 }} />
            <SkeletonLine width="70%" height={14} style={{ marginBottom: 26 }} />
            <SkeletonLine width={200} height={70} radius={16} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail">
        <button
          type="button"
          className="mb-btn mb-btn-ghost detail-back"
          onClick={() => navigate("/home")}
        >
          <Icon name="arrowLeft" size={18} />
          Volver al menú
        </button>
      </div>
    );
  }

  return (
    <div className="detail">
      <button
        type="button"
        className="mb-btn mb-btn-ghost detail-back"
        onClick={() => navigate(-1)}
      >
        <Icon name="arrowLeft" size={18} />
        Volver
      </button>

      <div className="detail-hero">
        <motion.figure
          className="detail-media"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          {product.url_imagen ? (
            <img src={`${API_URL}${product.url_imagen}`} alt={product.nombre} />
          ) : (
            <span className="detail-media-empty">
              <Icon name="image" size={38} />
            </span>
          )}
        </motion.figure>

        <div className="detail-info">
          <div className="detail-info-top">
            {product.categoria && (
              <span className="mb-badge violet">{product.categoria}</span>
            )}

            <span
              className={`mb-badge ${product.disponible ? "green" : "red"} live`}
            >
              <span className="mb-badge-dot" />
              {product.disponible ? "Disponible" : "Agotado"}
            </span>
          </div>

          <div className="detail-title-row">
            <h1>{product.nombre}</h1>

            <motion.button
              type="button"
              className={`detail-favorite ${isFavorite(product.id) ? "is-active" : ""}`}
              aria-pressed={isFavorite(product.id)}
              aria-label={
                isFavorite(product.id)
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
              onClick={handleToggleFavorite}
              whileTap={{ scale: 0.85 }}
              animate={
                isFavorite(product.id) ? { scale: [1, 1.22, 1] } : { scale: 1 }
              }
              transition={{ duration: 0.32 }}
            >
              <Icon
                name="heart"
                size={19}
                fill={isFavorite(product.id) ? "currentColor" : "none"}
              />
            </motion.button>
          </div>

          <p className="detail-description">
            {product.descripcion ||
              "Platillo preparado al momento por la cafetería de la UPMH."}
          </p>

          <div className="detail-price">
            <span>Precio base</span>
            <strong>${Number(product.precio_base).toFixed(2)}</strong>

            {equivalente(product.precio_base) && (
              <small>{equivalente(product.precio_base)}</small>
            )}
          </div>
        </div>
      </div>

      {grupos.length > 0 && (
        <section className="detail-options">
          <div className="mb-section-head">
            <h2>Personaliza tu pedido</h2>
            <span>
              {grupos.length} {grupos.length === 1 ? "grupo" : "grupos"} de
              opciones
            </span>
          </div>

          <motion.div
            className="detail-groups"
            variants={listaVariants}
            initial="initial"
            animate="animate"
          >
            {grupos.map((grupo) => (
              <motion.fieldset
                key={grupo.nombre}
                className="detail-group"
                variants={itemVariants}
              >
                <legend>
                  <span className="detail-group-name">
                    <Icon name="tag" size={16} />
                    {grupo.nombre}
                  </span>

                  <span
                    className={`detail-group-rule ${
                      grupo.minimo > 0 ? "is-required" : ""
                    }`}
                  >
                    {textoReglaGrupo(grupo)}
                  </span>
                </legend>

                <div className="detail-group-list">
                  {grupo.opciones.map((item) => {
                    const activa = estaSeleccionada(grupo, item);

                    const bloqueada =
                      !activa && grupo.tipo === "multiple" && grupoLleno(grupo);

                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        className={`detail-option ${activa ? "is-active" : ""}`}
                        disabled={bloqueada}
                        onClick={() => alternar(grupo, item)}
                        whileTap={{ scale: 0.98 }}
                        transition={resorte}
                      >
                        <span
                          className={`detail-option-mark ${
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
                                <Icon name="check" size={12} strokeWidth={3} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>

                        <span className="detail-option-body">
                          <strong>{item.nombre}</strong>

                          {item.descripcion && <small>{item.descripcion}</small>}
                        </span>

                        <span className="detail-option-price">
                          {Number(item.precio_adicional) > 0
                            ? `+$${Number(item.precio_adicional).toFixed(2)}`
                            : "Incluido"}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.fieldset>
            ))}
          </motion.div>

          <label className="detail-notes">
            <span className="detail-group-name">
              <Icon name="edit" size={16} />
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

            <small>
              {notas.length}/{MAXIMO_NOTAS}
            </small>
          </label>
        </section>
      )}

      <NutritionPanel productoId={product.id} />

      <div className="detail-actionbar">
        <div className="detail-qty">
          <span className="mb-stat-label">Cantidad</span>

          <div className="detail-qty-controls">
            <button
              type="button"
              className="qty-btn"
              aria-label="Quitar uno"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              <Icon name="minus" size={17} strokeWidth={2.4} />
            </button>

            <AnimatePresence mode="popLayout">
              <motion.strong
                key={quantity}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={resorte}
              >
                {quantity}
              </motion.strong>
            </AnimatePresence>

            <button
              type="button"
              className="qty-btn"
              aria-label="Agregar uno"
              onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
            >
              <Icon name="plus" size={17} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="detail-total">
          <span className="mb-stat-label">Total</span>

          <strong>
            <AnimatedNumber
              value={liveTotal}
              decimals={2}
              prefix="$"
              duration={380}
            />
          </strong>
        </div>

        <motion.button
          type="button"
          className="mb-btn mb-btn-accent mb-btn-lg detail-add"
          onClick={handleAddToCart}
          disabled={!product.disponible || !esValida}
          whileTap={{ scale: 0.98 }}
        >
          <Icon name="cart" size={19} />

          {!product.disponible
            ? "No disponible"
            : esValida
              ? "Agregar al carrito"
              : `Falta elegir ${grupoPendiente?.nombre}`}
        </motion.button>
      </div>
    </div>
  );
}

export default ProductDetail;
