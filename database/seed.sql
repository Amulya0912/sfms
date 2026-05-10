-- =====================================================
-- SFMS Seed Data — MySQL 8.0
-- Demo data for local development
-- =====================================================

USE sfms_db;

-- ---------------------
-- 1. Roles
-- ---------------------
INSERT INTO roles (name, description) VALUES
  ('super_admin', 'Full system access. Manage all users, roles, configurations, and analytics.'),
  ('accountant', 'Manage payments, generate receipts, view financial reports.'),
  ('staff', 'Register students, manage fee structures, assign batches, update scholarships.'),
  ('student', 'View personal profile, fee details, payment history, download receipts.');

-- ---------------------
-- 2. Departments
-- ---------------------
INSERT INTO departments (name, code, head_of_dept) VALUES
  ('Computer Science & Engineering', 'CSE', 'Dr. Ramesh Kumar'),
  ('Electronics & Communication Engineering', 'ECE', 'Dr. Priya Sharma'),
  ('Mechanical Engineering', 'ME', 'Dr. Anil Reddy'),
  ('Civil Engineering', 'CE', 'Dr. Kavitha Nair'),
  ('Electrical & Electronics Engineering', 'EEE', 'Dr. Suresh Babu');

-- ---------------------
-- 3. Academic Years
-- ---------------------
INSERT INTO academic_years (year_label, batch_year, start_date, end_date, is_current) VALUES
  ('PUC 1st Year', '2024-2025', '2024-06-01', '2025-05-31', 0),
  ('PUC 2nd Year', '2024-2025', '2024-06-01', '2025-05-31', 0),
  ('B.Tech 1st Year', '2024-2025', '2024-06-01', '2025-05-31', 1),
  ('B.Tech 2nd Year', '2024-2025', '2024-06-01', '2025-05-31', 1),
  ('B.Tech 3rd Year', '2024-2025', '2024-06-01', '2025-05-31', 1),
  ('B.Tech 4th Year', '2024-2025', '2024-06-01', '2025-05-31', 1);

-- ---------------------
-- 4. Users (passwords are bcrypt hash of 'password123')
-- $2a$10$... is the bcrypt hash for 'password123'
-- ---------------------
INSERT INTO users (username, email, password_hash, full_name, role_id) VALUES
  ('admin', 'admin@sfms.edu', '$2a$10$5Hz2BugyNM44OOX2S6QGG.r/gmAUQcwks22bo/Fj7LCfIBu2nmb8u', 'System Administrator', 1),
  ('accountant1', 'accountant@sfms.edu', '$2a$10$5Hz2BugyNM44OOX2S6QGG.r/gmAUQcwks22bo/Fj7LCfIBu2nmb8u', 'Ravi Shankar', 2),
  ('staff1', 'staff1@sfms.edu', '$2a$10$5Hz2BugyNM44OOX2S6QGG.r/gmAUQcwks22bo/Fj7LCfIBu2nmb8u', 'Meena Kumari', 3),
  ('staff2', 'staff2@sfms.edu', '$2a$10$5Hz2BugyNM44OOX2S6QGG.r/gmAUQcwks22bo/Fj7LCfIBu2nmb8u', 'Rajesh Verma', 3),
  ('student1', 'student1@sfms.edu', '$2a$10$5Hz2BugyNM44OOX2S6QGG.r/gmAUQcwks22bo/Fj7LCfIBu2nmb8u', 'Aarav Patel', 4),
  ('student2', 'student2@sfms.edu', '$2a$10$5Hz2BugyNM44OOX2S6QGG.r/gmAUQcwks22bo/Fj7LCfIBu2nmb8u', 'Sneha Reddy', 4);

-- ---------------------
-- 5. Fee Categories
-- ---------------------
INSERT INTO fee_categories (name, code, description, is_mandatory) VALUES
  ('Vidyalaya Trust Fee 1', 'VT1', 'Primary trust fee - Semester 1', 1),
  ('Vidyalaya Trust Fee 2', 'VT2', 'Primary trust fee - Semester 2', 1),
  ('Vidyalaya Trust Fee 3', 'VT3', 'Development fee', 1),
  ('Vidyalaya Trust Fee 4', 'VT4', 'Infrastructure fee', 1),
  ('Vidyalaya Special Fee', 'VS', 'Special institutional fee', 1),
  ('Hostel Fee', 'HOSTEL', 'Accommodation charges for hostellers', 0),
  ('Bus Fee', 'BUS', 'Transportation fee for bus commuters', 0),
  ('Library Fee', 'LIBRARY', 'Annual library membership and resources', 0),
  ('Examination Fee', 'EXAM', 'Per-semester examination charges', 1);

-- ---------------------
-- 6. Students
-- ---------------------
INSERT INTO students (student_id, user_id, first_name, last_name, email, phone, address, date_of_birth, gender, department_id, academic_year_id, batch, admission_date, total_fee, pending_balance) VALUES
  ('SFMS2024001', 5, 'Aarav', 'Patel', 'student1@sfms.edu', '9876543210', '123 Main Street, Hyderabad', '2005-03-15', 'Male', 1, 3, '2024', '2024-06-15', 125000.00, 125000.00),
  ('SFMS2024002', 6, 'Sneha', 'Reddy', 'student2@sfms.edu', '9876543211', '456 Park Avenue, Bangalore', '2005-07-22', 'Female', 2, 3, '2024', '2024-06-15', 125000.00, 125000.00),
  ('SFMS2024003', NULL, 'Vikram', 'Singh', 'vikram.singh@email.com', '9876543212', '789 Lake Road, Chennai', '2004-11-10', 'Male', 1, 4, '2023', '2023-06-20', 120000.00, 45000.00),
  ('SFMS2024004', NULL, 'Priya', 'Nair', 'priya.nair@email.com', '9876543213', '321 Hill View, Kochi', '2005-01-05', 'Female', 3, 3, '2024', '2024-06-15', 115000.00, 115000.00),
  ('SFMS2024005', NULL, 'Arjun', 'Mehta', 'arjun.mehta@email.com', '9876543214', '654 River Side, Pune', '2004-09-18', 'Male', 2, 5, '2022', '2022-06-18', 110000.00, 0.00);

-- ---------------------
-- 7. Fee Structures (B.Tech 1st Year, 2024 batch)
-- ---------------------
INSERT INTO fee_structures (academic_year_id, department_id, fee_category_id, batch, amount, due_date) VALUES
  -- CSE Department - B.Tech 1st Year
  (3, 1, 1, '2024', 25000.00, '2024-07-15'),
  (3, 1, 2, '2024', 25000.00, '2025-01-15'),
  (3, 1, 3, '2024', 15000.00, '2024-07-15'),
  (3, 1, 4, '2024', 20000.00, '2024-07-15'),
  (3, 1, 5, '2024', 10000.00, '2024-07-15'),
  (3, 1, 6, '2024', 15000.00, '2024-07-15'),
  (3, 1, 9, '2024', 5000.00, '2024-12-01'),
  -- ECE Department - B.Tech 1st Year
  (3, 2, 1, '2024', 22000.00, '2024-07-15'),
  (3, 2, 2, '2024', 22000.00, '2025-01-15'),
  (3, 2, 3, '2024', 14000.00, '2024-07-15'),
  (3, 2, 4, '2024', 18000.00, '2024-07-15'),
  (3, 2, 5, '2024', 9000.00, '2024-07-15'),
  (3, 2, 9, '2024', 5000.00, '2024-12-01'),
  -- ME Department - B.Tech 1st Year
  (3, 3, 1, '2024', 20000.00, '2024-07-15'),
  (3, 3, 2, '2024', 20000.00, '2025-01-15'),
  (3, 3, 3, '2024', 12000.00, '2024-07-15'),
  (3, 3, 4, '2024', 15000.00, '2024-07-15'),
  (3, 3, 5, '2024', 8000.00, '2024-07-15'),
  (3, 3, 9, '2024', 5000.00, '2024-12-01');

-- ---------------------
-- 8. Sample Payments
-- ---------------------
INSERT INTO payments (student_id, fee_structure_id, amount_paid, payment_method, transaction_ref, gateway_ref, status, payment_date, created_by) VALUES
  (3, 1, 25000.00, 'Bank Transfer', 'TXN20240701001', 'MOCK_1719820800000', 'Completed', '2024-07-01 10:30:00', 2),
  (3, 3, 15000.00, 'UPI', 'TXN20240715001', 'MOCK_1721030400000', 'Completed', '2024-07-15 14:00:00', 2),
  (3, 4, 20000.00, 'Cash', 'TXN20240720001', 'MOCK_1721462400000', 'Completed', '2024-07-20 11:00:00', 2),
  (3, 5, 10000.00, 'Card', 'TXN20240801001', 'MOCK_1722470400000', 'Completed', '2024-08-01 09:30:00', 2),
  (5, 8, 22000.00, 'Bank Transfer', 'TXN20240705001', 'MOCK_1720166400000', 'Completed', '2024-07-05 10:00:00', 2),
  (5, 10, 14000.00, 'UPI', 'TXN20240710001', 'MOCK_1720598400000', 'Completed', '2024-07-10 15:30:00', 2),
  (5, 11, 18000.00, 'Cash', 'TXN20240715002', 'MOCK_1721030400001', 'Completed', '2024-07-15 16:00:00', 2),
  (5, 12, 9000.00, 'Card', 'TXN20240801002', 'MOCK_1722470400001', 'Completed', '2024-08-01 12:00:00', 2),
  (5, 13, 5000.00, 'UPI', 'TXN20241201001', 'MOCK_1733011200000', 'Completed', '2024-12-01 10:00:00', 2),
  (5, 9, 22000.00, 'Bank Transfer', 'TXN20250115001', 'MOCK_1736899200000', 'Completed', '2025-01-15 11:00:00', 2);

-- ---------------------
-- 9. Scholarships
-- ---------------------
INSERT INTO scholarships (student_id, fee_category_id, discount_type, discount_value, reason, academic_year_id, created_by) VALUES
  (3, NULL, 'Amount', 5000.00, 'Merit scholarship - Top 10 in entrance exam', 4, 3),
  (5, 6, 'Percentage', 50.00, 'Sports quota - State level athlete', 5, 3);

-- ---------------------
-- 10. Receipts
-- ---------------------
INSERT INTO receipts (receipt_no, payment_id, student_id, amount, created_by) VALUES
  ('RCP-2024-000001', 1, 3, 25000.00, 2),
  ('RCP-2024-000002', 2, 3, 15000.00, 2),
  ('RCP-2024-000003', 3, 3, 20000.00, 2),
  ('RCP-2024-000004', 4, 3, 10000.00, 2),
  ('RCP-2024-000005', 5, 5, 22000.00, 2),
  ('RCP-2024-000006', 6, 5, 14000.00, 2);

-- ---------------------
-- 11. Update student balances based on seed payments
-- Note: Triggers handle this for new payments, but seed data
-- needs manual reconciliation since triggers fire per-row
-- ---------------------
UPDATE students SET
  total_paid = 70000.00,
  pending_balance = total_fee - 70000.00 - 5000.00,
  total_discount = 5000.00
WHERE id = 3;

UPDATE students SET
  total_paid = 90000.00,
  pending_balance = total_fee - 90000.00 - 0.00,
  total_discount = 0.00
WHERE id = 5;
