-- 기존 평문 비밀번호를 bcrypt 해시로 변환
-- 사이트 비밀번호: freedom2025
-- 관리자 비밀번호: admin2025

UPDATE site_password SET password = '$2b$10$QbeQYM3fZelfA59PgIj82e9LiMz.0BRetcWvhoS.RuQIAQxfAfkMi' WHERE id = 1;
UPDATE admin_password SET password = '$2b$10$IJlAg5UsEt.HlVgeCpc3iONDB4o4NPjI.mm99jlwwpWaScSn0D4q6' WHERE id = 1;

-- 확인
SELECT 'site_password' as table_name, password FROM site_password WHERE id = 1
UNION ALL
SELECT 'admin_password' as table_name, password FROM admin_password WHERE id = 1;
