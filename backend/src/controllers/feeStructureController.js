const asyncHandler = require('express-async-handler');
const feeStructureService = require('../services/feeStructureService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const data = await feeStructureService.getAll(req.query);
  ApiResponse.success(res, data);
});
exports.getById = asyncHandler(async (req, res) => {
  const data = await feeStructureService.getById(req.params.id);
  ApiResponse.success(res, data);
});
exports.getForStudent = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    const studentService = require('../services/studentService');
    const myProfile = await studentService.getByUserId(req.user.id);
    if (myProfile.id != req.params.studentId) {
      const ApiError = require('../utils/ApiError');
      throw new ApiError(403, 'Access denied. You can only view your own fee structures.');
    }
  }
  const data = await feeStructureService.getForStudent(req.params.studentId);
  ApiResponse.success(res, data);
});
exports.create = asyncHandler(async (req, res) => {
  const data = await feeStructureService.create(req.body);
  ApiResponse.created(res, data, 'Fee structure created');
});
exports.update = asyncHandler(async (req, res) => {
  const data = await feeStructureService.update(req.params.id, req.body);
  ApiResponse.success(res, data, 'Fee structure updated');
});
exports.delete = asyncHandler(async (req, res) => {
  await feeStructureService.delete(req.params.id);
  ApiResponse.success(res, null, 'Fee structure deleted');
});
