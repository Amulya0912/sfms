const { v4: uuidv4 } = require('uuid');

/**
 * Correlation ID Middleware
 * Generates a unique ID per request for distributed tracing
 */
const correlationId = (req, res, next) => {
  const id = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = id;
  res.setHeader('X-Correlation-Id', id);
  next();
};

module.exports = { correlationId };
