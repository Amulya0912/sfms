const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate);

router.get('/', authorize(ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.STAFF, ROLES.STUDENT), receiptController.getAll);
router.get('/:id', receiptController.getById);
router.get('/:id/download', receiptController.download);

module.exports = router;
