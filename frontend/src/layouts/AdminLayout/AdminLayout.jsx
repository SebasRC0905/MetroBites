import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./AdminLayout.css";

function AdminLayout() {
  const { user, logout } = useAuth();

  const firstName = user?.nombre?.split(" ")[0] || "";

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark">🍽</span>
          <div>
            MetroBites
            <span>Admin</span>
          </div>
        </div>

        <nav className="admin-menu">
          <NavLink to="/admin" end className="admin-item">
            <span>📊</span>
            Dashboard
          </NavLink>

          <NavLink to="/admin/productos" className="admin-item">
            <span>🍔</span>
            Productos
          </NavLink>

          <NavLink to="/admin/pedidos" className="admin-item">
            <span>📦</span>
            Pedidos
          </NavLink>

          <NavLink to="/admin/usuarios" className="admin-item">
            <span>👥</span>
            Usuarios
          </NavLink>
        </nav>

        <button type="button" className="admin-logout" onClick={logout}>
          <span>🚪</span>
          Cerrar sesión
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Panel administrativo</span>
            <h2>
              Bienvenido, {firstName}
            </h2>

            <p>Control operativo de MetroBites</p>
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
