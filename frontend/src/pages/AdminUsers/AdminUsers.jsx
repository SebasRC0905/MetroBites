import { useEffect, useState } from "react";

import adminUserService from "../../services/adminUserService";

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

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const loadUsers = async () => {
    try {
      const response = await adminUserService.getUsersAdmin();

      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
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

      alert(isEditing ? "Usuario actualizado" : "Usuario creado correctamente");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error al guardar usuario");
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
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `¿Eliminar el usuario ${user.nombre}? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await adminUserService.deleteUser(user.id);

      setUsers((prev) => prev.filter((item) => item.id !== user.id));

      alert("Usuario eliminado");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Error al eliminar usuario");
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("es-MX", {
      dateStyle: "medium",
    });

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-title">
          <span className="eyebrow">Comunidad</span>
          <h1>Administración de usuarios</h1>

          <p>Gestiona alumnos, empleados y administradores del sistema.</p>
        </div>

        <button
          type="button"
          className="new-product-btn"
          onClick={() => {
            if (showForm && !isEditing) {
              resetForm();
              return;
            }

            setShowForm(true);
            setIsEditing(false);
            setEditingUser(null);
            setFormData(emptyForm);
          }}
        >
          + Nuevo usuario
        </button>
      </div>

      {showForm && (
        <div className="admin-user-form-card">
          <div className="product-form-heading">
            <h2>{isEditing ? "Editar usuario" : "Nuevo usuario"}</h2>
            <span>
              {isEditing
                ? "Deja la contraseña vacía si no deseas cambiarla"
                : "Completa los datos de acceso"}
            </span>
          </div>

          <div className="admin-form-grid">
            <label className="admin-field">
              <span>Matrícula</span>
              <input
                type="text"
                placeholder="Matrícula"
                value={formData.matricula}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matricula: e.target.value,
                  })
                }
              />
            </label>

            <label className="admin-field">
              <span>Nombre</span>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre: e.target.value,
                  })
                }
              />
            </label>

            <label className="admin-field">
              <span>Correo</span>
              <input
                type="email"
                placeholder="correo@upmh.edu.mx"
                value={formData.correo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    correo: e.target.value,
                  })
                }
              />
            </label>

            <label className="admin-field">
              <span>Contraseña</span>
              <input
                type="password"
                placeholder={isEditing ? "Nueva contraseña opcional" : "Contraseña"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </label>

            <label className="admin-field full">
              <span>Carrera</span>
              <input
                type="text"
                placeholder="Programa educativo"
                value={formData.carrera}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carrera: e.target.value,
                  })
                }
              />
            </label>

            <label className="admin-field">
              <span>Rol</span>
              <select
                value={formData.rol}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rol: e.target.value,
                  })
                }
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span>Tolerancia picante</span>
              <select
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
            <button type="button" className="edit-btn" onClick={resetForm}>
              Cancelar
            </button>

            <button type="button" className="toggle-btn" onClick={handleSubmit}>
              {isEditing ? "Actualizar usuario" : "Guardar usuario"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <div className="admin-empty-state">
          <h2>No hay usuarios registrados</h2>
          <p>Agrega el primer usuario administrativo o alumno.</p>
        </div>
      ) : (
        <div className="admin-users-grid">
          {users.map((user) => (
            <div key={user.id} className="admin-user-card">
              <div className="admin-user-top">
                <div className="admin-user-avatar">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2>{user.nombre}</h2>
                  <span className={`admin-role-badge ${user.rol}`}>
                    {user.rol}
                  </span>
                </div>
              </div>

              <div className="admin-user-info">
                <div>
                  <span>Matrícula</span>
                  <strong>{user.matricula}</strong>
                </div>

                <div>
                  <span>Correo</span>
                  <strong>{user.correo}</strong>
                </div>

                <div>
                  <span>Carrera</span>
                  <strong>{user.carrera || "Sin carrera"}</strong>
                </div>

                <div>
                  <span>Picante</span>
                  <strong>{user.tolerancia_picante}</strong>
                </div>

                <div>
                  <span>Registro</span>
                  <strong>{formatDate(user.creado_en)}</strong>
                </div>
              </div>

              <div className="admin-actions">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEditUser(user)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => handleDeleteUser(user)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
