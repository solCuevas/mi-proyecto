
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  age:        { type: Number },
  password:   { type: String, required: true },
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Carts', default: null },
  role:       { type: String, default: 'user' }
}, { timestamps: true });

// Encriptar contraseña antes de guardar 
UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const saltRounds = 10;
  user.password = bcrypt.hashSync(user.password, saltRounds); 
  next();
});

// Método para comprobar contraseña
UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Excluir password al convertir a JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
