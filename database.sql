-- FIVEN:FREEDOM 데이터베이스 초기화 스크립트

USE webapp_db;

-- 사이트 접속 비밀번호 테이블
CREATE TABLE IF NOT EXISTS site_password (
    id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 관리자 비밀번호 테이블
CREATE TABLE IF NOT EXISTS admin_password (
    id INT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 사기 신고 테이블
CREATE TABLE IF NOT EXISTS fraud_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_date DATE NOT NULL,
    unique_id INT NOT NULL,
    amount INT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_unique_id (unique_id)
);

-- 제보 테이블
CREATE TABLE IF NOT EXISTS tip_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 비밀번호 삽입 (초기 설정)
INSERT INTO site_password (password) VALUES ('freedom2025');
INSERT INTO admin_password (password) VALUES ('admin2025');

-- 테스트 데이터 (선택사항)
INSERT INTO fraud_reports (report_date, unique_id, amount, reason) VALUES
('2025-10-20', 12345, 500000, '게임 아이템 거래 사기'),
('2025-10-21', 12345, 300000, '서버 부스팅 대금 미지급'),
('2025-10-22', 67890, 1000000, '계정 판매 후 환불 사기'),
('2025-10-23', 11111, 200000, '거래 중 먹튀');
