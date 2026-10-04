require('dotenv').config();
const pool = require('./database');

//Importar express y crear la app
const express = require('express');
const app = express();

//Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor activo' });
});

//Encender el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

pool
  .query('SELECT NOW()')
  .then((res) => console.log('Conectado a Postgres:', res.rows[0]))
  .catch((err) => console.error('Error de conexión:', err.message));
