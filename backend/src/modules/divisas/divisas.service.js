/**
 * Integración con Frankfurter (https://frankfurter.dev), que publica
 * los tipos de cambio oficiales del Banco Central Europeo.
 *
 * En MetroBites sirve para que un alumno de intercambio pueda ver el
 * precio del menú en dólares o euros sin salir de la aplicación.
 *
 * API pública, sin llave. Los tipos de cambio se publican una vez al
 * día, así que se cachean seis horas.
 */

const {
    fetchJson,
    crearCache
} = require('../../utils/externalApi');

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const cache = crearCache(CACHE_TTL_MS);

const MONEDA_BASE = 'MXN';

const MONEDAS = {
    MXN: { codigo: 'MXN', simbolo: '$', nombre: 'Peso mexicano', bandera: '🇲🇽' },
    USD: { codigo: 'USD', simbolo: 'US$', nombre: 'Dólar estadounidense', bandera: '🇺🇸' },
    EUR: { codigo: 'EUR', simbolo: '€', nombre: 'Euro', bandera: '🇪🇺' }
};

const DESTINOS = ['USD', 'EUR'];

const URL =
    'https://api.frankfurter.dev/v1/latest' +
    `?base=${MONEDA_BASE}` +
    `&symbols=${DESTINOS.join(',')}`;

const obtenerTasas = async () =>
    cache.resolver('latest', async () => {

        const respuesta = await fetchJson(URL, {
            timeoutMs: 6000,
            proveedor: 'Frankfurter'
        });

        if (!respuesta.rates) {

            throw new Error(
                'Frankfurter respondió sin tipos de cambio'
            );

        }

        return {
            base: MONEDA_BASE,
            fecha: respuesta.date,
            monedas: DESTINOS.map((codigo) => ({
                ...MONEDAS[codigo],
                tasa: respuesta.rates[codigo],
                /*
                 Cuántos pesos cuesta una unidad de la otra moneda.
                 Es el número que la gente reconoce ("el dólar está
                 a 17 pesos").
                */
                pesosPorUnidad:
                    Math.round((1 / respuesta.rates[codigo]) * 100) / 100
            })),
            fuente: 'Banco Central Europeo vía Frankfurter',
            actualizadoEn: new Date().toISOString()
        };

    });

const convertir = async (monto, monedaDestino) => {

    const codigo = String(monedaDestino || '').toUpperCase();

    if (!DESTINOS.includes(codigo)) {

        throw new Error(
            `Solo se puede convertir a ${DESTINOS.join(' o ')}`
        );

    }

    const cantidad = Number(monto);

    if (!Number.isFinite(cantidad) || cantidad < 0) {
        throw new Error('El monto a convertir no es válido');
    }

    const tasas = await obtenerTasas();

    const moneda = tasas.monedas.find(
        (item) => item.codigo === codigo
    );

    return {
        base: MONEDA_BASE,
        monto: cantidad,
        moneda: codigo,
        simbolo: moneda.simbolo,
        convertido:
            Math.round(cantidad * moneda.tasa * 100) / 100,
        tasa: moneda.tasa,
        fecha: tasas.fecha
    };
};

module.exports = {
    obtenerTasas,
    convertir
};
