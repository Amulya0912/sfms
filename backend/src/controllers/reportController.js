const asyncHandler = require('express-async-handler');
const reportService = require('../services/reportService');
const ApiResponse = require('../utils/ApiResponse');

exports.getMonthlyCollections = asyncHandler(async (req, res) => {
  const data = await reportService.getMonthlyCollections(req.query.year, req.query.month);
  ApiResponse.success(res, data);
});

exports.getPendingFees = asyncHandler(async (req, res) => {
  const data = await reportService.getPendingFeesReport(req.query);
  ApiResponse.success(res, data);
});

exports.getStudentHistory = asyncHandler(async (req, res) => {
  const data = await reportService.getStudentPaymentHistory(req.params.studentId);
  ApiResponse.success(res, data);
});

exports.exportExcel = asyncHandler(async (req, res) => {
  const { type } = req.query;
  let data;
  if (type === 'pending') data = await reportService.getPendingFeesReport(req.query);
  else data = await reportService.getMonthlyCollections(req.query.year, req.query.month);

  const buffer = await reportService.exportToExcel(data, type || 'Report');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.xlsx`);
  res.send(buffer);
});

exports.exportPDF = asyncHandler(async (req, res) => {
  const { type } = req.query;
  let data;
  if (type === 'pending') data = await reportService.getPendingFeesReport(req.query);
  else data = await reportService.getMonthlyCollections(req.query.year, req.query.month);
  await reportService.exportToPDF(data, `${type || 'Financial'} Report`, res);
});
