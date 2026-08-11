import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Icon from "./Icon";

import { useFavorites } from "../context/FavoritesContext";

import "./ProductCard.css";

const API_URL = "http://localhost:3000";

function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite } = useFavorites();

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

  return (
    <article
      className="product-card mb-reveal"
      style={{ "--i": index }}
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

        <button
          type="button"
          className={`product-favorite ${favorite ? "is-active" : ""}`}
          aria-label={
            favorite ? `Quitar ${product.nombre} de favoritos` : `Agregar ${product.nombre} a favoritos`
          }
          aria-pressed={favorite}
          onClick={handleFavoriteClick}
        >
          <Icon name="heart" size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.nombre}</h3>

        <p className="product-description">
          {product.descripcion || "Preparado al momento en la cafetería."}
        </p>

        <div className="product-footer">
          <span className="product-price">
            ${Number(product.precio_base).toFixed(2)}
          </span>

          <span
            className="product-add"
            aria-hidden="true"
            title={`Ver ${product.nombre}`}
          >
            <Icon name="plus" size={20} strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
