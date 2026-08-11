import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authService from "../../services/authService";

import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import AuthAside from "../../components/AuthAside";

import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [correo, setCorreo] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await authService.login(correo, password);

      login(response.token, response.usuario);

      toast.success(`Bienvenido, ${response.usuario.nombre.split(" ")[0]}`);

      if (response.usuario.rol === "admin") {
        navigate("/admin");

        return;
      }

      navigate("/home");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Credenciales incorrectas",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <AuthAside
        title={
          <>
            Comida deliciosa,
            <br />
            sin hacer filas.
          </>
        }
        subtitle="Exclusivo para la comunidad UPMH. Pide desde tu salón y recoge en ventanilla."
        highlights={[
          { icon: "clock", label: "Listo en tu receso" },
          { icon: "qr", label: "Código de recolección" },
          { icon: "wallet", label: "Paga en caja o con tarjeta" },
        ]}
      />

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-brand">
            <Logo size={46} />
          </div>

          <div className="auth-card-head">
            <span className="mb-eyebrow">
              <Icon name="shield" size={13} />
              Acceso seguro
            </span>

            <h1>Iniciar sesión</h1>

            <p>Ingresa con tu correo institucional.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="mb-field">
              <span>Correo electrónico</span>

              <div className="mb-input-icon">
                <Icon name="mail" size={19} />
                <input
                  className="mb-input"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@upmh.edu.mx"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </label>

            <label className="mb-field">
              <span className="auth-label-row">
                Contraseña
                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </span>

              <div className="mb-input-icon">
                <Icon name="lock" size={19} />
                <input
                  className="mb-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>

            <button
              type="submit"
              className="mb-btn mb-btn-primary mb-btn-lg mb-btn-block"
              disabled={submitting}
            >
              {submitting ? <span className="mb-spinner" /> : null}
              {submitting ? "Entrando…" : "Entrar"}
            </button>
          </form>

          <p className="auth-foot">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
