import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

import ProductCard from "../../components/ProductCard";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import { SkeletonGrid } from "../../components/Skeleton";
import WeatherWidget from "../../components/WeatherWidget";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import "./Home.css";

const fallbackCategories = [
  "Populares",
  "Desayunos",
  "Comidas",
  "Bebidas",
  "Snacks",
];

const categoryIcons = {
  Todos: "sparkles",
  Populares: "flame",
  Desayunos: "coffee",
  Comidas: "utensils",
  Bebidas: "bottle",
  Snacks: "snack",
};

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const { total, items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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

    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();

        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data.map((item) => item.nombre));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
    loadCategories();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.nombre
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        const matchesCategory =
          selectedCategory === "Todos"
            ? true
            : product.categoria === selectedCategory;

        return matchesSearch && matchesCategory;
      }),
    [products, search, selectedCategory],
  );

  const firstName = user?.nombre?.split(" ")[0] || "";
  const userInitial = firstName.charAt(0).toUpperCase() || "U";

  const tabs = ["Todos", ...categories];

  return (
    <div className="home">
      <header className="home-bar">
        <div className="mb-input-icon home-search">
          <Icon name="search" size={19} />
          <input
            type="search"
            className="mb-input"
            placeholder="¿Qué se te antoja hoy?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="home-bar-user">
          <div className="home-identity">
            <span className="mb-avatar sm">{userInitial}</span>
            <span>{firstName}</span>
          </div>

          <button
            type="button"
            className="home-cart"
            onClick={() => navigate("/cart")}
          >
            <span className="home-cart-icon">
              <Icon name="cart" size={19} />
              {items.length > 0 && <i>{items.length}</i>}
            </span>

            <strong>${total.toFixed(2)}</strong>
          </button>
        </div>
      </header>

      <section className="home-hero">
        <svg
          className="home-hero-wave"
          viewBox="0 0 320 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M320 0v260H92c74-46 108-96 108-150C200 66 176 26 132 0z"
            fill="url(#heroWave)"
          />
          <defs>
            <linearGradient id="heroWave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9b7d" />
              <stop offset="100%" stopColor="#ef6a4e" />
            </linearGradient>
          </defs>
        </svg>

        <div className="home-hero-copy">
          <span className="home-hero-kicker">
            <Icon name="store" size={14} />
            Cafetería UPMH
          </span>

          <h1>
            Pide desde tu salón,
            <br />
            recoge sin filas.
          </h1>

          <p>
            Elige tus favoritos, personaliza tu orden y pásala a recoger en el
            receso que prefieras.
          </p>
        </div>

        <dl className="home-hero-stats">
          <div>
            <dt>Productos</dt>
            <dd>{loading ? "—" : products.length}</dd>
          </div>

          <div>
            <dt>Categorías</dt>
            <dd>{categories.length}</dd>
          </div>
        </dl>
      </section>

      <WeatherWidget
        onSuggest={(categoria) => {
          setSelectedCategory(categoria);

          document
            .getElementById("home-products")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <nav className="home-tabs" aria-label="Categorías">
        {tabs.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`mb-chip ${selectedCategory === category ? "is-active" : ""}`}
            style={{ "--i": index }}
            onClick={() => setSelectedCategory(category)}
          >
            <Icon name={categoryIcons[category] || "utensils"} size={16} />
            {category}
          </button>
        ))}
      </nav>

      <section id="home-products" className="home-products">
        <div className="mb-section-head">
          <h2>
            {selectedCategory === "Todos"
              ? "Favoritos de la semana"
              : selectedCategory}
          </h2>

          <span>
            {loading
              ? "Cargando…"
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "producto" : "productos"
                }`}
          </span>
        </div>

        {loading ? (
          <SkeletonGrid count={6} className="home-grid" />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon="search"
            title="No encontramos productos"
            description="Prueba con otra búsqueda o cambia de categoría."
            action={
              <button
                type="button"
                className="mb-btn mb-btn-soft"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Todos");
                }}
              >
                Limpiar filtros
              </button>
            }
          />
        ) : (
          <div className="home-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
