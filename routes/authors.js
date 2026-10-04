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

module.exports = router;
