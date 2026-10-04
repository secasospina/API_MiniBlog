require('dotenv').config();
const pool = require('./database');

//Importar express y crear la app
const express = require('express');
const app = express();

app.use(express.json());
const authorsRouter = require('./routes/authors');
app.use('/authors', authorsRouter);

//Encender el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

pool
  .query('SELECT NOW()')
  .then((res) => console.log('Conectado a Postgres:', res.rows[0]))
  .catch((err) => console.error('Error de conexión:', err.message));
