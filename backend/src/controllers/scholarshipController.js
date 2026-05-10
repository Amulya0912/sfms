const asyncHandler = require('express-async-handler');
const scholarshipService = require('../services/scholarshipService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const data = await scholarshipService.getAll(req.query);
  ApiResponse.success(res, data);
});
exports.getById = asyncHandler(async (req, res) => {
  const data = await scholarshipService.getById(req.params.id);
  ApiResponse.success(res, data);
});
exports.create = asyncHandler(async (req, res) => {
  const data = await scholarshipService.create(req.body, req.user.id);
  ApiResponse.created(res, data, 'Scholarship created');
});
exports.update = asyncHandler(async (req, res) => {
  const data = await scholarshipService.update(req.params.id, req.body);
  ApiResponse.success(res, data, 'Scholarship updated');
});
exports.delete = asyncHandler(async (req, res) => {
  await scholarshipService.delete(req.params.id);
  ApiResponse.success(res, null, 'Scholarship removed');
});
