const express = require('express');
const postsService = require('../services/posts');
const validateId = require('../middlewares/validateId');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await postsService.getAllPosts();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

router.get('/:id', validateId(), async (req, res) => {
  try {
    const post = await postsService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el post' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { author_id, title, content, published } = req.body;
    if (!author_id || !title || !content) {
      return res
        .status(400)
        .json({ error: 'author_id, title y content son obligatorios' });
    }
    const post = await postsService.createPost(
      author_id,
      title,
      content,
      published
    );
    res.status(201).json(post);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'El autor indicado no existe' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al crear el post' });
  }
});

router.put('/:id', validateId(), async (req, res) => {
  try {
    const { author_id, title, content, published } = req.body;
    if (!author_id || !title || !content) {
      return res
        .status(400)
        .json({ error: 'author_id, title y content son obligatorios' });
    }
    const post = await postsService.updatePost(
      req.params.id,
      author_id,
      title,
      content,
      published
    );
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'El autor indicado no existe' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
});

router.delete('/:id', validateId(), async (req, res) => {
  try {
    const post = await postsService.deletePost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
});

router.get('/author/:authorId', validateId('authorId'), async (req, res) => {
  try {
    const posts = await postsService.getPostsByAuthor(req.params.authorId);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los posts del autor' });
  }
});

module.exports = router;
