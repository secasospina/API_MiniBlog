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

  test('POST /authors devuelve 400 si falta el name', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ email: `test_${Date.now()}@email.com` });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('name y email son obligatorios');
  });

  test('POST /authors devuelve 400 si el email ya existe', async () => {
    const email = `test_${Date.now()}@email.com`;
    const first = await request(app)
      .post('/authors')
      .send({ name: 'Autor original', email });

    const res = await request(app)
      .post('/authors')
      .send({ name: 'Autor con email repetido', email });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('El email ya está registrado');

    // Limpieza
    await request(app).delete(`/authors/${first.body.id}`);
  });

  test('GET /authors/:id devuelve 404 si el autor no existe', async () => {
    const res = await request(app).get('/authors/999999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Autor no encontrado');
  });

  test('GET /authors/:id devuelve 400 si el id no es válido', async () => {
    const res = await request(app).get('/authors/abc');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('id debe ser un número entero positivo');
  });

  test('PUT /authors/:id actualiza un autor', async () => {
    const created = await request(app)
      .post('/authors')
      .send({
        name: 'Nombre original',
        email: `test_${Date.now()}@email.com`,
      });

    const newEmail = `test_actualizado_${Date.now()}@email.com`;
    const res = await request(app)
      .put(`/authors/${created.body.id}`)
      .send({ name: 'Nombre actualizado', email: newEmail, bio: 'Nueva bio' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Nombre actualizado');
    expect(res.body.email).toBe(newEmail);

    // Limpieza
    await request(app).delete(`/authors/${created.body.id}`);
  });

  test('DELETE /authors/:id elimina un autor y devuelve 204', async () => {
    const created = await request(app)
      .post('/authors')
      .send({
        name: 'Autor a eliminar',
        email: `test_${Date.now()}@email.com`,
      });

    const res = await request(app).delete(`/authors/${created.body.id}`);
    expect(res.statusCode).toBe(204);

    // Comprueba que ya no existe
    const check = await request(app).get(`/authors/${created.body.id}`);
    expect(check.statusCode).toBe(404);
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

  test('PUT /posts/:id actualiza un post', async () => {
    const author = await request(app)
      .post('/authors')
      .send({
        name: 'Autor para actualizar post',
        email: `test_${Date.now()}@email.com`,
      });
    const post = await request(app).post('/posts').send({
      author_id: author.body.id,
      title: 'Título original',
      content: 'Contenido original',
    });

    const res = await request(app).put(`/posts/${post.body.id}`).send({
      author_id: author.body.id,
      title: 'Título actualizado',
      content: 'Contenido actualizado',
      published: true,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Título actualizado');
    expect(res.body.published).toBe(true);

    // Limpieza (el post se borra solo por ON DELETE CASCADE)
    await request(app).delete(`/authors/${author.body.id}`);
  });

  test('DELETE /posts/:id elimina un post y devuelve 204', async () => {
    const author = await request(app)
      .post('/authors')
      .send({
        name: 'Autor para borrar post',
        email: `test_${Date.now()}@email.com`,
      });
    const post = await request(app).post('/posts').send({
      author_id: author.body.id,
      title: 'Post a eliminar',
      content: 'Contenido del post a eliminar',
    });

    const res = await request(app).delete(`/posts/${post.body.id}`);
    expect(res.statusCode).toBe(204);

    // Comprueba que ya no existe
    const check = await request(app).get(`/posts/${post.body.id}`);
    expect(check.statusCode).toBe(404);

    // Limpieza
    await request(app).delete(`/authors/${author.body.id}`);
  });
});
