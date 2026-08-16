/**
 * Programas educativos de la UPMH.
 *
 * Están aquí y no dentro de una pantalla porque los usan tanto el
 * registro como la edición del perfil: si la universidad abre un
 * programa nuevo, se agrega en un solo lugar.
 */
export const CARRERAS = [
  "Aeronáutica",
  "Animación y Efectos Visuales",
  "Energía y Desarrollo Sostenible",
  "Logística",
  "Tecnologías de la Información e Innovación Digital",
  "Administración y Gestión Empresarial",
  "Arquitectura Bioclimática",
  "Comercio Internacional y Aduanas",
];

/** Dominio del correo institucional exigido por el backend. */
export const DOMINIO_INSTITUCIONAL = "upmh.edu.mx";

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Misma regla que aplica el servidor, replicada aquí solo para avisar
 * antes de enviar el formulario. La validación que manda es la del
 * backend.
 */
export const esCorreoInstitucional = (correo) => {
  const valor = String(correo || "").trim().toLowerCase();

  return (
    FORMATO_CORREO.test(valor) && valor.endsWith(`@${DOMINIO_INSTITUCIONAL}`)
  );
};

export default CARRERAS;
