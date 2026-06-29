import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        <div className="login-brand">
          <span className="login-brand-mark">🍽</span>
          <span>MetroBites</span>
        </div>

        <h1>Comida lista cuando tú estés listo.</h1>

        <p>
          Pide desde tu salón, recoge sin filas y disfruta tu comida favorita.
        </p>

        <div className="login-showcase" aria-hidden="true">
          <div className="showcase-card main">
            <span>Pedido express</span>
            <strong>12 min</strong>
          </div>

          <div className="showcase-card accent">
            <span>Favorito</span>
            <strong>Cuernito + café</strong>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-heading">
            <span className="eyebrow">Acceso seguro</span>
            <h2>Bienvenido</h2>
            <p>Inicia sesión para continuar</p>
          </div>

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
              Iniciar sesión
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
