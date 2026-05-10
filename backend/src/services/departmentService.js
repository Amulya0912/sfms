const departmentRepository = require('../repositories/departmentRepository');
const ApiError = require('../utils/ApiError');

class DepartmentService {
  async getAll() { return departmentRepository.findAll(); }
  async getById(id) {
    const dept = await departmentRepository.findById(id);
    if (!dept) throw new ApiError(404, 'Department not found');
    return dept;
  }
  async create(data) { return departmentRepository.create(data); }
  async update(id, data) {
    await this.getById(id);
    return departmentRepository.update(id, data);
  }
  async delete(id) {
    await this.getById(id);
    await departmentRepository.delete(id);
  }
}

module.exports = new DepartmentService();
