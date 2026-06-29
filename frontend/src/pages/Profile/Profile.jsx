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
    return <p className="loading-text">Cargando...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <span className="eyebrow">Cuenta</span>
        <h1>Mi perfil</h1>
      </div>

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
                <span>Cafés gratis</span>
              </div>
            </div>
          </div>

          <div className="profile-right">
            <h2>Preferencias</h2>

            <div className="preference-card">
              <h3>🌶 Nivel de picante</h3>

              <div className="spicy-section">
                <label>
                  <input
                    type="radio"
                    value="ninguno"
                    checked={tolerancia === "ninguno"}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />
                  <span>Ninguno</span>
                </label>

                <label>
                  <input
                    type="radio"
                    value="medio"
                    checked={tolerancia === "medio"}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />
                  <span>Medio</span>
                </label>

                <label>
                  <input
                    type="radio"
                    value="habanero"
                    checked={tolerancia === "habanero"}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />
                  <span>Habanero</span>
                </label>
              </div>
            </div>

            <div className="preference-card">
              <h3>📧 Información</h3>

              <p>
                <strong>Matrícula:</strong>
                <span>{user.matricula}</span>
              </p>

              <p>
                <strong>Correo:</strong>
                <span>{user.correo}</span>
              </p>
            </div>

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
