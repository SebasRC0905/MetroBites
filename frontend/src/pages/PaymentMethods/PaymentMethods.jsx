import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import paymentMethodService from "../../services/paymentMethodService";

import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SkeletonGrid } from "../../components/Skeleton";

import "./PaymentMethods.css";

const methodTypes = [
  {
    value: "tarjeta_credito",
    label: "Tarjeta de crédito",
    icon: "card",
    hint: "Visa, Mastercard o Amex.",
  },
  {
    value: "tarjeta_debito",
    label: "Tarjeta de débito",
    icon: "card",
    hint: "Se cobra directo a tu cuenta.",
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: "wallet",
    hint: "Paga con tu cuenta PayPal.",
  },
];

const getTypeMeta = (tipo) =>
  methodTypes.find((item) => item.value === tipo) || methodTypes[0];

const emptyForm = {
  tipo: "tarjeta_credito",
  alias: "",
  digitos: "",
  correo: "",
};

function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const [methodToDelete, setMethodToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMethods = async () => {
    try {
      const response = await paymentMethodService.getMethods();

      setMethods(response.data);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos cargar tus métodos de pago");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadMethods();
    };

    init();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
  };

  const isCard = formData.tipo !== "paypal";

  const handleCreate = async () => {
    const referencia = isCard
      ? `•••• ${formData.digitos}`
      : formData.correo.trim();

    if (isCard && formData.digitos.trim().length !== 4) {
      toast.error("Ingresa los últimos 4 dígitos de tu tarjeta");

      return;
    }

    if (!isCard && !formData.correo.trim()) {
      toast.error("Ingresa el correo de tu cuenta PayPal");

      return;
    }

    try {
      setSaving(true);

      await paymentMethodService.createMethod({
        tipo: formData.tipo,
        alias: formData.alias.trim() || null,
        referencia,
      });

      await loadMethods();
      resetForm();

      toast.success("Método de pago guardado");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "No pudimos guardar el método",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (method) => {
    try {
      await paymentMethodService.setDefaultMethod(method.id);

      await loadMethods();

      toast.success(`${getTypeMeta(method.tipo).label} ahora es tu predeterminado`);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos actualizar tu método predeterminado");
    }
  };

  const handleDelete = async () => {
    if (!methodToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await paymentMethodService.deleteMethod(methodToDelete.id);

      setMethods((prev) => prev.filter((item) => item.id !== methodToDelete.id));

      toast.success("Método de pago eliminado");

      setMethodToDelete(null);
    } catch (error) {
      console.error(error);

      toast.error("No pudimos eliminar el método de pago");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="payment-methods">
      <header className="mb-page-head">
        <div>
          <span className="mb-eyebrow">
            <Icon name="card" size={13} />
            Tu cuenta
          </span>

          <h1>Métodos de pago</h1>

          <p>
            Guarda una referencia de tus tarjetas o tu cuenta PayPal para
            elegirlas más rápido al pagar.
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
          {showForm ? "Cerrar" : "Agregar método"}
        </button>
      </header>

      <p className="payment-methods-notice">
        <Icon name="shield" size={16} />
        Por seguridad no guardamos números de tarjeta completos ni CVV. El
        cobro siempre se realiza en persona al recoger tu pedido.
      </p>

      {showForm && (
        <section className="mb-form-card">
          <div className="mb-form-head">
            <div>
              <h2>Nuevo método de pago</h2>
              <p>Elige el tipo y agrega una referencia para identificarlo.</p>
            </div>
          </div>

          <div className="payment-type-picker">
            {methodTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`payment-type-option ${
                  formData.tipo === type.value ? "is-active" : ""
                }`}
                onClick={() => setFormData({ ...formData, tipo: type.value })}
              >
                <Icon name={type.icon} size={20} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-form-grid">
            <label className="mb-field">
              <span>Alias (opcional)</span>

              <input
                className="mb-input"
                type="text"
                placeholder="Ej. Mi tarjeta principal"
                value={formData.alias}
                onChange={(e) =>
                  setFormData({ ...formData, alias: e.target.value })
                }
              />
            </label>

            {isCard ? (
              <label className="mb-field">
                <span>Últimos 4 dígitos</span>

                <input
                  className="mb-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4242"
                  value={formData.digitos}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      digitos: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                />
              </label>
            ) : (
              <label className="mb-field">
                <span>Correo de PayPal</span>

                <input
                  className="mb-input"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                />
              </label>
            )}
          </div>

          <div className="mb-form-actions">
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
              Guardar método
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <SkeletonGrid
          count={3}
          image={false}
          lines={2}
          className="payment-methods-grid"
        />
      ) : methods.length === 0 ? (
        <EmptyState
          icon="card"
          title="Aún no tienes métodos guardados"
          description="Agrega tu tarjeta o PayPal para pagar más rápido en tu próximo pedido."
        />
      ) : (
        <div className="payment-methods-grid">
          {methods.map((method, index) => {
            const meta = getTypeMeta(method.tipo);

            return (
              <article
                key={method.id}
                className="payment-method-card mb-reveal"
                style={{ "--i": index }}
              >
                <div className="payment-method-top">
                  <span className={`payment-method-icon ${method.tipo}`}>
                    <Icon name={meta.icon} size={20} />
                  </span>

                  {method.predeterminado ? (
                    <span className="mb-badge violet">Predeterminado</span>
                  ) : (
                    <button
                      type="button"
                      className="payment-method-default-btn"
                      onClick={() => handleSetDefault(method)}
                    >
                      Usar por defecto
                    </button>
                  )}
                </div>

                <strong className="payment-method-alias">
                  {method.alias || meta.label}
                </strong>

                <span className="payment-method-type">{meta.label}</span>

                <span className="payment-method-reference">
                  {method.referencia}
                </span>

                <button
                  type="button"
                  className="mb-btn mb-btn-danger mb-btn-sm mb-btn-block"
                  onClick={() => setMethodToDelete(method)}
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
        open={Boolean(methodToDelete)}
        title="¿Eliminar método de pago?"
        description={
          methodToDelete
            ? `Se eliminará "${methodToDelete.alias || getTypeMeta(methodToDelete.tipo).label}". Tus pedidos anteriores no se verán afectados.`
            : ""
        }
        confirmLabel="Sí, eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setMethodToDelete(null)}
      />
    </div>
  );
}

export default PaymentMethods;
