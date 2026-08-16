import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

/**
 * Guarda de rol para las rutas del panel.
 *
 * El backend ya valida los permisos en cada endpoint; esto evita que un
 * alumno que escriba /admin en la barra vea una pantalla rota llena de
 * errores 403.
 */
function RoleRoute({ roles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return roles.includes(user.rol) ? <Outlet /> : <Navigate to="/home" replace />;
}

export default RoleRoute;
