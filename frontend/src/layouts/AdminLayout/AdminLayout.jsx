import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import Icon from "../../components/Icon";
import Logo from "../../components/Logo";

import { useAuth } from "../../context/AuthContext";

import "./AdminLayout.css";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: "layout", end: true },
  { to: "/admin/productos", label: "Productos", icon: "package" },
  { to: "/admin/pedidos", label: "Pedidos", icon: "receipt" },
  { to: "/admin/usuarios", label: "Usuarios", icon: "users" },
];

const titles = {
  "/admin": "Panel general",
  "/admin/productos": "Catálogo de productos",
  "/admin/pedidos": "Operación de pedidos",
  "/admin/usuarios": "Comunidad y accesos",
};

function AdminLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const firstName = user?.nombre?.split(" ")[0] || "";
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-shell">
      <header className="admin-mobilebar">
        <Logo size={36} caption="Admin" />

        <button
          type="button"
          className="admin-burger"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={22} />
        </button>
      </header>

      {menuOpen && (
        <div
          className="admin-scrim"
          role="presentation"
          onClick={closeMenu}
        />
      )}

      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <Logo size={42} tone="light" caption="Panel admin" />
        </div>

        <p className="admin-nav-label">Gestión</p>

        <nav className="admin-nav">
          {adminNav.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "is-active" : ""}`
              }
              style={{ "--i": index }}
              onClick={closeMenu}
            >
              <span className="admin-nav-icon">
                <Icon name={item.icon} size={18} />
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-user">
            <span className="admin-user-avatar">{initial}</span>

            <div>
              <strong>{firstName || "Administrador"}</strong>
              <span>{user?.correo}</span>
            </div>
          </div>

          <button type="button" className="admin-logout" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="mb-eyebrow">
              <Icon name="shield" size={13} />
              Panel administrativo
            </span>

            <h1>{titles[location.pathname] || "MetroBites"}</h1>
          </div>

          <div className="admin-topbar-user">
            <div className="admin-topbar-name">
              <strong>{firstName}</strong>
              <span>Sesión activa</span>
            </div>

            <span className="mb-avatar sm">{initial}</span>
          </div>
        </header>

        <main key={location.pathname} className="admin-content mb-page-transition">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
