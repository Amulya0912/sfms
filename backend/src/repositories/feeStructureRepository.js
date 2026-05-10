const { pool } = require('../config/db');

class FeeStructureRepository {
  async findAll(filters = {}) {
    let where = 'fs.is_active = 1';
    const params = [];
    if (filters.academic_year_id) { where += ' AND fs.academic_year_id = ?'; params.push(filters.academic_year_id); }
    if (filters.department_id) { where += ' AND fs.department_id = ?'; params.push(filters.department_id); }
    if (filters.batch) { where += ' AND fs.batch = ?'; params.push(filters.batch); }
    if (filters.fee_category_id) { where += ' AND fs.fee_category_id = ?'; params.push(filters.fee_category_id); }

    const [rows] = await pool.query(
      `SELECT fs.*, d.name as department_name, d.code as department_code,
              ay.year_label as academic_year, ay.batch_year,
              fc.name as fee_category_name, fc.code as fee_category_code, fc.is_mandatory
       FROM fee_structures fs
       JOIN departments d ON fs.department_id = d.id
       JOIN academic_years ay ON fs.academic_year_id = ay.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       WHERE ${where} ORDER BY d.name, fc.name`,
      params
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT fs.*, d.name as department_name, ay.year_label as academic_year,
              fc.name as fee_category_name, fc.code as fee_category_code
       FROM fee_structures fs
       JOIN departments d ON fs.department_id = d.id
       JOIN academic_years ay ON fs.academic_year_id = ay.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       WHERE fs.id = ?`, [id]
    );
    return rows[0] || null;
  }

  async findForStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT fs.*, fc.name as fee_category_name, fc.code as fee_category_code,
              fc.is_mandatory, d.name as department_name,
              COALESCE(SUM(CASE WHEN p.status='Completed' THEN p.amount_paid ELSE 0 END),0) as paid_amount,
              (fs.amount - COALESCE(SUM(CASE WHEN p.status='Completed' THEN p.amount_paid ELSE 0 END),0)) as remaining
       FROM fee_structures fs
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       JOIN departments d ON fs.department_id = d.id
       JOIN students s ON s.department_id = fs.department_id
         AND s.academic_year_id = fs.academic_year_id AND s.batch = fs.batch
       LEFT JOIN payments p ON p.fee_structure_id = fs.id AND p.student_id = s.id
       WHERE s.id = ? AND fs.is_active = 1 GROUP BY fs.id`, [studentId]
    );
    return rows;
  }

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO fee_structures (academic_year_id, department_id, fee_category_id, batch, amount, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.academic_year_id, data.department_id, data.fee_category_id, data.batch, data.amount, data.due_date || null]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [], values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && ['amount','due_date','is_active'].includes(key)) {
        fields.push(`${key} = ?`); values.push(value);
      }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE fee_structures SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(`UPDATE fee_structures SET is_active = 0 WHERE id = ?`, [id]);
  }

  async getTotalFeeForStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(fs.amount), 0) as total FROM fee_structures fs
       JOIN students s ON s.department_id = fs.department_id
         AND s.academic_year_id = fs.academic_year_id AND s.batch = fs.batch
       WHERE s.id = ? AND fs.is_active = 1`, [studentId]
    );
    return rows[0].total;
  }
}

module.exports = new FeeStructureRepository();
