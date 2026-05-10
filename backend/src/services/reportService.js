const { pool } = require('../config/db');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

class ReportService {
  async getMonthlyCollections(year, month) {
    let where = "p.status = 'Completed'"; const params = [];
    if (year) { where += ' AND YEAR(p.payment_date)=?'; params.push(year); }
    if (month) { where += ' AND MONTH(p.payment_date)=?'; params.push(month); }

    const [rows] = await pool.query(
      `SELECT DATE(p.payment_date) as date, p.payment_method,
              fc.name as fee_category, COUNT(*) as transactions,
              SUM(p.amount_paid) as total
       FROM payments p JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       WHERE ${where}
       GROUP BY DATE(p.payment_date), p.payment_method, fc.name
       ORDER BY date DESC`, params
    );
    return rows;
  }

  async getPendingFeesReport(filters = {}) {
    let where = 's.is_active=1 AND s.pending_balance>0'; const params = [];
    if (filters.department_id) { where += ' AND s.department_id=?'; params.push(filters.department_id); }
    if (filters.batch) { where += ' AND s.batch=?'; params.push(filters.batch); }

    const [rows] = await pool.query(
      `SELECT s.student_id, CONCAT(s.first_name,' ',s.last_name) as name,
              d.name as department, ay.year_label as academic_year, s.batch,
              s.total_fee, s.total_paid, s.total_discount, s.pending_balance
       FROM students s JOIN departments d ON s.department_id = d.id
       JOIN academic_years ay ON s.academic_year_id = ay.id
       WHERE ${where} ORDER BY s.pending_balance DESC`, params
    );
    return rows;
  }

  async getStudentPaymentHistory(studentId) {
    const [rows] = await pool.query(
      `SELECT p.id, p.amount_paid, p.payment_method, p.transaction_ref, p.status,
              p.payment_date, fc.name as fee_category, r.receipt_no
       FROM payments p JOIN fee_structures fs ON p.fee_structure_id = fs.id
       JOIN fee_categories fc ON fs.fee_category_id = fc.id
       LEFT JOIN receipts r ON r.payment_id = p.id
       WHERE p.student_id = ? ORDER BY p.payment_date DESC`, [studentId]
    );
    return rows;
  }

  async exportToExcel(data, sheetName = 'Report') {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  async exportToPDF(data, title, res) {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.pdf`);
    doc.pipe(res);

    doc.fontSize(16).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(8).font('Helvetica').text(`Generated: ${new Date().toLocaleString('en-IN')}`);
    doc.moveDown();

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const colWidth = (doc.page.width - 60) / headers.length;

      // Header row
      doc.font('Helvetica-Bold');
      headers.forEach((h, i) => {
        doc.text(h.replace(/_/g, ' ').toUpperCase(), 30 + i * colWidth, doc.y, { width: colWidth, continued: i < headers.length - 1 });
      });
      doc.moveDown();
      doc.font('Helvetica');

      // Data rows
      data.slice(0, 50).forEach(row => {
        headers.forEach((h, i) => {
          const val = row[h] != null ? String(row[h]) : '';
          doc.text(val.substring(0, 20), 30 + i * colWidth, doc.y, { width: colWidth, continued: i < headers.length - 1 });
        });
        doc.moveDown(0.5);
      });
    }

    doc.end();
  }
}

module.exports = new ReportService();
