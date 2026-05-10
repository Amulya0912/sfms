const asyncHandler = require('express-async-handler');
const paymentService = require('../services/paymentService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const result = await paymentService.getAll(req.query);
  ApiResponse.paginated(res, result.payments, result.pagination);
});

exports.getById = asyncHandler(async (req, res) => {
  const data = await paymentService.getById(req.params.id);
  ApiResponse.success(res, data);
});

exports.getByStudentId = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const studentService = require('../services/studentService');
    const myProfile = await studentService.getByUserId(req.user.id);
    if (myProfile.id != req.params.studentId) {
      const ApiError = require('../utils/ApiError');
      throw new ApiError(403, 'Access denied. You can only view your own payments.');
    }
  }
  const data = await paymentService.getByStudentId(req.params.studentId);
  ApiResponse.success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const data = await paymentService.createPayment(req.body, req.user.id);
  ApiResponse.created(res, data, 'Payment processed successfully');
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  const data = await paymentService.updateStatus(req.params.id, status, remarks);
  ApiResponse.success(res, data, 'Payment status updated');
});
