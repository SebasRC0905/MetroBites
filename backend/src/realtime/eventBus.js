const { EventEmitter } = require('events');
const crypto = require('crypto');

/**
 * Bus de eventos en memoria + tickets de acceso para SSE.
 *
 * El tablero del administrador y la pantalla de seguimiento del alumno
 * no viven de sondear la API cada pocos segundos: se suscriben a un
 * stream Server-Sent Events y el backend les empuja cada cambio de
 * estado en cuanto ocurre.
 *
 * Al ser memoria del proceso, esto funciona con una sola instancia del
 * servidor (que es el caso de MetroBites). Si algún día se escala a
 * varias instancias habría que sustituir el emisor por Redis pub/sub
 * sin tocar el resto del código.
 */

const emisor = new EventEmitter();

// Un tablero abierto en varias pantallas es normal; subimos el límite.
emisor.setMaxListeners(50);

const CANAL = 'pedidos';

const publicar = (evento) => {

    emisor.emit(CANAL, {
        ...evento,
        emitidoEn: new Date().toISOString()
    });

};

const suscribir = (manejador) => {

    emisor.on(CANAL, manejador);

    return () => emisor.off(CANAL, manejador);

};

/* ------------------------------------------------------------------
   Tickets de acceso
   ------------------------------------------------------------------
   EventSource (la API del navegador para SSE) no permite mandar el
   header Authorization. En vez de exponer el JWT en la URL —donde
   queda en logs e historial— el cliente pide un ticket de un solo uso
   con su token normal y ese ticket, que vive un minuto, es el que
   viaja en la query string.
------------------------------------------------------------------- */

const TICKET_TTL_MS = 60 * 1000;

const tickets = new Map();

const limpiarTicketsVencidos = () => {

    const ahora = Date.now();

    for (const [clave, ticket] of tickets) {

        if (ticket.expiraEn <= ahora) {
            tickets.delete(clave);
        }

    }

};

const crearTicket = (usuario) => {

    limpiarTicketsVencidos();

    const clave = crypto.randomBytes(24).toString('hex');

    tickets.set(clave, {
        usuario: {
            id: usuario.id,
            rol: usuario.rol
        },
        expiraEn: Date.now() + TICKET_TTL_MS
    });

    return {
        ticket: clave,
        expiraEnSegundos: TICKET_TTL_MS / 1000
    };

};

const consumirTicket = (clave) => {

    limpiarTicketsVencidos();

    const ticket = tickets.get(clave);

    if (!ticket) {
        return null;
    }

    // Un solo uso: en cuanto se abre el stream el ticket deja de servir.
    tickets.delete(clave);

    return ticket.usuario;

};

module.exports = {
    publicar,
    suscribir,
    crearTicket,
    consumirTicket
};
