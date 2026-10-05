const pool = require('../database');

async function getAllPosts() {
  const result = await pool.query('SELECT * FROM posts');
  return result.rows;
}

async function getPostById(id) {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
}

async function createPost(authorId, title, content, published = false) {
  const result = await pool.query(
    'INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *',
    [authorId, title, content, published]
  );
  return result.rows[0];
}

async function updatePost(id, authorId, title, content, published = false) {
  const result = await pool.query(
    'UPDATE posts SET author_id = $1, title = $2, content = $3, published = $4 WHERE id = $5 RETURNING *',
    [authorId, title, content, published, id]
  );
  return result.rows[0];
}

async function deletePost(id) {
  const result = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

async function getPostsByAuthor(authorId) {
  const result = await pool.query(
    `SELECT posts.*, authors.name AS author_name, authors.email AS author_email
     FROM posts
     JOIN authors ON posts.author_id = authors.id
     WHERE posts.author_id = $1`,
    [authorId]
  );
  return result.rows;
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByAuthor,
};
