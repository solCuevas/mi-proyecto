const jwt = require('jsonwebtoken');

// Middleware para verificar roles
exports.only = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  if (req.user.role !== requiredRole) return res.status(403).json({ message: 'No autorizado' });
  next();
};
