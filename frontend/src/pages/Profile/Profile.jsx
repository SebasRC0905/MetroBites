import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import profileService from "../../services/profileService";
import historyService from "../../services/historyService";

import Icon from "../../components/Icon";
import Avatar from "../../components/Avatar";
import AnimatedNumber from "../../components/AnimatedNumber";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SkeletonLine } from "../../components/Skeleton";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

import { CARRERAS } from "../../lib/carreras";
import { itemVariants, listaVariants, resorte } from "../../lib/motion";
import { queryKeys } from "../../lib/queryClient";

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

const MAXIMO_FOTO_MB = 3;

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const formatearFecha = (valor) =>
  valor
    ? new Date(valor).toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric",
      })
    : "—";

/**
 * Pantalla del perfil ya con datos.
 *
 * Va en su propio componente para que el formulario pueda arrancar
 * directo con los valores del usuario (`useState` con valor inicial) en
 * vez de copiarlos en un efecto, que provocaría un render de más.
 */
function PerfilCargado({ user }) {
  const clienteConsultas = useQueryClient();

  const { refreshUser } = useAuth();
  const { favorites } = useFavorites();

  const archivoRef = useRef(null);

  const [form, setForm] = useState(() => ({
    nombre: user.nombre || "",
    carrera: user.carrera || "",
    telefono: user.telefono || "",
    tolerancia_picante: user.tolerancia_picante || "medio",
  }));

  const [preferenciasElegidas, setPreferenciasElegidas] = useState(() =>
    user.preferencias.map((item) => item.id),
  );

  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [passwords, setPasswords] = useState({ actual: "", nueva: "", repetir: "" });

  const catalogoConsulta = useQuery({
    queryKey: ["preferencias"],
    queryFn: profileService.getPreferencias,
    staleTime: 60 * 60 * 1000,
    select: (respuesta) => respuesta.data,
  });

  const pedidosConsulta = useQuery({
    queryKey: queryKeys.misPedidos,
    queryFn: historyService.getMyOrders,
    select: (respuesta) => respuesta.data,
  });

  const alGuardar = (respuesta) => {
    clienteConsultas.setQueryData(["perfil"], respuesta);

    refreshUser();
  };

  const guardar = useMutation({
    mutationFn: (datos) => profileService.updateProfile(datos),
    onSuccess: (respuesta) => {
      alGuardar(respuesta);

      toast.success("Perfil actualizado");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "No pudimos guardar tus cambios",
      );
    },
  });

  const subirFoto = useMutation({
    mutationFn: (file) => profileService.uploadPhoto(file),
    onSuccess: (respuesta) => {
      alGuardar(respuesta);

      toast.success("Foto de perfil actualizada");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "No pudimos subir la imagen",
      );
    },
  });

  const borrarFoto = useMutation({
    mutationFn: profileService.deletePhoto,
    onSuccess: (respuesta) => {
      alGuardar(respuesta);

      setConfirmandoBorrado(false);

      toast.success("Foto eliminada");
    },
    onError: () => toast.error("No pudimos quitar la foto"),
  });

  const cambiarPassword = useMutation({
    mutationFn: ({ actual, nueva }) =>
      profileService.changePassword(actual, nueva),
    onSuccess: () => {
      toast.success("Contraseña actualizada");

      setPasswords({ actual: "", nueva: "", repetir: "" });
      setCambiandoPassword(false);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "No pudimos cambiar tu contraseña",
      );
    },
  });

  const elegirArchivo = (evento) => {
    const file = evento.target.files?.[0];

    // Permite volver a elegir la misma imagen si algo salió mal.
    evento.target.value = "";

    if (!file) {
      return;
    }

    if (!TIPOS_IMAGEN.includes(file.type)) {
      toast.error("Usa una imagen JPG, PNG, WEBP o GIF");

      return;
    }

    if (file.size > MAXIMO_FOTO_MB * 1024 * 1024) {
      toast.error(`La imagen no debe pesar más de ${MAXIMO_FOTO_MB} MB`);

      return;
    }

    subirFoto.mutate(file);
  };

  const alternarPreferencia = (id) => {
    setPreferenciasElegidas((previas) =>
      previas.includes(id)
        ? previas.filter((item) => item !== id)
        : [...previas, id],
    );
  };

  const pedidos = pedidosConsulta.data || [];

  const gastado = pedidos.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0,
  );

  const entregados = pedidos.filter(
    (pedido) => pedido.estado === "entregado",
  ).length;

  const catalogo = catalogoConsulta.data || [];

  const alergias = catalogo.filter((item) => item.tipo === "alergia");
  const estilos = catalogo.filter((item) => item.tipo === "estilo_vida");

  const hayCambios =
    form.nombre !== (user.nombre || "") ||
    form.carrera !== (user.carrera || "") ||
    form.telefono !== (user.telefono || "") ||
    form.tolerancia_picante !== user.tolerancia_picante ||
    preferenciasElegidas.length !== user.preferencias.length ||
    preferenciasElegidas.some(
      (id) => !user.preferencias.some((item) => item.id === id),
    );

  const passwordsCoinciden =
    passwords.repetir.length === 0 || passwords.nueva === passwords.repetir;

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
          <div className="profile-photo">
            <Avatar nombre={user.nombre} urlFoto={user.url_foto} size={112} />

            <button
              type="button"
              className="profile-photo-btn"
              onClick={() => archivoRef.current?.click()}
              disabled={subirFoto.isPending}
              aria-label="Cambiar foto de perfil"
            >
              {subirFoto.isPending ? (
                <span className="mb-spinner" />
              ) : (
                <Icon name="image" size={16} />
              )}
            </button>

            <input
              ref={archivoRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={elegirArchivo}
            />
          </div>

          <h2>{user.nombre}</h2>

          <p>{user.carrera || "Comunidad UPMH"}</p>

          <span className="mb-badge violet profile-role">{user.rol}</span>

          <div className="profile-photo-actions">
            <button
              type="button"
              className="mb-btn mb-btn-soft mb-btn-sm"
              onClick={() => archivoRef.current?.click()}
              disabled={subirFoto.isPending}
            >
              <Icon name="image" size={15} />
              {user.url_foto ? "Cambiar foto" : "Subir foto"}
            </button>

            {user.url_foto && (
              <button
                type="button"
                className="mb-btn mb-btn-ghost mb-btn-sm"
                onClick={() => setConfirmandoBorrado(true)}
              >
                <Icon name="trash" size={15} />
                Quitar
              </button>
            )}
          </div>

          <p className="profile-photo-hint">
            JPG, PNG o WEBP · máximo {MAXIMO_FOTO_MB} MB
          </p>

          <motion.div
            className="profile-stats"
            variants={listaVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div className="mb-stat" variants={itemVariants}>
              <span className="mb-stat-label">Pedidos</span>
              <span className="mb-stat-value">
                <AnimatedNumber value={pedidos.length} />
              </span>
            </motion.div>

            <motion.div className="mb-stat" variants={itemVariants}>
              <span className="mb-stat-label">Entregados</span>
              <span className="mb-stat-value">
                <AnimatedNumber value={entregados} />
              </span>
            </motion.div>

            <motion.div className="mb-stat" variants={itemVariants}>
              <span className="mb-stat-label">Consumo</span>
              <span className="mb-stat-value">
                <AnimatedNumber value={gastado} decimals={2} prefix="$" />
              </span>
            </motion.div>

            <motion.div className="mb-stat" variants={itemVariants}>
              <span className="mb-stat-label">Favoritos</span>
              <span className="mb-stat-value">
                <AnimatedNumber value={favorites.length} />
              </span>
            </motion.div>
          </motion.div>

          <p className="profile-since">
            <Icon name="calendar" size={14} />
            Miembro desde {formatearFecha(user.creado_en)}
          </p>
        </aside>

        <div className="profile-card profile-preferences">
          <div className="mb-section-head">
            <h2>Preferencias</h2>
            <span>Se aplican a tus próximos pedidos</span>
          </div>

          <section className="profile-block">
            <header>
              <span className="profile-block-icon">
                <Icon name="idCard" size={18} />
              </span>

              <div>
                <h3>Tus datos</h3>
                <p>Cómo te identificamos al recoger tu pedido.</p>
              </div>
            </header>

            <div className="profile-fields">
              <label className="mb-field">
                <span>Nombre completo</span>

                <input
                  className="mb-input"
                  type="text"
                  value={form.nombre}
                  maxLength={100}
                  onChange={(evento) =>
                    setForm({ ...form, nombre: evento.target.value })
                  }
                />
              </label>

              <label className="mb-field">
                <span>Teléfono de contacto</span>

                <input
                  className="mb-input"
                  type="tel"
                  placeholder="7712345678"
                  value={form.telefono}
                  maxLength={20}
                  onChange={(evento) =>
                    setForm({ ...form, telefono: evento.target.value })
                  }
                />
              </label>

              <label className="mb-field profile-field-wide">
                <span>Programa educativo</span>

                <select
                  className="mb-select"
                  value={form.carrera}
                  onChange={(evento) =>
                    setForm({ ...form, carrera: evento.target.value })
                  }
                >
                  <option value="">Sin especificar</option>

                  {CARRERAS.map((carrera) => (
                    <option key={carrera} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </select>
              </label>
            </div>

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
                  Correo institucional
                </dt>
                <dd>{user.correo}</dd>
              </div>
            </dl>
          </section>

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
                    form.tolerancia_picante === level.value ? "is-active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="tolerancia"
                    value={level.value}
                    checked={form.tolerancia_picante === level.value}
                    onChange={(evento) =>
                      setForm({
                        ...form,
                        tolerancia_picante: evento.target.value,
                      })
                    }
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
                <Icon name="leaf" size={18} />
              </span>

              <div>
                <h3>Alergias y estilo de vida</h3>
                <p>
                  Te avisamos cuando un platillo pueda contener algo que
                  marcaste.
                </p>
              </div>
            </header>

            <div className="profile-tags-group">
              <span className="profile-tags-label">Alergias</span>

              <div className="profile-tags">
                {alergias.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    className={`profile-tag is-allergy ${
                      preferenciasElegidas.includes(item.id) ? "is-active" : ""
                    }`}
                    onClick={() => alternarPreferencia(item.id)}
                    whileTap={{ scale: 0.94 }}
                    transition={resorte}
                  >
                    {preferenciasElegidas.includes(item.id) && (
                      <Icon name="check" size={13} strokeWidth={3} />
                    )}
                    {item.nombre}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="profile-tags-group">
              <span className="profile-tags-label">Estilo de vida</span>

              <div className="profile-tags">
                {estilos.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    className={`profile-tag ${
                      preferenciasElegidas.includes(item.id) ? "is-active" : ""
                    }`}
                    onClick={() => alternarPreferencia(item.id)}
                    whileTap={{ scale: 0.94 }}
                    transition={resorte}
                  >
                    {preferenciasElegidas.includes(item.id) && (
                      <Icon name="check" size={13} strokeWidth={3} />
                    )}
                    {item.nombre}
                  </motion.button>
                ))}
              </div>
            </div>
          </section>

          <section className="profile-block">
            <header>
              <span className="profile-block-icon">
                <Icon name="lock" size={18} />
              </span>

              <div>
                <h3>Seguridad</h3>
                <p>Cambia tu contraseña de acceso.</p>
              </div>
            </header>

            {!cambiandoPassword ? (
              <button
                type="button"
                className="mb-btn mb-btn-soft"
                onClick={() => setCambiandoPassword(true)}
              >
                <Icon name="lock" size={16} />
                Cambiar contraseña
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  className="profile-password"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="mb-field">
                    <span>Contraseña actual</span>

                    <input
                      className="mb-input"
                      type="password"
                      autoComplete="current-password"
                      value={passwords.actual}
                      onChange={(evento) =>
                        setPasswords({
                          ...passwords,
                          actual: evento.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="mb-field">
                    <span>Nueva contraseña</span>

                    <input
                      className="mb-input"
                      type="password"
                      autoComplete="new-password"
                      value={passwords.nueva}
                      onChange={(evento) =>
                        setPasswords({
                          ...passwords,
                          nueva: evento.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="mb-field">
                    <span>Repite la nueva</span>

                    <input
                      className={`mb-input ${passwordsCoinciden ? "" : "is-invalid"}`}
                      type="password"
                      autoComplete="new-password"
                      value={passwords.repetir}
                      onChange={(evento) =>
                        setPasswords({
                          ...passwords,
                          repetir: evento.target.value,
                        })
                      }
                    />
                  </label>

                  <p className="profile-password-hint">
                    <Icon name="shield" size={14} />
                    Mínimo 8 caracteres, con al menos una letra y un número.
                  </p>

                  <div className="profile-password-actions">
                    <button
                      type="button"
                      className="mb-btn mb-btn-ghost"
                      onClick={() => {
                        setCambiandoPassword(false);
                        setPasswords({ actual: "", nueva: "", repetir: "" });
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="mb-btn mb-btn-primary"
                      disabled={
                        cambiarPassword.isPending ||
                        !passwords.actual ||
                        passwords.nueva.length < 8 ||
                        passwords.nueva !== passwords.repetir
                      }
                      onClick={() =>
                        cambiarPassword.mutate({
                          actual: passwords.actual,
                          nueva: passwords.nueva,
                        })
                      }
                    >
                      {cambiarPassword.isPending && (
                        <span className="mb-spinner" />
                      )}
                      Guardar contraseña
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </section>

          <button
            type="button"
            className="mb-btn mb-btn-primary mb-btn-lg profile-save"
            onClick={() =>
              guardar.mutate({
                ...form,
                preferencias: preferenciasElegidas,
              })
            }
            disabled={guardar.isPending || !hayCambios}
          >
            {guardar.isPending ? (
              <span className="mb-spinner" />
            ) : (
              <Icon name="check" size={18} />
            )}
            {guardar.isPending
              ? "Guardando…"
              : hayCambios
                ? "Guardar cambios"
                : "Todo guardado"}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmandoBorrado}
        title="¿Quitar tu foto de perfil?"
        description="Volverás a aparecer con tus iniciales."
        confirmLabel="Sí, quitarla"
        loading={borrarFoto.isPending}
        onConfirm={() => borrarFoto.mutate()}
        onCancel={() => setConfirmandoBorrado(false)}
      />
    </div>
  );
}

/**
 * Carga el perfil y monta la pantalla con `key` del usuario: si se
 * cambia de cuenta en el mismo equipo, el formulario nace limpio.
 */
function Profile() {
  const perfilConsulta = useQuery({
    queryKey: ["perfil"],
    queryFn: profileService.getProfile,
    select: (respuesta) => respuesta.data,
  });

  const user = perfilConsulta.data;

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
            <SkeletonLine
              width="60%"
              height={18}
              style={{ margin: "0 auto 12px" }}
            />
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

  return <PerfilCargado key={user.id} user={user} />;
}

export default Profile;
