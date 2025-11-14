
const express = require('express');
const passport = require('../config/passport'); // importa y registra estrategias
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);

// Login usando passport 'login' (local)
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'No autorizado' });
    req.user = user;
    return authController.login(req, res);
  })(req, res, next);
});

// Ruta /current -> valida JWT con estrategia 'current'
router.get('/current',
  passport.authenticate('current', { session: false, failWithError: true }),
  (req, res) => authController.current(req, res)
);

// Manejo de error específico cuando token inválido/no existe
router.use((err, req, res, next) => {
  if (err) {
    return res.status(401).json({ message: 'Token inválido o inexistente' });
  }
  next();
});

module.exports = router;
