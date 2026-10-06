require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Carga del archivo de documentación OpenAPI
const swaggerDocument = YAML.load('./openapi.yaml');

app.use(express.json());

// Ruta de la documentación interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas de la API
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);

// Middlewares de error (deben ir al final)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
