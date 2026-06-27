import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AdminLayout.css";

function AdminLayout() {

  const { user, logout } = useAuth();

  const firstName =
    user?.nombre?.split(" ")[0] || "";

  return (

    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-logo">

          🍽 MetroBites

          <span>ADMIN</span>

        </div>

        <nav className="admin-menu">

          <NavLink
            to="/admin"
            end
            className="admin-item"
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/productos"
            className="admin-item"
          >
            🍔 Productos
          </NavLink>

          <NavLink
            to="/admin/pedidos"
            className="admin-item"
          >
            📦 Pedidos
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            className="admin-item"
          >
            👥 Usuarios
          </NavLink>

        </nav>

        <button
          className="admin-logout"
          onClick={logout}
        >
          🚪 Cerrar sesión
        </button>

      </aside>

      <div className="admin-main">

        <header className="admin-header">

          <div>

            <h2>

              Bienvenido,
              {" "}
              {firstName}

            </h2>

            <p>

              Panel Administrativo MetroBites

            </p>

          </div>

        </header>

        <main className="admin-content">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default AdminLayout;