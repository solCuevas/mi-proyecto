
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/Users');
require('dotenv').config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization: Bearer <token>
  secretOrKey: process.env.JWT_SECRET || 'un_secret_largo_y_seguro'
};

// Local strategy para login (email + password)
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

// JWT strategy: "current" — valida el token y coloca req.user
passport.use('current', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // payload.sub contendrá el id al firmar el token 
    const user = await User.findById(payload.sub).select('-password');
    if (!user) return done(null, false, { message: 'Token válido pero usuario no existe' });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
