/**
 * Integración con Open Food Facts (https://world.openfoodfacts.org),
 * la base de datos abierta y colaborativa de productos alimenticios.
 *
 * Sirve para mostrarle al alumno una referencia nutrimental de lo que
 * está por pedir. Importante: son valores de referencia de productos
 * parecidos, no el análisis del platillo exacto de la cafetería, y así
 * se le informa en la interfaz.
 *
 * API pública, sin llave y sin costo.
 */

const pool = require('../../config/database');

const {
    fetchJson,
    crearCache
} = require('../../utils/externalApi');

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const cache = crearCache(CACHE_TTL_MS);

const CAMPOS = [
    'product_name',
    'brands',
    'nutriscore_grade',
    'nutriments',
    'allergens_tags',
    'serving_size'
].join(',');

/*
 Se usa el buscador nuevo de Open Food Facts (search.openfoodfacts.org).
 El endpoint viejo `cgi/search.pl` sigue existiendo pero responde 503
 con frecuencia por límite de peticiones.
*/
const construirUrl = (termino) =>
    'https://search.openfoodfacts.org/search' +
    `?q=${encodeURIComponent(termino)}` +
    '&page_size=5' +
    `&fields=${CAMPOS}`;

const numeroONulo = (valor) => {

    const numero = Number(valor);

    return Number.isFinite(numero)
        ? Math.round(numero * 10) / 10
        : null;
};

/*
 Traducción de las etiquetas de alérgenos de Open Food Facts
 (vienen como "en:milk", "en:gluten"…) a español.
*/
const ALERGENOS = {
    'en:milk': 'Lácteos',
    'en:gluten': 'Gluten',
    'en:eggs': 'Huevo',
    'en:soybeans': 'Soya',
    'en:nuts': 'Frutos secos',
    'en:peanuts': 'Cacahuate',
    'en:sesame-seeds': 'Ajonjolí',
    'en:fish': 'Pescado',
    'en:crustaceans': 'Mariscos',
    'en:mustard': 'Mostaza',
    'en:celery': 'Apio',
    'en:sulphur-dioxide-and-sulphites': 'Sulfitos'
};

const traducirAlergenos = (etiquetas = []) =>
    etiquetas
        .map((etiqueta) => ALERGENOS[etiqueta] || null)
        .filter(Boolean);

/*
 El Nutri-Score es la calificación A–E que usa Open Food Facts para
 resumir qué tan saludable es un producto.
*/
const NUTRI_SCORE = {
    a: { letra: 'A', etiqueta: 'Muy buena opción', tono: 'green' },
    b: { letra: 'B', etiqueta: 'Buena opción', tono: 'green' },
    c: { letra: 'C', etiqueta: 'Opción intermedia', tono: 'amber' },
    d: { letra: 'D', etiqueta: 'Consúmelo con medida', tono: 'amber' },
    e: { letra: 'E', etiqueta: 'Antójate, pero poco', tono: 'red' }
};

/**
 * Se queda con el primer resultado que traiga al menos calorías: la
 * base es colaborativa y hay fichas incompletas.
 */
const elegirMejorResultado = (productos = []) =>
    productos.find((producto) => {

        const nutrimentos = producto.nutriments || {};

        return (
            nutrimentos['energy-kcal_100g'] !== undefined ||
            nutrimentos.energy_100g !== undefined
        );

    }) || null;

const normalizar = (producto, termino) => {

    if (!producto) {

        return {
            termino,
            encontrado: false,
            fuente: 'Open Food Facts'
        };

    }

    const nutrimentos = producto.nutriments || {};

    const nutriScore =
        NUTRI_SCORE[producto.nutriscore_grade] || null;

    /* En el buscador nuevo `brands` llega como arreglo. */
    const marca = Array.isArray(producto.brands)
        ? producto.brands.join(', ')
        : producto.brands || null;

    return {
        termino,
        encontrado: true,
        referencia:
            producto.product_name || termino,
        marca,
        porcion: producto.serving_size || '100 g',
        nutriScore,
        alergenos: traducirAlergenos(producto.allergens_tags),
        valoresPor100g: {
            calorias: numeroONulo(
                nutrimentos['energy-kcal_100g'] ??
                nutrimentos['energy-kcal']
            ),
            proteinas: numeroONulo(nutrimentos.proteins_100g),
            carbohidratos: numeroONulo(nutrimentos.carbohydrates_100g),
            azucares: numeroONulo(nutrimentos.sugars_100g),
            grasas: numeroONulo(nutrimentos.fat_100g),
            grasasSaturadas: numeroONulo(nutrimentos['saturated-fat_100g']),
            fibra: numeroONulo(nutrimentos.fiber_100g),
            sodio: numeroONulo(nutrimentos.sodium_100g)
        },
        fuente: 'Open Food Facts',
        actualizadoEn: new Date().toISOString()
    };
};

const buscarPorTermino = async (termino) => {

    const clave = termino.trim().toLowerCase();

    if (clave.length < 3) {

        throw new Error(
            'Escribe al menos 3 letras para buscar información nutrimental'
        );

    }

    return cache.resolver(clave, async () => {

        const respuesta = await fetchJson(
            construirUrl(clave),
            {
                timeoutMs: 7000,
                proveedor: 'Open Food Facts'
            }
        );

        return normalizar(
            elegirMejorResultado(respuesta.hits),
            clave
        );

    });

};

/**
 * Información nutrimental de referencia para un producto del menú.
 * Se busca por su nombre, quitando adjetivos que no aportan a la
 * búsqueda ("especiales", "preparadas"…).
 */
const obtenerPorProducto = async (productoId) => {

    const [filas] = await pool.query(
        `
        SELECT
            p.id,
            p.nombre,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.categoria_id = c.id
        WHERE p.id = ?
        `,
        [productoId]
    );

    if (filas.length === 0) {
        throw new Error('Producto no encontrado');
    }

    const producto = filas[0];

    const termino = producto.nombre
        .toLowerCase()
        .replace(/especiales?|preparad[oa]s?|de la casa/g, '')
        .trim();

    const nutricion = await buscarPorTermino(termino || producto.nombre);

    return {
        producto: {
            id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria
        },
        ...nutricion,
        aviso:
            'Valores de referencia de productos similares. La receta de ' +
            'la cafetería puede variar.'
    };
};

module.exports = {
    buscarPorTermino,
    obtenerPorProducto
};
