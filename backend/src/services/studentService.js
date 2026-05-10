const studentRepository = require('../repositories/studentRepository');
const feeStructureRepository = require('../repositories/feeStructureRepository');
const ApiError = require('../utils/ApiError');
const { generateStudentId } = require('../utils/helpers');

class StudentService {
  async getAll(query) {
    const { parsePagination, buildPaginationMeta } = require('../utils/helpers');
    const { page, limit, offset } = parsePagination(query);
    const { rows, total } = await studentRepository.findAll({
      page, limit, offset,
      search: query.search,
      department_id: query.department_id,
      batch: query.batch,
      academic_year_id: query.academic_year_id,
      fee_status: query.fee_status,
    });
    return { students: rows, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id) {
    const student = await studentRepository.findById(id);
    if (!student) throw new ApiError(404, 'Student not found');
    return student;
  }

  async getByUserId(userId) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) throw new ApiError(404, 'Student profile not found');
    return student;
  }

  async getMyFees(userId) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) throw new ApiError(404, 'Student profile not found');
    const feeStructures = await feeStructureRepository.findForStudent(student.id);
    const totalFee = feeStructures.reduce((sum, fs) => sum + parseFloat(fs.amount || 0), 0);
    const totalPaid = feeStructures.reduce((sum, fs) => sum + parseFloat(fs.paid_amount || 0), 0);
    const totalPending = feeStructures.reduce((sum, fs) => sum + parseFloat(fs.remaining || 0), 0);
    return {
      student,
      feeStructures,
      summary: { totalFee, totalPaid, totalPending },
    };
  }

  async create(data) {
    const lastSeq = await studentRepository.getLastSequence();
    data.student_id = generateStudentId(lastSeq);

    // Calculate total fee from fee structures
    const student = await studentRepository.create(data);
    const totalFee = await feeStructureRepository.getTotalFeeForStudent(student.id);
    if (totalFee > 0) {
      await studentRepository.update(student.id, {
        total_fee: totalFee, pending_balance: totalFee,
      });
    }
    return studentRepository.findById(student.id);
  }

  async update(id, data) {
    const student = await studentRepository.findById(id);
    if (!student) throw new ApiError(404, 'Student not found');
    return studentRepository.update(id, data);
  }

  async updateSelf(userId, data) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) throw new ApiError(404, 'Student profile not found');
    // Only allow personal fields
    const allowed = { phone: data.phone, email: data.email, address: data.address };
    return studentRepository.update(student.id, allowed);
  }

  async delete(id) {
    const student = await studentRepository.findById(id);
    if (!student) throw new ApiError(404, 'Student not found');
    await studentRepository.delete(id);
  }

  async getPendingDues(filters) {
    return studentRepository.getStudentsWithPendingDues(filters);
  }

  async getCountByDepartment() {
    return studentRepository.countByDepartment();
  }
}

module.exports = new StudentService();
