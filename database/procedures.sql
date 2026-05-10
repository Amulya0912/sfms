-- =====================================================
-- SFMS Stored Procedures & Views — MySQL 8.0
-- =====================================================

USE sfms_db;

DELIMITER //

-- ---------------------
-- Stored Procedure: Monthly Revenue Report
-- ---------------------
CREATE PROCEDURE sp_get_monthly_revenue_report(
  IN p_year INT,
  IN p_month INT
)
BEGIN
  SELECT
    DATE(p.payment_date) AS payment_day,
    COUNT(p.id) AS total_transactions,
    SUM(p.amount_paid) AS total_collected,
    p.payment_method,
    fc.name AS fee_category
  FROM payments p
  JOIN fee_structures fs ON p.fee_structure_id = fs.id
  JOIN fee_categories fc ON fs.fee_category_id = fc.id
  WHERE p.status = 'Completed'
    AND YEAR(p.payment_date) = p_year
    AND MONTH(p.payment_date) = p_month
  GROUP BY DATE(p.payment_date), p.payment_method, fc.name
  ORDER BY payment_day ASC;
END //

-- ---------------------
-- Stored Procedure: Batch-wise Collection
-- ---------------------
CREATE PROCEDURE sp_get_batch_wise_collection(
  IN p_batch VARCHAR(20)
)
BEGIN
  SELECT
    d.name AS department,
    fc.name AS fee_category,
    SUM(fs.amount) AS total_fee,
    COALESCE(SUM(p.amount_paid), 0) AS total_collected,
    SUM(fs.amount) - COALESCE(SUM(p.amount_paid), 0) AS pending
  FROM fee_structures fs
  JOIN departments d ON fs.department_id = d.id
  JOIN fee_categories fc ON fs.fee_category_id = fc.id
  LEFT JOIN payments p ON p.fee_structure_id = fs.id AND p.status = 'Completed'
  WHERE fs.batch = p_batch
  GROUP BY d.name, fc.name
  ORDER BY d.name, fc.name;
END //

DELIMITER ;

-- ---------------------
-- View: Students with Pending Dues
-- ---------------------
CREATE OR REPLACE VIEW v_students_with_pending_dues AS
SELECT
  s.id,
  s.student_id,
  CONCAT(s.first_name, ' ', s.last_name) AS full_name,
  s.email,
  s.phone,
  d.name AS department,
  ay.year_label AS academic_year,
  s.batch,
  s.total_fee,
  s.total_paid,
  s.total_discount,
  s.pending_balance,
  CASE
    WHEN s.pending_balance <= 0 THEN 'Paid'
    WHEN s.pending_balance < s.total_fee * 0.5 THEN 'Partially Paid'
    ELSE 'Unpaid'
  END AS payment_status
FROM students s
JOIN departments d ON s.department_id = d.id
JOIN academic_years ay ON s.academic_year_id = ay.id
WHERE s.is_active = 1
  AND s.pending_balance > 0
ORDER BY s.pending_balance DESC;

-- ---------------------
-- View: Payment Summary
-- ---------------------
CREATE OR REPLACE VIEW v_payment_summary AS
SELECT
  p.id AS payment_id,
  p.amount_paid,
  p.payment_method,
  p.transaction_ref,
  p.status,
  p.payment_date,
  p.remarks,
  s.student_id,
  CONCAT(s.first_name, ' ', s.last_name) AS student_name,
  d.name AS department,
  fc.name AS fee_category,
  fs.amount AS structure_amount,
  r.receipt_no,
  u.full_name AS processed_by
FROM payments p
JOIN students s ON p.student_id = s.id
JOIN fee_structures fs ON p.fee_structure_id = fs.id
JOIN fee_categories fc ON fs.fee_category_id = fc.id
JOIN departments d ON s.department_id = d.id
LEFT JOIN receipts r ON r.payment_id = p.id
LEFT JOIN users u ON p.created_by = u.id
ORDER BY p.payment_date DESC;
