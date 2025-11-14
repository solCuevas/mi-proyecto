
const User = require('../models/Users');

// Listar todos los usuarios (sin password)
exports.list = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error interno' });
  }
};

// Obtener usuario por id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error interno' });
  }
};

// Crear usuario 
exports.create = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role, cart } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    const user = new User({ first_name, last_name, email: email.toLowerCase(), age, password, role: role || 'user', cart });
    await user.save();
    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Error interno' });
  }
};

// Actualizar usuario 
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    // Si se intenta cambiar email, normalizarlo
    if (updateData.email) updateData.email = updateData.email.toLowerCase();

    if (updateData.password) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      Object.assign(user, updateData);
      await user.save();
      return res.json({ user: user.toJSON() });
    } else {
      const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error interno' });
  }
};

// Eliminar usuario
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', user });
  } catch (err) {
    res.status(500).json({ message: 'Error interno' });
  }
};
