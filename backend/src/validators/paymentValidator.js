const { body } = require('express-validator');
const { PAYMENT_METHODS } = require('../utils/constants');

const createPaymentValidation = [
  body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  body('fee_structure_id').isInt({ min: 1 }).withMessage('Valid fee structure ID is required'),
  body('amount_paid').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('payment_method')
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`),
  body('transaction_ref').optional().trim().isLength({ max: 100 }),
  body('remarks').optional().trim().isLength({ max: 500 }),
];

const updatePaymentStatusValidation = [
  body('status')
    .isIn(['Completed', 'Failed', 'Refunded'])
    .withMessage('Status must be Completed, Failed, or Refunded'),
  body('remarks').optional().trim().isLength({ max: 500 }),
];

module.exports = { createPaymentValidation, updatePaymentStatusValidation };
