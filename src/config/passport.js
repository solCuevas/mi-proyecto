const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user'); // Asegúrate de importar correctamente el modelo User
require('dotenv').config();

// Opciones JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'un_secret_largo_y_seguro'
};

// Estrategia local (para login)
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    const valid = user.isValidPassword(password);
    if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Estrategia JWT (para autenticar al usuario)
passport.use('current', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub).select('-password');
    if (!user) return done(null, false, { message: 'Token válido pero usuario no existe' });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
