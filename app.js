require('dotenv').config();
const express = require('express');
const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express();
app.use(express.json());
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
