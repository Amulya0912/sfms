const asyncHandler = require('express-async-handler');
const departmentService = require('../services/departmentService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const data = await departmentService.getAll();
  ApiResponse.success(res, data);
});
exports.getById = asyncHandler(async (req, res) => {
  const data = await departmentService.getById(req.params.id);
  ApiResponse.success(res, data);
});
exports.create = asyncHandler(async (req, res) => {
  const data = await departmentService.create(req.body);
  ApiResponse.created(res, data, 'Department created');
});
exports.update = asyncHandler(async (req, res) => {
  const data = await departmentService.update(req.params.id, req.body);
  ApiResponse.success(res, data, 'Department updated');
});
exports.delete = asyncHandler(async (req, res) => {
  await departmentService.delete(req.params.id);
  ApiResponse.success(res, null, 'Department deleted');
});
