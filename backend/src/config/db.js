const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool Configuration
 * Uses mysql2/promise for async/await support
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'sfms_user',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'sfms_pass_2024',
  database: process.env.DB_NAME || 'sfms_db',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  timezone: '+00:00',
});

/**
 * Test database connection on startup
 * @returns {Promise<void>}
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
