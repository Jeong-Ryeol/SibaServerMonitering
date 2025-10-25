# FIVEN:FREEDOM - 사기 신고 데이터베이스 시스템

![Node.js](https://img.shields.io/badge/Node.js-18.x-43853d?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

> **프로덕션 운영 중** | FiveM 게임 커뮤니티를 위한 실시간 사기 전적 조회 및 관리 시스템

Oracle Cloud 인프라 기반 프로덕션 환경에서 실제 운영 중인 풀스택 웹 애플리케이션입니다.
Node.js/Express 백엔드, Vanilla JavaScript 프론트엔드, MySQL 데이터베이스를 활용하여 사기 피해 방지 솔루션을 제공합니다.

---

## 📑 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [데이터베이스 설계](#️-데이터베이스-설계)
- [API 명세](#-api-명세)
- [보안 구현](#-보안-구현)
- [설치 및 실행](#-설치-및-실행)
- [핵심 기술 구현](#-핵심-기술-구현)
- [프로젝트 통계](#-프로젝트-통계)
- [트러블슈팅](#-트러블슈팅)

---

## 🎯 프로젝트 개요

### 비즈니스 문제

FiveM 게임 커뮤니티 내에서 아이템/금전 거래 시 사기 피해가 빈번하게 발생하지만, 사기꾼의 전적을 조회할 수 있는 중앙화된 시스템이 부재했습니다.

### 솔루션

- **실시간 블랙리스트 조회**: 사용자 고유번호로 사기 전적 즉시 확인
- **관리자 검증 시스템**: 허위 신고 방지를 위한 2단계 승인 프로세스
- **커뮤니티 참여**: 사용자 직접 제보 → 관리자 검토 → 등록 워크플로우
- **한국어 최적화**: 억/만원 단위 자동 변환, 완전 한글 인터페이스

### 프로덕션 환경

- **서버**: Oracle Cloud Infrastructure (Seoul Region)
- **IP**: `168.107.28.244:3000`
- **프로세스 관리**: PM2 (자동 재시작, 무중단 배포)
- **데이터베이스**: MySQL 8.0+ (UTF8MB4 인코딩)
- **배포 전략**: Git → SSH Pull → PM2 Reload

---

## ✨ 주요 기능

### 사용자 기능

| 기능 | 설명 | 기술 구현 |
|------|------|-----------|
| 🔍 **사기 전적 조회** | 고유번호로 즉시 조회, 피해자/가해자 구분 표시 | RESTful API + MySQL 인덱싱 |
| 🎨 **이스터에그** | 개발자/관리자 ID 조회 시 특별 애니메이션 | CSS 키프레임 애니메이션 (15+ effects) |
| 📊 **실시간 통계** | 온라인 유저 수, 전체 사기 건수 자동 갱신 | 10초 주기 폴링 (setInterval) |
| 📢 **공지사항** | 최신 10개 공지사항 실시간 업데이트 | LIMIT 10 + ORDER BY created_at DESC |
| 📝 **사기 제보** | Discord ID 포함 피해 내역 제출 | pending_reports 테이블 + 승인 워크플로우 |
| 💰 **금액 표기** | "50만원", "1억" 한국식 단위 자동 변환 | JavaScript 숫자 변환 알고리즘 |
| 🔐 **세션 유지** | 자정까지 로그인 상태 유지 | 동적 세션 만료 (getMillisecondsUntilMidnight) |

### 관리자 기능

| 기능 | 설명 | 기술 구현 |
|------|------|-----------|
| ✅ **제보 승인/거부** | 사용자 제보 검토 후 블랙리스트 등록 | Transaction + INSERT/DELETE |
| 🗃️ **사기 전적 관리** | 피해자/가해자 정보, 금액/아이템 구분 등록 | 4-field format (victim/attacker separation) |
| 🔄 **일괄 ID 변경** | 특정 ID의 모든 전적을 새 ID로 마이그레이션 | Bulk UPDATE with CASE statements |
| 🔑 **비밀번호 관리** | 사이트/관리자 비밀번호 변경 | bcrypt 해싱 (10 rounds) |
| 📈 **통계 수정** | 온라인 유저 수 수동 조정 | Singleton pattern (id=1) |
| 👥 **세션 추적** | 현재 로그인한 관리자 수 표시 | Map-based session tracking + 30s cleanup |

---

## 🛠️ 기술 스택

### Backend

| 기술 | 버전 | 역할 | 선택 이유 |
|------|------|------|-----------|
| **Node.js** | 18.x | JavaScript 런타임 | 비동기 I/O 처리, 풍부한 생태계 |
| **Express.js** | 4.18.2 | 웹 프레임워크 | 미들웨어 기반 라우팅, RESTful API 구현 용이 |
| **MySQL2** | 3.6.5 | 데이터베이스 드라이버 | Promise/Async-Await 지원, Prepared Statements |
| **bcrypt** | 6.0.0 | 비밀번호 해싱 | 산업 표준 암호화, Salt 자동 생성 |
| **express-session** | 1.17.3 | 세션 관리 | 서버 사이드 세션, 쿠키 기반 인증 |
| **dotenv** | 16.3.1 | 환경 변수 관리 | 민감 정보 분리, .env 파일 지원 |

### Frontend

| 기술 | 용도 | 특징 |
|------|------|------|
| **Vanilla JavaScript (ES6+)** | DOM 조작, API 통신 | 프레임워크 없이 순수 JS로 구현 (번들링 불필요) |
| **CSS3** | 스타일링, 애니메이션 | 15+ 키프레임 애니메이션, Glass Morphism, Gradient |
| **Fetch API** | 비동기 HTTP 요청 | async/await 패턴, JSON 자동 파싱 |
| **HTML5** | 시맨틱 마크업 | 접근성 고려, SEO 최적화 |

### Database

| 기술 | 설정 | 목적 |
|------|------|------|
| **MySQL** | 8.0+ | 트랜잭션, ACID 보장, 관계형 데이터 관리 |
| **UTF8MB4** | 문자 인코딩 | 한글, 이모지 완벽 지원 |
| **Indexes** | unique_id, attacker_id | 조회 성능 최적화 (O(log n)) |

### DevOps

| 도구 | 용도 | 설정 |
|------|------|------|
| **PM2** | 프로세스 관리 | Auto-restart, Log rotation, Cluster mode 지원 |
| **Git/GitHub** | 버전 관리 | 브랜치 전략: main (production) |
| **Ubuntu Server** | 운영 환경 | Oracle Cloud, 20.04 LTS |
| **nodemon** | 개발 환경 | 파일 변경 감지, 자동 재시작 |

---

## 🏗 시스템 아키텍처

### 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────┐              ┌───────────────────┐    │
│  │   index.html     │              │   admin.html      │    │
│  │  (Public User)   │              │  (Admin Panel)    │    │
│  │                  │              │                   │    │
│  │ • 10s Polling    │              │ • 2min Timeout    │    │
│  │ • Session: 24h   │              │ • Bulk Update     │    │
│  │ • Easter Eggs    │              │ • Approval Flow   │    │
│  └────────┬─────────┘              └─────────┬─────────┘    │
│           │                                  │              │
│           └──────────────┬───────────────────┘              │
└────────────────────────────────────────────────────────────┬─┘
                           │ Fetch API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               Express.js Server (server.js)         │    │
│  │                                                      │    │
│  │  Middleware Chain:                                   │    │
│  │  1. express-session  → Session Management            │    │
│  │  2. body-parser      → JSON Parsing                  │    │
│  │  3. requireAdmin     → Authorization Check           │    │
│  │                                                      │    │
│  │  API Routes:                                         │    │
│  │  • Public:  8 endpoints  (GET/POST)                  │    │
│  │  • Admin:  19 endpoints  (GET/POST/DELETE)           │    │
│  │                                                      │    │
│  │  Session Logic:                                      │    │
│  │  • User:  Expires at midnight (dynamic maxAge)       │    │
│  │  • Admin: 2-minute inactivity timeout                │    │
│  └──────────────────────────┬───────────────────────────┘    │
└────────────────────────────────────────────────────────────┬─┘
                               │ mysql2 (Prepared Statements)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │             MySQL Database (webapp_db)              │    │
│  │                                                      │    │
│  │  Tables (7):                                         │    │
│  │  ├─ fraud_reports      → Main blacklist (indexed)    │    │
│  │  ├─ pending_reports    → Approval queue              │    │
│  │  ├─ announcements      → Public notices              │    │
│  │  ├─ tip_reports        → Admin tips                  │    │
│  │  ├─ site_password      → bcrypt hashed               │    │
│  │  ├─ admin_password     → bcrypt hashed               │    │
│  │  └─ site_stats         → Singleton (id=1)            │    │
│  │                                                      │    │
│  │  Indexes: unique_id, attacker_id (B-Tree)            │    │
│  │  Encoding: UTF8MB4 (이모지 지원)                      │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 데이터 흐름 (사기 전적 조회 예시)

```
1. User Input (uniqueId: 12345)
   └─→ searchFraudReports(12345)
       └─→ fetch('/api/fraud-reports/12345')
           └─→ Express Route Handler
               └─→ Session Validation (req.session.siteAuthorized)
                   └─→ MySQL Query: SELECT * FROM fraud_reports
                                     WHERE attacker_id = ?
                                     ORDER BY report_date DESC
                       └─→ Results (Array of fraud cases)
                           └─→ JSON Response { success: true, data: [...] }
                               └─→ Client Rendering (HTML + Korean formatting)
                                   └─→ Display: "피해금액: 50만원"
```

---

## 🗄️ 데이터베이스 설계

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐         ┌──────────────────┐
│ site_password   │         │ admin_password   │
│─────────────────│         │──────────────────│
│ PK id           │         │ PK id            │
│    password     │         │    password      │
│    (bcrypt)     │         │    (bcrypt)      │
└─────────────────┘         └──────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌──────────────────────────────────────────────────┐
│               Authentication Layer                │
└──────────────────────────────────────────────────┘

┌─────────────────────────┐
│    pending_reports      │    User Submission
│─────────────────────────│         │
│ PK id                   │         │ POST /api/submit-report
│    reporter_unique_id   │         ▼
│    reporter_nickname    │    ┌─────────┐
│    discord_id           │    │ Pending │
│    report_date          │    │  Queue  │
│    fraudster_unique_id  │    └────┬────┘
│    amount (BIGINT)      │         │
│    reason (TEXT)        │         │ Admin Review
│    created_at           │         │
└─────────────────────────┘         │
        │                            │
        │ Approve                   │ Reject
        ▼                            ▼
┌─────────────────────────┐    [DELETE]
│    fraud_reports        │
│─────────────────────────│
│ PK id                   │    Main Blacklist
│    report_date          │         │
│    unique_id (INDEX)    │         │
│    victim_id            │         │ GET /api/fraud-reports/:id
│    victim_nickname      │         ▼
│    attacker_id (INDEX)  │    [Public Query]
│    attacker_nickname    │
│    amount (VARCHAR)     │    Supports:
│    amount_type (ENUM)   │    • money
│    reason (TEXT)        │    • item
│    created_at           │    • both (mixed)
└─────────────────────────┘

┌─────────────────┐         ┌──────────────────┐
│ announcements   │         │   tip_reports    │
│─────────────────│         │──────────────────│
│ PK id           │         │ PK id            │
│    title        │         │    content       │
│    content      │         │    created_at    │
│    created_at   │         │                  │
└─────────────────┘         └──────────────────┘
        │                            │
        │ LIMIT 10                  │ Admin Only
        ▼                            ▼
[Public Display]            [Internal Notes]

┌─────────────────┐
│   site_stats    │    Singleton Pattern
│─────────────────│
│ PK id (=1)      │
│    online_users │    Manual Update by Admin
│    last_update  │
└─────────────────┘
```

### 주요 테이블 설명

#### 1. fraud_reports (사기 전적 블랙리스트)

```sql
CREATE TABLE fraud_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_date DATE NOT NULL,
  unique_id INT NOT NULL,                    -- Legacy field (keep for compatibility)
  victim_id INT,                             -- 피해자 ID
  victim_nickname VARCHAR(255),              -- 피해자 닉네임
  attacker_id INT,                           -- 가해자 ID (사기꾼)
  attacker_nickname VARCHAR(255),            -- 가해자 닉네임
  amount VARCHAR(255) NOT NULL,              -- 피해 금액/아이템 (유연한 VARCHAR)
  amount_type VARCHAR(20) DEFAULT 'money',   -- ENUM: 'money', 'item', 'both'
  reason TEXT NOT NULL,                      -- 사기 사유
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_unique_id (unique_id),           -- 빠른 조회를 위한 인덱스
  INDEX idx_attacker_id (attacker_id)        -- 가해자 검색 최적화
);
```

**설계 포인트**:
- `amount`를 VARCHAR로 변경: "500,000 + 람보르기니" 같은 복합 정보 저장 가능
- `amount_type` ENUM: 금액/아이템/둘 다 구분
- 피해자/가해자 분리: 향후 분석 기능 확장 가능 (재범자 추적 등)

#### 2. pending_reports (승인 대기 큐)

```sql
CREATE TABLE pending_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_unique_id INT NOT NULL,           -- 제보자 ID
  reporter_nickname VARCHAR(255) NOT NULL,   -- 제보자 닉네임
  discord_id VARCHAR(255) NOT NULL,          -- 제보자 Discord ID (연락용)
  report_date DATE NOT NULL,                 -- 사기 발생 날짜
  fraudster_unique_id INT NOT NULL,          -- 사기꾼 ID
  amount BIGINT NOT NULL,                    -- 피해 금액 (숫자만)
  reason TEXT NOT NULL,                      -- 사기 사유
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**워크플로우**:
1. 사용자가 `/api/submit-report`로 제보
2. `pending_reports`에 INSERT
3. 관리자가 `/api/admin/pending-reports`에서 확인
4. 승인 → `fraud_reports`로 이동, 거부 → DELETE

#### 3. site_password / admin_password

```sql
CREATE TABLE site_password (
  id INT PRIMARY KEY DEFAULT 1,
  password VARCHAR(255) NOT NULL              -- bcrypt 해시 ($2b$10$...)
);
```

**보안 강화**:
- 평문 저장 → bcrypt 해싱 마이그레이션 완료
- Salt 자동 생성 (10 rounds)
- Rainbow Table 공격 방지

---

## 🔌 API 명세

### Public API (8 endpoints)

| Method | Endpoint | 인증 | 설명 | Request Body | Response |
|--------|----------|------|------|--------------|----------|
| GET | `/api/check-session` | ❌ | 세션 유효성 확인 | - | `{ authorized: true/false }` |
| POST | `/api/verify-site-password` | ❌ | 사용자 로그인 | `{ password }` | `{ success: true }` |
| GET | `/api/fraud-reports/:uniqueId` | ✅ | 사기 전적 조회 | - | `{ success: true, data: [...] }` |
| GET | `/api/stats` | ✅ | 통계 정보 | - | `{ onlineUsers, fraudCount, lastUpdate }` |
| GET | `/api/announcements` | ✅ | 공지사항 목록 | - | `{ success: true, data: [...] }` |
| POST | `/api/submit-report` | ✅ | 사기 제보 제출 | `{ reporterUniqueId, discordId, ... }` | `{ success: true, message }` |

### Admin API (19 endpoints)

<details>
<summary><b>펼쳐보기 (19개 엔드포인트)</b></summary>

| Method | Endpoint | 기능 | Request Body |
|--------|----------|------|--------------|
| GET | `/api/admin/check-session` | 관리자 세션 확인 | - |
| POST | `/api/admin/verify-password` | 관리자 로그인 | `{ password }` |
| POST | `/api/admin/logout` | 로그아웃 | - |
| **Fraud Management** |
| POST | `/api/admin/fraud-reports` | 사기 전적 등록 | `{ reportDate, victimId, attackerId, amount, amountType, reason }` |
| GET | `/api/admin/fraud-reports` | 전체 전적 조회 | - |
| DELETE | `/api/admin/fraud-reports/:id` | 전적 삭제 | - |
| POST | `/api/admin/bulk-update-id` | ID 일괄 변경 | `{ oldId, newId }` |
| **Pending Reports** |
| GET | `/api/admin/pending-reports` | 대기 중 제보 목록 | - |
| POST | `/api/admin/approve-report/:id` | 제보 승인 | - |
| DELETE | `/api/admin/reject-report/:id` | 제보 거부 | - |
| **Announcements** |
| POST | `/api/admin/announcements` | 공지사항 등록 | `{ title, content }` |
| DELETE | `/api/admin/announcements/:id` | 공지사항 삭제 | - |
| **Tips** |
| POST | `/api/admin/tip-reports` | 제보 등록 | `{ content }` |
| GET | `/api/admin/tip-reports` | 제보 목록 | - |
| DELETE | `/api/admin/tip-reports/:id` | 제보 삭제 | - |
| **Settings** |
| POST | `/api/admin/change-site-password` | 사이트 비밀번호 변경 | `{ newPassword }` |
| POST | `/api/admin/change-admin-password` | 관리자 비밀번호 변경 | `{ newPassword }` |
| POST | `/api/admin/update-stats` | 통계 업데이트 | `{ onlineUsers, lastUpdateDate }` |
| GET | `/api/admin/active-admins` | 현재 로그인 관리자 수 | - |

</details>

---

## 🔒 보안 구현

### 1. 비밀번호 보안 (Bcrypt Hashing)

#### 마이그레이션 과정
```
평문 저장 (Initial)  →  bcrypt 해싱 (Enhanced)
─────────────────────────────────────────────
"freedom2025"         →  "$2b$10$QbeQYM3fZelfA59P..."
"admin2025"           →  "$2b$10$IJlAg5UsEt.HlVge..."
```

#### 구현 코드
```javascript
// 비밀번호 해싱 (회원가입/변경 시)
const hashedPassword = await bcrypt.hash(newPassword, 10);

// 비밀번호 검증 (로그인 시)
const isMatch = await bcrypt.compare(inputPassword, storedHash);
```

#### 보안 이점
- ✅ **일방향 암호화**: 해시 → 평문 복원 불가능
- ✅ **Salt 자동 생성**: 동일 비밀번호도 다른 해시 생성
- ✅ **Rainbow Table 방어**: 사전 계산된 해시 테이블 무력화
- ✅ **Brute-Force 저항**: 10 rounds로 의도적 연산 지연

### 2. SQL Injection 방지

```javascript
// ❌ 취약한 코드
db.query(`SELECT * FROM fraud_reports WHERE unique_id = ${userInput}`);

// ✅ 안전한 코드 (Prepared Statements)
db.query(
  'SELECT * FROM fraud_reports WHERE attacker_id = ?',
  [userInput],  // 파라미터 바인딩
  (err, results) => { /* ... */ }
);
```

**적용 범위**: 프로젝트 내 모든 쿼리 (100% 커버리지)

### 3. 세션 관리

#### 사용자 세션 (24시간 → 자정 만료)
```javascript
function getMillisecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

app.use((req, res, next) => {
  req.session.cookie.maxAge = getMillisecondsUntilMidnight();
  next();
});
```

#### 관리자 세션 (2분 비활동 타임아웃)
```javascript
const activeAdminSessions = new Map(); // sessionID → lastActivityTime

setInterval(() => {
  const now = Date.now();
  activeAdminSessions.forEach((lastActivity, sessionId) => {
    if (now - lastActivity > 2 * 60 * 1000) {  // 2분 초과
      activeAdminSessions.delete(sessionId);
    }
  });
}, 30000);  // 30초마다 정리
```

### 4. 환경 변수 보호

```bash
# .env 파일 (Git 제외)
DB_HOST=localhost
DB_USER=webapp_user
DB_PASSWORD=secure_password_here
DB_NAME=webapp_db
SESSION_SECRET=random_secret_key_here
PORT=3000
```

```javascript
// .env 로드
require('dotenv').config();

// 사용
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

### 5. 인증 미들웨어

```javascript
const requireAdmin = (req, res, next) => {
  if (!req.session.adminAuthorized) {
    return res.status(401).json({
      success: false,
      message: '관리자 인증이 필요합니다.'
    });
  }

  // 활동 시간 갱신
  activeAdminSessions.set(req.sessionID, Date.now());
  next();
};

// 17개 관리자 엔드포인트에 적용
app.post('/api/admin/fraud-reports', requireAdmin, (req, res) => {
  // Protected route logic
});
```

---

## 🚀 설치 및 실행

### 1. 사전 요구사항

- Node.js 18.x 이상
- MySQL 8.0 이상
- npm 또는 yarn
- Git

### 2. 로컬 개발 환경 설정

```bash
# 1. 저장소 클론
git clone https://github.com/Jeong-Ryeol/SibaServerMonitering.git
cd SibaServerMonitering

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cat > .env << EOF
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=webapp_db
SESSION_SECRET=$(openssl rand -base64 32)
PORT=3000
EOF

# 4. MySQL 데이터베이스 생성
mysql -u root -p << SQL
CREATE DATABASE webapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'webapp_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON webapp_db.* TO 'webapp_user'@'localhost';
FLUSH PRIVILEGES;
SQL

# 5. 스키마 생성 (bcrypt 해싱 버전)
mysql -u webapp_user -p webapp_db < reset_db.sql

# 6. (선택) 기존 DB를 사용 중이라면 비밀번호만 업데이트
mysql -u webapp_user -p webapp_db < update_passwords.sql
# 또는
node update_passwords_db.js

# 7. 개발 서버 실행
npm run dev
```

### 3. 프로덕션 배포 (PM2)

```bash
# PM2 전역 설치
sudo npm install -g pm2

# 애플리케이션 시작
pm2 start server.js --name fiven-freedom

# 상태 확인
pm2 status

# 로그 모니터링
pm2 logs fiven-freedom

# 재시작 (코드 변경 후)
pm2 restart fiven-freedom

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 환경 변수 설정 (PM2 Ecosystem)
pm2 start ecosystem.config.js
```

**ecosystem.config.js 예시**:
```javascript
module.exports = {
  apps: [{
    name: 'fiven-freedom',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 4. 접속 확인

- **로컬**: http://localhost:3000
- **프로덕션**: http://168.107.28.244:3000
- **관리자 페이지**: http://168.107.28.244:3000/admin.html

---

## 💡 핵심 기술 구현

### 1. 동적 세션 만료 (자정 리셋)

```javascript
function getMillisecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

app.use((req, res, next) => {
  if (req.session.siteAuthorized) {
    req.session.cookie.maxAge = getMillisecondsUntilMidnight();
  }
  next();
});
```

**효과**: 모든 사용자가 자정에 동시에 로그아웃 → 일일 접속 통계 정확성 향상

### 2. 한국식 금액 표기 알고리즘

```javascript
function numberToKorean(number) {
  const num = parseInt(number.toString().replace(/,/g, ''));

  if (num >= 1000000000000) {      // 1조 이상
    const jo = Math.floor(num / 1000000000000);
    const remainder = num % 1000000000000;
    if (remainder === 0) return `${jo}조`;

    const eok = Math.floor(remainder / 100000000);
    if (eok === 0) return `${jo}조`;
    return `${jo}조 ${eok}억`;

  } else if (num >= 100000000) {   // 1억 이상
    return `${Math.floor(num / 100000000)}억`;

  } else if (num >= 10000) {       // 1만 이상
    return `${(num / 10000).toFixed(0)}만원`;

  } else if (num >= 1000) {        // 1천 이상
    return num.toLocaleString() + '원';

  } else {
    return num + '원';
  }
}
```

**변환 예시**:
- `1234567890000` → "1조 2345억"
- `500000000` → "5억"
- `1234567` → "123만원"
- `50000` → "5만원"

### 3. 실시간 폴링 시스템

```javascript
let lastSearchedId = null;

function startAutoRefresh() {
  setInterval(() => {
    loadStats();             // 통계 갱신
    loadAnnouncements();     // 공지사항 갱신

    // 마지막 조회 ID가 있으면 자동 재조회
    if (lastSearchedId !== null) {
      searchFraudReports(lastSearchedId);
    }
  }, 10000);  // 10초 주기
}
```

**최적화**:
- 조회 기록이 없으면 스킵 → 불필요한 요청 방지
- 이스터에그 조회 시 자동 갱신 제외

### 4. 피해자/가해자 분리 검색

```javascript
// 가해자(사기꾼) ID로 검색
db.query(`
  SELECT * FROM fraud_reports
  WHERE attacker_id = ?
  ORDER BY report_date DESC
`, [uniqueId], (err, results) => {
  // 결과 반환
});
```

**UI 표시**:
```javascript
results.forEach(report => {
  const card = document.createElement('div');
  card.className = report.attacker_id == uniqueId
    ? 'fraud-report-card attacker'   // 빨간색 강조
    : 'fraud-report-card';

  card.innerHTML = `
    <div class="role-badge ${report.attacker_id == uniqueId ? 'attacker-badge' : 'victim-badge'}">
      ${report.attacker_id == uniqueId ? '가해자 (사기꾼)' : '피해자'}
    </div>
  `;
});
```

### 5. 일괄 ID 변경 (Bulk Update)

```javascript
app.post('/api/admin/bulk-update-id', requireAdmin, (req, res) => {
  const { oldId, newId } = req.body;

  db.query(`
    UPDATE fraud_reports
    SET
      unique_id = CASE WHEN unique_id = ? THEN ? ELSE unique_id END,
      victim_id = CASE WHEN victim_id = ? THEN ? ELSE victim_id END,
      attacker_id = CASE WHEN attacker_id = ? THEN ? ELSE attacker_id END
    WHERE unique_id = ? OR victim_id = ? OR attacker_id = ?
  `, [oldId, newId, oldId, newId, oldId, newId, oldId, oldId, oldId],
  (err, result) => {
    res.json({
      success: true,
      message: `${result.affectedRows}개의 레코드가 업데이트되었습니다.`
    });
  });
});
```

**사용 사례**: 유저가 계정 변경 시 모든 과거 전적을 새 ID로 이관

### 6. 이스터에그 애니메이션

```css
@keyframes easterEggGlow {
  0%   { box-shadow: 0 0 150px rgba(255,215,0,1), 0 0 300px rgba(255,215,0,0.6); }
  33%  { box-shadow: 0 0 200px rgba(138,43,226,1), 0 0 400px rgba(138,43,226,0.6); }
  66%  { box-shadow: 0 0 250px rgba(0,255,255,1), 0 0 450px rgba(0,255,255,0.6); }
  100% { box-shadow: 0 0 150px rgba(255,215,0,1), 0 0 300px rgba(255,215,0,0.6); }
}

.easter-egg-container {
  animation: easterEggGlow 6s ease-in-out infinite;
  background: linear-gradient(135deg,
    rgba(255,215,0,0.3),
    rgba(255,105,180,0.3),
    rgba(138,43,226,0.3));
}
```

---

## 📊 프로젝트 통계

### 코드 규모

| 항목 | 라인 수 | 파일 수 |
|------|---------|---------|
| **Backend** (server.js) | ~519 lines | 1 |
| **Frontend** (index.html) | ~1,398 lines | 1 |
| **Admin Panel** (admin.html) | ~500+ lines | 1 |
| **Database Scripts** | ~200 lines | 4 files |
| **Documentation** | ~900 lines | 2 files |
| **Total** | **~3,500+ lines** | 9 files |

### API 통계

- **Total Endpoints**: 27
  - Public API: 8
  - Admin API: 19
- **HTTP Methods**: GET (12), POST (13), DELETE (2)
- **Authentication**: 19 protected endpoints

### 데이터베이스

- **Tables**: 7
- **Indexes**: 2 (unique_id, attacker_id)
- **Migrations**: 4 SQL scripts
- **Encoding**: UTF8MB4 (full Unicode support)

### 프론트엔드

- **CSS Animations**: 15+ keyframes
- **Custom Functions**: 20+ JavaScript functions
- **Polling Interval**: 10 seconds
- **Session Duration**: 24 hours (user), 2 minutes (admin)

---

## 🔧 트러블슈팅

### 1. MySQL 연결 실패

**증상**: `MySQL 연결 실패: ECONNREFUSED`

**해결**:
```bash
# MySQL 서비스 확인
sudo systemctl status mysql

# 시작
sudo systemctl start mysql

# .env 파일 검증
cat .env | grep DB_
```

### 2. 포트 충돌 (EADDRINUSE)

**증상**: `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000`

**해결**:
```bash
# 포트 사용 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# PM2 정리
pm2 delete all
pm2 start server.js
```

### 3. 비밀번호 업데이트 실패

**증상**: `Unknown database 'fraud_reports_db'`

**원인**: 데이터베이스명 불일치

**해결**:
```bash
# 실제 DB 이름 확인
sudo mysql -e "SHOW DATABASES;"

# 올바른 DB 이름으로 업데이트
sudo mysql webapp_db < update_passwords.sql

# 또는 Node.js 스크립트 사용
node update_passwords_db.js
```

### 4. 세션 유지 실패

**증상**: 새로고침 시 다시 로그인 요구

**원인**:
1. `.env`의 SESSION_SECRET 미설정
2. 브라우저 쿠키 차단
3. 서버 재시작으로 인한 세션 초기화

**해결**:
```javascript
// .env 확인
SESSION_SECRET=your_secret_key

// 브라우저 설정에서 쿠키 허용
// Chrome: 설정 → 개인정보 및 보안 → 쿠키 및 기타 사이트 데이터
```

### 5. bcrypt 설치 오류 (macOS)

**증상**: `gyp ERR! build error`

**해결**:
```bash
# Xcode Command Line Tools 설치
xcode-select --install

# bcrypt 재설치
npm install bcrypt --build-from-source
```

---

## 📚 학습 포인트 (취업 포트폴리오)

이 프로젝트에서 배울 수 있는 실무 역량:

### Backend 개발
- ✅ RESTful API 설계 및 구현 (27 endpoints)
- ✅ Express.js 미들웨어 패턴
- ✅ MySQL 데이터베이스 설계 및 최적화 (인덱싱, 정규화)
- ✅ 세션 기반 인증 시스템
- ✅ 비밀번호 보안 (bcrypt 해싱)
- ✅ SQL Injection 방어 (Prepared Statements)

### Frontend 개발
- ✅ Vanilla JavaScript (프레임워크 없이 순수 JS 활용)
- ✅ 비동기 처리 (Fetch API, async/await)
- ✅ DOM 조작 및 동적 UI 생성
- ✅ CSS 애니메이션 (15+ 키프레임)
- ✅ 실시간 데이터 폴링 시스템

### Database
- ✅ MySQL 스키마 설계 (7 tables)
- ✅ 데이터베이스 마이그레이션 (4 stages)
- ✅ 인덱싱 전략 (B-Tree indexes)
- ✅ 트랜잭션 관리

### DevOps
- ✅ PM2 프로세스 관리
- ✅ 프로덕션 서버 배포 (Oracle Cloud)
- ✅ 환경 변수 관리 (.env)
- ✅ Git 버전 관리

### Security
- ✅ 비밀번호 해싱 (bcrypt)
- ✅ SQL Injection 방어
- ✅ 세션 관리 및 타임아웃
- ✅ 환경 변수 보호

---

## 🎓 개선 가능 사항 (향후 발전 방향)

### 보안 강화
- [ ] HTTPS/SSL 적용 (Let's Encrypt)
- [ ] Rate Limiting (express-rate-limit)
- [ ] CORS 설정
- [ ] Content Security Policy (Helmet.js)
- [ ] Input Validation (Joi, express-validator)

### 기능 확장
- [ ] WebSocket 실시간 알림
- [ ] 페이지네이션 (대량 데이터 처리)
- [ ] 검색 필터 (날짜 범위, 금액 범위)
- [ ] CSV/Excel 내보내기
- [ ] Discord Bot 연동
- [ ] 이메일 알림 시스템

### 성능 최적화
- [ ] Redis 세션 스토어
- [ ] 쿼리 캐싱
- [ ] CDN 적용 (정적 파일)
- [ ] 이미지 최적화

---

## 📄 라이선스

MIT License

---

## 👨‍💻 개발자

**정려열 (Jeong Ryeol)**
- GitHub: [@Jeong-Ryeol](https://github.com/Jeong-Ryeol)
- Project Repository: [SibaServerMonitering](https://github.com/Jeong-Ryeol/SibaServerMonitering)

---

## 🙏 감사의 말

이 프로젝트는 FiveM 게임 커뮤니티의 사기 피해를 줄이고자 시작되었습니다.
실제 프로덕션 환경에서 운영하며 겪은 문제들을 해결하고, 사용자 피드백을 반영하여 지속적으로 발전하고 있습니다.

**함께 만드는 안전한 게임 커뮤니티, FIVEN:FREEDOM**

---

**마지막 업데이트**: 2025-10-25
**프로젝트 상태**: 🟢 프로덕션 운영 중
**서버 주소**: http://168.107.28.244:3000
