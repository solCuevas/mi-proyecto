const express = require('express');
const router = express.Router();
const { authenticateCurrent, onlyAdmin, onlyUser } = require('../middlewares/auth'); // Importar los middlewares
const productController = require('../controllers/productController');
// Ruta para crear un producto (solo admin)
router.post('/create', authenticateCurrent, onlyAdmin, (req, res) => {
  // Lógica para crear un producto
  res.status(201).json({ message: 'Producto creado' });
});

// Ruta para que un usuario agregue productos a su carrito (solo usuarios)
router.post('/cart', authenticateCurrent, onlyUser, (req, res) => {
  // Lógica para agregar productos al carrito
  res.status(200).json({ message: 'Producto agregado al carrito' });
});

module.exports = router;
