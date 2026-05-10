const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  ApiResponse.success(res, result, 'Login successful');
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  ApiResponse.success(res, result, 'Token refreshed');
});

exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  ApiResponse.success(res, null, 'Logged out successfully');
});

exports.getMe = asyncHandler(async (req, res) => {
  const userService = require('../services/userService');
  const user = await userService.getById(req.user.id);
  ApiResponse.success(res, user);
});
