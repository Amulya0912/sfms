const academicYearRepository = require('../repositories/academicYearRepository');
const ApiError = require('../utils/ApiError');

class AcademicYearService {
  async getAll() { return academicYearRepository.findAll(); }
  async getById(id) {
    const ay = await academicYearRepository.findById(id);
    if (!ay) throw new ApiError(404, 'Academic year not found');
    return ay;
  }
  async getCurrent() { return academicYearRepository.findCurrent(); }
  async create(data) { return academicYearRepository.create(data); }
  async update(id, data) {
    await this.getById(id);
    return academicYearRepository.update(id, data);
  }
  async delete(id) {
    await this.getById(id);
    await academicYearRepository.delete(id);
  }
}

module.exports = new AcademicYearService();
