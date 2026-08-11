import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import adminProductService from "../../services/adminProductService";
import categoryService from "../../services/categoryService";
import uploadService from "../../services/uploadService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import { SkeletonGrid } from "../../components/Skeleton";

import "./AdminProducts.css";

const API_URL = "http://localhost:3000";

const emptyForm = {
  categoria_id: "",
  nombre: "",
  descripcion: "",
  precio_base: "",
  stock: "",
  url_imagen: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const loadProducts = async () => {
    try {
      const response = await adminProductService.getProductsAdmin();

      setProducts(response.data);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadProducts();

      try {
        const response = await categoryService.getCategories();

        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedFile(null);
    setIsEditing(false);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleCreateProduct = async () => {
    try {
      setSaving(true);

      let imageUrl = "";

      if (selectedFile) {
        const uploadResponse = await uploadService.uploadImage(selectedFile);

        imageUrl = uploadResponse.imageUrl;
      }

      await adminProductService.createProduct({
        ...formData,
        categoria_id: Number(formData.categoria_id),
        precio_base: Number(formData.precio_base),
        stock: Number(formData.stock),
        url_imagen: imageUrl,
      });

      await loadProducts();

      resetForm();

      toast.success("Producto creado correctamente");
    } catch (error) {
      console.error(error);

      toast.error("Error al crear el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      setSaving(true);

      let imageUrl = formData.url_imagen;

      if (selectedFile) {
        const uploadResponse = await uploadService.uploadImage(selectedFile);

        imageUrl = uploadResponse.imageUrl;
      }

      await adminProductService.updateProduct(editingProduct.id, {
        ...formData,
        categoria_id: Number(formData.categoria_id),
        precio_base: Number(formData.precio_base),
        stock: Number(formData.stock),
        url_imagen: imageUrl,
      });

      await loadProducts();

      resetForm();

      toast.success("Producto actualizado");
    } catch (error) {
      console.error(error);

      toast.error("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await adminProductService.toggleAvailability(
        product.id,
        !product.disponible,
      );

      await loadProducts();

      toast.success(
        product.disponible
          ? `${product.nombre} se desactivó`
          : `${product.nombre} está disponible`,
      );
    } catch (error) {
      console.error(error);

      toast.error("Error al actualizar el producto");
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setShowForm(true);
    setSelectedFile(null);

    setFormData({
      categoria_id: product.categoria_id,
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio_base: product.precio_base,
      stock: product.stock,
      url_imagen: product.url_imagen || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.nombre
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "todos"
          ? true
          : statusFilter === "activos"
            ? Boolean(product.disponible)
            : !product.disponible;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const activos = products.filter((product) => product.disponible).length;

  return (
    <div className="admin-products">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-section-title">Catálogo</h2>
          <p className="admin-section-text">
            {products.length} productos · {activos} disponibles
          </p>
        </div>

        <div className="admin-toolbar-actions">
          <div className="mb-input-icon admin-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              className="mb-input"
              placeholder="Buscar producto…"
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
            }}
          >
            <Icon name={showForm ? "close" : "plus"} size={18} />
            {showForm ? "Cerrar" : "Nuevo producto"}
          </button>
        </div>
      </div>

      <div className="admin-filters">
        {[
          { key: "todos", label: "Todos" },
          { key: "activos", label: "Disponibles" },
          { key: "inactivos", label: "Inactivos" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            className={`mb-chip ${statusFilter === item.key ? "is-active" : ""}`}
            onClick={() => setStatusFilter(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {showForm && (
        <section className="admin-form-card">
          <div className="admin-form-head">
            <div>
              <h2>{isEditing ? "Editar producto" : "Nuevo producto"}</h2>
              <p>Completa la información que verán los alumnos.</p>
            </div>

            {isEditing && (
              <span className="mb-badge violet">#{editingProduct?.id}</span>
            )}
          </div>

          <div className="admin-form-grid">
            <label className="mb-field">
              <span>Categoría</span>

              <select
                className="mb-select"
                value={formData.categoria_id}
                onChange={(e) =>
                  setFormData({ ...formData, categoria_id: e.target.value })
                }
              >
                <option value="">Selecciona categoría</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="mb-field">
              <span>Nombre</span>

              <input
                className="mb-input"
                type="text"
                placeholder="Ej. Chilaquiles verdes"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </label>

            <label className="mb-field full">
              <span>Descripción</span>

              <textarea
                className="mb-textarea"
                placeholder="Ingredientes o detalles del platillo"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Precio</span>

              <input
                className="mb-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.precio_base}
                onChange={(e) =>
                  setFormData({ ...formData, precio_base: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Stock</span>

              <input
                className="mb-input"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </label>

            <div className="mb-field full">
              <span>Imagen</span>

              <label className="mb-file">
                <Icon name="image" size={19} />

                <span>
                  {selectedFile ? (
                    <b>{selectedFile.name}</b>
                  ) : formData.url_imagen ? (
                    "Imagen actual cargada · elige otra para reemplazarla"
                  ) : (
                    "Selecciona una imagen del platillo"
                  )}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="mb-btn mb-btn-ghost" onClick={resetForm}>
              Cancelar
            </button>

            <button
              type="button"
              className="mb-btn mb-btn-primary"
              onClick={isEditing ? handleUpdateProduct : handleCreateProduct}
              disabled={saving}
            >
              {saving ? <span className="mb-spinner" /> : <Icon name="check" size={18} />}
              {isEditing ? "Actualizar producto" : "Guardar producto"}
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <SkeletonGrid count={6} className="admin-products-grid" />
      ) : visibleProducts.length === 0 ? (
        <EmptyState
          icon="package"
          title="Sin productos que mostrar"
          description="Ajusta la búsqueda o crea un nuevo producto para el catálogo."
        />
      ) : (
        <div className="admin-products-grid">
          {visibleProducts.map((product, index) => (
            <article
              key={product.id}
              className="admin-product mb-reveal"
              style={{ "--i": index }}
            >
              <div className="admin-product-media">
                {product.url_imagen ? (
                  <img
                    src={`${API_URL}${product.url_imagen}`}
                    alt={product.nombre}
                    loading="lazy"
                  />
                ) : (
                  <Icon name="image" size={26} />
                )}

                <span
                  className={`mb-badge ${product.disponible ? "green" : "red"} admin-product-state`}
                >
                  <span className="mb-badge-dot" />
                  {product.disponible ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="admin-product-body">
                <span className="mb-badge violet">{product.categoria}</span>

                <h3>{product.nombre}</h3>

                <p>{product.descripcion || "Sin descripción"}</p>

                <div className="admin-product-meta">
                  <div className="mb-stat">
                    <span className="mb-stat-label">Precio</span>
                    <span className="mb-stat-value">
                      ${Number(product.precio_base).toFixed(2)}
                    </span>
                  </div>

                  <div className="mb-stat">
                    <span className="mb-stat-label">Stock</span>
                    <span className="mb-stat-value">{product.stock}</span>
                  </div>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    className="mb-btn mb-btn-ghost mb-btn-sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Icon name="edit" size={16} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className={`mb-btn mb-btn-sm ${
                      product.disponible ? "mb-btn-danger" : "mb-btn-soft"
                    }`}
                    onClick={() => handleToggleAvailability(product)}
                  >
                    <Icon name="power" size={16} />
                    {product.disponible ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
