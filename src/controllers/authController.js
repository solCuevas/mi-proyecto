
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'un_secret_largo_y_seguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role, cart } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    const newUser = new User({
      first_name, last_name, email: email.toLowerCase(), age, password, role: role || 'user', cart
    });
    await newUser.save();

    const userToReturn = newUser.toJSON();
    res.status(201).json({ message: 'Usuario creado', user: userToReturn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno' });
  }
};

exports.login = async (req, res) => {
  try {
    const user = req.user; // seteado por passport 'login'
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const userResp = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      age: user.age,
      cart: user.cart
    };

    res.json({ message: 'Autenticado', token, user: userResp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al generar token' });
  }
};

exports.current = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Usuario no autenticado' });
  const user = {
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.role,
    age: req.user.age,
    cart: req.user.cart
  };
  res.json({ user });
};
