// 1. Cargar variables del .env
require('dotenv').config();

// 2. Importar Pool de pg
const { Pool } = require('pg');

// 3. Crear el pool con los datos de tu .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 4. Exportarlo para usarlo en otros archivos
module.exports = pool;
