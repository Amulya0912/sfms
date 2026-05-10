-- =====================================================
-- SFMS Database Schema — MySQL 8.0
-- Student Fee Management System
-- =====================================================

CREATE DATABASE IF NOT EXISTS sfms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sfms_db;

-- ---------------------
-- 1. Roles
-- ---------------------
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------
-- 2. Users
-- ---------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  role_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  last_login TIMESTAMP NULL,
  refresh_token TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);

-- ---------------------
-- 3. Departments
-- ---------------------
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  head_of_dept VARCHAR(200),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------
-- 4. Academic Years
-- ---------------------
CREATE TABLE academic_years (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year_label VARCHAR(50) NOT NULL,
  batch_year VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_academic_year UNIQUE (year_label, batch_year)
) ENGINE=InnoDB;

-- ---------------------
-- 5. Students
-- ---------------------
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  department_id INT NOT NULL,
  academic_year_id INT NOT NULL,
  batch VARCHAR(20) NOT NULL,
  admission_date DATE NOT NULL,
  profile_picture VARCHAR(500),
  total_fee DECIMAL(12, 2) DEFAULT 0.00,
  total_paid DECIMAL(12, 2) DEFAULT 0.00,
  total_discount DECIMAL(12, 2) DEFAULT 0.00,
  pending_balance DECIMAL(12, 2) DEFAULT 0.00,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_students_acad FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_dept ON students(department_id);
CREATE INDEX idx_students_batch ON students(batch);
CREATE INDEX idx_students_user ON students(user_id);

-- ---------------------
-- 6. Fee Categories
-- ---------------------
CREATE TABLE fee_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description VARCHAR(500),
  is_mandatory TINYINT(1) DEFAULT 1,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------
-- 7. Fee Structures
-- ---------------------
CREATE TABLE fee_structures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  academic_year_id INT NOT NULL,
  department_id INT NOT NULL,
  fee_category_id INT NOT NULL,
  batch VARCHAR(20) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
  due_date DATE,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_fs_acad FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT,
  CONSTRAINT fk_fs_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_fs_cat FOREIGN KEY (fee_category_id) REFERENCES fee_categories(id) ON DELETE RESTRICT,
  CONSTRAINT uq_fee_structure UNIQUE (academic_year_id, department_id, fee_category_id, batch)
) ENGINE=InnoDB;

CREATE INDEX idx_fs_batch ON fee_structures(batch);
CREATE INDEX idx_fs_acad ON fee_structures(academic_year_id);

-- ---------------------
-- 8. Payments
-- ---------------------
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  fee_structure_id INT NOT NULL,
  amount_paid DECIMAL(12, 2) NOT NULL CHECK (amount_paid > 0),
  payment_method ENUM('Cash', 'UPI', 'Card', 'Bank Transfer') NOT NULL,
  transaction_ref VARCHAR(100),
  gateway_ref VARCHAR(100),
  status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_payments_fs FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE RESTRICT,
  CONSTRAINT fk_payments_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_fs ON payments(fee_structure_id);

-- ---------------------
-- 9. Scholarships
-- ---------------------
CREATE TABLE scholarships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  fee_category_id INT NULL,
  discount_type ENUM('Percentage', 'Amount') NOT NULL,
  discount_value DECIMAL(12, 2) NOT NULL CHECK (discount_value > 0),
  reason VARCHAR(500),
  academic_year_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_schol_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_schol_cat FOREIGN KEY (fee_category_id) REFERENCES fee_categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_schol_acad FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT,
  CONSTRAINT fk_schol_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_schol_student ON scholarships(student_id);

-- ---------------------
-- 10. Receipts
-- ---------------------
CREATE TABLE receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  receipt_no VARCHAR(50) NOT NULL UNIQUE,
  payment_id INT NOT NULL,
  student_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pdf_path VARCHAR(500),
  created_by INT,
  CONSTRAINT fk_receipts_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_receipts_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_receipts_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_receipts_no ON receipts(receipt_no);
CREATE INDEX idx_receipts_student ON receipts(student_id);

-- ---------------------
-- 11. Audit Logs
-- ---------------------
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
