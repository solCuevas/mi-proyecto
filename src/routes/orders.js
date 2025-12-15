const express = require('express');
const passport = require('passport');
const orderController = require('../controllers/orderController');
const { only } = require('../middlewares/auth');
const router = express.Router();

// Ruta para realizar un pedido (compra)
router.post('/create', passport.authenticate('current', { session: false }), orderController.createOrder);

module.exports = router;
