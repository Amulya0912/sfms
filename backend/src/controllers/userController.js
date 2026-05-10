const asyncHandler = require('express-async-handler');
const userService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

exports.getRoles = asyncHandler(async (req, res) => {
  const roles = await userService.getRoles();
  ApiResponse.success(res, roles);
});

exports.getAll = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  ApiResponse.success(res, users);
});

exports.getById = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  ApiResponse.success(res, user);
});

exports.create = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  ApiResponse.created(res, user, 'User created successfully');
});

exports.update = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  ApiResponse.success(res, user, 'User updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  await userService.delete(req.params.id);
  ApiResponse.success(res, null, 'User deactivated successfully');
});

