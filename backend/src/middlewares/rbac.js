const ApiError = require('../utils/ApiError');

/**
 * Role-Based Access Control (RBAC) Middleware Factory
 * @param  {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 *
 * Usage: authorize('super_admin', 'accountant')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

/**
 * Student Mutation Block Middleware
 * CRITICAL: Prevents students from modifying any fee-related data
 */
const blockStudentMutation = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next(
      new ApiError(403, 'Students are not permitted to modify fee-related data.')
    );
  }
  next();
};

module.exports = { authorize, blockStudentMutation };
