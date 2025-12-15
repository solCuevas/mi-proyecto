// src/routes/products.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productController'); 
const { only } = require('../middlewares/auth'); 

// Crear un producto (solo admin puede hacerlo)
router.post('/', only('admin'), productController.createProduct); 
// Otras rutas...

module.exports = router;
