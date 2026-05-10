const paymentRepository = require('../repositories/paymentRepository');
const studentRepository = require('../repositories/studentRepository');
const { pool } = require('../config/db');

class DashboardService {
  async getStats() {
    const [studentCount] = await pool.query(`SELECT COUNT(*) as total FROM students WHERE is_active=1`);
    const [deptCount] = await pool.query(`SELECT COUNT(*) as total FROM departments WHERE is_active=1`);
    const totalCollected = await paymentRepository.getTotalCollected();
    const [pendingRows] = await pool.query(
      `SELECT COALESCE(SUM(pending_balance),0) as total FROM students WHERE is_active=1 AND pending_balance>0`
    );

    return {
      totalStudents: studentCount[0].total,
      totalDepartments: deptCount[0].total,
      totalCollected,
      totalPending: pendingRows[0].total,
    };
  }

  async getMonthlyRevenue(year) {
    const y = year || new Date().getFullYear();
    const [rows] = await pool.query(
      `SELECT MONTH(payment_date) as month, SUM(amount_paid) as total
       FROM payments WHERE status='Completed' AND YEAR(payment_date)=?
       GROUP BY MONTH(payment_date) ORDER BY month`, [y]
    );
    // Fill all 12 months
    const months = Array.from({ length: 12 }, (_, i) => {
      const found = rows.find(r => r.month === i + 1);
      return { month: i + 1, total: found ? Number(found.total) : 0 };
    });
    return months;
  }

  async getBatchWiseStats() {
    const [rows] = await pool.query(
      `SELECT s.batch, COUNT(s.id) as students, SUM(s.total_fee) as total_fee,
              SUM(s.total_paid) as total_paid, SUM(s.pending_balance) as pending
       FROM students s WHERE s.is_active=1 GROUP BY s.batch ORDER BY s.batch DESC`
    );
    return rows;
  }

  async getDepartmentWiseStats() {
    const [rows] = await pool.query(
      `SELECT d.name as department, d.code, COUNT(s.id) as students,
              COALESCE(SUM(s.total_fee),0) as total_fee,
              COALESCE(SUM(s.total_paid),0) as total_paid,
              COALESCE(SUM(s.pending_balance),0) as pending
       FROM departments d LEFT JOIN students s ON d.id = s.department_id AND s.is_active=1
       WHERE d.is_active=1 GROUP BY d.id, d.name, d.code`
    );
    return rows;
  }

  async getRecentTransactions() {
    return paymentRepository.getRecentPayments(10);
  }

  async getPaymentMethodStats() {
    return paymentRepository.getPaymentMethodStats();
  }
}

module.exports = new DashboardService();
