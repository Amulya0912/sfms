const { pool } = require('../config/db');

/**
 * Student Repository — Raw SQL queries for students table
 */
class StudentRepository {
  async findAll({ page = 1, limit = 10, offset = 0, search, department_id, batch, academic_year_id, fee_status }) {
    let where = 's.is_active = 1';
    const params = [];

    if (search) {
      where += ` AND (s.student_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (department_id) { where += ' AND s.department_id = ?'; params.push(department_id); }
    if (batch) { where += ' AND s.batch = ?'; params.push(batch); }
    if (academic_year_id) { where += ' AND s.academic_year_id = ?'; params.push(academic_year_id); }
    if (fee_status === 'paid') { where += ' AND s.pending_balance <= 0'; }
    else if (fee_status === 'unpaid') { where += ' AND s.pending_balance >= s.total_fee AND s.total_fee > 0'; }
    else if (fee_status === 'partial') { where += ' AND s.pending_balance > 0 AND s.pending_balance < s.total_fee'; }

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM students s WHERE ${where}`, params);
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT s.*, d.name as department_name, d.code as department_code,
              ay.year_label as academic_year, ay.batch_year
       FROM students s
       JOIN departments d ON s.department_id = d.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       WHERE ${where}
       ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return { rows, total };
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, d.name as department_name, d.code as department_code,
              ay.year_label as academic_year, ay.batch_year
       FROM students s
       JOIN departments d ON s.department_id = d.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findByStudentId(studentId) {
    const [rows] = await pool.query(
      `SELECT s.*, d.name as department_name, ay.year_label as academic_year
       FROM students s
       JOIN departments d ON s.department_id = d.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       WHERE s.student_id = ?`,
      [studentId]
    );
    return rows[0] || null;
  }

  async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT s.*, d.name as department_name, d.code as department_code,
              ay.year_label as academic_year, ay.batch_year
       FROM students s
       JOIN departments d ON s.department_id = d.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       WHERE s.user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO students (student_id, user_id, first_name, last_name, email, phone, address,
        date_of_birth, gender, department_id, academic_year_id, batch, admission_date,
        profile_picture, total_fee, pending_balance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.student_id, data.user_id || null, data.first_name, data.last_name,
        data.email, data.phone || null, data.address || null, data.date_of_birth || null,
        data.gender, data.department_id, data.academic_year_id, data.batch,
        data.admission_date, data.profile_picture || null, data.total_fee || 0, data.total_fee || 0,
      ]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    const allowed = ['first_name', 'last_name', 'email', 'phone', 'address', 'date_of_birth',
      'gender', 'department_id', 'academic_year_id', 'batch', 'profile_picture',
      'total_fee', 'total_paid', 'total_discount', 'pending_balance', 'is_active'];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && allowed.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE students SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(`UPDATE students SET is_active = 0 WHERE id = ?`, [id]);
  }

  async getLastSequence() {
    const [rows] = await pool.query(
      `SELECT student_id FROM students ORDER BY id DESC LIMIT 1`
    );
    if (rows.length === 0) return 0;
    const lastId = rows[0].student_id;
    const seq = parseInt(lastId.replace(/\D/g, '').slice(-3), 10);
    return isNaN(seq) ? 0 : seq;
  }

  async getStudentsWithPendingDues(filters = {}) {
    let where = 's.is_active = 1 AND s.pending_balance > 0';
    const params = [];
    if (filters.department_id) { where += ' AND s.department_id = ?'; params.push(filters.department_id); }
    if (filters.batch) { where += ' AND s.batch = ?'; params.push(filters.batch); }

    const [rows] = await pool.query(
      `SELECT s.id, s.student_id, CONCAT(s.first_name, ' ', s.last_name) as full_name,
              s.email, s.phone, d.name as department, ay.year_label as academic_year,
              s.batch, s.total_fee, s.total_paid, s.total_discount, s.pending_balance
       FROM students s
       JOIN departments d ON s.department_id = d.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       WHERE ${where}
       ORDER BY s.pending_balance DESC`,
      params
    );
    return rows;
  }

  async countByDepartment() {
    const [rows] = await pool.query(
      `SELECT d.name as department, d.code, COUNT(s.id) as count
       FROM departments d LEFT JOIN students s ON d.id = s.department_id AND s.is_active = 1
       GROUP BY d.id, d.name, d.code`
    );
    return rows;
  }
}

module.exports = new StudentRepository();
