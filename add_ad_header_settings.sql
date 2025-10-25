-- 광고 헤더 설정 테이블 추가

USE webapp_db;

CREATE TABLE IF NOT EXISTS ad_header_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255) NOT NULL,
    line3 VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 기본값 설정
INSERT INTO ad_header_settings (line1, line2, line3)
VALUES ('📋 파트너쉽 📋', '무장 담보대출', '문의 : 무장 (100)');
