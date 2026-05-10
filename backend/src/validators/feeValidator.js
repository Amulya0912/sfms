const { body } = require('express-validator');

const createFeeStructureValidation = [
  body('academic_year_id').isInt({ min: 1 }).withMessage('Valid academic year ID is required'),
  body('department_id').isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('fee_category_id').isInt({ min: 1 }).withMessage('Valid fee category ID is required'),
  body('batch').trim().notEmpty().withMessage('Batch is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('due_date').optional().isISO8601().withMessage('Valid due date is required'),
];

const updateFeeStructureValidation = [
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('due_date').optional().isISO8601().withMessage('Valid due date is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
];

const createFeeCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 100 }),
  body('code').trim().notEmpty().withMessage('Category code is required').isLength({ max: 20 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('is_mandatory').optional().isBoolean(),
];

module.exports = {
  createFeeStructureValidation,
  updateFeeStructureValidation,
  createFeeCategoryValidation,
};
