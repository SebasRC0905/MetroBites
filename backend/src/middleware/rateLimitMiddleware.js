/**
 * Límite de intentos por IP, en memoria y sin dependencias.
 *
 * Protege los endpoints sensibles (iniciar sesión, registrarse, cambiar
 * contraseña) de intentos automatizados de adivinar credenciales. Al
 * vivir en memoria funciona con una sola instancia del servidor, que es
 * el caso de MetroBites; con varias instancias habría que moverlo a
 * Redis sin cambiar la forma de usarlo.
 */

const crearLimitador = ({
    intentos = 10,
    ventanaMs = 15 * 60 * 1000,
    mensaje = 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
} = {}) => {

    const registros = new Map();

    const limpiar = (ahora) => {

        for (const [clave, registro] of registros) {

            if (registro.reinicioEn <= ahora) {
                registros.delete(clave);
            }

        }

    };

    return (req, res, next) => {

        const ahora = Date.now();

        limpiar(ahora);

        const clave = req.ip || req.socket.remoteAddress || 'desconocida';

        const registro = registros.get(clave) || {
            conteo: 0,
            reinicioEn: ahora + ventanaMs
        };

        registro.conteo += 1;

        registros.set(clave, registro);

        const restantes = Math.max(intentos - registro.conteo, 0);

        res.setHeader('X-RateLimit-Limit', intentos);
        res.setHeader('X-RateLimit-Remaining', restantes);

        if (registro.conteo > intentos) {

            const segundos = Math.ceil((registro.reinicioEn - ahora) / 1000);

            res.setHeader('Retry-After', segundos);

            return res.status(429).json({
                success: false,
                message: mensaje
            });

        }

        return next();

    };

};

module.exports = crearLimitador;
