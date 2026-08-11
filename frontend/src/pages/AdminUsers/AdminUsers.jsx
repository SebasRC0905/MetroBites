import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import adminUserService from "../../services/adminUserService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SkeletonGrid } from "../../components/Skeleton";

import "./AdminUsers.css";

const emptyForm = {
  matricula: "",
  nombre: "",
  correo: "",
  password: "",
  carrera: "",
  rol: "alumno",
  tolerancia_picante: "medio",
};

const roles = ["alumno", "empleado", "admin"];
const spicyLevels = ["ninguno", "medio", "habanero"];

const roleTones = {
  alumno: "blue",
  empleado: "green",
  admin: "violet",
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [userToDelete, setUserToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");

  const loadUsers = async () => {
    try {
      const response = await adminUserService.getUsersAdmin();

      setUsers(response.data);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadUsers();
    };

    init();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
      };

      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        await adminUserService.updateUser(editingUser.id, payload);
      } else {
        await adminUserService.createUser(payload);
      }

      await loadUsers();
      resetForm();

      toast.success(isEditing ? "Usuario actualizado" : "Usuario creado");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Error al guardar usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditingUser(user);
    setShowForm(true);

    setFormData({
      matricula: user.matricula,
      nombre: user.nombre,
      correo: user.correo,
      password: "",
      carrera: user.carrera || "",
      rol: user.rol,
      tolerancia_picante: user.tolerancia_picante || "medio",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await adminUserService.deleteUser(userToDelete.id);

      setUsers((prev) => prev.filter((item) => item.id !== userToDelete.id));

      toast.success("Usuario eliminado");

      setUserToDelete(null);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Error al eliminar usuario");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("es-MX", {
      dateStyle: "medium",
    });

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.nombre.toLowerCase().includes(term) ||
        String(user.matricula).toLowerCase().includes(term) ||
        user.correo.toLowerCase().includes(term);

      const matchesRole = roleFilter === "todos" ? true : user.rol === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="admin-users">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-section-title">Usuarios</h2>
          <p className="admin-section-text">
            {users.length} cuentas registradas en el sistema.
          </p>
        </div>

        <div className="admin-toolbar-actions">
          <div className="mb-input-icon admin-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              className="mb-input"
              placeholder="Buscar por nombre o matrícula…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="mb-btn mb-btn-primary"
            onClick={() => {
              if (showForm) {
                resetForm();
                return;
              }

              setShowForm(true);
              setIsEditing(false);
              setEditingUser(null);
              setFormData(emptyForm);
            }}
          >
            <Icon name={showForm ? "close" : "plus"} size={18} />
            {showForm ? "Cerrar" : "Nuevo usuario"}
          </button>
        </div>
      </div>

      <div className="admin-filters">
        {["todos", ...roles].map((item) => (
          <button
            key={item}
            type="button"
            className={`mb-chip ${roleFilter === item ? "is-active" : ""}`}
            onClick={() => setRoleFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {showForm && (
        <section className="admin-form-card">
          <div className="admin-form-head">
            <div>
              <h2>{isEditing ? "Editar usuario" : "Nuevo usuario"}</h2>
              <p>
                {isEditing
                  ? "Deja la contraseña vacía si no deseas cambiarla."
                  : "Completa los datos de acceso de la cuenta."}
              </p>
            </div>

            {isEditing && (
              <span className="mb-badge violet">#{editingUser?.id}</span>
            )}
          </div>

          <div className="admin-form-grid">
            <label className="mb-field">
              <span>Matrícula</span>

              <input
                className="mb-input"
                type="text"
                placeholder="123456"
                value={formData.matricula}
                onChange={(e) =>
                  setFormData({ ...formData, matricula: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Nombre completo</span>

              <input
                className="mb-input"
                type="text"
                placeholder="Nombre y apellidos"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Correo</span>

              <input
                className="mb-input"
                type="email"
                placeholder="correo@upmh.edu.mx"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Contraseña</span>

              <input
                className="mb-input"
                type="password"
                placeholder={
                  isEditing ? "Nueva contraseña (opcional)" : "Contraseña"
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>

            <label className="mb-field full">
              <span>Programa educativo</span>

              <input
                className="mb-input"
                type="text"
                placeholder="Carrera del alumno"
                value={formData.carrera}
                onChange={(e) =>
                  setFormData({ ...formData, carrera: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Rol</span>

              <select
                className="mb-select"
                value={formData.rol}
                onChange={(e) =>
                  setFormData({ ...formData, rol: e.target.value })
                }
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="mb-field">
              <span>Tolerancia al picante</span>

              <select
                className="mb-select"
                value={formData.tolerancia_picante}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tolerancia_picante: e.target.value,
                  })
                }
              >
                {spicyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="mb-btn mb-btn-ghost" onClick={resetForm}>
              Cancelar
            </button>

            <button
              type="button"
              className="mb-btn mb-btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? <span className="mb-spinner" /> : <Icon name="check" size={18} />}
              {isEditing ? "Actualizar usuario" : "Guardar usuario"}
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <SkeletonGrid
          count={4}
          image={false}
          lines={4}
          className="admin-users-grid"
        />
      ) : visibleUsers.length === 0 ? (
        <EmptyState
          icon="users"
          title="Sin usuarios que mostrar"
          description="Ajusta la búsqueda o crea una cuenta nueva."
        />
      ) : (
        <div className="admin-users-grid">
          {visibleUsers.map((user, index) => (
            <article
              key={user.id}
              className="admin-user-card mb-reveal"
              style={{ "--i": index }}
            >
              <header className="admin-user-head">
                <span className="mb-avatar">
                  {user.nombre.charAt(0).toUpperCase()}
                </span>

                <div>
                  <h3>{user.nombre}</h3>

                  <span className={`mb-badge ${roleTones[user.rol] || "neutral"}`}>
                    {user.rol}
                  </span>
                </div>
              </header>

              <dl className="admin-user-info">
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
                  <dd>{user.carrera || "Sin carrera"}</dd>
                </div>

                <div>
                  <dt>
                    <Icon name="flame" size={15} />
                    Picante
                  </dt>
                  <dd className="is-capital">{user.tolerancia_picante}</dd>
                </div>

                <div>
                  <dt>
                    <Icon name="calendar" size={15} />
                    Registro
                  </dt>
                  <dd>{formatDate(user.creado_en)}</dd>
                </div>
              </dl>

              <div className="admin-user-actions">
                <button
                  type="button"
                  className="mb-btn mb-btn-ghost mb-btn-sm"
                  onClick={() => handleEditUser(user)}
                >
                  <Icon name="edit" size={16} />
                  Editar
                </button>

                <button
                  type="button"
                  className="mb-btn mb-btn-danger mb-btn-sm"
                  onClick={() => setUserToDelete(user)}
                >
                  <Icon name="trash" size={16} />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="¿Eliminar usuario?"
        description={
          userToDelete
            ? `Se eliminará la cuenta de ${userToDelete.nombre}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={handleDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}

export default AdminUsers;
