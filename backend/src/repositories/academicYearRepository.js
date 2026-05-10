const { pool } = require('../config/db');

class AcademicYearRepository {
  async findAll() {
    const [rows] = await pool.query(`SELECT * FROM academic_years ORDER BY batch_year DESC, year_label`);
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM academic_years WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async findCurrent() {
    const [rows] = await pool.query(`SELECT * FROM academic_years WHERE is_current = 1`);
    return rows;
  }

  async create({ year_label, batch_year, start_date, end_date, is_current }) {
    const [result] = await pool.query(
      `INSERT INTO academic_years (year_label, batch_year, start_date, end_date, is_current) VALUES (?, ?, ?, ?, ?)`,
      [year_label, batch_year, start_date, end_date, is_current || 0]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && ['year_label', 'batch_year', 'start_date', 'end_date', 'is_current'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE academic_years SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(`DELETE FROM academic_years WHERE id = ?`, [id]);
  }
}

module.exports = new AcademicYearRepository();
