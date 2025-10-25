-- 금액 타입 컬럼 추가 (금액/아이템 구분)
USE webapp_db;

ALTER TABLE fraud_reports
ADD COLUMN amount_type ENUM('money', 'item') DEFAULT 'money' AFTER amount;

-- 기존 데이터는 모두 'money'로 설정됨 (DEFAULT)
