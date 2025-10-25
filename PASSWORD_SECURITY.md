# 비밀번호 보안 강화 (bcrypt 해싱)

## 개요
사용자 및 관리자 비밀번호가 이제 bcrypt를 사용하여 안전하게 해시되어 저장됩니다.
데이터베이스가 해킹당하더라도 실제 비밀번호는 알 수 없습니다.

## 기본 비밀번호
- **사이트 비밀번호**: `freedom2025`
- **관리자 비밀번호**: `admin2025`

## 기존 데이터베이스 업데이트 방법

서버에 SSH로 접속한 후:

```bash
# MySQL 접속
mysql -u webapp_user -p webapp_db

# SQL 파일 실행
source /path/to/update_passwords.sql
```

또는 직접 쿼리 실행:

```sql
UPDATE site_password SET password = '$2b$10$QbeQYM3fZelfA59PgIj82e9LiMz.0BRetcWvhoS.RuQIAQxfAfkMi' WHERE id = 1;
UPDATE admin_password SET password = '$2b$10$IJlAg5UsEt.HlVgeCpc3iONDB4o4NPjI.mm99jlwwpWaScSn0D4q6' WHERE id = 1;
```

## 새 비밀번호 생성 방법

새로운 비밀번호를 설정하려면 관리자 페이지에서 비밀번호 변경 기능을 사용하세요.
새 비밀번호는 자동으로 bcrypt로 해싱되어 저장됩니다.

## 보안 이점

1. **일방향 암호화**: 비밀번호를 해시로 변환하면 원본을 복구할 수 없습니다
2. **Salt 추가**: bcrypt는 각 비밀번호에 고유한 salt를 추가하여 레인보우 테이블 공격을 방지합니다
3. **느린 해싱**: bcrypt는 의도적으로 느리게 설계되어 무차별 대입 공격을 어렵게 만듭니다

## 파일 설명

- `update_passwords.sql`: 기존 평문 비밀번호를 해시로 변환하는 SQL 스크립트
- `hash_passwords.js`: 새로운 비밀번호 해시를 생성하는 도구
- `reset_db.sql`: 업데이트됨 - 새 DB 생성 시 해시된 비밀번호 사용

## 주의사항

⚠️ **중요**: 비밀번호를 변경한 후에는 반드시 기억하세요!
해시된 비밀번호는 복구할 수 없으며, 잊어버린 경우 데이터베이스에서 직접 업데이트해야 합니다.
