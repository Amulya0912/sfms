const { pool } = require('../config/db');
const paymentRepository = require('../repositories/paymentRepository');
const receiptRepository = require('../repositories/receiptRepository');
const studentRepository = require('../repositories/studentRepository');
const feeStructureRepository = require('../repositories/feeStructureRepository');
const ApiError = require('../utils/ApiError');
const { generateReceiptNo, parsePagination, buildPaginationMeta } = require('../utils/helpers');
const { verifyPaymentGateway, sendEmail } = require('../utils/mockServices');

class PaymentService {
  async getAll(query) {
    const { page, limit, offset } = parsePagination(query);
    const { rows, total } = await paymentRepository.findAll({
      page, limit, offset, student_id: query.student_id, status: query.status,
      payment_method: query.payment_method, from_date: query.from_date, to_date: query.to_date,
    });
    return { payments: rows, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new ApiError(404, 'Payment not found');
    return payment;
  }

  async getByStudentId(studentId) {
    return paymentRepository.findByStudentId(studentId);
  }

  /**
   * Process a new payment with atomic transaction
   * START TRANSACTION → verify gateway → INSERT payment → create receipt → COMMIT/ROLLBACK
   */
  async createPayment(data, userId) {
    const student = await studentRepository.findById(data.student_id);
    if (!student) throw new ApiError(404, 'Student not found');

    const feeStructure = await feeStructureRepository.findById(data.fee_structure_id);
    if (!feeStructure) throw new ApiError(404, 'Fee structure not found');

    // Verify payment via mock gateway
    const gatewayResult = await verifyPaymentGateway(data.transaction_ref, data.amount_paid);
    if (gatewayResult.status !== 'SUCCESS') {
      throw new ApiError(400, 'Payment verification failed');
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const paymentId = await paymentRepository.create({
        ...data, gateway_ref: gatewayResult.gatewayRef, status: 'Completed', created_by: userId,
      }, connection);

      // Generate receipt
      const lastSeq = await receiptRepository.getLastSequence();
      const receiptNo = generateReceiptNo(lastSeq);
      await receiptRepository.create({
        receipt_no: receiptNo, payment_id: paymentId, student_id: data.student_id,
        amount: data.amount_paid, created_by: userId,
      }, connection);

      await connection.commit();

      // Send mock notification
      await sendEmail(student.email, 'Payment Confirmation',
        `Payment of ₹${data.amount_paid} received. Receipt: ${receiptNo}`);

      return paymentRepository.findById(paymentId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateStatus(id, status, remarks) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new ApiError(404, 'Payment not found');
    return paymentRepository.updateStatus(id, status, remarks);
  }
}

module.exports = new PaymentService();
