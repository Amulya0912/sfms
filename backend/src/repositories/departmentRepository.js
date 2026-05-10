const { pool } = require('../config/db');

class DepartmentRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT d.*, COUNT(s.id) as student_count
       FROM departments d LEFT JOIN students s ON d.id = s.department_id AND s.is_active = 1
       WHERE d.is_active = 1 GROUP BY d.id ORDER BY d.name`
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM departments WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async create({ name, code, head_of_dept }) {
    const [result] = await pool.query(
      `INSERT INTO departments (name, code, head_of_dept) VALUES (?, ?, ?)`,
      [name, code, head_of_dept || null]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && ['name', 'code', 'head_of_dept', 'is_active'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE departments SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(`UPDATE departments SET is_active = 0 WHERE id = ?`, [id]);
  }
}

module.exports = new DepartmentRepository();
