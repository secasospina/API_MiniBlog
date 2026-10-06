const request = require('supertest');
const app = require('../app');
const pool = require('../database');

afterAll(async () => {
  await pool.end();
});

describe('Authors', () => {
  test('POST /authors crea un autor', async () => {
    const email = `test_${Date.now()}@email.com`;
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Autor de prueba', email, bio: 'Creado por un test' });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.id).toBeDefined();

    // Limpieza: borra el autor que acaba de crear
    await request(app).delete(`/authors/${res.body.id}`);
  });

  test('GET /authors/:id devuelve un autor existente', async () => {
    const email = `test_${Date.now()}@email.com`;
    const created = await request(app)
      .post('/authors')
      .send({ name: 'Autor para consultar', email });

    const res = await request(app).get(`/authors/${created.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Autor para consultar');

    // Limpieza
    await request(app).delete(`/authors/${created.body.id}`);
  });
});

describe('Posts', () => {
  test('POST /posts crea un post', async () => {
    const author = await request(app)
      .post('/authors')
      .send({
        name: 'Autor de los posts',
        email: `test_${Date.now()}@email.com`,
      });

    const res = await request(app).post('/posts').send({
      author_id: author.body.id,
      title: 'Post de prueba',
      content: 'Contenido creado por un test',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.author_id).toBe(author.body.id);
    expect(res.body.published).toBe(false);

    // Limpieza: al borrar el autor, su post se borra solo (ON DELETE CASCADE)
    await request(app).delete(`/authors/${author.body.id}`);
  });

  test('DELETE /posts/:id devuelve 404 si el post no existe', async () => {
    const res = await request(app).delete('/posts/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Post no encontrado');
  });
});
