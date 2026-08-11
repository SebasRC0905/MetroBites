import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import dashboardService from "../../services/dashboardService";

import Icon from "../../components/Icon";
import { SkeletonLine } from "../../components/Skeleton";

import "./AdminDashboard.css";

const statusBreakdown = [
  { key: "pedidos_recibidos", label: "Recibidos", tone: "blue" },
  { key: "pedidos_preparando", label: "Preparando", tone: "amber" },
  { key: "pedidos_listos", label: "Listos", tone: "violet" },
  { key: "pedidos_entregados", label: "Entregados", tone: "green" },
  { key: "pedidos_cancelados", label: "Cancelados", tone: "red" },
];

const shortcuts = [
  {
    to: "/admin/productos",
    icon: "package",
    title: "Catálogo",
    text: "Alta, edición y disponibilidad de productos.",
  },
  {
    to: "/admin/pedidos",
    icon: "receipt",
    title: "Pedidos",
    text: "Avanza el estado de las órdenes activas.",
  },
  {
    to: "/admin/usuarios",
    icon: "users",
    title: "Usuarios",
    text: "Administra alumnos, empleados y accesos.",
  },
  {
    to: "/admin/cupones",
    icon: "tag",
    title: "Cupones",
    text: "Crea códigos de descuento para promociones.",
  },
];

const currency = (value) =>
  `$${Number(value || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [today, setToday] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, todayRes, topRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getTodaySales(),
          dashboardService.getTopProducts(),
        ]);

        setSummary(summaryRes.data);
        setToday(todayRes.data);
        setTopProducts(topRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPedidos = statusBreakdown.reduce(
    (acc, item) => acc + Number(summary?.[item.key] || 0),
    0,
  );

  const activos =
    Number(summary?.pedidos_recibidos || 0) +
    Number(summary?.pedidos_preparando || 0) +
    Number(summary?.pedidos_listos || 0);

  const maxVentas = topProducts.reduce(
    (acc, item) => Math.max(acc, Number(item.ventas || 0)),
    0,
  );

  const kpis = [
    {
      label: "Ventas totales",
      value: currency(summary?.ventas_totales),
      icon: "trendingUp",
      tone: "violet",
    },
    {
      label: "Ingresos de hoy",
      value: currency(today?.ingresos_hoy),
      icon: "wallet",
      tone: "coral",
    },
    {
      label: "Pedidos de hoy",
      value: Number(today?.pedidos_hoy || 0),
      icon: "receipt",
      tone: "green",
    },
    {
      label: "Pedidos activos",
      value: activos,
      icon: "clock",
      tone: "blue",
    },
  ];

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-hero-kicker">
            <Icon name="chart" size={14} />
            Resumen operativo
          </span>

          <h2>Así va la cafetería hoy</h2>

          <p>
            Métricas en tiempo real de ventas, pedidos y productos más pedidos.
          </p>
        </div>

        <button
          type="button"
          className="mb-btn mb-btn-accent"
          onClick={() => navigate("/admin/pedidos")}
        >
          Ver pedidos activos
          <Icon name="arrowRight" size={18} />
        </button>
      </section>

      <section className="dashboard-kpis">
        {kpis.map((kpi, index) => (
          <article
            key={kpi.label}
            className={`dashboard-kpi tone-${kpi.tone} mb-reveal`}
            style={{ "--i": index }}
          >
            <span className="dashboard-kpi-icon">
              <Icon name={kpi.icon} size={19} />
            </span>

            <div>
              <span className="mb-stat-label">{kpi.label}</span>

              {loading ? (
                <SkeletonLine width={90} height={24} style={{ marginTop: 8 }} />
              ) : (
                <strong>{kpi.value}</strong>
              )}
            </div>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <div className="mb-section-head">
            <h2>Productos más pedidos</h2>
            <span>Top {topProducts.length || 0}</span>
          </div>

          {loading ? (
            <div className="dashboard-bars">
              {[0, 1, 2, 3].map((item) => (
                <SkeletonLine key={item} height={34} radius={10} />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="dashboard-empty">
              Aún no hay ventas registradas para calcular el ranking.
            </p>
          ) : (
            <ol className="dashboard-bars">
              {topProducts.map((item, index) => {
                const ventas = Number(item.ventas || 0);
                const width = maxVentas > 0 ? (ventas / maxVentas) * 100 : 0;

                return (
                  <li
                    key={item.producto}
                    className="dashboard-bar"
                    title={`${item.producto}: ${ventas} unidades`}
                    style={{ "--i": index }}
                  >
                    <span className="dashboard-bar-label">{item.producto}</span>

                    <span className="dashboard-bar-track">
                      <span
                        className="dashboard-bar-fill"
                        style={{ width: `${Math.max(width, 3)}%` }}
                      />
                    </span>

                    <span className="dashboard-bar-value">{ventas}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="mb-section-head">
            <h2>Estado de los pedidos</h2>
            <span>{totalPedidos} en total</span>
          </div>

          <ul className="dashboard-status">
            {statusBreakdown.map((item) => {
              const value = Number(summary?.[item.key] || 0);
              const share = totalPedidos > 0 ? (value / totalPedidos) * 100 : 0;

              return (
                <li key={item.key}>
                  <span className={`dashboard-status-dot tone-${item.tone}`} />

                  <span className="dashboard-status-label">{item.label}</span>

                  <span className="dashboard-status-meter">
                    <span
                      className={`tone-${item.tone}`}
                      style={{ width: `${share}%` }}
                    />
                  </span>

                  <strong>{value}</strong>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="dashboard-shortcuts">
        {shortcuts.map((item, index) => (
          <button
            key={item.to}
            type="button"
            className="dashboard-shortcut mb-reveal"
            style={{ "--i": index }}
            onClick={() => navigate(item.to)}
          >
            <span className="dashboard-shortcut-icon">
              <Icon name={item.icon} size={20} />
            </span>

            <span className="dashboard-shortcut-body">
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </span>

            <Icon name="chevronRight" size={18} />
          </button>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;
