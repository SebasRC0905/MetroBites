import { useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";

import { useAuth } from "../../context/AuthContext";
import "./Login.css";
function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [correo, setCorreo] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(correo, password);

      login(response.token, response.usuario);

      if (response.usuario.rol === "admin") {
        console.log("Navegando a /admin");

        navigate("/admin");

        return;
      }

      navigate("/home");
    } catch (error) {
      console.error(error);

      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>🍽 MetroBites</h1>

        <p>
          Pide desde tu salón, recoge sin filas y disfruta tu comida favorita.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Bienvenido</h2>

          <p>Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="email"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-button">
              Iniciar Sesión
            </button>
            <div className="register-link">
              <Link to="/register">¿No tienes cuenta? Regístrate</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
