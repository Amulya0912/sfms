const { body } = require('express-validator');
const { GENDERS } = require('../utils/constants');

const createStudentValidation = [
  body('first_name').trim().notEmpty().withMessage('First name is required').isLength({ max: 100 }),
  body('last_name').trim().notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number is required'),
  body('gender').isIn(GENDERS).withMessage(`Gender must be one of: ${GENDERS.join(', ')}`),
  body('department_id').isInt({ min: 1 }).withMessage('Valid department ID is required'),
  body('academic_year_id').isInt({ min: 1 }).withMessage('Valid academic year ID is required'),
  body('batch').trim().notEmpty().withMessage('Batch is required'),
  body('admission_date').isISO8601().withMessage('Valid admission date is required (YYYY-MM-DD)'),
  body('date_of_birth').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('address').optional().trim().isLength({ max: 500 }),
];

const updateStudentValidation = [
  body('first_name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('last_name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('address').optional().trim().isLength({ max: 500 }),
];

/**
 * Student self-update validation — ONLY personal details allowed
 * Blocks: fee-related fields, department, academic year, batch, admission_date
 */
const studentSelfUpdateValidation = [
  body('phone').optional().trim(),
  body('email').optional().trim().isEmail().withMessage('Valid email is required'),
  body('address').optional().trim().isLength({ max: 500 }),
  // Block any fee-related fields
  body('total_fee').not().exists().withMessage('Students cannot modify fee details'),
  body('total_paid').not().exists().withMessage('Students cannot modify payment details'),
  body('pending_balance').not().exists().withMessage('Students cannot modify balance details'),
  body('total_discount').not().exists().withMessage('Students cannot modify discount details'),
  body('department_id').not().exists().withMessage('Students cannot modify department'),
  body('academic_year_id').not().exists().withMessage('Students cannot modify academic year'),
  body('batch').not().exists().withMessage('Students cannot modify batch'),
];

module.exports = { createStudentValidation, updateStudentValidation, studentSelfUpdateValidation };
