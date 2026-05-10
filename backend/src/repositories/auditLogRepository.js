const { pool } = require('../config/db');

class AuditLogRepository {
  async create({ user_id, action, entity_type, entity_id, old_values, new_values, ip_address }) {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, action, entity_type, entity_id,
       old_values ? JSON.stringify(old_values) : null,
       new_values ? JSON.stringify(new_values) : null, ip_address || null]
    );
  }

  async findAll({ page=1, limit=20, offset=0, entity_type, user_id }) {
    let where = '1=1'; const params = [];
    if (entity_type) { where += ' AND a.entity_type = ?'; params.push(entity_type); }
    if (user_id) { where += ' AND a.user_id = ?'; params.push(user_id); }

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM audit_logs a WHERE ${where}`, params);
    const [rows] = await pool.query(
      `SELECT a.*, u.full_name as user_name, u.username
       FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id
       WHERE ${where} ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return { rows, total: countRows[0].total };
  }
}

module.exports = new AuditLogRepository();
