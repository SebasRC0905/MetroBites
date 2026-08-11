import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderStatus from "./pages/OrderStatus/OrderStatus";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import Profile from "./pages/Profile/Profile";

import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminCoupons from "./pages/AdminCoupons/AdminCoupons";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===========================
              RUTAS PÚBLICAS
        ============================ */}

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ===========================
              RUTAS DEL ALUMNO
        ============================ */}

        <Route element={<PrivateRoute />}>

          <Route element={<MainLayout />}>

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path="/favoritos"
              element={<Favorites />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/historial"
              element={<OrderHistory />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/producto/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/order-status/:id"
              element={<OrderStatus />}
            />

          </Route>

        </Route>

        {/* ===========================
              RUTAS DEL ADMINISTRADOR
        ============================ */}

        <Route element={<PrivateRoute />}>

          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/productos"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/pedidos"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/usuarios"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/cupones"
              element={<AdminCoupons />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
