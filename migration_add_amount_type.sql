-- 금액 타입 컬럼 추가 (금액/아이템 구분)
USE webapp_db;

-- amount_type이 이미 존재하면 수정, 없으면 추가
ALTER TABLE fraud_reports
MODIFY COLUMN amount_type ENUM('money', 'item', 'both') DEFAULT 'money';

-- 기존 데이터는 모두 'money'로 설정됨 (DEFAULT)
