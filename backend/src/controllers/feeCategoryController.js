const asyncHandler = require('express-async-handler');
const feeCategoryService = require('../services/feeCategoryService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const data = await feeCategoryService.getAll();
  ApiResponse.success(res, data);
});
exports.getById = asyncHandler(async (req, res) => {
  const data = await feeCategoryService.getById(req.params.id);
  ApiResponse.success(res, data);
});
exports.create = asyncHandler(async (req, res) => {
  const data = await feeCategoryService.create(req.body);
  ApiResponse.created(res, data, 'Fee category created');
});
exports.update = asyncHandler(async (req, res) => {
  const data = await feeCategoryService.update(req.params.id, req.body);
  ApiResponse.success(res, data, 'Fee category updated');
});
exports.delete = asyncHandler(async (req, res) => {
  await feeCategoryService.delete(req.params.id);
  ApiResponse.success(res, null, 'Fee category deleted');
});
