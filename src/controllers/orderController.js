const Ticket = require('../models/ticket');
const Product = require('../models/Product');
const UserRepository = require('../repositories/userRepository');

// Crear un nuevo ticket de compra
exports.createOrder = async (req, res) => {
  const { products } = req.body;
  const user = req.user;

  try {
    let total = 0;

    // Verificar el stock de los productos
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i].product);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${products[i].product} no encontrado` });
      }

      if (product.stock < products[i].quantity) {
        return res.status(400).json({ message: `Stock insuficiente para el producto ${product.name}` });
      }

      total += product.price * products[i].quantity;
    }

    // Crear el ticket
    const ticket = new Ticket({
      user: user._id,
      products,
      total,
      status: 'pending',
    });

    await ticket.save();

    // Reducir el stock de los productos
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i].product);
      product.stock -= products[i].quantity;
      await product.save();
    }

    res.status(201).json({ message: 'Compra realizada con éxito', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error });
  }
};
