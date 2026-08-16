/**
 * Reglas de validación compartidas por la API.
 *
 * Viven aquí y no dentro de un módulo para que las use tanto el
 * registro público como el alta de usuarios desde el panel: el correo
 * institucional se exige en los dos caminos, no solo en la pantalla.
 */

/*
 El dominio se puede cambiar por variable de entorno para no tocar
 código si la universidad estrena otro (o para poder probar en local).
*/
const DOMINIO_INSTITUCIONAL = (
    process.env.DOMINIO_INSTITUCIONAL || 'upmh.edu.mx'
).toLowerCase();

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MENSAJE_CORREO_INSTITUCIONAL =
    `El correo debe ser institucional (@${DOMINIO_INSTITUCIONAL})`;

const normalizarCorreo = (correo) =>
    String(correo || '').trim().toLowerCase();

/**
 * Verdadero solo si el correo tiene formato válido y termina
 * exactamente en el dominio institucional (no vale
 * "alguien@upmh.edu.mx.otro.com").
 */
const esCorreoInstitucional = (correo) => {

    const valor = normalizarCorreo(correo);

    if (!FORMATO_CORREO.test(valor)) {
        return false;
    }

    return valor.endsWith(`@${DOMINIO_INSTITUCIONAL}`);
};

/**
 * Lanza un error con mensaje para el usuario si el correo no sirve.
 * Se usa en los servicios como segunda barrera, por si algún día se
 * agrega una ruta nueva y se olvida el validador de la ruta.
 */
const asegurarCorreoInstitucional = (correo) => {

    if (!esCorreoInstitucional(correo)) {
        throw new Error(MENSAJE_CORREO_INSTITUCIONAL);
    }

    return normalizarCorreo(correo);
};

const MENSAJE_CONTRASENA =
    'La contraseña debe tener al menos 8 caracteres, una letra y un número';

const esContrasenaSegura = (password) => {

    const valor = String(password || '');

    return (
        valor.length >= 8 &&
        /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(valor) &&
        /[0-9]/.test(valor)
    );
};

module.exports = {
    DOMINIO_INSTITUCIONAL,
    MENSAJE_CORREO_INSTITUCIONAL,
    MENSAJE_CONTRASENA,
    normalizarCorreo,
    esCorreoInstitucional,
    asegurarCorreoInstitucional,
    esContrasenaSegura
};
