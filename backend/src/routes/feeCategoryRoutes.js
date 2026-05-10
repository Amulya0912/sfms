const express = require('express');
const router = express.Router();
const feeCategoryController = require('../controllers/feeCategoryController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { validate } = require('../middlewares/validator');
const { createFeeCategoryValidation } = require('../validators/feeValidator');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.STAFF, ROLES.ACCOUNTANT));

router.route('/')
  .get(feeCategoryController.getAll)
  .post(createFeeCategoryValidation, validate, feeCategoryController.create);

router.route('/:id')
  .get(feeCategoryController.getById)
  .put(feeCategoryController.update)
  .delete(feeCategoryController.delete);

module.exports = router;
