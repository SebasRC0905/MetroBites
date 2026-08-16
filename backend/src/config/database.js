const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  /*
   Se fija explícitamente para que la conexión nunca herede la página de
   códigos del sistema (en Windows, cp850) y los acentos y eñes viajen
   igual que como están guardados en las tablas.
  */
  charset: 'utf8mb4'
});

module.exports = pool;