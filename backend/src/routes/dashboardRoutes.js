const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.STAFF));

router.get('/stats', dashboardController.getStats);
router.get('/revenue', dashboardController.getMonthlyRevenue);
router.get('/batch-stats', dashboardController.getBatchWiseStats);
router.get('/department-stats', dashboardController.getDepartmentWiseStats);
router.get('/recent-transactions', dashboardController.getRecentTransactions);
router.get('/payment-methods', dashboardController.getPaymentMethodStats);

module.exports = router;
