import { useNavigate } from "react-router-dom";

import Icon from "./Icon";

import "./ProductCard.css";

const API_URL = "http://localhost:3000";

function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();

  const open = () => navigate(`/producto/${product.id}`);

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
