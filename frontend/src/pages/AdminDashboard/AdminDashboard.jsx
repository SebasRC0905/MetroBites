import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-hero">
        <span className="eyebrow">MetroBites</span>
        <h1>Dashboard administrador</h1>

        <p>Bienvenido al panel de administración de MetroBites.</p>
      </section>

      <section className="admin-dashboard-grid" aria-label="Resumen">
        <div className="admin-dashboard-card">
          <span>Productos</span>
          <strong>Catálogo</strong>
          <p>Gestiona disponibilidad, precios y stock.</p>
        </div>

        <div className="admin-dashboard-card">
          <span>Pedidos</span>
          <strong>Operación</strong>
          <p>Da seguimiento a las órdenes activas.</p>
        </div>

        <div className="admin-dashboard-card">
          <span>Usuarios</span>
          <strong>Comunidad</strong>
          <p>Consulta perfiles y actividad del sistema.</p>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
