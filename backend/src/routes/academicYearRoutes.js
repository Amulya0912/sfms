const express = require('express');
const router = express.Router();
const academicYearController = require('../controllers/academicYearController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.STAFF, ROLES.ACCOUNTANT));

router.route('/')
  .get(academicYearController.getAll)
  .post(academicYearController.create);

router.route('/:id')
  .get(academicYearController.getById)
  .put(academicYearController.update)
  .delete(academicYearController.delete);

module.exports = router;
