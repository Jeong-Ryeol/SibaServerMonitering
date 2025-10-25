-- 기존 테이블 삭제
DROP TABLE IF EXISTS fraud_reports;
DROP TABLE IF EXISTS pending_reports;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS tip_reports;
DROP TABLE IF EXISTS site_stats;
DROP TABLE IF EXISTS site_password;
DROP TABLE IF EXISTS admin_password;

-- fraud_reports 테이블 생성 (새 구조)
CREATE TABLE fraud_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_date DATE NOT NULL,
  unique_id INT NOT NULL,
  victim_id INT,
  victim_nickname VARCHAR(255),
  attacker_id INT,
  attacker_nickname VARCHAR(255),
  amount VARCHAR(255) NOT NULL,
  amount_type VARCHAR(20) DEFAULT 'money',
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- pending_reports 테이블 생성
CREATE TABLE pending_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_unique_id INT NOT NULL,
  reporter_nickname VARCHAR(255) NOT NULL,
  discord_id VARCHAR(255) NOT NULL,
  report_date DATE NOT NULL,
  fraudster_unique_id INT NOT NULL,
  amount VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- announcements 테이블 생성
CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tip_reports 테이블 생성
CREATE TABLE tip_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- site_stats 테이블 생성
CREATE TABLE site_stats (
  id INT PRIMARY KEY DEFAULT 1,
  online_users INT DEFAULT 400,
  last_update_date DATE DEFAULT (CURRENT_DATE)
);

-- site_password 테이블 생성
CREATE TABLE site_password (
  id INT PRIMARY KEY DEFAULT 1,
  password VARCHAR(255) NOT NULL
);

-- admin_password 테이블 생성
CREATE TABLE admin_password (
  id INT PRIMARY KEY DEFAULT 1,
  password VARCHAR(255) NOT NULL
);

-- 기본 데이터 삽입
INSERT INTO site_stats (id, online_users, last_update_date) VALUES (1, 400, CURDATE());
INSERT INTO site_password (id, password) VALUES (1, 'freedom2025');
INSERT INTO admin_password (id, password) VALUES (1, 'admin2025');

-- 샘플 공지사항 삽입
INSERT INTO announcements (title, content) VALUES
('서비스 오픈', 'FREEDOM 사기 전적 조회 서비스가 오픈되었습니다.'),
('이용 안내', '고유번호를 입력하시면 해당 유저의 사기 전적을 확인하실 수 있습니다.');
