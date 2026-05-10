const feeStructureRepository = require('../repositories/feeStructureRepository');
const ApiError = require('../utils/ApiError');

class FeeStructureService {
  async getAll(filters) { return feeStructureRepository.findAll(filters); }
  async getById(id) {
    const fs = await feeStructureRepository.findById(id);
    if (!fs) throw new ApiError(404, 'Fee structure not found');
    return fs;
  }
  async getForStudent(studentId) { return feeStructureRepository.findForStudent(studentId); }
  async create(data) { return feeStructureRepository.create(data); }
  async update(id, data) {
    await this.getById(id);
    return feeStructureRepository.update(id, data);
  }
  async delete(id) {
    await this.getById(id);
    await feeStructureRepository.delete(id);
  }
}

module.exports = new FeeStructureService();
