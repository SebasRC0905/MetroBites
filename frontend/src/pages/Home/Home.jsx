import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ProductCard from "../../components/ProductCard";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import AnimatedNumber from "../../components/AnimatedNumber";
import { SkeletonGrid } from "../../components/Skeleton";
import WeatherWidget from "../../components/WeatherWidget";
import HolidayNotice from "../../components/HolidayNotice";
import CurrencySwitcher from "../../components/CurrencySwitcher";

import { useProductos, useCategorias } from "../../hooks/useProducts";
import useDebounce from "../../hooks/useDebounce";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { listaVariants, resorte } from "../../lib/motion";

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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  /*
   La búsqueda se retrasa un poco: filtrar en cada tecla hace que la
   lista parpadee mientras se escribe.
  */
  const busqueda = useDebounce(search, 220);

  const { data: products = [], isLoading } = useProductos();
  const { data: categoriasApi } = useCategorias();

  const { total, totalUnidades } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = useMemo(
    () =>
      Array.isArray(categoriasApi) && categoriasApi.length > 0
        ? categoriasApi.map((item) => item.nombre)
        : fallbackCategories,
    [categoriasApi],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.nombre
          .toLowerCase()
          .includes(busqueda.trim().toLowerCase());

        const matchesCategory =
          selectedCategory === "Todos"
            ? true
            : product.categoria === selectedCategory;

        return matchesSearch && matchesCategory;
      }),
    [products, busqueda, selectedCategory],
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
          <CurrencySwitcher />

          <div className="home-identity">
            <span className="mb-avatar sm">{userInitial}</span>
            <span>{firstName}</span>
          </div>

          <motion.button
            type="button"
            className="home-cart"
            onClick={() => navigate("/cart")}
            whileTap={{ scale: 0.96 }}
            transition={resorte}
          >
            <span className="home-cart-icon">
              <Icon name="cart" size={19} />

              <AnimatePresence>
                {totalUnidades > 0 && (
                  <motion.i
                    key={totalUnidades}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={resorte}
                  >
                    {totalUnidades}
                  </motion.i>
                )}
              </AnimatePresence>
            </span>

            <strong>
              <AnimatedNumber value={total} decimals={2} prefix="$" />
            </strong>
          </motion.button>
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
            <dd>{isLoading ? "—" : products.length}</dd>
          </div>

          <div>
            <dt>Categorías</dt>
            <dd>{categories.length}</dd>
          </div>
        </dl>
      </section>

      <div className="home-widgets">
        <WeatherWidget
          onSuggest={(categoria) => {
            setSelectedCategory(categoria);

            document
              .getElementById("home-products")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />

        <HolidayNotice />
      </div>

      <nav className="home-tabs" aria-label="Categorías">
        {tabs.map((category) => {
          const activa = selectedCategory === category;

          return (
            <motion.button
              key={category}
              type="button"
              className={`mb-chip ${activa ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(category)}
              whileTap={{ scale: 0.95 }}
              transition={resorte}
            >
              <Icon name={categoryIcons[category] || "utensils"} size={16} />
              {category}
            </motion.button>
          );
        })}
      </nav>

      <section id="home-products" className="home-products">
        <div className="mb-section-head">
          <h2>
            {selectedCategory === "Todos"
              ? "Favoritos de la semana"
              : selectedCategory}
          </h2>

          <span>
            {isLoading
              ? "Cargando…"
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "producto" : "productos"
                }`}
          </span>
        </div>

        {isLoading ? (
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
          <motion.div
            className="home-grid"
            variants={listaVariants}
            initial="initial"
            animate="animate"
            key={`${selectedCategory}-${busqueda}`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default Home;
