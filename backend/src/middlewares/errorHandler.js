const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

/**
 * Centralized Error Handler Middleware
 * Produces consistent error response shape:
 * { success: false, code: number, message: string, timestamp: string, correlationId?: string }
 */
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry. This record already exists.';
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referenced record does not exist.';
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds the maximum allowed limit (5MB).';
  }

  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body.';
  }

  // Log error
  logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    correlationId: req.correlationId,
    method: req.method,
    path: req.originalUrl,
    userId: req.user?.id,
  });

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { errorHandler, notFoundHandler };
