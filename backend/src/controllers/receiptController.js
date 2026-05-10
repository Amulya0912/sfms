const asyncHandler = require('express-async-handler');
const receiptService = require('../services/receiptService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const filters = { ...req.query };
  // Students may only see their own receipts — auto-inject their student_id
  if (req.user.role === 'student') {
    const studentService = require('../services/studentService');
    const myProfile = await studentService.getByUserId(req.user.id);
    filters.student_id = myProfile.id;
  }
  const data = await receiptService.getAll(filters);
  ApiResponse.success(res, data);
});
exports.getById = asyncHandler(async (req, res) => {
  const data = await receiptService.getById(req.params.id);
  if (req.user.role === 'student') {
    const studentService = require('../services/studentService');
    const myProfile = await studentService.getByUserId(req.user.id);
    if (data.student_id !== myProfile.id) {
      const ApiError = require('../utils/ApiError');
      throw new ApiError(403, 'Access denied. You can only view your own receipts.');
    }
  }
  ApiResponse.success(res, data);
});
exports.download = asyncHandler(async (req, res) => {
  const data = await receiptService.getById(req.params.id);
  if (req.user.role === 'student') {
    const studentService = require('../services/studentService');
    const myProfile = await studentService.getByUserId(req.user.id);
    if (data.student_id !== myProfile.id) {
      const ApiError = require('../utils/ApiError');
      throw new ApiError(403, 'Access denied. You can only download your own receipts.');
    }
  }
  await receiptService.generatePDF(req.params.id, res);
});
