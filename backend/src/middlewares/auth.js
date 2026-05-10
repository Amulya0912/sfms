const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const ApiError = require('../utils/ApiError');

/**
 * JWT Authentication Middleware
 * Extracts and verifies access token from Authorization header
 * Attaches decoded user to req.user
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    // TODO: PRODUCTION INTEGRATION — Use RSA key pairs for JWT verification
    const decoded = jwt.verify(token, jwtConfig.accessToken.secret);

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      roleId: decoded.roleId,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please refresh your session.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'));
    }
    next(error);
  }
};

module.exports = { authenticate };
