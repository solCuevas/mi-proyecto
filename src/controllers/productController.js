// src/controllers/productsController.js

class ProductsController {
  static async createProduct(req, res) {
    try {
      // Lógica para crear un producto
      const { name, price, description, category } = req.body;
      
      if (!name || !price) {
        return res.status(400).json({ message: 'Nombre y precio son requeridos' });
      }
      
      const newProduct = new Product({
        name,
        price,
        description,
        category,
      });
      
      await newProduct.save();
      return res.status(201).json({ message: 'Producto creado correctamente', product: newProduct });
    } catch (err) {
      return res.status(500).json({ message: 'Error creando el producto', error: err.message });
    }
  }

  // Otras funciones como getProducts, updateProduct, etc...
}

module.exports = ProductsController;
