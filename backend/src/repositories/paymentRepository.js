const { pool } = require('../config/db');

class PaymentRepository {
  async findAll({ page=1, limit=10, offset=0, student_id, status, payment_method, from_date, to_date }) {
    let where = '1=1'; const params = [];
    if (student_id) { where += ' AND p.student_id = ?'; params.push(student_id); }
    if (status) { where += ' AND p.status = ?'; params.push(status); }
    if (payment_method) { where += ' AND p.payment_method = ?'; params.push(payment_method); }
    if (from_date) { where += ' AND p.payment_date >= ?'; params.push(from_date); }
    if (to_date) { where += ' AND p.payment_date <= ?'; params.push(to_date); }

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM payments p WHERE ${where}`, params);
    const [rows] = await pool.query(
      `SELECT p.*, s.student_id as student_code, CONCAT(s.first_name,' ',s.last_name) as student_name,
              d.name as department, fc.name as fee_category, fc.code as fee_category_code,
              u.full_name as processed_by
       FROM payments p
       JOIN students s ON p.student_id = s.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       JOIN departments d ON s.department_id = d.id
       LEFT JOIN users u ON p.created_by = u.id
       WHERE ${where} ORDER BY p.payment_date DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return { rows, total: countRows[0].total };
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT p.*, s.student_id as student_code, CONCAT(s.first_name,' ',s.last_name) as student_name,
              s.email as student_email, d.name as department, fc.name as fee_category,
              fs.amount as structure_amount, u.full_name as processed_by
       FROM payments p JOIN students s ON p.student_id = s.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       JOIN departments d ON s.department_id = d.id
       LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?`, [id]
    );
    return rows[0] || null;
  }

  async findByStudentId(studentId) {
    const [rows] = await pool.query(
      `SELECT p.*, fc.name as fee_category, fc.code as fee_category_code,
              fs.amount as structure_amount, u.full_name as processed_by
       FROM payments p JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.student_id = ? ORDER BY p.payment_date DESC`, [studentId]
    );
    return rows;
  }

  async create(data, connection = null) {
    const conn = connection || pool;
    const [result] = await conn.query(
      `INSERT INTO payments (student_id, fee_structure_id, amount_paid, payment_method,
        transaction_ref, gateway_ref, status, remarks, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.student_id, data.fee_structure_id, data.amount_paid, data.payment_method,
       data.transaction_ref || null, data.gateway_ref || null, data.status || 'Completed',
       data.remarks || null, data.created_by || null]
    );
    return result.insertId;
  }

  async updateStatus(id, status, remarks) {
    await pool.query(`UPDATE payments SET status = ?, remarks = ? WHERE id = ?`, [status, remarks || null, id]);
    return this.findById(id);
  }

  async getMonthlyRevenue(year, month) {
    const [rows] = await pool.query(
      `SELECT DATE(payment_date) as date, SUM(amount_paid) as total, COUNT(*) as count
       FROM payments WHERE status = 'Completed' AND YEAR(payment_date)=? AND MONTH(payment_date)=?
       GROUP BY DATE(payment_date) ORDER BY date`, [year, month]
    );
    return rows;
  }

  async getTotalCollected() {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(amount_paid),0) as total FROM payments WHERE status='Completed'`
    );
    return rows[0].total;
  }

  async getRecentPayments(limit = 10) {
    const [rows] = await pool.query(
      `SELECT p.*, s.student_id as student_code, CONCAT(s.first_name,' ',s.last_name) as student_name,
              fc.name as fee_category
       FROM payments p JOIN students s ON p.student_id = s.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       WHERE p.status='Completed' ORDER BY p.payment_date DESC LIMIT ?`, [limit]
    );
    return rows;
  }

  async getPaymentMethodStats() {
    const [rows] = await pool.query(
      `SELECT payment_method, COUNT(*) as count, SUM(amount_paid) as total
       FROM payments WHERE status='Completed' GROUP BY payment_method`
    );
    return rows;
  }

  async getBatchWiseCollection(batch) {
    const [rows] = await pool.query(
      `SELECT d.name as department, SUM(p.amount_paid) as collected
       FROM payments p JOIN students s ON p.student_id = s.id
       JOIN departments d ON s.department_id = d.id
       WHERE p.status='Completed' AND s.batch = ? GROUP BY d.id, d.name`, [batch]
    );
    return rows;
  }
}

module.exports = new PaymentRepository();
