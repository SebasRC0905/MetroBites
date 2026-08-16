import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Icon from "../components/Icon";
import Logo from "../components/Logo";
import AnimatedOutlet from "../components/AnimatedOutlet";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

import { resorte } from "../lib/motion";

import "./MainLayout.css";

const navItems = [
  { to: "/home", label: "Menú principal", icon: "home" },
  { to: "/favoritos", label: "Favoritos", icon: "heart" },
  { to: "/profile", label: "Perfil y salud", icon: "user" },
  { to: "/metodos-pago", label: "Método de pago", icon: "card" },
  { to: "/historial", label: "Mis pedidos", icon: "receipt" },
  { to: "/cart", label: "Mi carrito", icon: "cart" },
];

/** Contador que salta cada vez que cambia su valor. */
function ContadorNav({ valor, suave = false }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={valor}
        className={`app-nav-count ${suave ? "is-soft" : ""}`}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={resorte}
      >
        {valor}
      </motion.span>
    </AnimatePresence>
  );
}

function MainLayout() {
  const { user, logout } = useAuth();
  const { totalUnidades } = useCart();
  const { favorites } = useFavorites();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const firstName = user?.nombre?.split(" ")[0] || "";
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <Logo size={38} />

        <button
          type="button"
          className="app-burger"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={22} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="app-scrim"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <aside className={`app-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="app-sidebar-brand">
          <Logo size={42} caption="Cafetería UPMH" />
        </div>

        <p className="app-sidebar-label">Tu cuenta</p>

        <nav className="app-nav">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-nav-item ${isActive ? "is-active" : ""}`
              }
              style={{ "--i": index }}
              onClick={closeMenu}
            >
              <span className="app-nav-icon">
                <Icon name={item.icon} size={18} />
              </span>

              <span className="app-nav-text">{item.label}</span>

              {item.to === "/cart" && totalUnidades > 0 && (
                <ContadorNav valor={totalUnidades} />
              )}

              {item.to === "/favoritos" && favorites.length > 0 && (
                <ContadorNav valor={favorites.length} suave />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar-foot">
          <div className="app-user">
            <span className="mb-avatar sm">{initial}</span>

            <div>
              <strong>{firstName || "Alumno"}</strong>
              <span>{user?.carrera || "UPMH"}</span>
            </div>
          </div>

          <button type="button" className="app-logout" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="app-main">
        <AnimatedOutlet className="app-page" />
      </main>
    </div>
  );
}

export default MainLayout;
