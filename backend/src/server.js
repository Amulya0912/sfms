require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');
const logger = require('./config/logger');


const PORT = process.env.PORT || 5000;

// Test DB connection and start server
testConnection().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle Unhandled Rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
});
