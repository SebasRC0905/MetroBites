/**
 * Utilidades compartidas para consumir APIs públicas de terceros.
 *
 * Todas las integraciones externas de MetroBites (clima, nutrición,
 * tipo de cambio, días festivos) siguen la misma receta:
 *
 *   1. Petición con timeout, para que un proveedor lento no deje
 *      colgada una pantalla del alumno.
 *   2. Caché en memoria, para no gastar el límite gratuito del
 *      proveedor y responder al instante.
 *   3. Si el proveedor falla pero hay un dato viejo en caché, se
 *      devuelve ese dato antes que romper la vista.
 */

const TIMEOUT_POR_DEFECTO_MS = 6000;

/**
 * GET a una API externa que responde JSON.
 * Lanza un error descriptivo si la respuesta no es correcta.
 */
const fetchJson = async (
    url,
    {
        timeoutMs = TIMEOUT_POR_DEFECTO_MS,
        headers = {},
        proveedor = 'API externa'
    } = {}
) => {

    const controlador = new AbortController();

    const temporizador = setTimeout(
        () => controlador.abort(),
        timeoutMs
    );

    try {

        const respuesta = await fetch(url, {
            signal: controlador.signal,
            headers: {
                Accept: 'application/json',
                /*
                 Varias APIs abiertas (Open Food Facts entre ellas)
                 piden identificar a la aplicación que las consume.
                */
                'User-Agent':
                    'MetroBites/1.0 (proyecto académico UPMH)',
                ...headers
            }
        });

        if (!respuesta.ok) {

            throw new Error(
                `${proveedor} respondió con estado ${respuesta.status}`
            );

        }

        return await respuesta.json();

    } catch (error) {

        if (error.name === 'AbortError') {

            throw new Error(
                `${proveedor} tardó demasiado en responder`
            );

        }

        throw error;

    } finally {

        clearTimeout(temporizador);

    }

};

/**
 * Caché en memoria con vencimiento y varias llaves (por ejemplo, una
 * entrada por producto consultado). Devuelve el dato vencido como
 * último recurso si el proveedor externo se cae.
 */
const crearCache = (ttlMs) => {

    const entradas = new Map();

    return {

        obtener(clave) {

            const entrada = entradas.get(clave);

            if (!entrada) {
                return null;
            }

            if (Date.now() - entrada.guardadoEn > ttlMs) {
                return null;
            }

            return entrada.valor;
        },

        obtenerAunqueVenza(clave) {
            return entradas.get(clave)?.valor ?? null;
        },

        guardar(clave, valor) {

            entradas.set(clave, {
                valor,
                guardadoEn: Date.now()
            });

            return valor;
        },

        /**
         * Envoltura completa: devuelve la caché si sirve, si no llama
         * al proveedor, y si el proveedor falla recurre al dato viejo.
         */
        async resolver(clave, cargar) {

            const enCache = this.obtener(clave);

            if (enCache) {
                return enCache;
            }

            try {

                return this.guardar(clave, await cargar());

            } catch (error) {

                const respaldo = this.obtenerAunqueVenza(clave);

                if (respaldo) {
                    return respaldo;
                }

                throw error;

            }

        }

    };

};

module.exports = {
    fetchJson,
    crearCache
};
