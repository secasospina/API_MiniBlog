require('dotenv').config();
const app = require('./app');
const pool = require('./database');

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

pool
  .query('SELECT NOW()')
  .then((res) => console.log('Conectado a Postgres:', res.rows[0]))
  .catch((err) => console.error('Error de conexión:', err.message));
