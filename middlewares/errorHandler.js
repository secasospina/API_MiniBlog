function notFound(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res
      .status(400)
      .json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.code === '23505') {
    return res
      .status(400)
      .json({ error: 'Ya existe un registro con esos datos' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: 'La referencia indicada no existe' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
module.exports = { notFound, errorHandler };
