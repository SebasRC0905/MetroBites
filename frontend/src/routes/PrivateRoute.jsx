import { Navigate, Outlet } from "react-router-dom";

import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mb-loader-screen">
        <div style={{ display: "grid", justifyItems: "center", gap: 18 }}>
          <Logo size={54} withText={false} />
          <span className="mb-spinner" style={{ width: 26, height: 26 }} />
          <p>Preparando tu cafetería…</p>
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
