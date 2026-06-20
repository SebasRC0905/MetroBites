import { NavLink, Outlet } from "react-router-dom";

import "./MainLayout.css";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
  const { user, logout } = useAuth();

  const firstName =
    user?.nombre?.split(" ")[0] || "";

  const initial =
    firstName.charAt(0).toUpperCase();
  return (
    
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">🍽 MetroBites</div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>

          <h3>{firstName}</h3>

          <p>{user?.carrera}</p>
        </div>

        <div className="sidebar-title">TU CUENTA</div>

        <NavLink to="/home" className="menu-item">
          🏠 Menú Principal
        </NavLink>

        <NavLink to="/profile" className="menu-item">
          👤 Perfil y Salud
        </NavLink>

        <NavLink to="/historial" className="menu-item">
          📜 Mis Pedidos
        </NavLink>

        <button className="logout-button" onClick={logout}>
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <h3>Cafetería UPMH</h3>

          <div className="user-info">
            <div className="avatar" />
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
