const pool = require('../database');

async function getAllAuthors() {
  const result = await pool.query('SELECT * FROM authors');
  return result.rows;
}

module.exports = { getAllAuthors };
