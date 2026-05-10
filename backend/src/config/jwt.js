require('dotenv').config();

/**
 * JWT Configuration
 * // TODO: PRODUCTION INTEGRATION — Replace with RSA key pairs, use env-specific secrets,
 * // and implement proper key rotation with AWS KMS or HashiCorp Vault.
 */
module.exports = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET || 'sfms_access_secret_dev',
    expiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET || 'sfms_refresh_secret_dev',
    expiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
};
