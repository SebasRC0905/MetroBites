const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/auth/auth.routes');
const categoriasRoutes = require('./modules/categorias/categorias.routes');
const productosRoutes = require('./modules/productos/productos.routes')
const favoritosRoutes = require('./modules/favoritos/favoritos.routes');
const horariosRoutes = require('./modules/horarios/horarios.routes');
const pedidosRoutes = require('./modules/pedidos/pedidos.routes');
const dashboardRoutes =require('./modules/dashboard/dashboard.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const uploadsRoutes = require('../uploads/uploads.routes');
const cuponesRoutes = require('./modules/cupones/cupones.routes');
const climaRoutes = require('./modules/clima/clima.routes');
const metodosPagoRoutes = require('./modules/metodosPago/metodosPago.routes');
const nutricionRoutes = require('./modules/nutricion/nutricion.routes');
const divisasRoutes = require('./modules/divisas/divisas.routes');
const festivosRoutes = require('./modules/festivos/festivos.routes');

const {
    notFoundHandler,
    errorHandler
} = require('./middleware/errorMiddleware');
const app = express();

app.use(cors());

/* Un pedido con muchos productos no llega ni a 100 KB; el tope evita
   que alguien mande un JSON gigante para tumbar el servidor. */
app.use(express.json({ limit: '1mb' }));
app.use(
    '/uploads',
    express.static(
        'uploads'
    )
);
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MetroBites API funcionando'
  });
});

app.use('/api/auth', authRoutes);
app.use(
  '/api/categorias',
  categoriasRoutes
);
app.use(
    '/api/productos',
    productosRoutes
);
app.use(
    '/api/favoritos',
    favoritosRoutes
);
app.use(
    '/api/horarios',
    horariosRoutes
);
app.use(
    '/api/pedidos',
    pedidosRoutes
);
app.use(
    '/api/dashboard',
    dashboardRoutes
);
app.use(
    '/api/usuarios',
    usuariosRoutes
);
app.use(
    '/api/uploads',
    uploadsRoutes
);
app.use(
    '/api/cupones',
    cuponesRoutes
);
app.use(
    '/api/clima',
    climaRoutes
);
app.use(
    '/api/metodos-pago',
    metodosPagoRoutes
);
/*
 Integraciones con APIs públicas externas: información nutrimental
 (Open Food Facts), tipo de cambio (Frankfurter) y días festivos
 oficiales de México (Nager.Date).
*/
app.use(
    '/api/nutricion',
    nutricionRoutes
);
app.use(
    '/api/divisas',
    divisasRoutes
);
app.use(
    '/api/festivos',
    festivosRoutes
);
/*
 Siempre al final: primero el 404 para rutas que nadie atendió y luego
 el manejador de errores, que convierte cualquier excepción suelta en
 una respuesta JSON con la misma forma que el resto de la API.
*/
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;