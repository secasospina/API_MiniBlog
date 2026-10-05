const MAX_INT = 2147483647;

function validateId(paramName = 'id') {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > MAX_INT) {
      return res
        .status(400)
        .json({ error: `${paramName} debe ser un número entero positivo` });
    }
    next();
  };
}

module.exports = validateId;
