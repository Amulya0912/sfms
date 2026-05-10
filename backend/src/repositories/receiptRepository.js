const { pool } = require('../config/db');

class ReceiptRepository {
  async findAll(filters = {}) {
    let where = '1=1'; const params = [];
    if (filters.student_id) { where += ' AND r.student_id = ?'; params.push(filters.student_id); }

    const [rows] = await pool.query(
      `SELECT r.id, r.receipt_no, r.amount, r.generated_at, r.student_id,
              CONCAT(s.first_name,' ',s.last_name) as student_name,
              s.student_id as student_code,
              p.payment_method, p.amount_paid, p.payment_date,
              p.transaction_ref, p.status as payment_status,
              fc.name as fee_category,
              ay.year_label as academic_year,
              u.full_name as generated_by
       FROM receipts r
       JOIN payments p ON r.payment_id = p.id
       JOIN students s ON r.student_id = s.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       JOIN academic_years ay ON fs.academic_year_id = ay.id
       LEFT JOIN users u ON r.created_by = u.id
       WHERE ${where}
       ORDER BY r.generated_at DESC`, params
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT r.*, CONCAT(s.first_name,' ',s.last_name) as student_name, s.student_id as student_code,
              s.email as student_email, s.phone as student_phone, d.name as department,
              p.payment_method, p.amount_paid, p.transaction_ref, p.payment_date, p.status as payment_status,
              fc.name as fee_category, fs.amount as structure_amount, ay.year_label as academic_year,
              u.full_name as generated_by
       FROM receipts r JOIN payments p ON r.payment_id = p.id
       JOIN students s ON r.student_id = s.id JOIN departments d ON s.department_id = d.id
       JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       LEFT JOIN users u ON r.created_by = u.id WHERE r.id = ?`, [id]
    );
    return rows[0] || null;
  }

  async findByReceiptNo(receiptNo) {
    const [rows] = await pool.query(`SELECT * FROM receipts WHERE receipt_no = ?`, [receiptNo]);
    return rows[0] || null;
  }

  async create(data, connection = null) {
    const conn = connection || pool;
    const [result] = await conn.query(
      `INSERT INTO receipts (receipt_no, payment_id, student_id, amount, pdf_path, created_by) VALUES (?,?,?,?,?,?)`,
      [data.receipt_no, data.payment_id, data.student_id, data.amount, data.pdf_path || null, data.created_by || null]
    );
    return result.insertId;
  }

  async getLastSequence() {
    const [rows] = await pool.query(`SELECT receipt_no FROM receipts ORDER BY id DESC LIMIT 1`);
    if (!rows.length) return 0;
    const seq = parseInt(rows[0].receipt_no.split('-').pop(), 10);
    return isNaN(seq) ? 0 : seq;
  }
}

module.exports = new ReceiptRepository();
