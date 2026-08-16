import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import dashboardService from "../../services/dashboardService";

import Icon from "../../components/Icon";
import AnimatedNumber from "../../components/AnimatedNumber";
import { SkeletonLine } from "../../components/Skeleton";

import { itemVariants, listaVariants } from "../../lib/motion";

import "./AdminDashboard.css";

const statusBreakdown = [
  { key: "pedidos_pendiente_pago", label: "Pago pendiente", tone: "amber" },
  { key: "pedidos_recibidos", label: "Recibidos", tone: "blue" },
  { key: "pedidos_confirmados", label: "Confirmados", tone: "violet" },
  { key: "pedidos_preparando", label: "Preparando", tone: "amber" },
  { key: "pedidos_listos", label: "Listos", tone: "green" },
  { key: "pedidos_entregados", label: "Entregados", tone: "green" },
  { key: "pedidos_cancelados", label: "Cancelados", tone: "red" },
  { key: "pedidos_rechazados", label: "Rechazados", tone: "red" },
  { key: "pedidos_no_recogidos", label: "No recogidos", tone: "neutral" },
];

/* Fecha corta para el eje de la gráfica: "12 ago". */
const diaCorto = (iso) => {
  const [anio, mes, dia] = iso.split("-").map(Number);

  return new Date(anio, mes - 1, dia).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
};

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

  /*
   Las cinco consultas del panel se piden en paralelo con React Query:
   se cachean, se recargan solas al volver a la pestaña y cada una
   maneja su propio error sin tumbar al resto.
  */
  const [resumen, ventasHoy, top, serie, porHora] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "resumen"],
        queryFn: dashboardService.getSummary,
        select: (r) => r.data,
      },
      {
        queryKey: ["dashboard", "ventas-hoy"],
        queryFn: dashboardService.getTodaySales,
        select: (r) => r.data,
      },
      {
        queryKey: ["dashboard", "top-productos"],
        queryFn: dashboardService.getTopProducts,
        select: (r) => r.data || [],
      },
      {
        queryKey: ["dashboard", "ventas-por-dia"],
        queryFn: () => dashboardService.getSalesByDay(7),
        select: (r) => r.data || [],
      },
      {
        queryKey: ["dashboard", "pedidos-por-hora"],
        queryFn: dashboardService.getOrdersByHour,
        select: (r) => r.data || [],
      },
    ],
  });

  const summary = resumen.data;
  const today = ventasHoy.data;
  const topProducts = top.data || [];
  const loading = resumen.isLoading || ventasHoy.isLoading;

  const serieVentas = (serie.data || []).map((punto) => ({
    ...punto,
    etiqueta: diaCorto(punto.dia),
  }));

  const horas = (porHora.data || []).filter((punto) => punto.pedidos > 0);

  const totalPedidos = statusBreakdown.reduce(
    (acc, item) => acc + Number(summary?.[item.key] || 0),
    0,
  );

  const activos =
    Number(summary?.pedidos_pendiente_pago || 0) +
    Number(summary?.pedidos_recibidos || 0) +
    Number(summary?.pedidos_confirmados || 0) +
    Number(summary?.pedidos_preparando || 0) +
    Number(summary?.pedidos_listos || 0);

  const maxVentas = topProducts.reduce(
    (acc, item) => Math.max(acc, Number(item.ventas || 0)),
    0,
  );

  const kpis = [
    {
      label: "Ventas totales",
      raw: Number(summary?.ventas_totales || 0),
      prefix: "$",
      decimals: 2,
      icon: "trendingUp",
      tone: "violet",
    },
    {
      label: "Ingresos de hoy",
      raw: Number(today?.ingresos_hoy || 0),
      prefix: "$",
      decimals: 2,
      icon: "wallet",
      tone: "coral",
    },
    {
      label: "Pedidos de hoy",
      raw: Number(today?.pedidos_hoy || 0),
      icon: "receipt",
      tone: "green",
    },
    {
      label: "Pedidos activos",
      raw: activos,
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

      <motion.section
        className="dashboard-kpis"
        variants={listaVariants}
        initial="initial"
        animate="animate"
      >
        {kpis.map((kpi) => (
          <motion.article
            key={kpi.label}
            className={`dashboard-kpi tone-${kpi.tone}`}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <span className="dashboard-kpi-icon">
              <Icon name={kpi.icon} size={19} />
            </span>

            <div>
              <span className="mb-stat-label">{kpi.label}</span>

              {loading ? (
                <SkeletonLine width={90} height={24} style={{ marginTop: 8 }} />
              ) : (
                <strong>
                  <AnimatedNumber
                    value={kpi.raw}
                    decimals={kpi.decimals ?? 0}
                    prefix={kpi.prefix ?? ""}
                  />
                </strong>
              )}
            </div>
          </motion.article>
        ))}
      </motion.section>

      <section className="dashboard-panel dashboard-chart">
        <div className="mb-section-head">
          <h2>Ventas de los últimos 7 días</h2>
          <span>Ingresos por día</span>
        </div>

        {serie.isLoading ? (
          <SkeletonLine height={220} radius={14} />
        ) : (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={serieVentas}
              margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.36} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="4 6"
                stroke="rgba(20, 18, 31, 0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="etiqueta"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6e6a85", fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6e6a85", fontSize: 12 }}
                width={62}
                tickFormatter={(valor) => `$${valor}`}
              />

              <Tooltip
                cursor={{ stroke: "rgba(124, 58, 237, 0.28)" }}
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid rgba(20, 18, 31, 0.08)",
                  boxShadow: "0 14px 38px rgba(35, 18, 74, 0.14)",
                  fontSize: 13,
                }}
                formatter={(valor) => [currency(valor), "Ingresos"]}
              />

              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#6023be"
                strokeWidth={2.4}
                fill="url(#ingresos)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
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

        <section className="dashboard-panel">
          <div className="mb-section-head">
            <h2>Pedidos por hora</h2>
            <span>¿Cuándo se satura la cafetería?</span>
          </div>

          {porHora.isLoading ? (
            <SkeletonLine height={200} radius={14} />
          ) : horas.length === 0 ? (
            <p className="dashboard-empty">
              Todavía no hay pedidos suficientes.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart
                data={horas}
                margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 6"
                  stroke="rgba(20, 18, 31, 0.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="etiqueta"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6e6a85", fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6e6a85", fontSize: 12 }}
                  width={44}
                />

                <Tooltip
                  cursor={{ fill: "rgba(124, 58, 237, 0.08)" }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(20, 18, 31, 0.08)",
                    boxShadow: "0 14px 38px rgba(35, 18, 74, 0.14)",
                    fontSize: 13,
                  }}
                  formatter={(valor) => [valor, "Pedidos"]}
                />

                <Bar
                  dataKey="pedidos"
                  fill="#f97a5c"
                  radius={[8, 8, 4, 4]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
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
