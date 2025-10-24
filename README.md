# FIVEN:FREEDOM - 사기 신고 데이터베이스 시스템

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

실시간 사기 신고 조회 및 관리 시스템으로, FiveM 게임 커뮤니티의 사기 피해를 방지하기 위한 웹 애플리케이션입니다.

---

## 📖 사용 방법

### 사용자 (일반 접속)

1. **사이트 접속**: `http://168.107.28.244:3000` 또는 로컬 환경 `http://localhost:3000`
2. **비밀번호 입력**: 초기 비밀번호는 `freedom2025` (관리자에게 문의하여 최신 비밀번호 확인)
3. **고유번호 조회**: 의심되는 사용자의 고유번호(unique_id)를 입력하여 사기 이력 조회
4. **공지사항 확인**: 하단에서 최신 공지사항 및 실시간 통계 확인
5. **사기 제보**: "사기 신고 제출" 버튼을 통해 피해 내역 제출 (관리자 승인 후 등록)

**실시간 업데이트**: 10초마다 자동으로 공지사항, 통계, 조회 결과가 갱신됩니다. 새로고침 불필요합니다.

### 관리자

1. **관리자 페이지 접속**: `http://168.107.28.244:3000/admin.html`
2. **관리자 비밀번호 입력**: 초기 비밀번호는 `admin2025`
3. **주요 기능**:
   - **사기 신고 관리**: 신고 데이터 등록/삭제
   - **제보 관리**: 사용자가 제출한 제보 승인/거부
   - **공지사항 관리**: 공지사항 등록/삭제
   - **비밀번호 변경**: 사이트 비밀번호 및 관리자 비밀번호 변경
   - **통계 관리**: 온라인 사용자 수 및 업데이트 날짜 수정

---

## 🎯 프로젝트 개요

이 프로젝트는 FiveM 게임 커뮤니티에서 발생하는 사기 행위를 데이터베이스화하여, 사용자들이 거래 전 상대방의 사기 이력을 조회할 수 있도록 하는 시스템입니다. 관리자는 제보된 사기 내역을 검증하고 등록하며, 사용자는 실시간으로 업데이트되는 정보를 확인할 수 있습니다.

### 핵심 기능

- 🔍 **고유번호 기반 사기 이력 조회**
- 📊 **실시간 통계 및 공지사항 자동 갱신** (10초 주기 폴링)
- 🔐 **세션 기반 인증** (24시간 지속)
- 👥 **2단계 권한 시스템** (일반 사용자 / 관리자)
- 📝 **사용자 제보 및 관리자 승인 워크플로우**
- 💰 **한국식 금액 표기** (억, 만원 단위 자동 변환)
- 📱 **반응형 웹 디자인**

---

## 🛠️ 기술 스택

### Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 18.x | JavaScript 런타임 환경 |
| **Express.js** | 4.18.2 | 웹 프레임워크 및 RESTful API 서버 |
| **MySQL2** | 3.6.5 | MySQL 데이터베이스 드라이버 (Promise 지원) |
| **Express-session** | 1.17.3 | 세션 관리 미들웨어 |
| **Body-parser** | 1.20.2 | HTTP 요청 본문 파싱 |
| **Dotenv** | 16.3.1 | 환경 변수 관리 |
| **PM2** | Latest | 프로덕션 프로세스 관리 |

### Frontend

| 기술 | 용도 |
|------|------|
| **Vanilla JavaScript** | DOM 조작 및 API 통신 (Fetch API) |
| **CSS3** | 반응형 레이아웃 및 애니메이션 (gradientShift, pulse, fadeIn 등) |
| **HTML5** | 시맨틱 마크업 |

### Database

| 기술 | 버전 | 용도 |
|------|------|------|
| **MySQL** | 8.0+ | 관계형 데이터베이스 |
| **UTF8MB4** | - | 한글 및 이모지 지원 문자 인코딩 |

### DevOps & Tools

| 기술 | 용도 |
|------|------|
| **Git** | 버전 관리 |
| **PM2** | 프로세스 모니터링 및 자동 재시작 |
| **Ubuntu Server** | 프로덕션 환경 (168.107.28.244:3000) |

---

## 📂 프로젝트 구조

```
SibaServerMonitering/
├── server.js                 # Express 서버 및 API 엔드포인트
├── database.sql             # MySQL 데이터베이스 스키마 및 초기 데이터
├── package.json             # NPM 의존성 정의
├── .env                     # 환경 변수 (DB 접속 정보, 세션 시크릿)
├── public/                  # 정적 파일 디렉토리
│   ├── index.html          # 사용자 메인 페이지
│   ├── admin.html          # 관리자 페이지
│   └── styles.css          # (선택사항) 추가 스타일시트
└── README.md               # 프로젝트 문서
```

---

## 🗄️ 데이터베이스 스키마

### ERD 개요

```
site_password ───┐
admin_password ──┤
site_stats ──────┤
announcements ───┤
tip_reports ─────┼─── webapp_db
fraud_reports ───┤
pending_reports ─┘
```

### 테이블 구조

#### 1. `fraud_reports` (사기 신고 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 신고 고유 ID |
| report_date | DATE | NOT NULL | 신고 날짜 |
| unique_id | INT | NOT NULL, INDEX | 사기꾼 고유번호 |
| amount | INT | NOT NULL | 피해 금액 |
| reason | TEXT | NOT NULL | 사기 사유 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 레코드 생성 시각 |

#### 2. `pending_reports` (승인 대기 제보 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 제보 고유 ID |
| reporter_unique_id | INT | NOT NULL | 제보자 고유번호 |
| reporter_nickname | VARCHAR(255) | NOT NULL | 제보자 닉네임 |
| discord_id | VARCHAR(255) | NOT NULL | 제보자 디스코드 ID |
| report_date | DATE | NOT NULL | 사기 발생 날짜 |
| fraudster_unique_id | INT | NOT NULL, INDEX | 사기꾼 고유번호 |
| amount | BIGINT | NOT NULL | 피해 금액 |
| reason | TEXT | NOT NULL | 사기 사유 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 제보 제출 시각 |

#### 3. `announcements` (공지사항 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 공지사항 ID |
| title | VARCHAR(255) | NOT NULL | 공지사항 제목 |
| content | TEXT | NOT NULL | 공지사항 내용 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 작성 시각 |

#### 4. `tip_reports` (제보 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 제보 ID |
| content | TEXT | NOT NULL | 제보 내용 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 제보 시각 |

#### 5. `site_password` (사이트 비밀번호 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 비밀번호 ID |
| password | VARCHAR(255) | NOT NULL | 사이트 접속 비밀번호 (평문) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 마지막 수정 시각 |

#### 6. `admin_password` (관리자 비밀번호 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 비밀번호 ID |
| password | VARCHAR(255) | NOT NULL | 관리자 비밀번호 (평문) |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 마지막 수정 시각 |

#### 7. `site_stats` (사이트 통계 테이블)

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 통계 ID |
| online_users | INT | NOT NULL, DEFAULT 400 | 온라인 사용자 수 |
| last_update_date | DATE | NOT NULL | 마지막 업데이트 날짜 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 마지막 수정 시각 |

---

## 🔌 API 명세

### 사용자 API

#### 1. 세션 확인
```http
GET /api/check-session
```
**Response:**
```json
{
  "authorized": true
}
```

#### 2. 사이트 비밀번호 확인
```http
POST /api/verify-site-password
Content-Type: application/json

{
  "password": "freedom2025"
}
```
**Response:**
```json
{
  "success": true
}
```

#### 3. 고유번호로 사기 신고 조회
```http
GET /api/fraud-reports/:uniqueId
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "report_date": "2025-10-20",
      "unique_id": 12345,
      "amount": 500000,
      "reason": "게임 아이템 거래 사기",
      "created_at": "2025-10-20T12:00:00.000Z"
    }
  ]
}
```

#### 4. 통계 정보 조회
```http
GET /api/stats
```
**Response:**
```json
{
  "onlineUsers": 400,
  "fraudCount": 25,
  "lastUpdate": "2025-10-25T00:00:00.000Z"
}
```

#### 5. 공지사항 조회
```http
GET /api/announcements
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "사이트 오픈",
      "content": "FIVEN:FREEDOM 사기 신고 시스템이 오픈되었습니다.",
      "created_at": "2025-10-20T12:00:00.000Z"
    }
  ]
}
```

#### 6. 사용자 제보 제출
```http
POST /api/submit-report
Content-Type: application/json

{
  "reporterUniqueId": 11111,
  "reporterNickname": "제보자닉네임",
  "discordId": "discord#1234",
  "reportDate": "2025-10-20",
  "fraudsterUniqueId": 99999,
  "amount": 1000000,
  "reason": "거래 후 먹튀"
}
```
**Response:**
```json
{
  "success": true,
  "message": "제보가 제출되었습니다. 관리자 승인 후 등록됩니다."
}
```

### 관리자 API

#### 1. 관리자 세션 확인
```http
GET /api/admin/check-session
```

#### 2. 관리자 비밀번호 확인
```http
POST /api/admin/verify-password
Content-Type: application/json

{
  "password": "admin2025"
}
```

#### 3. 사기 신고 등록
```http
POST /api/admin/fraud-reports
Content-Type: application/json

{
  "reportDate": "2025-10-20",
  "uniqueId": 12345,
  "amount": 500000,
  "reason": "거래 사기"
}
```

#### 4. 사기 신고 삭제
```http
DELETE /api/admin/fraud-reports/:id
```

#### 5. 모든 사기 신고 조회
```http
GET /api/admin/fraud-reports
```

#### 6. 대기 중인 제보 조회
```http
GET /api/admin/pending-reports
```

#### 7. 제보 승인
```http
POST /api/admin/approve-report/:id
```

#### 8. 제보 거부
```http
DELETE /api/admin/reject-report/:id
```

#### 9. 공지사항 등록
```http
POST /api/admin/announcements
Content-Type: application/json

{
  "title": "공지사항 제목",
  "content": "공지사항 내용"
}
```

#### 10. 공지사항 삭제
```http
DELETE /api/admin/announcements/:id
```

#### 11. 제보 등록 (관리자용)
```http
POST /api/admin/tip-reports
Content-Type: application/json

{
  "content": "제보 내용"
}
```

#### 12. 제보 조회
```http
GET /api/admin/tip-reports
```

#### 13. 제보 삭제
```http
DELETE /api/admin/tip-reports/:id
```

#### 14. 사이트 비밀번호 변경
```http
POST /api/admin/change-site-password
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

#### 15. 관리자 비밀번호 변경
```http
POST /api/admin/change-admin-password
Content-Type: application/json

{
  "newPassword": "newadminpass123"
}
```

#### 16. 통계 업데이트
```http
POST /api/admin/update-stats
Content-Type: application/json

{
  "onlineUsers": 450,
  "lastUpdateDate": "2025-10-25"
}
```

#### 17. 현재 통계 조회
```http
GET /api/admin/stats
```

---

## ⚙️ 시스템 아키텍처

### 클라이언트-서버 구조

```
┌─────────────────┐         HTTP/HTTPS          ┌─────────────────┐
│                 │ ◄─────────────────────────► │                 │
│  Web Browser    │      Fetch API Calls        │  Express Server │
│  (index.html /  │                             │  (server.js)    │
│   admin.html)   │                             │                 │
└─────────────────┘                             └────────┬────────┘
        │                                                │
        │ 10-second Polling                             │
        │ (Auto-refresh)                                │
        │                                                │
        │                                                ▼
        │                                        ┌──────────────┐
        │                                        │    MySQL     │
        │                                        │  Database    │
        │                                        │ (webapp_db)  │
        │                                        └──────────────┘
        │
        └─► Session Storage (24h)
```

### 데이터 흐름

1. **사용자 인증**:
   - 클라이언트 → POST `/api/verify-site-password` → 서버
   - 서버 → MySQL (비밀번호 검증)
   - 서버 → 세션 생성 (24시간 유효)
   - 서버 → 클라이언트 (success: true)

2. **사기 이력 조회**:
   - 클라이언트 → GET `/api/fraud-reports/:uniqueId` → 서버
   - 서버 → 세션 확인
   - 서버 → MySQL (SELECT WHERE unique_id = ?)
   - MySQL → 서버 (결과 반환)
   - 서버 → 클라이언트 (JSON 응답)

3. **실시간 업데이트**:
   - 클라이언트 → `setInterval(10000)` → 자동 API 호출
   - `/api/stats`, `/api/announcements` 주기적 폴링
   - 조회된 고유번호가 있을 경우 `/api/fraud-reports/:uniqueId` 재조회

4. **제보 워크플로우**:
   - 사용자 → POST `/api/submit-report` → `pending_reports` 테이블 삽입
   - 관리자 → GET `/api/admin/pending-reports` → 목록 확인
   - 관리자 → POST `/api/admin/approve-report/:id` → `fraud_reports` 테이블로 이동
   - 또는 DELETE `/api/admin/reject-report/:id` → 제보 삭제

---

## 🚀 설치 및 실행

### 1. 사전 요구사항

- Node.js 18.x 이상
- MySQL 8.0 이상
- npm 또는 yarn

### 2. 설치 단계

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/SibaServerMonitering.git
cd SibaServerMonitering

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 다음 정보 입력:
# DB_HOST=localhost
# DB_USER=your_db_user
# DB_PASSWORD=your_db_password
# DB_NAME=webapp_db
# SESSION_SECRET=your_session_secret_key
# PORT=3000

# 4. MySQL 데이터베이스 생성
mysql -u root -p
> CREATE DATABASE webapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> exit;

# 5. 데이터베이스 스키마 및 초기 데이터 삽입
mysql -u your_db_user -p webapp_db < database.sql

# 6. 개발 서버 실행
npm run dev

# 또는 프로덕션 서버 실행
npm start
```

### 3. PM2로 프로덕션 배포

```bash
# PM2 전역 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start server.js --name fiven-freedom

# PM2 프로세스 목록 확인
pm2 list

# 로그 확인
pm2 logs fiven-freedom

# 서버 재시작
pm2 restart fiven-freedom

# 서버 중지
pm2 stop fiven-freedom

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

### 4. 접속 확인

- 로컬: http://localhost:3000
- 외부: http://168.107.28.244:3000
- 관리자 페이지: http://168.107.28.244:3000/admin.html

---

## 🎨 주요 기능 구현 상세

### 1. 실시간 데이터 폴링

**파일**: `public/index.html`

```javascript
// 10초마다 자동 갱신
let lastSearchedId = null;

function startAutoRefresh() {
    setInterval(() => {
        loadStats();           // 통계 갱신
        loadAnnouncements();   // 공지사항 갱신

        // 조회 기록이 있으면 재조회
        if (lastSearchedId !== null) {
            searchFraudReports(lastSearchedId);
        }
    }, 10000); // 10초
}
```

### 2. 세션 지속성

**파일**: `server.js`

```javascript
// 세션 설정 (24시간 유효)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24시간
}));
```

**파일**: `public/index.html`

```javascript
// 페이지 로드 시 세션 확인
window.addEventListener('DOMContentLoaded', () => {
    checkSession(); // 세션이 있으면 자동 로그인
});

async function checkSession() {
    const response = await fetch('/api/check-session');
    const data = await response.json();
    if (data.authorized) {
        // 자동 로그인 처리
        showMainScreen();
    }
}
```

### 3. 한국식 금액 표기

**파일**: `public/index.html`, `public/admin.html`

```javascript
function convertAmountToKoreanUnit(amount) {
    const num = parseInt(amount);

    if (num >= 100000000) {        // 1억 이상
        return Math.floor(num / 100000000) + '억';
    } else if (num >= 10000) {     // 1만 이상
        return Math.floor(num / 10000) + '만원';
    } else if (num >= 1000) {      // 1천 이상
        return Math.floor(num / 1000) + '천원';
    } else {
        return num + '원';
    }
}
```

**예시**:
- 10,000,000,000 → "100억"
- 500,000 → "50만원"
- 1,200 → "1천원"

### 4. 관리자 인증 미들웨어

**파일**: `server.js`

```javascript
const requireAdmin = (req, res, next) => {
  if (!req.session.adminAuthorized) {
    return res.status(401).json({
      success: false,
      message: '관리자 인증이 필요합니다.'
    });
  }
  next();
};

// 사용 예시
app.post('/api/admin/fraud-reports', requireAdmin, (req, res) => {
  // 관리자만 접근 가능
});
```

### 5. SQL 인젝션 방지

**파일**: `server.js`

```javascript
// Prepared Statements 사용
db.query(
  'SELECT * FROM fraud_reports WHERE unique_id = ? ORDER BY report_date DESC',
  [uniqueId],  // 파라미터 바인딩
  (err, results) => {
    // 쿼리 실행
  }
);
```

---

## 🔒 보안 고려사항

### 현재 구현된 보안 기능

1. **세션 기반 인증**
   - Express-session을 통한 서버 사이드 세션 관리
   - 24시간 세션 타임아웃
   - httpOnly 쿠키 (기본값)

2. **SQL 인젝션 방지**
   - Prepared Statements 사용
   - 모든 사용자 입력값 파라미터 바인딩

3. **권한 분리**
   - 사용자 / 관리자 세션 분리
   - 관리자 전용 API 엔드포인트
   - requireAdmin 미들웨어를 통한 접근 제어

### 향후 개선 가능한 보안 사항

1. **비밀번호 해싱**
   - 현재: 평문 저장
   - 개선안: bcrypt, argon2 등을 사용한 해싱

2. **HTTPS 적용**
   - SSL/TLS 인증서 설치
   - Let's Encrypt를 통한 무료 인증서

3. **Rate Limiting**
   - express-rate-limit을 통한 API 요청 제한
   - 브루트포스 공격 방지

4. **CORS 설정**
   - 특정 도메인만 API 접근 허용

5. **입력값 검증**
   - Joi, express-validator 등을 통한 스키마 검증

6. **Content Security Policy (CSP)**
   - Helmet.js를 통한 보안 헤더 설정

---

## 📊 성능 최적화

### 데이터베이스 인덱싱

```sql
-- unique_id에 인덱스 생성 (조회 성능 향상)
INDEX idx_unique_id (unique_id)
INDEX idx_fraudster_id (fraudster_unique_id)
```

### 폴링 주기 최적화

- 현재: 10초 주기 (실시간성과 서버 부하 균형)
- 필요 시 조정 가능 (`setInterval` 값 변경)

### 쿼리 최적화

```javascript
// 최신 비밀번호만 조회 (전체 테이블 스캔 방지)
'SELECT password FROM site_password ORDER BY id DESC LIMIT 1'

// 최근 10개 공지사항만 조회
'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10'
```

---

## 🧪 테스트

### 수동 테스트 체크리스트

#### 사용자 기능
- [ ] 사이트 비밀번호 인증
- [ ] 고유번호 조회 (존재하는 ID)
- [ ] 고유번호 조회 (존재하지 않는 ID)
- [ ] 실시간 통계 갱신 (10초 대기)
- [ ] 공지사항 자동 갱신
- [ ] 제보 제출
- [ ] 세션 지속 (새로고침 후 로그인 유지)

#### 관리자 기능
- [ ] 관리자 비밀번호 인증
- [ ] 사기 신고 등록
- [ ] 사기 신고 삭제
- [ ] 대기 중인 제보 조회
- [ ] 제보 승인
- [ ] 제보 거부
- [ ] 공지사항 등록/삭제
- [ ] 비밀번호 변경 (사이트/관리자)
- [ ] 통계 업데이트

### API 테스트 (curl 예시)

```bash
# 세션 확인
curl -X GET http://localhost:3000/api/check-session

# 비밀번호 확인
curl -X POST http://localhost:3000/api/verify-site-password \
  -H "Content-Type: application/json" \
  -d '{"password":"freedom2025"}'

# 사기 이력 조회
curl -X GET http://localhost:3000/api/fraud-reports/12345

# 통계 조회
curl -X GET http://localhost:3000/api/stats
```

---

## 🐛 문제 해결 (Troubleshooting)

### 1. MySQL 연결 실패

**증상**: `MySQL 연결 실패: ECONNREFUSED` 오류

**해결**:
```bash
# MySQL 서비스 상태 확인
sudo systemctl status mysql

# MySQL 시작
sudo systemctl start mysql

# .env 파일의 DB 정보 확인
cat .env
```

### 2. 포트 충돌

**증상**: `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000`

**해결**:
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# 또는 PM2 프로세스 정리
pm2 delete all
```

### 3. 비밀번호 불일치

**증상**: 올바른 비밀번호를 입력해도 로그인 실패

**해결**:
```sql
-- MySQL에서 현재 비밀번호 확인
SELECT * FROM site_password ORDER BY id DESC LIMIT 1;

-- 비밀번호 재설정
UPDATE site_password SET password = 'freedom2025' WHERE id = 1;
```

### 4. 세션이 유지되지 않음

**증상**: 새로고침 시 다시 로그인 요구

**해결**:
- `.env` 파일에 `SESSION_SECRET` 설정 확인
- 브라우저 쿠키 설정 확인 (쿠키 차단 여부)
- 서버 재시작 후 세션 데이터 초기화 (정상 동작)

### 5. 데이터베이스 초기화

**전체 데이터 삭제 및 재설정**:
```sql
-- 모든 테이블 데이터 삭제
TRUNCATE TABLE fraud_reports;
TRUNCATE TABLE pending_reports;
TRUNCATE TABLE announcements;
TRUNCATE TABLE tip_reports;

-- 비밀번호 및 통계 재설정
DELETE FROM site_password WHERE id > 1;
DELETE FROM admin_password WHERE id > 1;
UPDATE site_password SET password = 'freedom2025' WHERE id = 1;
UPDATE admin_password SET password = 'admin2025' WHERE id = 1;

-- 기본 통계 삽입
INSERT INTO site_stats (online_users, last_update_date) VALUES (400, CURDATE());
```

---

## 📈 향후 개선 계획

### 단기 (1개월 내)
- [ ] 비밀번호 bcrypt 해싱 적용
- [ ] HTTPS 인증서 설치
- [ ] Rate limiting 적용
- [ ] 입력값 검증 강화

### 중기 (3개월 내)
- [ ] WebSocket을 통한 실시간 푸시 알림
- [ ] 페이지네이션 구현
- [ ] 검색 필터 기능 (날짜 범위, 금액 범위)
- [ ] CSV 내보내기 기능

### 장기 (6개월 내)
- [ ] Discord 봇 연동
- [ ] 관리자 권한 세분화 (슈퍼관리자 / 일반관리자)
- [ ] 이메일 알림 시스템
- [ ] 사용자 피드백 시스템

---

## 🙏 감사의 말

이 프로젝트는 FiveM 커뮤니티의 사기 피해를 줄이고자 시작되었습니다. 사용자 여러분의 적극적인 제보와 피드백이 시스템을 더욱 발전시킵니다.

**함께 만드는 안전한 게임 커뮤니티, FIVEN:FREEDOM**

---

## 📚 참고 자료

- [Express.js 공식 문서](https://expressjs.com/)
- [MySQL2 GitHub](https://github.com/sidorares/node-mysql2)
- [Express-session 문서](https://www.npmjs.com/package/express-session)
- [PM2 문서](https://pm2.keymetrics.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**마지막 업데이트**: 2025-10-25
