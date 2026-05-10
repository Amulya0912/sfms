const feeCategoryRepository = require('../repositories/feeCategoryRepository');
const ApiError = require('../utils/ApiError');

class FeeCategoryService {
  async getAll() { return feeCategoryRepository.findAll(); }
  async getById(id) {
    const cat = await feeCategoryRepository.findById(id);
    if (!cat) throw new ApiError(404, 'Fee category not found');
    return cat;
  }
  async create(data) { return feeCategoryRepository.create(data); }
  async update(id, data) {
    await this.getById(id);
    return feeCategoryRepository.update(id, data);
  }
  async delete(id) {
    await this.getById(id);
    await feeCategoryRepository.delete(id);
  }
}

module.exports = new FeeCategoryService();
