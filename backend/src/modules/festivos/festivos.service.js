/**
 * Integración con Nager.Date (https://date.nager.at), un directorio
 * abierto de días festivos oficiales por país.
 *
 * En MetroBites se usa para avisar en el menú qué días no habrá
 * servicio en la cafetería, para que nadie programe un pedido en un
 * día inhábil.
 *
 * API pública, sin llave. Se cachea 24 horas por año consultado.
 */

const {
    fetchJson,
    crearCache
} = require('../../utils/externalApi');

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const cache = crearCache(CACHE_TTL_MS);

const PAIS = 'MX';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const construirUrl = (anio) =>
    `https://date.nager.at/api/v3/PublicHolidays/${anio}/${PAIS}`;

const obtenerDelAnio = async (anio) =>
    cache.resolver(String(anio), async () => {

        const respuesta = await fetchJson(
            construirUrl(anio),
            {
                timeoutMs: 6000,
                proveedor: 'Nager.Date'
            }
        );

        return Array.isArray(respuesta) ? respuesta : [];

    });

const inicioDelDia = (fecha) => {

    const copia = new Date(fecha);

    copia.setHours(0, 0, 0, 0);

    return copia;
};

const formatearFecha = (fecha) =>
    new Intl.DateTimeFormat('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(fecha);

/**
 * Próximos días festivos a partir de hoy. Se consulta el año actual y,
 * si ya se acabó el calendario, también el siguiente.
 */
const obtenerProximos = async (limite = 3) => {

    const total = Math.min(Math.max(Number(limite) || 3, 1), 10);

    const hoy = inicioDelDia(new Date());

    const anioActual = hoy.getFullYear();

    const festivos = [
        ...(await obtenerDelAnio(anioActual)),
        ...(await obtenerDelAnio(anioActual + 1))
    ];

    const proximos = festivos
        .map((festivo) => {

            /*
             La fecha viene como "2026-09-16"; se construye en hora
             local para no perder un día por la zona horaria.
            */
            const [anio, mes, dia] = festivo.date
                .split('-')
                .map(Number);

            const fecha = new Date(anio, mes - 1, dia);

            return {
                fecha: festivo.date,
                nombre: festivo.localName,
                nombreIngles: festivo.name,
                fechaLegible: formatearFecha(fecha),
                diasFaltantes: Math.round(
                    (inicioDelDia(fecha) - hoy) / MS_POR_DIA
                ),
                esHoy: inicioDelDia(fecha).getTime() === hoy.getTime()
            };

        })
        .filter((festivo) => festivo.diasFaltantes >= 0)
        .sort((a, b) => a.diasFaltantes - b.diasFaltantes)
        .slice(0, total);

    const siguiente = proximos[0] || null;

    return {
        pais: PAIS,
        festivos: proximos,
        aviso: siguiente
            ? siguiente.esHoy
                ? `Hoy es ${siguiente.nombre}: la cafetería no abre.`
                : siguiente.diasFaltantes <= 7
                    ? `La cafetería cierra el ${siguiente.fechaLegible} por ${siguiente.nombre}.`
                    : `Siguiente día sin servicio: ${siguiente.fechaLegible} (${siguiente.nombre}).`
            : null,
        fuente: 'Nager.Date',
        actualizadoEn: new Date().toISOString()
    };
};

module.exports = {
    obtenerProximos
};
