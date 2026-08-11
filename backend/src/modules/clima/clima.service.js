/**
 * Integración con Open-Meteo (https://open-meteo.com) para mostrar el clima
 * del campus y sugerir una categoría del menú acorde a la temperatura.
 * No requiere API key. Se cachea en memoria para no exceder el límite de
 * peticiones gratuito del proveedor y para responder de forma instantánea.
 */

// Coordenadas aproximadas de la UPMH (Tolcayuca, Hidalgo).
const CAMPUS_LAT = 19.9967;
const CAMPUS_LON = -98.9153;

const OPEN_METEO_URL =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${CAMPUS_LAT}&longitude=${CAMPUS_LON}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day` +
    `&timezone=America%2FMexico_City`;

const CACHE_TTL_MS = 10 * 60 * 1000;

let cache = {
    data: null,
    fetchedAt: 0
};

/*
 Tabla de condiciones según los códigos WMO que devuelve Open-Meteo,
 reducida a las categorías que nos interesan para la sugerencia.
*/
const weatherCodeMap = {
    0: { label: 'Despejado', icon: 'sun', group: 'despejado' },
    1: { label: 'Poco nublado', icon: 'sun', group: 'despejado' },
    2: { label: 'Parcialmente nublado', icon: 'cloudSun', group: 'despejado' },
    3: { label: 'Nublado', icon: 'cloud', group: 'nublado' },
    45: { label: 'Neblina', icon: 'cloud', group: 'adverso' },
    48: { label: 'Neblina helada', icon: 'cloud', group: 'adverso' },
    51: { label: 'Llovizna ligera', icon: 'rain', group: 'adverso' },
    53: { label: 'Llovizna', icon: 'rain', group: 'adverso' },
    55: { label: 'Llovizna densa', icon: 'rain', group: 'adverso' },
    56: { label: 'Llovizna helada', icon: 'rain', group: 'adverso' },
    57: { label: 'Llovizna helada densa', icon: 'rain', group: 'adverso' },
    61: { label: 'Lluvia ligera', icon: 'rain', group: 'adverso' },
    63: { label: 'Lluvia', icon: 'rain', group: 'adverso' },
    65: { label: 'Lluvia intensa', icon: 'rain', group: 'adverso' },
    66: { label: 'Lluvia helada', icon: 'rain', group: 'adverso' },
    67: { label: 'Lluvia helada intensa', icon: 'rain', group: 'adverso' },
    71: { label: 'Nevada ligera', icon: 'snow', group: 'adverso' },
    73: { label: 'Nevada', icon: 'snow', group: 'adverso' },
    75: { label: 'Nevada intensa', icon: 'snow', group: 'adverso' },
    77: { label: 'Granizo fino', icon: 'snow', group: 'adverso' },
    80: { label: 'Chubascos ligeros', icon: 'rain', group: 'adverso' },
    81: { label: 'Chubascos', icon: 'rain', group: 'adverso' },
    82: { label: 'Chubascos intensos', icon: 'rain', group: 'adverso' },
    85: { label: 'Chubascos de nieve', icon: 'snow', group: 'adverso' },
    86: { label: 'Chubascos de nieve intensos', icon: 'snow', group: 'adverso' },
    95: { label: 'Tormenta eléctrica', icon: 'storm', group: 'adverso' },
    96: { label: 'Tormenta con granizo', icon: 'storm', group: 'adverso' },
    99: { label: 'Tormenta con granizo intenso', icon: 'storm', group: 'adverso' }
};

const getCondition = (code) =>
    weatherCodeMap[code] || {
        label: 'Clima variable',
        icon: 'cloud',
        group: 'nublado'
    };

/*
 Traduce temperatura + condición a una recomendación de categoría del
 menú. Se mantiene deliberadamente simple y basado en categorías fijas
 (Bebidas / Populares) para no depender de nombres de producto que el
 administrador puede cambiar en cualquier momento.
*/
const buildSuggestion = (temperature, group) => {

    if (group === 'adverso' || temperature <= 15) {
        return {
            categoria: 'Bebidas',
            titulo: 'Ideal para algo calientito',
            mensaje:
                'Está fresco en el campus. Un café o chocolate caliente te va a caer bien.'
        };
    }

    if (temperature >= 26) {
        return {
            categoria: 'Bebidas',
            titulo: 'Refréscate un poco',
            mensaje:
                'Hace calor en el campus. Prueba una bebida fría entre clases.'
        };
    }

    return {
        categoria: 'Populares',
        titulo: 'Buen clima para comer rico',
        mensaje: 'El clima está agradable, buen momento para tus favoritos.'
    };
};

const fetchFromProvider = async () => {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {

        const response = await fetch(OPEN_METEO_URL, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(
                `Open-Meteo respondió con estado ${response.status}`
            );
        }

        const payload = await response.json();

        const current = payload.current;

        if (!current) {
            throw new Error('Respuesta de Open-Meteo sin datos actuales');
        }

        const condition = getCondition(current.weather_code);

        const temperature = Math.round(current.temperature_2m);

        return {
            temperatura: temperature,
            sensacion: Math.round(current.apparent_temperature),
            humedad: current.relative_humidity_2m,
            viento: Math.round(current.wind_speed_10m),
            esDeDia: Boolean(current.is_day),
            condicion: {
                codigo: current.weather_code,
                etiqueta: condition.label,
                icono: condition.icon
            },
            sugerencia: buildSuggestion(temperature, condition.group),
            actualizadoEn: new Date().toISOString()
        };

    } finally {

        clearTimeout(timeout);

    }
};

const getCurrentWeather = async () => {

    const now = Date.now();

    if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
        return cache.data;
    }

    try {

        const data = await fetchFromProvider();

        cache = {
            data,
            fetchedAt: now
        };

        return data;

    } catch (error) {

        /*
         Si el proveedor externo falla y todavía tenemos un dato en caché
         (aunque esté vencido), lo devolvemos en vez de romper la vista.
        */
        if (cache.data) {
            return cache.data;
        }

        throw error;

    }
};

module.exports = {
    getCurrentWeather
};
