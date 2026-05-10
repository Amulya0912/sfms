const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

// TODO: PRODUCTION INTEGRATION — Replace mock bcrypt with production-grade hashing config
// and JWT signing with RSA key pairs / external OAuth/SSO providers

class AuthService {
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new ApiError(401, 'Invalid credentials');
    if (!user.is_active) throw new ApiError(403, 'Account is deactivated');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await userRepository.updateRefreshToken(user.id, refreshToken);
    await userRepository.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name, role: user.role },
    };
  }

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, jwtConfig.refreshToken.secret);
      const user = await userRepository.findById(decoded.id);
      if (!user || user.refresh_token !== token) throw new ApiError(401, 'Invalid refresh token');

      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      await userRepository.updateRefreshToken(user.id, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  async logout(userId) {
    await userRepository.updateRefreshToken(userId, null);
  }

  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role, roleId: user.role_id },
      jwtConfig.accessToken.secret,
      { expiresIn: jwtConfig.accessToken.expiry }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      jwtConfig.refreshToken.secret,
      { expiresIn: jwtConfig.refreshToken.expiry }
    );
  }
}

module.exports = new AuthService();
