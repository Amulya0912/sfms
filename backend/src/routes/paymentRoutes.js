const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/auth');
const { authorize, blockStudentMutation } = require('../middlewares/rbac');
const { validate } = require('../middlewares/validator');
const { createPaymentValidation, updatePaymentStatusValidation } = require('../validators/paymentValidator');
const { ROLES } = require('../utils/constants');

router.use(authenticate);

// Student routes (read-only)
router.get('/student/:studentId', paymentController.getByStudentId);

// Accountant+ routes for mutations
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT));
router.use(blockStudentMutation);

router.route('/')
  .get(paymentController.getAll)
  .post(createPaymentValidation, validate, paymentController.create);

router.route('/:id')
  .get(paymentController.getById)
  .put(updatePaymentStatusValidation, validate, paymentController.updateStatus);

module.exports = router;
