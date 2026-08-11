import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import profileService from "../../services/profileService";
import historyService from "../../services/historyService";

import Icon from "../../components/Icon";
import { SkeletonLine } from "../../components/Skeleton";

import "./Profile.css";

const spicyLevels = [
  {
    value: "ninguno",
    label: "Sin picante",
    hint: "Prefiero los sabores suaves.",
  },
  {
    value: "medio",
    label: "Medio",
    hint: "Salsa con moderación.",
  },
  {
    value: "habanero",
    label: "Habanero",
    hint: "Entre más pique, mejor.",
  },
];

function Profile() {
  const [user, setUser] = useState(null);

  const [saving, setSaving] = useState(false);

  const [tolerancia, setTolerancia] = useState("");

  const [stats, setStats] = useState({ pedidos: 0, gastado: 0 });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileService.getProfile();

        setUser(response.data);

        setTolerancia(response.data.tolerancia_picante);
      } catch (error) {
        console.error(error);

        toast.error("No pudimos cargar tu perfil");
      }
    };

    const loadStats = async () => {
      try {
        const response = await historyService.getMyOrders();

        const orders = response.data || [];

        setStats({
          pedidos: orders.length,
          gastado: orders.reduce(
            (acc, order) => acc + Number(order.total || 0),
            0,
          ),
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
    loadStats();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      await profileService.updateProfile({
        tolerancia_picante: tolerancia,
      });

      toast.success("Preferencias actualizadas");
    } catch (error) {
      console.error(error);

      toast.error("No pudimos guardar tus cambios");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile">
        <div className="profile-grid">
          <div className="profile-card">
            <SkeletonLine
              width={104}
              height={104}
              radius={999}
              style={{ margin: "0 auto 20px" }}
            />
            <SkeletonLine width="60%" height={18} style={{ margin: "0 auto 12px" }} />
            <SkeletonLine width="80%" height={13} style={{ margin: "0 auto" }} />
          </div>

          <div className="profile-card">
            <SkeletonLine width="40%" height={18} style={{ marginBottom: 18 }} />
            <SkeletonLine height={72} radius={16} style={{ marginBottom: 12 }} />
            <SkeletonLine height={72} radius={16} />
          </div>
        </div>
      </div>
    );
  }

  const initial = user.nombre.charAt(0).toUpperCase();

  return (
    <div className="profile">
      <header className="mb-page-head">
        <div>
          <span className="mb-eyebrow">
            <Icon name="user" size={13} />
            Tu cuenta
          </span>

          <h1>Perfil y preferencias</h1>

          <p>Configura tu experiencia dentro de la cafetería.</p>
        </div>
      </header>

      <div className="profile-grid">
        <aside className="profile-card profile-identity">
          <span className="mb-avatar lg">{initial}</span>

          <h2>{user.nombre}</h2>

          <p>{user.carrera || "Comunidad UPMH"}</p>

          <span className="mb-badge violet profile-role">{user.rol}</span>

          <div className="profile-stats">
            <div className="mb-stat">
              <span className="mb-stat-label">Pedidos</span>
              <span className="mb-stat-value">{stats.pedidos}</span>
            </div>

            <div className="mb-stat">
              <span className="mb-stat-label">Consumo</span>
              <span className="mb-stat-value">
                ${stats.gastado.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>

        <div className="profile-card profile-preferences">
          <div className="mb-section-head">
            <h2>Preferencias</h2>
            <span>Se aplican a tus próximos pedidos</span>
          </div>

          <section className="profile-block">
            <header>
              <span className="profile-block-icon">
                <Icon name="flame" size={18} />
              </span>

              <div>
                <h3>Tolerancia al picante</h3>
                <p>Para tus chilaquiles y salsas extra.</p>
              </div>
            </header>

            <div className="profile-spicy">
              {spicyLevels.map((level) => (
                <label
                  key={level.value}
                  className={`profile-spicy-option ${
                    tolerancia === level.value ? "is-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="tolerancia"
                    value={level.value}
                    checked={tolerancia === level.value}
                    onChange={(e) => setTolerancia(e.target.value)}
                  />

                  <strong>{level.label}</strong>
                  <small>{level.hint}</small>
                </label>
              ))}
            </div>
          </section>

          <section className="profile-block">
            <header>
              <span className="profile-block-icon">
                <Icon name="idCard" size={18} />
              </span>

              <div>
                <h3>Información de la cuenta</h3>
                <p>Datos registrados por control escolar.</p>
              </div>
            </header>

            <dl className="profile-info">
              <div>
                <dt>
                  <Icon name="idCard" size={15} />
                  Matrícula
                </dt>
                <dd>{user.matricula}</dd>
              </div>

              <div>
                <dt>
                  <Icon name="mail" size={15} />
                  Correo
                </dt>
                <dd>{user.correo}</dd>
              </div>

              <div>
                <dt>
                  <Icon name="star" size={15} />
                  Programa
                </dt>
                <dd>{user.carrera || "—"}</dd>
              </div>
            </dl>
          </section>

          <button
            type="button"
            className="mb-btn mb-btn-primary mb-btn-lg profile-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <span className="mb-spinner" /> : <Icon name="check" size={18} />}
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
