import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

import Logo from "./components/Logo";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

/*
 Las pantallas se cargan bajo demanda (code splitting): al entrar solo
 se descarga el login, y el panel de administración —que casi ningún
 alumno abre— nunca llega a su navegador.
*/
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));

const Home = lazy(() => import("./pages/Home/Home"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const OrderStatus = lazy(() => import("./pages/OrderStatus/OrderStatus"));
const OrderHistory = lazy(() => import("./pages/OrderHistory/OrderHistory"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const PaymentMethods = lazy(
  () => import("./pages/PaymentMethods/PaymentMethods"),
);

const AdminDashboard = lazy(
  () => import("./pages/AdminDashboard/AdminDashboard"),
);
const AdminProducts = lazy(() => import("./pages/AdminProducts/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/AdminOrders/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/AdminUsers/AdminUsers"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons/AdminCoupons"));

function PantallaDeCarga() {
  return (
    <div className="mb-loader-screen">
      <div style={{ display: "grid", justifyItems: "center", gap: 18 }}>
        <Logo size={54} withText={false} />
        <span className="mb-spinner" style={{ width: 26, height: 26 }} />
        <p>Cargando…</p>
      </div>
    </div>
  );
}

/**
 * Mapa de rutas.
 *
 * La animación de cambio de pantalla vive dentro de cada layout
 * (`AnimatedOutlet`), para que solo se anime el contenido y la barra
 * lateral se quede quieta.
 */
function Rutas() {
  return (
    <Routes>
        {/* ===========================
              RUTAS PÚBLICAS
        ============================ */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ===========================
              RUTAS DEL ALUMNO
        ============================ */}

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />

            <Route path="/favoritos" element={<Favorites />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/metodos-pago" element={<PaymentMethods />} />

            <Route path="/historial" element={<OrderHistory />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route path="/producto/:id" element={<ProductDetail />} />

            <Route path="/order-status/:id" element={<OrderStatus />} />
          </Route>
        </Route>

        {/* ===========================
              RUTAS DEL ADMINISTRADOR
        ============================ */}

        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute roles={["admin", "empleado"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />

              <Route path="/admin/productos" element={<AdminProducts />} />

              <Route path="/admin/pedidos" element={<AdminOrders />} />

              <Route path="/admin/usuarios" element={<AdminUsers />} />

              <Route path="/admin/cupones" element={<AdminCoupons />} />
            </Route>
          </Route>
        </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PantallaDeCarga />}>
        <Rutas />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
