import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import productService from "../../services/productService";

import Icon from "../../components/Icon";
import { SkeletonLine } from "../../components/Skeleton";

import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import "./ProductDetail.css";

const API_URL = "http://localhost:3000";

function ProductDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addItem } = useCart();

  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);

  const [personalizaciones, setPersonalizaciones] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await productService.getProductDetail(id);

        setProduct(response.data);

        setPersonalizaciones(response.data?.personalizaciones || []);
      } catch (error) {
        console.error(error);

        toast.error("No pudimos cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const groups = useMemo(() => {
    return personalizaciones.reduce((acc, item) => {
      const key = item.nombre_grupo || "Extras";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);

      return acc;
    }, {});
  }, [personalizaciones]);

  const extrasTotal = selectedOptions.reduce(
    (acc, item) => acc + Number(item.precio_adicional),
    0,
  );

  const liveTotal = product
    ? (Number(product.precio_base) + extrasTotal) * quantity
    : 0;

  const handleOptionChange = (option) => {
    const exists = selectedOptions.some((item) => item.id === option.id);

    if (exists) {
      setSelectedOptions((prev) => prev.filter((item) => item.id !== option.id));
    } else {
      setSelectedOptions((prev) => [...prev, option]);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedOptions);

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

  if (loading) {
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
        <figure className="detail-media">
          {product.url_imagen ? (
            <img src={`${API_URL}${product.url_imagen}`} alt={product.nombre} />
          ) : (
            <span className="detail-media-empty">
              <Icon name="image" size={38} />
            </span>
          )}
        </figure>

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

            <button
              type="button"
              className={`detail-favorite ${isFavorite(product.id) ? "is-active" : ""}`}
              aria-pressed={isFavorite(product.id)}
              aria-label={
                isFavorite(product.id)
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
              onClick={handleToggleFavorite}
            >
              <Icon
                name="heart"
                size={19}
                fill={isFavorite(product.id) ? "currentColor" : "none"}
              />
            </button>
          </div>

          <p className="detail-description">
            {product.descripcion ||
              "Platillo preparado al momento por la cafetería de la UPMH."}
          </p>

          <div className="detail-price">
            <span>Precio base</span>
            <strong>${Number(product.precio_base).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {personalizaciones.length > 0 && (
        <section className="detail-options">
          <div className="mb-section-head">
            <h2>Personaliza tu pedido</h2>
            <span>{personalizaciones.length} opciones</span>
          </div>

          <div className="detail-groups">
            {Object.entries(groups).map(([groupName, options], groupIndex) => (
              <div
                key={groupName}
                className="detail-group mb-reveal"
                style={{ "--i": groupIndex }}
              >
                <h3>
                  <Icon name="tag" size={16} />
                  {groupName}
                </h3>

                <div className="detail-group-list">
                  {options.map((item) => (
                    <label key={item.id} className="mb-option violet">
                      <input
                        type="checkbox"
                        checked={selectedOptions.some(
                          (option) => option.id === item.id,
                        )}
                        onChange={() => handleOptionChange(item)}
                      />

                      <span className="mb-option-mark square" />

                      <span className="mb-option-body">
                        <strong>{item.nombre}</strong>
                      </span>

                      <span className="detail-option-price">
                        {Number(item.precio_adicional) > 0
                          ? `+$${Number(item.precio_adicional).toFixed(2)}`
                          : "Incluido"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

            <strong>{quantity}</strong>

            <button
              type="button"
              className="qty-btn"
              aria-label="Agregar uno"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              <Icon name="plus" size={17} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="detail-total">
          <span className="mb-stat-label">Total</span>
          <strong>${liveTotal.toFixed(2)}</strong>
        </div>

        <button
          type="button"
          className="mb-btn mb-btn-accent mb-btn-lg detail-add"
          onClick={handleAddToCart}
          disabled={!product.disponible}
        >
          <Icon name="cart" size={19} />
          {product.disponible ? "Agregar al carrito" : "No disponible"}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
