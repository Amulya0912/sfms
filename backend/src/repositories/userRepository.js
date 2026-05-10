const { pool } = require('../config/db');

/**
 * User Repository — Raw SQL queries for users table
 */
class UserRepository {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.is_active, u.last_login, u.created_at,
              r.name as role, r.id as role_id
       FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC`
    );
    return rows;
  }

  async findAllRoles() {
    const [rows] = await pool.query(`SELECT id, name, description FROM roles ORDER BY id`);
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.password_hash, u.is_active,
              u.last_login, u.refresh_token, u.created_at, u.updated_at,
              r.name as role, r.id as role_id
       FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findByUsername(username) {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.password_hash, u.is_active,
              u.refresh_token, r.name as role, r.id as role_id
       FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = ?`,
      [username]
    );
    return rows[0] || null;
  }

  async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, r.name as role
       FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  async create({ username, email, password_hash, full_name, role_id }) {
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, role_id) VALUES (?, ?, ?, ?, ?)`,
      [username, email, password_hash, full_name, role_id]
    );
    return { id: result.insertId, username, email, full_name, role_id };
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && !['id', 'created_at'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    if (fields.length === 0) return null;
    values.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async updateRefreshToken(id, refreshToken) {
    await pool.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, [refreshToken, id]);
  }

  async updateLastLogin(id) {
    await pool.query(`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
  }

  async delete(id) {
    await pool.query(`UPDATE users SET is_active = 0 WHERE id = ?`, [id]);
  }

  async count() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM users WHERE is_active = 1`);
    return rows[0].total;
  }
}

module.exports = new UserRepository();
