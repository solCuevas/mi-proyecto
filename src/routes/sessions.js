const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para solicitar el restablecimiento de contraseña (enviar el token al correo)
router.post('/forgot-password', authController.forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password', authController.resetPassword);

module.exports = router;

