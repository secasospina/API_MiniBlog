const express = require('express');
const authorsService = require('../services/authors');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const authors = await authorsService.getAllAuthors();
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los autores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const author = await authorsService.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el autor' });
  }
});

module.exports = router;
