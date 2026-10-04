require('dotenv').config();

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
