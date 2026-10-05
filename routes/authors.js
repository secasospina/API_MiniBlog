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

router.post('/', async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name y email son obligatorios' });
    }
    const author = await authorsService.createAuthor(name, email, bio);
    res.status(201).json(author);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al crear el autor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name y email son obligatorios' });
    }
    const author = await authorsService.updateAuthor(
      req.params.id,
      name,
      email,
      bio
    );
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.json(author);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el autor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const author = await authorsService.deleteAuthor(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el autor' });
  }
});

module.exports = router;
