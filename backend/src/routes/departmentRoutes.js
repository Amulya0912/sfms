const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.STAFF, ROLES.ACCOUNTANT));

router.route('/')
  .get(departmentController.getAll)
  .post(departmentController.create);

router.route('/:id')
  .get(departmentController.getById)
  .put(departmentController.update)
  .delete(departmentController.delete);

module.exports = router;
