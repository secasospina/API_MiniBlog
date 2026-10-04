INSERT INTO authors (name, email, bio) VALUES
('Ana Martínez', 'ana.martinez@email.com', 'Desarrolladora backend y entusiasta de las bases de datos.'),
('Carlos Mendoza', 'carlos.mendoza@email.com', 'Escritor técnico enfocado en arquitectura de software y Node.js.'),
('Sofía Vega', 'sofia.vega@email.com', 'Ingeniera de datos y creadora de contenido educativo.');

INSERT INTO posts (author_id, title, content, published) VALUES
(1, 'Introducción a PostgreSQL', 'En este artículo aprenderás los conceptos básicos de SQL...', true),
(1, 'Optimización de consultas complejas', 'Analizaremos el uso de EXPLAIN ANALYZE para mejorar el rendimiento...', false),
(2, 'Cómo conectar Node.js con Postgres', 'Guía paso a paso utilizando el módulo pg y Connection Pools...', true),
(3, 'Diseño de arquitecturas limpias', 'Principios fundamentales para mantener un código escalable...', true);
