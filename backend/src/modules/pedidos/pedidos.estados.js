/**
 * Ciclo de vida de un pedido de la cafetería.
 *
 * Este archivo es la única fuente de verdad sobre los estados: qué
 * significa cada uno, a qué estados puede pasar, quién tiene permiso
 * de hacer ese cambio y cuándo hace falta un motivo. El servicio lo
 * usa para validar y el frontend lo consume por API (`GET
 * /api/pedidos/estados`) para no duplicar las reglas.
 */

const ESTADOS = {

    pendiente_pago: {
        clave: 'pendiente_pago',
        etiqueta: 'Pago pendiente',
        descripcion:
            'El pedido se registró pero todavía no se confirma el pago.',
        mensajeAlumno:
            'Estamos esperando la confirmación de tu pago.',
        tono: 'amber',
        icono: 'wallet',
        paso: 0,
        esFinal: false,
        enTablero: true
    },

    recibido: {
        clave: 'recibido',
        etiqueta: 'Recibido',
        descripcion:
            'La cafetería ya ve el pedido, falta que lo acepte.',
        mensajeAlumno:
            'Tu pedido llegó a la cafetería. En un momento lo confirman.',
        tono: 'blue',
        icono: 'receipt',
        paso: 1,
        esFinal: false,
        enTablero: true
    },

    confirmado: {
        clave: 'confirmado',
        etiqueta: 'Confirmado',
        descripcion:
            'La cafetería aceptó el pedido y está en la cola de cocina.',
        mensajeAlumno:
            'La cafetería confirmó tu pedido y ya está en la fila.',
        tono: 'violet',
        icono: 'checkCircle',
        paso: 2,
        esFinal: false,
        enTablero: true
    },

    preparando: {
        clave: 'preparando',
        etiqueta: 'En preparación',
        descripcion:
            'El pedido se está cocinando en este momento.',
        mensajeAlumno:
            'Ya están preparando tu pedido.',
        tono: 'amber',
        icono: 'utensils',
        paso: 3,
        esFinal: false,
        enTablero: true
    },

    listo: {
        clave: 'listo',
        etiqueta: 'Listo para recoger',
        descripcion:
            'El pedido está empacado esperando en la ventanilla.',
        mensajeAlumno:
            '¡Tu pedido está listo! Pásalo a recoger con tu código QR.',
        tono: 'green',
        icono: 'package',
        paso: 4,
        esFinal: false,
        enTablero: true
    },

    entregado: {
        clave: 'entregado',
        etiqueta: 'Entregado',
        descripcion:
            'El alumno recogió su pedido.',
        mensajeAlumno:
            'Pedido entregado. ¡Buen provecho!',
        tono: 'green',
        icono: 'star',
        paso: 5,
        esFinal: true,
        enTablero: false
    },

    cancelado: {
        clave: 'cancelado',
        etiqueta: 'Cancelado',
        descripcion:
            'El pedido se canceló antes de entregarse.',
        mensajeAlumno:
            'Tu pedido fue cancelado.',
        tono: 'red',
        icono: 'close',
        paso: null,
        esFinal: true,
        enTablero: false
    },

    rechazado: {
        clave: 'rechazado',
        etiqueta: 'Rechazado',
        descripcion:
            'La cafetería no pudo tomar el pedido (sin ingredientes, fuera de horario…).',
        mensajeAlumno:
            'La cafetería no pudo tomar tu pedido.',
        tono: 'red',
        icono: 'alert',
        paso: null,
        esFinal: true,
        enTablero: false
    },

    no_recogido: {
        clave: 'no_recogido',
        etiqueta: 'No recogido',
        descripcion:
            'El pedido estuvo listo pero nadie pasó por él en su horario.',
        mensajeAlumno:
            'Tu pedido no se recogió en el horario acordado.',
        tono: 'neutral',
        icono: 'clock',
        paso: null,
        esFinal: true,
        enTablero: false
    }
};

const PERSONAL = ['admin', 'empleado'];
const TODOS = ['admin', 'empleado', 'alumno'];

/**
 * Transiciones válidas: estado actual → estado destino → roles que
 * pueden ejecutarla. Lo que no está aquí, no se puede hacer.
 */
const TRANSICIONES = {

    pendiente_pago: {
        recibido: PERSONAL,
        cancelado: TODOS,
        rechazado: PERSONAL
    },

    recibido: {
        confirmado: PERSONAL,
        cancelado: TODOS,
        rechazado: PERSONAL
    },

    confirmado: {
        preparando: PERSONAL,
        cancelado: TODOS,
        rechazado: PERSONAL
    },

    preparando: {
        listo: PERSONAL,
        cancelado: PERSONAL
    },

    listo: {
        entregado: PERSONAL,
        no_recogido: PERSONAL
    },

    entregado: {},
    cancelado: {},
    rechazado: {},
    no_recogido: {}
};

/*
 Estados que obligan a capturar un motivo: el alumno merece saber por
 qué se canceló su pedido y el administrador necesita el registro.
*/
const REQUIEREN_MOTIVO = ['cancelado', 'rechazado'];

/*
 Minutos estimados que se sugieren al pasar a cada estado. Es solo un
 valor por defecto: el personal puede sobrescribirlo desde el tablero.
*/
const TIEMPO_ESTIMADO_POR_ESTADO = {
    recibido: 20,
    confirmado: 15,
    preparando: 10,
    listo: 0
};

/*
 Cómo queda el pago cuando el pedido llega a ciertos estados. Evita
 que un pedido entregado siga marcado como "pendiente" de pago.
*/
const ESTADO_PAGO_POR_ESTADO = {
    entregado: 'pagado',
    cancelado: 'cancelado',
    rechazado: 'cancelado'
};

const ORDEN_TABLERO = [
    'pendiente_pago',
    'recibido',
    'confirmado',
    'preparando',
    'listo'
];

/* Estados que representan un pedido todavía "vivo". */
const ESTADOS_ACTIVOS = Object.values(ESTADOS)
    .filter((estado) => !estado.esFinal)
    .map((estado) => estado.clave);

const LISTA_ESTADOS = Object.keys(ESTADOS);

const existeEstado = (estado) =>
    Object.prototype.hasOwnProperty.call(ESTADOS, estado);

/**
 * Devuelve las acciones que un rol puede ejecutar sobre un pedido que
 * está en cierto estado, ya listas para pintar botones en la interfaz.
 */
const obtenerTransiciones = (estadoActual, rol) => {

    const posibles = TRANSICIONES[estadoActual] || {};

    return Object.entries(posibles)
        .filter(([, roles]) => roles.includes(rol))
        .map(([destino]) => ({
            estado: destino,
            etiqueta: ESTADOS[destino].etiqueta,
            tono: ESTADOS[destino].tono,
            icono: ESTADOS[destino].icono,
            requiereMotivo: REQUIEREN_MOTIVO.includes(destino)
        }));
};

const puedeTransicionar = (estadoActual, estadoNuevo, rol) => {

    const posibles = TRANSICIONES[estadoActual] || {};

    const roles = posibles[estadoNuevo];

    return Array.isArray(roles) && roles.includes(rol);
};

/**
 * Catálogo que consume el frontend para pintar etiquetas, colores y
 * columnas del tablero sin tener las reglas duplicadas.
 */
const obtenerCatalogo = (rol = 'alumno') => ({

    estados: LISTA_ESTADOS.map((clave) => ({
        ...ESTADOS[clave],
        requiereMotivo: REQUIEREN_MOTIVO.includes(clave),
        transiciones: obtenerTransiciones(clave, rol)
    })),

    ordenTablero: ORDEN_TABLERO,

    estadosActivos: ESTADOS_ACTIVOS,

    flujoPrincipal: LISTA_ESTADOS
        .filter((clave) => ESTADOS[clave].paso !== null)
        .sort((a, b) => ESTADOS[a].paso - ESTADOS[b].paso)
});

module.exports = {
    ESTADOS,
    TRANSICIONES,
    REQUIEREN_MOTIVO,
    TIEMPO_ESTIMADO_POR_ESTADO,
    ESTADO_PAGO_POR_ESTADO,
    ORDEN_TABLERO,
    ESTADOS_ACTIVOS,
    LISTA_ESTADOS,
    existeEstado,
    obtenerTransiciones,
    puedeTransicionar,
    obtenerCatalogo
};
