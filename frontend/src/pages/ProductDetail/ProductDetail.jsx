import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import productService from "../../services/productService";

import { useCart } from "../../context/CartContext";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { addItem } = useCart();

  const [product, setProduct] = useState(null);

  const [personalizaciones, setPersonalizaciones] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productService.getProductDetail(id);

        setProduct(response.data);

        setPersonalizaciones(response.personalizaciones);
      } catch (error) {
        console.error(error);
      }
    };

    loadProduct();
  }, [id]);

  const handleOptionChange = (option) => {
    const exists = selectedOptions.some((item) => item.id === option.id);

    if (exists) {
      setSelectedOptions((prev) =>
        prev.filter((item) => item.id !== option.id),
      );
    } else {
      setSelectedOptions((prev) => [...prev, option]);
    }
  };

  const handleAddToCart = () => {
    console.log(product);
    addItem(product, quantity, selectedOptions);

    navigate("/home");
  };

  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="product-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Regresar
      </button>

      <div className="product-card-detail">
        <div className="product-image-large">
          <img
            src={`http://localhost:3000${product.url_imagen}`}
            alt={product.nombre}
          />
        </div>

        <div className="product-info">
          <span className="status">
            {product.disponible ? "🟢 Disponible" : "🔴 Agotado"}
          </span>

          <h1>{product.nombre}</h1>

          <p className="description">{product.descripcion}</p>

          <h2 className="price">${product.precio_base}</h2>
        </div>
      </div>

      <div className="options-card">
        <h2>Personaliza tu pedido</h2>

        {personalizaciones.map((item) => (
          <label key={item.id} className="option-item">
            <div>
              <input
                type="checkbox"
                checked={selectedOptions.some(
                  (option) => option.id === item.id,
                )}
                onChange={() => handleOptionChange(item)}
              />

              <span>{item.nombre}</span>
            </div>

            <strong>+${item.precio_adicional}</strong>
          </label>
        ))}
      </div>

      <div className="bottom-section">
        <div className="quantity-card">
          <h3>Cantidad</h3>

          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              className="quantity-btn"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button className="add-cart-btn" onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
