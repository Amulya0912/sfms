const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN));

router.get('/roles', userController.getRoles);

router.route('/')
  .get(userController.getAll)
  .post(userController.create);

router.route('/:id')
  .get(userController.getById)
  .put(userController.update)
  .delete(userController.delete);

module.exports = router;
