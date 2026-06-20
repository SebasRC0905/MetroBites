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
const app = express();

app.use(cors());
app.use(express.json());
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
module.exports = app;