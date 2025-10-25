-- 광고 테이블 추가

USE webapp_db;

CREATE TABLE IF NOT EXISTS advertisements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_expires_at (expires_at)
);
