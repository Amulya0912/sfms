const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

class UserService {
  async getAll() { return userRepository.findAll(); }

  async getRoles() { return userRepository.findAllRoles(); }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    const { password_hash, refresh_token, ...safe } = user;
    return safe;
  }

  async create(data) {
    const existing = await userRepository.findByUsername(data.username);
    if (existing) throw new ApiError(409, 'Username already exists');
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) throw new ApiError(409, 'Email already exists');

    const password_hash = await bcrypt.hash(data.password || 'password123', 10);
    return userRepository.create({ ...data, password_hash });
  }

  async update(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    if (data.password) {
      data.password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    return userRepository.update(id, data);
  }

  async delete(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new ApiError(404, 'User not found');
    await userRepository.delete(id);
  }
}

module.exports = new UserService();
