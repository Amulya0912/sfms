const express = require('express');
const router = express.Router();
const feeStructureController = require('../controllers/feeStructureController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { validate } = require('../middlewares/validator');
const { createFeeStructureValidation, updateFeeStructureValidation } = require('../validators/feeValidator');
const { ROLES } = require('../utils/constants');

router.use(authenticate);

// Student can only view their own structures
router.get('/student/:studentId', authorize(ROLES.STUDENT, ROLES.STAFF, ROLES.ACCOUNTANT, ROLES.SUPER_ADMIN), feeStructureController.getForStudent);

// Staff+ routes
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.STAFF, ROLES.ACCOUNTANT));

router.route('/')
  .get(feeStructureController.getAll)
  .post(createFeeStructureValidation, validate, feeStructureController.create);

router.route('/:id')
  .get(feeStructureController.getById)
  .put(updateFeeStructureValidation, validate, feeStructureController.update)
  .delete(feeStructureController.delete);

module.exports = router;
