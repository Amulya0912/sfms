const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.STAFF));

router.route('/')
  .get(scholarshipController.getAll)
  .post(scholarshipController.create);

router.route('/:id')
  .get(scholarshipController.getById)
  .put(scholarshipController.update)
  .delete(scholarshipController.delete);

module.exports = router;
