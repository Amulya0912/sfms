const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const { ROLES } = require('../utils/constants');

router.use(authenticate, authorize(ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT));

router.get('/collections', reportController.getMonthlyCollections);
router.get('/pending-fees', reportController.getPendingFees);
router.get('/student/:studentId', reportController.getStudentHistory);
router.get('/export/excel', reportController.exportExcel);
router.get('/export/pdf', reportController.exportPDF);

module.exports = router;
