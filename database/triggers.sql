-- =====================================================
-- SFMS Triggers — MySQL 8.0
-- =====================================================

USE sfms_db;

DELIMITER //

-- ---------------------
-- Trigger: After Payment INSERT — Update student pending balance
-- ---------------------
CREATE TRIGGER trg_after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Completed' THEN
    UPDATE students
    SET total_paid = total_paid + NEW.amount_paid,
        pending_balance = total_fee - (total_paid + NEW.amount_paid) - total_discount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.student_id;
  END IF;
END //

-- ---------------------
-- Trigger: After Payment UPDATE — Recalculate on status changes
-- ---------------------
CREATE TRIGGER trg_after_payment_update
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
  -- If payment was just completed (status changed to Completed)
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    UPDATE students
    SET total_paid = total_paid + NEW.amount_paid,
        pending_balance = total_fee - (total_paid + NEW.amount_paid) - total_discount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.student_id;
  END IF;

  -- If payment was refunded (status changed to Refunded from Completed)
  IF NEW.status = 'Refunded' AND OLD.status = 'Completed' THEN
    UPDATE students
    SET total_paid = total_paid - OLD.amount_paid,
        pending_balance = total_fee - (total_paid - OLD.amount_paid) - total_discount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.student_id;
  END IF;

  -- If payment failed after being completed
  IF NEW.status = 'Failed' AND OLD.status = 'Completed' THEN
    UPDATE students
    SET total_paid = total_paid - OLD.amount_paid,
        pending_balance = total_fee - (total_paid - OLD.amount_paid) - total_discount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.student_id;
  END IF;
END //

-- ---------------------
-- Trigger: Audit log on user changes
-- ---------------------
CREATE TRIGGER trg_audit_user_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (
    NEW.id,
    'UPDATE',
    'users',
    NEW.id,
    JSON_OBJECT(
      'username', OLD.username,
      'email', OLD.email,
      'full_name', OLD.full_name,
      'role_id', OLD.role_id,
      'is_active', OLD.is_active
    ),
    JSON_OBJECT(
      'username', NEW.username,
      'email', NEW.email,
      'full_name', NEW.full_name,
      'role_id', NEW.role_id,
      'is_active', NEW.is_active
    )
  );
END //

DELIMITER ;
