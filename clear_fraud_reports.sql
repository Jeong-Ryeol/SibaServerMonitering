-- fraud_reports 테이블 데이터 전체 삭제
-- 실행 방법: sudo mysql webapp_db < clear_fraud_reports.sql

DELETE FROM fraud_reports;

-- AUTO_INCREMENT 초기화
ALTER TABLE fraud_reports AUTO_INCREMENT = 1;

-- 삭제 후 레코드 수 확인
SELECT COUNT(*) as total_records FROM fraud_reports;
