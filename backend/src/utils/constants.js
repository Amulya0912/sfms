/**
 * Application Constants & Enums
 */

const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ACCOUNTANT: 'accountant',
  STAFF: 'staff',
  STUDENT: 'student',
};

const ROLE_IDS = {
  [ROLES.SUPER_ADMIN]: 1,
  [ROLES.ACCOUNTANT]: 2,
  [ROLES.STAFF]: 3,
  [ROLES.STUDENT]: 4,
};

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

const DISCOUNT_TYPES = ['Percentage', 'Amount'];

const GENDERS = ['Male', 'Female', 'Other'];

const FEE_CATEGORY_CODES = ['VT1', 'VT2', 'VT3', 'VT4', 'VS', 'HOSTEL', 'BUS', 'LIBRARY', 'EXAM'];

const ACADEMIC_YEARS = [
  'PUC 1st Year',
  'PUC 2nd Year',
  'B.Tech 1st Year',
  'B.Tech 2nd Year',
  'B.Tech 3rd Year',
  'B.Tech 4th Year',
];

const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

module.exports = {
  ROLES,
  ROLE_IDS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  DISCOUNT_TYPES,
  GENDERS,
  FEE_CATEGORY_CODES,
  ACADEMIC_YEARS,
  PAGINATION_DEFAULTS,
};
