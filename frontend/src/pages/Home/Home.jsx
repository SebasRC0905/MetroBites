import { useEffect, useState } from "react";

import productService from "../../services/productService";

import ProductCard from "../../components/ProductCard";

import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const { total } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.getProducts();

        setProducts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  const categories = [
  "Todos",
  "Desayunos",
  "Comidas",
  "Bebidas",
  "Snacks"
];
const filteredProducts =
  products.filter((product) => {

    const matchesSearch =
      product.nombre
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesCategory =
      selectedCategory === "Todos"
        ? true
        : product.categoria === selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );

  });
  return (
    <div className="home-content">
      <header className="home-header">
        <input
          type="text"
          placeholder="🔍 ¿Qué se te antoja hoy?"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="cart-total">
          <div className="user-avatar" />
          <span>{user?.nombre?.split(" ")[0]}</span>

          <div onClick={() => navigate("/cart")}>🛒 ${total.toFixed(2)}</div>
        </div>
      </header>

      <section className="hero-banner">
        <h1>Pide desde tu salón, recoge sin filas. ⚡</h1>
      </section>
      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <section>
        <h2 className="section-title">Favoritos de la semana</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
