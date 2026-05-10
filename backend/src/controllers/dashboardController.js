const asyncHandler = require('express-async-handler');
const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/ApiResponse');

exports.getStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getStats();
  ApiResponse.success(res, data);
});
exports.getMonthlyRevenue = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyRevenue(req.query.year);
  ApiResponse.success(res, data);
});
exports.getBatchWiseStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getBatchWiseStats();
  ApiResponse.success(res, data);
});
exports.getDepartmentWiseStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDepartmentWiseStats();
  ApiResponse.success(res, data);
});
exports.getRecentTransactions = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentTransactions();
  ApiResponse.success(res, data);
});
exports.getPaymentMethodStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getPaymentMethodStats();
  ApiResponse.success(res, data);
});
