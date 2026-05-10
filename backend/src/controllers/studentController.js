const asyncHandler = require('express-async-handler');
const studentService = require('../services/studentService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAll = asyncHandler(async (req, res) => {
  const result = await studentService.getAll(req.query);
  ApiResponse.paginated(res, result.students, result.pagination);
});

exports.getById = asyncHandler(async (req, res) => {
  const student = await studentService.getById(req.params.id);
  ApiResponse.success(res, student);
});

exports.getMyProfile = asyncHandler(async (req, res) => {
  const student = await studentService.getByUserId(req.user.id);
  ApiResponse.success(res, student);
});

exports.getMyFees = asyncHandler(async (req, res) => {
  const data = await studentService.getMyFees(req.user.id);
  ApiResponse.success(res, data);
});

exports.create = asyncHandler(async (req, res) => {
  const student = await studentService.create(req.body);
  ApiResponse.created(res, student, 'Student registered successfully');
});

exports.update = asyncHandler(async (req, res) => {
  const student = await studentService.update(req.params.id, req.body);
  ApiResponse.success(res, student, 'Student updated successfully');
});

exports.updateSelf = asyncHandler(async (req, res) => {
  const student = await studentService.updateSelf(req.user.id, req.body);
  ApiResponse.success(res, student, 'Profile updated successfully');
});

exports.delete = asyncHandler(async (req, res) => {
  await studentService.delete(req.params.id);
  ApiResponse.success(res, null, 'Student deactivated');
});

exports.getPendingDues = asyncHandler(async (req, res) => {
  const data = await studentService.getPendingDues(req.query);
  ApiResponse.success(res, data);
});

exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) return ApiResponse.success(res, null, 'No file uploaded');
  const filePath = `/uploads/${req.file.filename}`;
  // For students, update their own profile; for staff, update specified student
  if (req.user.role === 'student') {
    const student = await studentService.getByUserId(req.user.id);
    await studentService.update(student.id, { profile_picture: filePath });
  } else {
    await studentService.update(req.params.id, { profile_picture: filePath });
  }
  ApiResponse.success(res, { path: filePath }, 'Profile picture uploaded');
});
