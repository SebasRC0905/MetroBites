import { NavLink, Outlet } from "react-router-dom";

import "./MainLayout.css";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { user, logout } = useAuth();

  const firstName = user?.nombre?.split(" ")[0] || "";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark">🍽</span>
          <span>MetroBites</span>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>

          <h3>{firstName}</h3>

          <p>{user?.carrera}</p>
        </div>

        <div className="sidebar-title">Categorías</div>

        <NavLink to="/home" className="menu-item">
          <span className="menu-icon">🔥</span>
          <span>Populares</span>
        </NavLink>

        <NavLink to="/home" className="menu-item">
          <span className="menu-icon">☕</span>
          <span>Desayunos</span>
        </NavLink>

        <NavLink to="/home" className="menu-item">
          <span className="menu-icon">🍽</span>
          <span>Comidas</span>
        </NavLink>

        <NavLink to="/home" className="menu-item">
          <span className="menu-icon">🥤</span>
          <span>Bebidas</span>
        </NavLink>

        <NavLink to="/home" className="menu-item">
          <span className="menu-icon">🍟</span>
          <span>Snacks</span>
        </NavLink>

        <hr />

        <NavLink to="/profile" className="menu-item">
          <span className="menu-icon">👤</span>
          <span>Perfil</span>
        </NavLink>

        <NavLink to="/historial" className="menu-item">
          <span className="menu-icon">📜</span>
          <span>Pedidos</span>
        </NavLink>

        <button className="logout-button" onClick={logout}>
          <span className="menu-icon">🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
