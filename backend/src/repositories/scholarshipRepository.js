const { pool } = require('../config/db');

class ScholarshipRepository {
  async findAll(filters = {}) {
    let where = 'sc.is_active = 1'; const params = [];
    if (filters.student_id) { where += ' AND sc.student_id = ?'; params.push(filters.student_id); }
    if (filters.academic_year_id) { where += ' AND sc.academic_year_id = ?'; params.push(filters.academic_year_id); }

    const [rows] = await pool.query(
      `SELECT sc.*, CONCAT(s.first_name,' ',s.last_name) as student_name, s.student_id as student_code,
              fc.name as fee_category_name, ay.year_label as academic_year, u.full_name as created_by_name
       FROM scholarships sc JOIN students s ON sc.student_id = s.id
       LEFT JOIN fee_categories fc ON sc.fee_category_id = fc.id
       JOIN academic_years ay ON sc.academic_year_id = ay.id
       LEFT JOIN users u ON sc.created_by = u.id WHERE ${where} ORDER BY sc.created_at DESC`, params
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT sc.*, CONCAT(s.first_name,' ',s.last_name) as student_name, s.student_id as student_code,
              fc.name as fee_category_name, ay.year_label as academic_year
       FROM scholarships sc JOIN students s ON sc.student_id = s.id
       LEFT JOIN fee_categories fc ON sc.fee_category_id = fc.id
       JOIN academic_years ay ON sc.academic_year_id = ay.id WHERE sc.id = ?`, [id]
    );
    return rows[0] || null;
  }

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO scholarships (student_id, fee_category_id, discount_type, discount_value, reason, academic_year_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.student_id, data.fee_category_id || null, data.discount_type, data.discount_value,
       data.reason || null, data.academic_year_id, data.created_by || null]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [], values = [];
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined && ['discount_type','discount_value','reason','fee_category_id','is_active'].includes(k)) {
        fields.push(`${k} = ?`); values.push(v);
      }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE scholarships SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id) { await pool.query(`UPDATE scholarships SET is_active = 0 WHERE id = ?`, [id]); }

  async getTotalDiscountForStudent(studentId) {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(CASE WHEN discount_type='Amount' THEN discount_value ELSE 0 END),0) as total_amount,
              COALESCE(SUM(CASE WHEN discount_type='Percentage' THEN discount_value ELSE 0 END),0) as total_pct
       FROM scholarships WHERE student_id = ? AND is_active = 1`, [studentId]
    );
    return rows[0];
  }
}

module.exports = new ScholarshipRepository();
