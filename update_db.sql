-- fraud_reports 테이블에 4개 컬럼 추가
ALTER TABLE fraud_reports
ADD COLUMN victim_id INT AFTER unique_id,
ADD COLUMN victim_nickname VARCHAR(255) AFTER victim_id,
ADD COLUMN attacker_id INT AFTER victim_nickname,
ADD COLUMN attacker_nickname VARCHAR(255) AFTER attacker_id;
