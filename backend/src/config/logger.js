const winston = require('winston');
const path = require('path');
require('dotenv').config();

const logDir = process.env.LOG_DIR || 'logs';

/**
 * Winston Logger Configuration
 * Structured JSON logging with file & console transports
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sfms-backend' },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
          const cid = correlationId ? `[${correlationId}] ` : '';
          const extra = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}: ${cid}${message}${extra}`;
        })
      ),
    })
  );
}

module.exports = logger;
