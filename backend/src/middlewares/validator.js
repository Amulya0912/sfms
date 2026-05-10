const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Express-validator result checking middleware
 * Runs after express-validator check chains, collects errors into a single response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    return res.status(422).json({
      success: false,
      code: 422,
      message: 'Validation failed',
      errors: extractedErrors,
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    });
  }
  next();
};

module.exports = { validate };
