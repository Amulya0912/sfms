const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const studentRoutes = require('./studentRoutes');
const departmentRoutes = require('./departmentRoutes');
const academicYearRoutes = require('./academicYearRoutes');
const feeCategoryRoutes = require('./feeCategoryRoutes');
const feeStructureRoutes = require('./feeStructureRoutes');
const paymentRoutes = require('./paymentRoutes');
const scholarshipRoutes = require('./scholarshipRoutes');
const receiptRoutes = require('./receiptRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const reportRoutes = require('./reportRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/departments', departmentRoutes);
router.use('/academic-years', academicYearRoutes);
router.use('/fee-categories', feeCategoryRoutes);
router.use('/fee-structures', feeStructureRoutes);
router.use('/payments', paymentRoutes);
router.use('/scholarships', scholarshipRoutes);
router.use('/receipts', receiptRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
