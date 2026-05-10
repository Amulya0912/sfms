const logger = require('../config/logger');

/**
 * Request/Response Logger Middleware
 * Logs every incoming request and its response status
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log incoming request
  logger.info({
    message: `→ ${req.method} ${req.originalUrl}`,
    correlationId: req.correlationId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel]({
      message: `← ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
      correlationId: req.correlationId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });
  });

  next();
};

module.exports = { requestLogger };
