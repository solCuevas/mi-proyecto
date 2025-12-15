const jwt = require('jsonwebtoken');

// Cargar la clave secreta del archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Generar un JWT a partir de un payload
 * @param {Object} payload - Información que se incluirá en el token (generalmente el ID del usuario)
 * @returns {string} - El token generado
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verificar la validez de un JWT
 * @param {string} token - El token a verificar
 * @returns {Object} - La información decodificada del token o un error si no es válido
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // Si el token es inválido o ha expirado, se devuelve null
  }
}

/**
 * Decodificar el JWT (sin verificar su validez)
 * @param {string} token - El token a decodificar
 * @returns {Object} - La información decodificada del token (sin verificar la validez)
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
