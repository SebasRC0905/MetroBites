import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authService from "../../services/authService";

import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import AuthAside from "../../components/AuthAside";

import "./Register.css";

const carreras = [
  "Aeronáutica",
  "Animación y Efectos Visuales",
  "Energía y Desarrollo Sostenible",
  "Logística",
  "Tecnologías de la Información e Innovación Digital",
  "Administración y Gestión Empresarial",
  "Arquitectura Bioclimática",
  "Comercio Internacional y Aduanas",
];

const getPasswordScore = (value) => {
  if (!value) {
    return 0;
  }

  let score = 0;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  return score;
};

const strengthLabels = ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"];

function Register() {
  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [carrera, setCarrera] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const score = useMemo(() => getPasswordScore(password), [password]);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!carrera) {
      toast.error("Selecciona un programa educativo");
      return;
    }

    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      setSubmitting(true);

      await authService.register({
        nombre,
        matricula,
        correo,
        password,
        carrera,
        tolerancia_picante: "medio",
      });

      toast.success("Cuenta creada correctamente. Ya puedes iniciar sesión.");

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Error al registrar usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell register-shell">
      <AuthAside
        title={
          <>
            Únete a la mejor forma
            <br />
            de pedir comida.
          </>
        }
        subtitle="Crea tu cuenta con el correo institucional, guarda tus preferencias y ahorra tiempo entre clases."
        highlights={[
          { icon: "sparkles", label: "Menú personalizado" },
          { icon: "flame", label: "Nivel de picante" },
          { icon: "receipt", label: "Historial de pedidos" },
        ]}
      />

      <div className="auth-panel">
        <div className="auth-card register-card">
          <div className="auth-card-brand">
            <Logo size={46} />
          </div>

          <div className="auth-card-head">
            <span className="mb-eyebrow accent">
              <Icon name="user" size={13} />
              Nuevo alumno
            </span>

            <h1>Crear una cuenta</h1>

            <p>Ingresa tus datos para registrarte en la cafetería.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form register-form">
            <label className="mb-field span-2">
              <span>Nombre completo</span>

              <div className="mb-input-icon">
                <Icon name="user" size={19} />
                <input
                  className="mb-input"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </label>

            <label className="mb-field">
              <span>Matrícula</span>

              <div className="mb-input-icon">
                <Icon name="idCard" size={19} />
                <input
                  className="mb-input"
                  type="text"
                  placeholder="123456"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
            </label>

            <label className="mb-field">
              <span>Correo institucional</span>

              <div className="mb-input-icon">
                <Icon name="mail" size={19} />
                <input
                  className="mb-input"
                  type="email"
                  placeholder="123456@upmh.edu.mx"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </label>

            <label className="mb-field span-2">
              <span>Programa educativo</span>

              <select
                className="mb-select"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
              >
                <option value="">Selecciona tu programa</option>

                {carreras.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
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
                  placeholder="Crea una contraseña segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>

            <label className="mb-field">
              <span>Confirmar contraseña</span>

              <div className="mb-input-icon">
                <Icon name="shield" size={19} />
                <input
                  className={`mb-input ${passwordsMatch ? "" : "is-invalid"}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </label>

            <div className="span-2 password-meter" data-score={score}>
              <div className="password-meter-track">
                {[0, 1, 2, 3].map((step) => (
                  <span key={step} className={step < score ? "is-on" : ""} />
                ))}
              </div>

              <small>
                {password
                  ? `Seguridad: ${strengthLabels[score]}`
                  : "Usa mayúsculas, números y símbolos."}
              </small>
            </div>

            {!passwordsMatch && (
              <p className="span-2 form-error">
                <Icon name="alert" size={15} />
                Las contraseñas no coinciden.
              </p>
            )}

            <label className="mb-check span-2 auth-terms">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span className="mb-check-box" />
              <span>Acepto los términos y condiciones de uso.</span>
            </label>

            <button
              type="submit"
              className="mb-btn mb-btn-accent mb-btn-lg mb-btn-block span-2"
              disabled={submitting}
            >
              {submitting ? <span className="mb-spinner" /> : null}
              {submitting ? "Creando cuenta…" : "Completar registro"}
            </button>
          </form>

          <p className="auth-foot">
            ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
