const { PAGINATION_DEFAULTS } = require('./constants');

/**
 * Generate unique student ID
 * Format: SFMS{YEAR}{SEQ} e.g., SFMS2024006
 * @param {number} lastSequence - Last sequence number from DB
 * @returns {string} Generated student ID
 */
const generateStudentId = (lastSequence = 0) => {
  const year = new Date().getFullYear();
  const seq = String(lastSequence + 1).padStart(3, '0');
  return `SFMS${year}${seq}`;
};

/**
 * Generate unique receipt number
 * Format: RCP-{YEAR}-{SEQ} e.g., RCP-2024-000007
 * @param {number} lastSequence - Last sequence number from DB
 * @returns {string} Generated receipt number
 */
const generateReceiptNo = (lastSequence = 0) => {
  const year = new Date().getFullYear();
  const seq = String(lastSequence + 1).padStart(6, '0');
  return `RCP-${year}-${seq}`;
};

/**
 * Parse pagination parameters from query string
 * @param {object} query - Express req.query
 * @returns {{ page: number, limit: number, offset: number }}
 */
const parsePagination = (query) => {
  let page = parseInt(query.page, 10) || PAGINATION_DEFAULTS.PAGE;
  let limit = parseInt(query.limit, 10) || PAGINATION_DEFAULTS.LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = PAGINATION_DEFAULTS.LIMIT;
  if (limit > PAGINATION_DEFAULTS.MAX_LIMIT) limit = PAGINATION_DEFAULTS.MAX_LIMIT;

  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build pagination metadata
 * @param {number} total - Total record count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});

/**
 * Format currency value
 * @param {number} amount
 * @returns {string}
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

module.exports = {
  generateStudentId,
  generateReceiptNo,
  parsePagination,
  buildPaginationMeta,
  formatCurrency,
};
