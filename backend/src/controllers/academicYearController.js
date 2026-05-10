const asyncHandler = require('express-async-handler');
const academicYearService = require('../services/academicYearService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const data = await academicYearService.getAll();
  ApiResponse.success(res, data);
});
exports.getById = asyncHandler(async (req, res) => {
  const data = await academicYearService.getById(req.params.id);
  ApiResponse.success(res, data);
});
exports.create = asyncHandler(async (req, res) => {
  const data = await academicYearService.create(req.body);
  ApiResponse.created(res, data, 'Academic year created');
});
exports.update = asyncHandler(async (req, res) => {
  const data = await academicYearService.update(req.params.id, req.body);
  ApiResponse.success(res, data, 'Academic year updated');
});
exports.delete = asyncHandler(async (req, res) => {
  await academicYearService.delete(req.params.id);
  ApiResponse.success(res, null, 'Academic year deleted');
});
