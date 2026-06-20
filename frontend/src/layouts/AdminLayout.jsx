import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./AdminLayout.css";

function AdminLayout() {

  const { user, logout } = useAuth();

  const firstName =
    user?.nombre?.split(" ")[0] || "";

  const initial =
    firstName.charAt(0).toUpperCase();

  return (

    <div className="layout">

      <aside className="sidebar">

        <div className="logo">
          ⚙️ MetroBites Admin
        </div>

        <div className="sidebar-user">

          <div className="sidebar-avatar">
            {initial}
          </div>

          <h3>{firstName}</h3>

          <p>Administrador</p>

        </div>

        <div className="sidebar-title">
          ADMINISTRACIÓN
        </div>

        <NavLink
          to="/admin/productos"
          className="menu-item"
        >
          📦 Productos
        </NavLink>

        <NavLink
          to="/admin/pedidos"
          className="menu-item"
        >
          🧾 Pedidos
        </NavLink>

        <button
          className="logout-button"
          onClick={logout}
        >
          🚪 Cerrar Sesión
        </button>

      </aside>

      <main className="main-content">

        <header className="header">

          <h3>
            Panel Administrativo
          </h3>

        </header>

        <div className="page-content">

          <Outlet />

        </div>

      </main>

    </div>

  );

}

export default AdminLayout;