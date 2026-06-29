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

  const categories = ["Todos", "Desayunos", "Comidas", "Bebidas", "Snacks"];

  const categoryIcons = {
    Todos: "✨",
    Desayunos: "☕",
    Comidas: "🍽",
    Bebidas: "🥤",
    Snacks: "🍟",
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" ? true : product.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const firstName = user?.nombre?.split(" ")[0] || "";
  const userInitial = firstName.charAt(0).toUpperCase();

  return (
    <div className="home-content">
      <header className="home-header">
        <div className="search-shell">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="¿Qué se te antoja hoy?"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cart-total">
          <div className="user-avatar">{userInitial}</div>
          <span>{firstName}</span>

          <button
            type="button"
            className="cart-chip"
            onClick={() => navigate("/cart")}
          >
            <span>🛒</span>
            <strong>${total.toFixed(2)}</strong>
          </button>
        </div>
      </header>

      <section className="hero-banner">
        <div className="hero-copy">
          <span className="hero-kicker">UPMH Cafetería</span>
          <h1>Pide desde tu salón, recoge sin filas.</h1>
          <p>Elige tus favoritos, personaliza tu orden y llega directo por ella.</p>
        </div>

        <div className="hero-metrics" aria-hidden="true">
          <div>
            <strong>5</strong>
            <span>Categorías</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Filas</span>
          </div>
        </div>
      </section>

      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category ? "category-btn active" : "category-btn"
            }
            onClick={() => setSelectedCategory(category)}
          >
            <span>{categoryIcons[category]}</span>
            {category}
          </button>
        ))}
      </div>

      <section className="products-section">
        <div className="section-heading">
          <h2 className="section-title">Favoritos de la semana</h2>
          <span>{filteredProducts.length} productos</span>
        </div>

        {loading ? (
          <p className="loading-text">Cargando...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-products">
            <h3>No encontramos productos</h3>
            <p>Prueba con otra búsqueda o categoría.</p>
          </div>
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
