
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport'); // registra estrategias
const sessionsRoutes = require('./routes/sessions');
const usersRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Inicializar passport
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRoutes);
app.use('/api/users', usersRoutes);

// Ruta base
app.get('/', (req, res) => res.json({ message: 'API Ecommerce OK' }));

// Conectar a MongoDB y arrancar servidor
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Mongo conectado');
    app.listen(PORT, () => console.log(`Server en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error conectando a Mongo', err);
  });

module.exports = app;
