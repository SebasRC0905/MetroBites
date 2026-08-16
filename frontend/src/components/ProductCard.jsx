import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Icon from "./Icon";
import CustomizeSheet from "./CustomizeSheet";

import { useFavorites } from "../context/FavoritesContext";
import { useCurrency } from "../context/CurrencyContext";

import { itemVariants, resorte } from "../lib/motion";

import "./ProductCard.css";

const API_URL = "http://localhost:3000";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { equivalente } = useCurrency();

  const [personalizando, setPersonalizando] = useState(false);

  const favorite = isFavorite(product.id);

  const open = () => navigate(`/producto/${product.id}`);

  const handleFavoriteClick = async (event) => {
    event.stopPropagation();

    try {
      await toggleFavorite(product);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos actualizar tus favoritos");
    }
  };

  const abrirPersonalizacion = (event) => {
    event.stopPropagation();

    setPersonalizando(true);
  };

  return (
    <>
      <motion.article
        className="product-card"
        variants={itemVariants}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={resorte}
        onClick={open}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        }}
      >
        <div className="product-media">
          {product.url_imagen ? (
            <img
              src={`${API_URL}${product.url_imagen}`}
              alt={product.nombre}
              loading="lazy"
            />
          ) : (
            <span className="product-media-empty">
              <Icon name="image" size={30} />
            </span>
          )}

          {product.categoria && (
            <span className="product-tag">{product.categoria}</span>
          )}

          <motion.button
            type="button"
            className={`product-favorite ${favorite ? "is-active" : ""}`}
            aria-label={
              favorite
                ? `Quitar ${product.nombre} de favoritos`
                : `Agregar ${product.nombre} a favoritos`
            }
            aria-pressed={favorite}
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.8 }}
            animate={favorite ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.32 }}
          >
            <Icon
              name="heart"
              size={17}
              fill={favorite ? "currentColor" : "none"}
            />
          </motion.button>
        </div>

        <div className="product-body">
          <h3 className="product-name">{product.nombre}</h3>

          <p className="product-description">
            {product.descripcion || "Preparado al momento en la cafetería."}
          </p>

          {Number(product.total_personalizaciones) > 0 && (
            <span className="product-custom-hint">
              <Icon name="sparkles" size={13} />
              Personalizable
            </span>
          )}

          <div className="product-footer">
            <span className="product-price">
              ${Number(product.precio_base).toFixed(2)}

              {equivalente(product.precio_base) && (
                <small>{equivalente(product.precio_base)}</small>
              )}
            </span>

            <motion.button
              type="button"
              className="product-add"
              aria-label={`Personalizar y agregar ${product.nombre}`}
              title="Agregar al carrito"
              onClick={abrirPersonalizacion}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.86 }}
              transition={resorte}
            >
              <Icon name="plus" size={20} strokeWidth={2.2} />
            </motion.button>
          </div>
        </div>
      </motion.article>

      <CustomizeSheet
        productoId={product.id}
        abierto={personalizando}
        onClose={() => setPersonalizando(false)}
      />
    </>
  );
}

export default ProductCard;
