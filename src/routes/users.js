const express = require('express');
const passport = require('passport');
const usersController = require('../controllers/usersController');
const { only } = require('../middlewares/auth');

const router = express.Router();

// Listar usuarios (protegida: solo admin)
router.get('/', passport.authenticate('current', { session: false }), only('admin'), usersController.list);

// Obtener por id (protegida: admin o el mismo usuario)
router.get('/:id', passport.authenticate('current', { session: false }), async (req, res, next) => {
  try {
    const requester = req.user;
    const { id } = req.params;
    if (requester.role === 'admin' || requester._id.toString() === id) {
      return usersController.getById(req, res);
    }
    return res.status(403).json({ message: 'No autorizado' });
  } catch (err) {
    next(err);
  }
});

// Crear usuario (registro público)
router.post('/', usersController.create);

// Actualizar usuario (protegida: admin o el mismo usuario)
router.put('/:id', passport.authenticate('current', { session: false }), async (req, res, next) => {
  try {
    const requester = req.user;
    const { id } = req.params;
    if (requester.role === 'admin' || requester._id.toString() === id) {
      return usersController.update(req, res);
    }
    return res.status(403).json({ message: 'No autorizado' });
  } catch (err) {
    next(err);
  }
});

// Eliminar usuario (protegida: admin o el mismo usuario)
router.delete('/:id', passport.authenticate('current', { session: false }), async (req, res, next) => {
  try {
    const requester = req.user;
    const { id } = req.params;
    if (requester.role === 'admin' || requester._id.toString() === id) {
      return usersController.remove(req, res);
    }
    return res.status(403).json({ message: 'No autorizado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
