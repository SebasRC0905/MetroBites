import { useEffect, useState } from "react";

import profileService from "../../services/profileService";

import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  const [saving, setSaving] = useState(false);

  const [tolerancia, setTolerancia] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileService.getProfile();

        setUser(response.data);

        setTolerancia(response.data.tolerancia_picante);
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      await profileService.updateProfile({
        tolerancia_picante: tolerancia,
      });

      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Mi Perfil</h1>

      <div className="profile-card">
        <div className="profile-grid">
          <div className="profile-left">
            <div className="profile-avatar">
              {user.nombre.charAt(0).toUpperCase()}
            </div>

            <h2>{user.nombre}</h2>

            <p>{user.carrera}</p>

            <div className="profile-stats">
              <div className="stat-card">
                <h3>12</h3>
                <span>Pedidos</span>
              </div>

              <div className="stat-card">
                <h3>3</h3>
                <span>Cafés Gratis</span>
              </div>
            </div>
          </div>

          <div className="profile-right">
            <h2>Preferencias</h2>

            <div className="preference-card">
              <h3>🌶 Nivel de Picante</h3>

              <div className="spicy-section">
                <label>
                  <input
                    type="radio"
                    value="ninguno"
                    checked={tolerancia === "ninguno"}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />
                  Ninguno
                </label>

                <label>
                  <input
                    type="radio"
                    value="medio"
                    checked={tolerancia === "medio"}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />
                  Medio
                </label>

                <label>
                  <input
                    type="radio"
                    value="habanero"
                    checked={tolerancia === "habanero"}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />
                  Habanero
                </label>
              </div>
            </div>

            <div className="preference-card">
              <h3>📧 Información</h3>

              <p>
                <strong>Matrícula:</strong>
                {user.matricula}
              </p>

              <p>
                <strong>Correo:</strong>
                {user.correo}
              </p>
            </div>

            <button
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
