const API_URL = "http://localhost:3000";
import { useNavigate } from "react-router-dom";

import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-image">
        {product.url_imagen ? (
          <img src={`${API_URL}${product.url_imagen}`} alt={product.nombre} />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>

      <div className="product-body">
        {product.categoria && (
          <span className="product-category">{product.categoria}</span>
        )}

        <h3 className="product-name">{product.nombre}</h3>

        <p className="product-description">{product.descripcion}</p>

        <div className="product-footer">
          <span className="product-price">${product.precio_base}</span>

          <button
            type="button"
            className="product-button"
            aria-label={`Ver ${product.nombre}`}
            onClick={() => navigate(`/producto/${product.id}`)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
