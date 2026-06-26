import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import productService from "../../services/productService";

import { useCart } from "../../context/CartContext";

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
    <div
      style={{
        padding: "30px",
      }}
    >
      <button onClick={() => navigate(-1)}>← Volver</button>
      <h1>{product.nombre}</h1>
      <p>{product.descripcion}</p>
      <h2>${product.precio_base}</h2>
      <hr />
      <h3>Personalizaciones</h3>
      {personalizaciones.map((item) => (
        <div key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedOptions.some((option) => option.id === item.id)}
              onChange={() => handleOptionChange(item)}
            />
            {item.nombre} (+$
            {item.precio_adicional})
          </label>
        </div>
      ))}
      <hr />
      <h3>Cantidad</h3>
      <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
        -
      </button>{" "}
      {quantity}{" "}
      <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
      <br />
      <br />
      <button onClick={handleAddToCart}>Agregar al carrito</button>
    </div>
  );
}

export default ProductDetail;
