const verificarAdmin = (req, res, next) => {
  // En esta app el vendedor es quien administra sus productos.
  const rolesPermitidos = ['admin', 'vendedor'];

  if (!rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ message: 'Acceso solo para vendedor o admin' });
  }

  next();
};

module.exports = verificarAdmin;
