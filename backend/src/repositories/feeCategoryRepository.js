const { pool } = require('../config/db');

class FeeCategoryRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT * FROM fee_categories WHERE is_active = 1 ORDER BY is_mandatory DESC, name`
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM fee_categories WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async create({ name, code, description, is_mandatory }) {
    const [result] = await pool.query(
      `INSERT INTO fee_categories (name, code, description, is_mandatory) VALUES (?, ?, ?, ?)`,
      [name, code, description || null, is_mandatory !== undefined ? is_mandatory : 1]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && ['name', 'code', 'description', 'is_mandatory', 'is_active'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE fee_categories SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id) {
    await pool.query(`UPDATE fee_categories SET is_active = 0 WHERE id = ?`, [id]);
  }
}

module.exports = new FeeCategoryRepository();
