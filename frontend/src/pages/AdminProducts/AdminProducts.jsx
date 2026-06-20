import { useEffect, useState } from "react";

import adminProductService from "../../services/adminProductService";

import "./AdminProducts.css";
import categoryService from "../../services/categoryService";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    categoria_id: "",
    nombre: "",
    descripcion: "",
    precio_base: "",
    stock: "",
    url_imagen: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await adminProductService.getProductsAdmin();

        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const loadCategories = async () => {
      try {
        const response = await categoryService.getCategories();

        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
    loadCategories();
  }, []);
  const handleCreateProduct = async () => {
    try {
      await adminProductService.createProduct({
        ...formData,
        categoria_id: Number(formData.categoria_id),
        precio_base: Number(formData.precio_base),
        stock: Number(formData.stock),
      });

      const response = await adminProductService.getProductsAdmin();

      setProducts(response.data);

      setShowForm(false);

      setFormData({
        categoria_id: "",
        nombre: "",
        descripcion: "",
        precio_base: "",
        stock: "",
        url_imagen: "",
      });

      alert("Producto creado correctamente");
    } catch (error) {
      console.error(error);

      alert("Error al crear producto");
    }
  };
  return (
    <div className="admin-products">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Administración de Productos</h1>

          <p>Gestiona los productos disponibles en MetroBites</p>
        </div>

        <button
          className="new-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          ➕ Nuevo Producto
        </button>
      </div>
      {showForm && (
        <div
          className="admin-product-card"
          style={{
            marginBottom: "30px",
          }}
        >
          <h2>Nuevo Producto</h2>

          <select
            value={formData.categoria_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                categoria_id: e.target.value,
              })
            }
          >
            <option value="">Selecciona categoría</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>

          <br />
          <br />

          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({
                ...formData,
                nombre: e.target.value,
              })
            }
          />

          <br />
          <br />

          <textarea
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({
                ...formData,
                descripcion: e.target.value,
              })
            }
          />

          <br />
          <br />

          <input
            type="number"
            placeholder="Precio"
            value={formData.precio_base}
            onChange={(e) =>
              setFormData({
                ...formData,
                precio_base: e.target.value,
              })
            }
          />

          <br />
          <br />

          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock: e.target.value,
              })
            }
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="URL Imagen"
            value={formData.url_imagen}
            onChange={(e) =>
              setFormData({
                ...formData,
                url_imagen: e.target.value,
              })
            }
          />

          <br />
          <br />

          <button className="toggle-btn" onClick={handleCreateProduct}>
            Guardar Producto
          </button>
        </div>
      )}
      <div className="products-admin-grid">
        {products.map((product) => (
          <div key={product.id} className="admin-product-card">
            <div className="admin-product-name">{product.nombre}</div>

            <div className="admin-product-category">{product.categoria}</div>

            <div className="admin-product-price">${product.precio_base}</div>

            <div className="admin-product-stock">Stock: {product.stock}</div>

            <div>
              Estado:{" "}
              <span
                className={
                  product.disponible ? "status-active" : "status-inactive"
                }
              >
                {product.disponible ? "🟢 Activo" : "🔴 Inactivo"}
              </span>
            </div>

            <div className="admin-actions">
              <button className="edit-btn">✏ Editar</button>

              <button className="toggle-btn">
                {product.disponible ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;
