import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

import "./Register.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [matricula, setMatricula] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [carrera, setCarrera] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!acceptTerms) {
      alert("Debes aceptar los términos");
      return;
    }

    if (!carrera) {
      alert("Selecciona un programa educativo");
      return;
    }

    try {
      const response = await authService.register({
        nombre,
        matricula,
        correo,
        password,
        carrera,
        tolerancia_picante: "medio",
      });

      alert("Usuario registrado correctamente");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>🍽 MetroBites</h1>

        <p>
          Únete a la cafetería inteligente de la UPMH y realiza tus pedidos
          desde cualquier salón.
        </p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Crear Cuenta</h2>

          <p>Registra tus datos para comenzar</p>

          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              className="login-input"
              type="text"
              placeholder="Matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />

            <input
              className="login-input"
              type="email"
              placeholder="Correo institucional"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <select
              className="login-input"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
            >
              <option value="">Programa Educativo</option>

              {carreras.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="terms-container">
              <label>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                Acepto los términos y condiciones
              </label>
            </div>

            <button type="submit" className="login-button">
              Registrarme
            </button>
          </form>

          <div className="register-link">
            <Link to="/">Ya tengo una cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
