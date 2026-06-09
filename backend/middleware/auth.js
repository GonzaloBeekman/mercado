const jwt = require('jsonwebtoken');

// Usa la misma clave que routes/usuarios.js para que login y validacion coincidan.
const SECRET = process.env.JWT_SECRET || 'secreto';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
