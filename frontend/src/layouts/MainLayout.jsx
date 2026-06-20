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
        <div className="logo">🍽 MetroBites</div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>

          <h3>{firstName}</h3>

          <p>{user?.carrera}</p>
        </div>

        <div className="sidebar-title">CATEGORÍAS</div>

        <NavLink to="/home" className="menu-item">
          🔥 Populares
        </NavLink>

        <NavLink to="/home" className="menu-item">
          ☕ Desayunos
        </NavLink>

        <NavLink to="/home" className="menu-item">
          🍽 Comidas
        </NavLink>

        <NavLink to="/home" className="menu-item">
          🥤 Bebidas
        </NavLink>

        <NavLink to="/home" className="menu-item">
          🍟 Snacks
        </NavLink>

        <hr />

        <NavLink to="/profile" className="menu-item">
          👤 Perfil
        </NavLink>

        <NavLink to="/historial" className="menu-item">
          📜 Pedidos
        </NavLink>

        <button className="logout-button" onClick={logout}>
          🚪 Cerrar Sesión
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
