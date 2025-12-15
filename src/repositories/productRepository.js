const Product = require('.../models/product.js');

class ProductRepository {
  static async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  static async findProductById(id) {
    return await Product.findById(id);
  }

  static async updateProduct(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  static async listProducts() {
    return await Product.find();
  }
}

module.exports = ProductRepository;
