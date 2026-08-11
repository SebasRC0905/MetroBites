import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import couponService from "../../services/couponService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SkeletonGrid } from "../../components/Skeleton";

import "./AdminCoupons.css";

const emptyForm = {
  codigo: "",
  monto_descuento: "",
  compra_minima: "",
  valido_hasta: "",
};

const isExpired = (value) => {
  if (!value) {
    return false;
  }

  const today = new Date();
  const expiry = new Date(value);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  return expiry < today;
};

const formatDate = (value) => {
  if (!value) {
    return "Sin vencimiento";
  }

  return new Date(value).toLocaleDateString("es-MX", { dateStyle: "medium" });
};

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const [couponToDelete, setCouponToDelete] = useState(null);

  const loadCoupons = async () => {
    try {
      const response = await couponService.getCouponsAdmin();

      setCoupons(response.data);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos cargar los cupones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCoupons();
    };

    init();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleCreate = async () => {
    try {
      setSaving(true);

      await couponService.createCoupon(formData);

      await loadCoupons();
      resetForm();

      toast.success("Cupón creado correctamente");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Error al crear el cupón");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await couponService.deleteCoupon(couponToDelete.id);

      setCoupons((prev) => prev.filter((item) => item.id !== couponToDelete.id));

      toast.success("Cupón eliminado");

      setCouponToDelete(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "No se puede eliminar: ya fue usado en algún pedido",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-coupons">
      <div className="admin-toolbar">
        <div>
          <h2 className="admin-section-title">Cupones</h2>
          <p className="admin-section-text">
            {coupons.length} códigos de descuento creados.
          </p>
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
          {showForm ? "Cerrar" : "Nuevo cupón"}
        </button>
      </div>

      {showForm && (
        <section className="admin-form-card">
          <div className="admin-form-head">
            <div>
              <h2>Nuevo cupón</h2>
              <p>El código se guarda en mayúsculas automáticamente.</p>
            </div>
          </div>

          <div className="admin-form-grid">
            <label className="mb-field">
              <span>Código</span>

              <input
                className="mb-input coupon-code-input"
                type="text"
                placeholder="BIENVENIDA10"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Descuento ($)</span>

              <input
                className="mb-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="10.00"
                value={formData.monto_descuento}
                onChange={(e) =>
                  setFormData({ ...formData, monto_descuento: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Compra mínima ($)</span>

              <input
                className="mb-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.compra_minima}
                onChange={(e) =>
                  setFormData({ ...formData, compra_minima: e.target.value })
                }
              />
            </label>

            <label className="mb-field">
              <span>Válido hasta (opcional)</span>

              <input
                className="mb-input"
                type="date"
                value={formData.valido_hasta}
                onChange={(e) =>
                  setFormData({ ...formData, valido_hasta: e.target.value })
                }
              />
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="mb-btn mb-btn-ghost" onClick={resetForm}>
              Cancelar
            </button>

            <button
              type="button"
              className="mb-btn mb-btn-primary"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? <span className="mb-spinner" /> : <Icon name="check" size={18} />}
              Guardar cupón
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <SkeletonGrid
          count={3}
          image={false}
          lines={2}
          className="admin-coupons-grid"
        />
      ) : coupons.length === 0 ? (
        <EmptyState
          icon="tag"
          title="Sin cupones todavía"
          description="Crea un código de descuento para promociones o eventos especiales."
        />
      ) : (
        <div className="admin-coupons-grid">
          {coupons.map((coupon, index) => {
            const expired = isExpired(coupon.valido_hasta);

            return (
              <article
                key={coupon.id}
                className="coupon-card mb-reveal"
                style={{ "--i": index }}
              >
                <div className="coupon-card-top">
                  <span className="coupon-card-icon">
                    <Icon name="tag" size={19} />
                  </span>

                  <span className={`mb-badge ${expired ? "red" : "green"}`}>
                    {expired ? "Vencido" : "Vigente"}
                  </span>
                </div>

                <strong className="coupon-card-code">{coupon.codigo}</strong>

                <p className="coupon-card-amount">
                  ${Number(coupon.monto_descuento).toFixed(2)} de descuento
                </p>

                <dl className="coupon-card-meta">
                  <div>
                    <dt>Compra mínima</dt>
                    <dd>${Number(coupon.compra_minima).toFixed(2)}</dd>
                  </div>

                  <div>
                    <dt>Vigencia</dt>
                    <dd>{formatDate(coupon.valido_hasta)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="mb-btn mb-btn-danger mb-btn-sm mb-btn-block"
                  onClick={() => setCouponToDelete(coupon)}
                >
                  <Icon name="trash" size={16} />
                  Eliminar
                </button>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(couponToDelete)}
        title="¿Eliminar cupón?"
        description={
          couponToDelete
            ? `Se eliminará el código ${couponToDelete.codigo}. No podrá usarse en nuevos pedidos.`
            : ""
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setCouponToDelete(null)}
      />
    </div>
  );
}

export default AdminCoupons;
