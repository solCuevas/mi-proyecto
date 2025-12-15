const Product = require('../models/product.js');  

class ProductsController {
  // Crear un producto
  static async createProduct(req, res) {
    try {
      const { name, price, description, category } = req.body;

      // Validación para asegurarse de que los campos requeridos estén presentes
      if (!name || !price) {
        return res.status(400).json({ message: 'Nombre y precio son requeridos' });
      }

      // Verificar si el producto ya existe (por nombre o alguna propiedad única)
      const existingProduct = await Product.findOne({ name: name });
      if (existingProduct) {
        return res.status(400).json({ message: 'Producto con este nombre ya existe' });
      }

      // Crear un nuevo producto
      const newProduct = new Product({
        name,
        price,
        description,
        category,
      });

      // Guardar el producto en la base de datos
      await newProduct.save();
      
      // Responder con éxito y devolver el producto creado
      return res.status(201).json({ message: 'Producto creado correctamente', product: newProduct });
    } catch (err) {
      // Manejar errores internos del servidor
      return res.status(500).json({ message: 'Error creando el producto', error: err.message });
    }
  }

  // Si tienes más métodos para otros tipos de solicitudes (GET, PUT, DELETE), agrégales aquí.

}

module.exports = ProductsController;
