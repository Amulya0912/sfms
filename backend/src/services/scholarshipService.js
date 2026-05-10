const scholarshipRepository = require('../repositories/scholarshipRepository');
const studentRepository = require('../repositories/studentRepository');
const ApiError = require('../utils/ApiError');

class ScholarshipService {
  async getAll(filters) { return scholarshipRepository.findAll(filters); }

  async getById(id) {
    const s = await scholarshipRepository.findById(id);
    if (!s) throw new ApiError(404, 'Scholarship not found');
    return s;
  }

  async create(data, userId) {
    const student = await studentRepository.findById(data.student_id);
    if (!student) throw new ApiError(404, 'Student not found');

    data.created_by = userId;
    const scholarship = await scholarshipRepository.create(data);

    // Recalculate student discount
    await this.recalculateStudentDiscount(data.student_id);
    return scholarship;
  }

  async update(id, data) {
    const scholarship = await scholarshipRepository.findById(id);
    if (!scholarship) throw new ApiError(404, 'Scholarship not found');
    const updated = await scholarshipRepository.update(id, data);
    await this.recalculateStudentDiscount(scholarship.student_id);
    return updated;
  }

  async delete(id) {
    const scholarship = await scholarshipRepository.findById(id);
    if (!scholarship) throw new ApiError(404, 'Scholarship not found');
    await scholarshipRepository.delete(id);
    await this.recalculateStudentDiscount(scholarship.student_id);
  }

  async recalculateStudentDiscount(studentId) {
    const discounts = await scholarshipRepository.getTotalDiscountForStudent(studentId);
    const student = await studentRepository.findById(studentId);
    let totalDiscount = discounts.total_amount;
    if (discounts.total_pct > 0) {
      totalDiscount += (student.total_fee * discounts.total_pct) / 100;
    }
    await studentRepository.update(studentId, {
      total_discount: totalDiscount,
      pending_balance: student.total_fee - student.total_paid - totalDiscount,
    });
  }
}

module.exports = new ScholarshipService();
