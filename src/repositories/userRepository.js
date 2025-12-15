const User = require('../models/user');

class UserRepository {
  static async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  static async findUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  static async findUserById(id) {
    return await User.findById(id).select('-password');
  }

  static async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
  }

  static async deleteUser(id) {
    return await User.findByIdAndDelete(id).select('-password');
  }

  static async listUsers() {
    return await User.find().select('-password');
  }
}

module.exports = UserRepository;
