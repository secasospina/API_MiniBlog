const { Pool } = require('pg');

// Si existe DATABASE_URL (Railway), la usa; de lo contrario usa las variables individuales (Local)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Requerido para conexiones externas/producción en Railway
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
      }
);

module.exports = pool;
